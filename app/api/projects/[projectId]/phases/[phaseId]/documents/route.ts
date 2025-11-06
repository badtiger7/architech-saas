import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/connection'
import { documents, documentVersions, documentSteps } from '@/lib/db/schema/documents'
import { eq, desc } from 'drizzle-orm'
import { z } from 'zod'

// Schema validation
const createDocumentSchema = z.object({
  title: z.string().min(1),
  category: z.enum(['plan', 'specification', 'photo', 'report', 'other']),
  // Pour l'instant, on simule l'upload sans fichier réel
})

// GET /api/projects/[projectId]/phases/[phaseId]/documents
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; phaseId: string }> }
) {
  try {
    const { projectId, phaseId } = await params

    // Get documents for this phase with their latest version info
    const phaseDocuments = await db
      .select({
        id: documents.id,
        title: documents.title,
        category: documents.category,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
        // Join avec documentSteps pour filtrer par phase
        stepId: documentSteps.stepId,
        // Join avec documentVersions pour avoir les infos du fichier
        fileSize: documentVersions.sizeBytes,
        uploadedAt: documentVersions.uploadedAt,
        originalFileName: documentVersions.originalFileName,
      })
      .from(documents)
      .innerJoin(documentSteps, eq(documentSteps.documentId, documents.id))
      .leftJoin(documentVersions, eq(documentVersions.documentId, documents.id))
      .where(eq(documentSteps.stepId, phaseId))
      .orderBy(desc(documentVersions.uploadedAt))

    // Grouper par document pour ne garder que la dernière version
    const uniqueDocuments = phaseDocuments.reduce((acc: any[], doc) => {
      const existingDoc = acc.find(d => d.id === doc.id)
      if (!existingDoc) {
        acc.push(doc)
      }
      return acc
    }, [])

    return NextResponse.json({
      success: true,
      data: uniqueDocuments
    })
  } catch (error) {
    console.error('Error fetching phase documents:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors du chargement des documents' },
      { status: 500 }
    )
  }
}

// POST /api/projects/[projectId]/phases/[phaseId]/documents  
// NOTE: Cette route n'est plus utilisée, l'upload se fait via /api/upload
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; phaseId: string }> }
) {
  try {
    const { projectId, phaseId } = await params
    const body = await request.json()

    // Validate input
    const validatedData = createDocumentSchema.parse(body)

    // Créer le document (sans phaseId car ce n'est plus dans le schéma)
    const newDocument = await db
      .insert(documents)
      .values({
        projectId,
        title: validatedData.title,
        category: validatedData.category,
        createdByUserId: 'user-test', // TODO: Récupérer l'utilisateur authentifié
      })
      .returning()

    // Lier le document à la phase via documentSteps
    await db
      .insert(documentSteps)
      .values({
        documentId: newDocument[0].id,
        stepId: phaseId,
      })

    return NextResponse.json({
      success: true,
      data: newDocument[0]
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating document:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création du document' },
      { status: 500 }
    )
  }
} 