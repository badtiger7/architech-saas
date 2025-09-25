import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/connection'
import { projects } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Schema validation
const updateProjectSchema = z.object({
  name: z.string().optional(),
  clientName: z.string().optional(),
  status: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
})

// GET /api/projects/[projectId]
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    const project = await db
      .select({
        id: projects.id,
        name: projects.name,
        clientName: projects.clientName,
        status: projects.status,
        startDate: projects.startDate,
        endDate: projects.endDate,
        createdAt: projects.createdAt,
        updatedAt: projects.updatedAt,
      })
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (project.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: project[0],
    })
  } catch (error) {
    console.error('Error fetching project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PATCH /api/projects/[projectId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await request.json()
    
    // Validate input
    const validatedData = updateProjectSchema.parse(body)

    // Check if project exists
    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (existingProject.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Build update object
    const updateData: any = {}
    if (validatedData.name) updateData.name = validatedData.name
    if (validatedData.clientName) updateData.clientName = validatedData.clientName
    if (validatedData.status) updateData.status = validatedData.status
    if (validatedData.startDate) updateData.startDate = validatedData.startDate
    if (validatedData.endDate) updateData.endDate = validatedData.endDate

    // Update project
    const updatedProject = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, projectId))
      .returning()

    return NextResponse.json({
      success: true,
      data: updatedProject[0],
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[projectId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    // Check if project exists
    const existingProject = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (existingProject.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Delete project
    await db
      .delete(projects)
      .where(eq(projects.id, projectId))

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 