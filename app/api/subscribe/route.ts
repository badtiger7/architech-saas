import { NextRequest, NextResponse } from "next/server"
import { Client } from "@notionhq/client"

const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Veuillez saisir votre adresse email" },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Veuillez saisir une adresse email valide" },
        { status: 400 }
      )
    }

    if (!NOTION_DATABASE_ID) {
      console.error("NOTION_DATABASE_ID is not set")
      return NextResponse.json(
        { error: "Erreur de configuration du serveur" },
        { status: 500 }
      )
    }

    if (!process.env.NOTION_API_KEY) {
      console.error("NOTION_API_KEY is not set")
      return NextResponse.json(
        { error: "Erreur de configuration du serveur" },
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
      },
    })

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error: any) {
    console.error("Error adding email to Notion:", error)
    
    // Handle Notion API errors
    if (error?.code === "object_already_exists" || error?.message?.includes("duplicate")) {
      return NextResponse.json(
        { error: "Cette adresse email est déjà enregistrée" },
        { status: 409 }
      )
    }

    // Handle missing properties error
    if (error?.code === "validation_error") {
      return NextResponse.json(
        { error: "Configuration du serveur incorrecte" },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: "Une erreur est survenue. Veuillez réessayer." },
      { status: 500 }
    )
  }
}
