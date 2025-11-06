import { NextRequest, NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { r2Client, R2_BUCKET_NAME } from '@/lib/r2'
import { db } from '@/lib/db/connection'
import { documents, documentVersions } from '@/lib/db/schema/documents'
import { eq, desc } from 'drizzle-orm'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> }
) {
  try {
    const { documentId } = await params

    // 1. Récupérer le document et sa dernière version depuis PostgreSQL
    const result = await db
      .select({
        documentId: documents.id,
        title: documents.title,
        category: documents.category,
        versionNumber: documentVersions.versionNumber,
        s3Key: documentVersions.s3Key,
        contentType: documentVersions.contentType,
        sizeBytes: documentVersions.sizeBytes,
        originalFileName: documentVersions.originalFileName,
      })
      .from(documents)
      .leftJoin(documentVersions, eq(documentVersions.documentId, documents.id))
      .where(eq(documents.id, documentId))
      .orderBy(desc(documentVersions.versionNumber))
      .limit(1)

    if (result.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Document non trouvé' },
        { status: 404 }
      )
    }

    const document = result[0]

    if (!document.s3Key) {
      return NextResponse.json(
        { success: false, error: 'Aucun fichier associé à ce document' },
        { status: 404 }
      )
    }

    // 2. Générer une URL signée temporaire (valide 1 heure)
    const command = new GetObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: document.s3Key,
    })

    const signedUrl = await getSignedUrl(r2Client, command, { expiresIn: 3600 })

    // 3. Retourner l'URL signée
    return NextResponse.json({
      success: true,
      data: {
        downloadUrl: signedUrl,
        fileName: document.originalFileName || 'document', // ✅ Utiliser le nom original stocké
        fileSize: document.sizeBytes,
        mimeType: document.contentType,
        title: document.title,
      },
    })
  } catch (error) {
    console.error('❌ Erreur download:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de la génération du lien de téléchargement',
      },
      { status: 500 }
    )
  }
}

