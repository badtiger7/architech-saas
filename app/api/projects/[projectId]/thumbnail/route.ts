import { NextRequest, NextResponse } from 'next/server'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { r2Client, R2_BUCKET_NAME, generateUniqueFileName, getMimeType } from '@/lib/r2'
import { db } from '@/lib/db/connection'
import { projects } from '@/lib/db/schema/projects'
import { eq } from 'drizzle-orm'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    // 1. Vérifier que le projet existe
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (project.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Projet non trouvé' },
        { status: 404 }
      )
    }

    // 2. Récupérer le fichier
    const formData = await request.formData()
    const file = formData.get('thumbnail') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier fourni' },
        { status: 400 }
      )
    }

    // 3. Valider que c'est une image
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: 'Le fichier doit être une image' },
        { status: 400 }
      )
    }

    // 4. Générer un nom unique pour la thumbnail
    const uniqueFileName = `thumbnails/${projectId}-${Date.now()}.${file.name.split('.').pop()}`
    const mimeType = getMimeType(file.name)

    // 5. Convertir en Buffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // 6. Upload vers R2
    const uploadCommand = new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: uniqueFileName,
      Body: buffer,
      ContentType: mimeType,
      ContentLength: buffer.length,
    })

    await r2Client.send(uploadCommand)

    // 7. Construire l'URL publique
    const thumbnailUrl = `${process.env.R2_PUBLIC_URL || process.env.R2_ENDPOINT}/${R2_BUCKET_NAME}/${uniqueFileName}`

    // 8. Mettre à jour le projet dans PostgreSQL
    const [updatedProject] = await db
      .update(projects)
      .set({ 
        thumbnailUrl: thumbnailUrl,
        updatedAt: new Date()
      })
      .where(eq(projects.id, projectId))
      .returning()

    // 9. Retourner la réponse
    return NextResponse.json({
      success: true,
      data: {
        projectId: updatedProject.id,
        thumbnailUrl: updatedProject.thumbnailUrl,
      },
    })
  } catch (error) {
    console.error('❌ Erreur upload thumbnail:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de l\'upload',
      },
      { status: 500 }
    )
  }
}

// DELETE thumbnail
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    // Supprimer l'URL de la thumbnail dans la BDD
    const [updatedProject] = await db
      .update(projects)
      .set({ 
        thumbnailUrl: null,
        updatedAt: new Date()
      })
      .where(eq(projects.id, projectId))
      .returning()

    return NextResponse.json({
      success: true,
      data: {
        projectId: updatedProject.id,
      },
    })
  } catch (error) {
    console.error('❌ Erreur suppression thumbnail:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la suppression',
      },
      { status: 500 }
    )
  }
}

