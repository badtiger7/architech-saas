import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/connection'
import { projectSteps, projects } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

// Schema validation
const updatePhaseSchema = z.object({
  name: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'blocked']).optional(),
  startDate: z.string().nullable().optional(),
  endDate: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  progressRatio: z.number().min(0).max(100).optional(),
})

// PATCH /api/projects/[projectId]/phases/[phaseId]
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; phaseId: string }> }
) {
  try {
    const { projectId, phaseId } = await params
    const body = await request.json()
    
    // Validate input
    const validatedData = updatePhaseSchema.parse(body)

    // Check if project and phase exist
    const existingPhase = await db
      .select()
      .from(projectSteps)
      .where(and(
        eq(projectSteps.id, phaseId),
        eq(projectSteps.projectId, projectId)
      ))
      .limit(1)

    if (existingPhase.length === 0) {
      return NextResponse.json(
        { error: 'Phase not found' },
        { status: 404 }
      )
    }

    // Build update object
    const updateData: any = {}
    if (validatedData.name) updateData.name = validatedData.name
    if (validatedData.status) updateData.status = validatedData.status
    if (validatedData.startDate !== undefined) updateData.startDate = validatedData.startDate
    if (validatedData.endDate !== undefined) updateData.endDate = validatedData.endDate
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.progressRatio !== undefined) updateData.progressRatio = validatedData.progressRatio


    // Update phase
    const updatedPhase = await db
      .update(projectSteps)
      .set(updateData)
      .where(eq(projectSteps.id, phaseId))
      .returning()

    return NextResponse.json({
      success: true,
      data: updatedPhase[0],
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating phase:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'Unknown error')
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// DELETE /api/projects/[projectId]/phases/[phaseId]
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string; phaseId: string }> }
) {
  try {
    const { projectId, phaseId } = await params

    // Check if phase exists
    const existingPhase = await db
      .select()
      .from(projectSteps)
      .where(and(
        eq(projectSteps.id, phaseId),
        eq(projectSteps.projectId, projectId)
      ))
      .limit(1)

    if (existingPhase.length === 0) {
      return NextResponse.json(
        { error: 'Phase not found' },
        { status: 404 }
      )
    }

    // Delete phase
    await db
      .delete(projectSteps)
      .where(eq(projectSteps.id, phaseId))

    return NextResponse.json({
      success: true,
    })
  } catch (error) {
    console.error('Error deleting phase:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 