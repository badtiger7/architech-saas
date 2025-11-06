import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2'
import { db } from '@/lib/db/connection'
import { projects } from '@/lib/db/schema/projects'
import { eq } from 'drizzle-orm'

// GET /api/projects/[projectId]/thumbnail/url
// Retourne une URL signée pour accéder à la thumbnail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    // 1. Récupérer le projet
    const project = await db
      .select({ thumbnailUrl: projects.thumbnailUrl })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (project.length === 0 || !project[0].thumbnailUrl) {
      return NextResponse.json(
        { success: false, error: 'Aucune thumbnail pour ce projet' },
        { status: 404 }
      )
    }

    // 2. Extraire la clé S3 depuis l'URL
    const thumbnailUrl = project[0].thumbnailUrl
    const s3Key = thumbnailUrl.split(`${R2_BUCKET_NAME}/`)[1]

    if (!s3Key) {
      return NextResponse.json(
        { success: false, error: 'URL de thumbnail invalide' },
        { status: 400 }
      )
    }

    // 3. Générer une URL signée (valide 24h)
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: s3Key,
    })

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 86400 }) // 24h

    // 4. Retourner l'URL signée
    return NextResponse.json({
      success: true,
      data: {
        signedUrl: signedUrl,
      },
    })
  } catch (error) {
    console.error('❌ Erreur génération URL signée:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la génération de l\'URL',
      },
      { status: 500 }
    )
  }
}

