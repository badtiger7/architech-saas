import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/connection'
import { projectSteps, projects } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { z } from 'zod'

// Schema validation
const createPhaseSchema = z.object({
  name: z.string().min(1, 'Phase name is required'),
  startDate: z.string().optional(),
  orderIndex: z.number().min(0),
})

const updatePhaseSchema = z.object({
  name: z.string().optional(),
  status: z.enum(['pending', 'in-progress', 'completed', 'blocked']).optional(),
  startDate: z.string().optional(),
  progressRatio: z.number().min(0).max(100).optional(),
})

// GET /api/projects/[projectId]/phases
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params

    // Verify project exists
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (project.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Get project phases
    const phases = await db
      .select({
        id: projectSteps.id,
        name: projectSteps.name,
        status: projectSteps.status,
        startDate: projectSteps.startDate,
        endDate: projectSteps.endDate,
        description: projectSteps.description,
        progressRatio: projectSteps.progressRatio,
        orderIndex: projectSteps.orderIndex,
      })
      .from(projectSteps)
      .where(eq(projectSteps.projectId, projectId))
      .orderBy(projectSteps.orderIndex)

    return NextResponse.json({
      success: true,
      data: phases,
    })
  } catch (error) {
    console.error('Error fetching phases:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/projects/[projectId]/phases
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params
    const body = await request.json()
    
    // Validate input
    const validatedData = createPhaseSchema.parse(body)

    // Verify project exists
    const project = await db
      .select()
      .from(projects)
      .where(eq(projects.id, projectId))
      .limit(1)

    if (project.length === 0) {
      return NextResponse.json(
        { error: 'Project not found' },
        { status: 404 }
      )
    }

    // Create phase
    const newPhase = await db
      .insert(projectSteps)
      .values({
        projectId,
        name: validatedData.name,
        status: 'pending',
        startDate: validatedData.startDate || null,
        progressRatio: 0,
        orderIndex: validatedData.orderIndex,
      })
      .returning()

    return NextResponse.json({
      success: true,
      data: newPhase[0],
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating phase:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 