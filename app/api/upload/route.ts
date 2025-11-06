import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET_NAME, generateUniqueFileName, getMimeType } from '@/lib/r2'
import { db } from '@/lib/db/connection'
import { documents, documentVersions, documentSteps } from '@/lib/db/schema/documents'
import { projectSteps } from '@/lib/db/schema/projects'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Schéma de validation pour les métadonnées
const uploadSchema = z.object({
  phaseId: z.string().min(1, 'Phase ID est requis'),
  title: z.string().min(1, 'Titre est requis'),
  category: z.enum(['plan', 'specification', 'photo', 'report', 'other']),
})

export async function POST(request: NextRequest) {
  try {
    // 1. Récupérer les données du formulaire
    const formData = await request.formData()
    const file = formData.get('file') as File
    const phaseId = formData.get('phaseId') as string
    const title = formData.get('title') as string
    const category = formData.get('category') as string

    // 2. Validation
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    const validation = uploadSchema.safeParse({ phaseId, title, category })
    if (!validation.success) {
      return NextResponse.json(
        { success: false, error: validation.error.errors[0].message },
        { status: 400 }
      )
    }

    // 2.5. Récupérer le projectId depuis la phase
    const phase = await db
      .select({ projectId: projectSteps.projectId })
      .from(projectSteps)
      .where(eq(projectSteps.id, phaseId))
      .limit(1)

    if (phase.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Phase non trouvée' },
        { status: 404 }
      )
    }

    const projectId = phase[0].projectId

    // 3. Générer un nom de fichier unique
    const uniqueFileName = generateUniqueFileName(file.name)
    const mimeType = getMimeType(file.name)

    // 4. Convertir le fichier en Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 5. Upload vers R2
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: mimeType,
      ContentLength: buffer.length,
      // Pas de Metadata pour éviter les caractères invalides dans les headers
    })

    await r2Client.send(uploadCommand)

    // 6. Construire l'URL du fichier
    const fileUrl = `${process.env.R2_ENDPOINT}/${R2_BUCKET_NAME}/${uniqueFileName}`

    // 7. Enregistrer dans PostgreSQL
    // TODO: Utiliser un vrai createdByUserId quand l'authentification sera en place
    const mockUserId = 'user-test'

    // Créer le document
    const [newDocument] = await db
      .insert(documents)
      .values({
        projectId: projectId, // ✅ Ajout du projectId requis
        title: title,
        category: category as 'plan' | 'specification' | 'photo' | 'report' | 'other',
        createdByUserId: mockUserId,
      })
      .returning()

    // Créer la première version
    const [newVersion] = await db
      .insert(documentVersions)
      .values({
        documentId: newDocument.id,
        versionNumber: 1,
        s3Bucket: R2_BUCKET_NAME,
        s3Key: uniqueFileName,
        s3Etag: 'mock-etag', // TODO: récupérer l'ETag réel de R2
        contentType: mimeType,
        sizeBytes: buffer.length,
        originalFileName: file.name, // ✅ Stocker le nom original du fichier
        uploadedByUserId: mockUserId,
      })
      .returning()

    // Lier le document à la phase
    await db
      .insert(documentSteps)
      .values({
        documentId: newDocument.id,
        stepId: phaseId,
        selectedVersionId: newVersion.id,
      })

    // 8. Retourner la réponse
    return NextResponse.json({
      success: true,
      data: {
        documentId: newDocument.id,
        projectId: newDocument.projectId,
        title: newDocument.title,
        category: newDocument.category,
        fileName: file.name,
        fileSize: buffer.length,
        mimeType: mimeType,
      },
    })
  } catch (error) {
    console.error('❌ Erreur upload:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de l\'upload',
      },
      { status: 500 }
    )
  }
}

