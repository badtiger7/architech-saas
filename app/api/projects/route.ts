import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/connection'
import { projects, organizations } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Schema validation
const createProjectSchema = z.object({
  name: z.string().min(1, 'Project name is required'),
  clientName: z.string().min(1, 'Client name is required'),
  organizationId: z.string().min(1, 'Organization ID is required'),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// GET /api/projects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const organizationId = searchParams.get('organizationId')

    if (!organizationId) {
      return NextResponse.json(
        { error: 'Organization ID is required' },
        { status: 400 }
      )
    }

    const allProjects = await db
      .select({
        id: projects.id,
        name: projects.name,
        clientName: projects.clientName,
        status: projects.status,
        startDate: projects.startDate,
        endDate: projects.endDate,
        thumbnailUrl: projects.thumbnailUrl, // ✅ Ajouter thumbnailUrl
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .where(eq(projects.organizationId, organizationId))
      .orderBy(projects.createdAt)

    return NextResponse.json({
      success: true,
      data: allProjects,
    })
  } catch (error) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createProjectSchema.parse(body)

    // Check if organization exists
    const organization = await db
      .select()
      .from(organizations)
      .where(eq(organizations.id, validatedData.organizationId))
      .limit(1)

    if (organization.length === 0) {
      return NextResponse.json(
        { error: 'Organization not found' },
        { status: 404 }
      )
    }

    // Create project
    const newProject = await db
      .insert(projects)
      .values({
        name: validatedData.name,
        clientName: validatedData.clientName,
        organizationId: validatedData.organizationId,
        status: 'planning', // Default status
        startDate: validatedData.startDate || null,
        endDate: validatedData.endDate || null,
      })
      .returning()

    return NextResponse.json({
      success: true,
      data: newProject[0],
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 