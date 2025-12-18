import { NextRequest, NextResponse } from 'next/server'
import { Client } from '@notionhq/client'

// Initialize Notion client
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

export async function POST(request: NextRequest) {
  try {
    const { email, variant = 'A', wantsLeadMagnet = false } = await request.json()

    // Validate email
    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Email invalide' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Format d\'email invalide' },
        { status: 400 }
      )
    }

    // Check for environment variables
    if (!NOTION_DATABASE_ID || !process.env.NOTION_API_KEY) {
      console.error('❌ Missing Notion configuration')
      return NextResponse.json(
        { success: false, error: 'Configuration manquante' },
        { status: 500 }
      )
    }

    // Add email to Notion database
    await notion.pages.create({
      parent: {
        database_id: NOTION_DATABASE_ID,
      },
      properties: {
        Email: {
          title: [
            {
              text: {
                content: email,
              },
            },
          ],
        },
        'Date d\'inscription': {
          date: {
            start: new Date().toISOString(),
          },
        },
        Status: {
          select: {
            name: 'Nouveau',
          },
        },
        'Variante A/B': {
          select: {
            name: variant,
          },
        },
        'Kit demandé': {
          checkbox: wantsLeadMagnet,
        },
      },
    })

    return NextResponse.json({
      success: true,
      message: 'Email enregistré avec succès',
    })
  } catch (error) {
    console.error('❌ Erreur lors de l\'enregistrement:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Erreur lors de l\'enregistrement',
      },
      { status: 500 }
    )
  }
}
