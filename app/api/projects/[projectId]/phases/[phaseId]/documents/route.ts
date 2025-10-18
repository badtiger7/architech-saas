import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/connection'
import { documents, documentVersions } from '@/lib/db/schema/documents'
import { eq } from 'drizzle-orm'
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

    // Get documents for this phase
    const phaseDocuments = await db
      .select({
        id: documents.id,
        title: documents.title,
        category: documents.category,
        createdAt: documents.createdAt,
        updatedAt: documents.updatedAt,
      })
      .from(documents)
      .where(eq(documents.phaseId, phaseId))

    return NextResponse.json({
      success: true,
      data: phaseDocuments
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
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; phaseId: string }> }
) {
  try {
    const { projectId, phaseId } = await params
    const body = await request.json()

    // Validate input
    const validatedData = createDocumentSchema.parse(body)

    // Pour l'instant, on crée un document sans fichier réel
    // TODO: Implémenter l'upload vers S3 plus tard
    const newDocument = await db
      .insert(documents)
      .values({
        projectId,
        phaseId,
        title: validatedData.title,
        category: validatedData.category,
        createdByUserId: 'user-test', // TODO: Récupérer l'utilisateur authentifié
      })
      .returning()

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