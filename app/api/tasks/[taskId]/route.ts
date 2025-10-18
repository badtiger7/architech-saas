import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/connection'
import { tasks } from '@/lib/db/schema/tasks'
import { projects } from '@/lib/db/schema/projects'
import { users } from '@/lib/db/schema/organizations'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Schema validation
const updateTaskSchema = z.object({
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']).optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assigneeUserId: z.string().optional(),
  dueDate: z.string().optional(),
  estimatedHours: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
})

// GET /api/tasks/[taskId] - Get a specific task
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params

    const task = await db
      .select({
        id: tasks.id,
        projectId: tasks.projectId,
        title: tasks.title,
        description: tasks.description,
        status: tasks.status,
        priority: tasks.priority,
        assigneeUserId: tasks.assigneeUserId,
        dueDate: tasks.dueDate,
        estimatedHours: tasks.estimatedHours,
        tags: tasks.tags,
        createdAt: tasks.createdAt,
        updatedAt: tasks.updatedAt,
        // Join project info
        projectName: projects.name,
        projectClientName: projects.clientName,
        // Join assignee info
        assigneeName: users.displayName,
        assigneeEmail: users.email,
      })
      .from(tasks)
      .leftJoin(projects, eq(tasks.projectId, projects.id))
      .leftJoin(users, eq(tasks.assigneeUserId, users.id))
      .where(eq(tasks.id, taskId))
      .limit(1)

    if (task.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tâche non trouvée' },
        { status: 404 }
      )
    }

    // Format the response
    const formattedTask = {
      ...task[0],
      tags: task[0].tags ? JSON.parse(task[0].tags) : [],
      assignee: task[0].assigneeName ? {
        name: task[0].assigneeName,
        email: task[0].assigneeEmail,
        avatar: task[0].assigneeName.split(' ').map(n => n[0]).join(''),
        company: "Architech"
      } : null,
      project: task[0].projectName,
      clientName: task[0].projectClientName,
    }

    return NextResponse.json({
      success: true,
      data: formattedTask
    })
  } catch (error) {
    console.error('Error fetching task:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors du chargement de la tâche' },
      { status: 500 }
    )
  }
}

// PATCH /api/tasks/[taskId] - Update a task
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params
    const body = await request.json()

    // Validate input
    const validatedData = updateTaskSchema.parse(body)

    // Build update object
    const updateData: any = {}
    if (validatedData.title !== undefined) updateData.title = validatedData.title
    if (validatedData.description !== undefined) updateData.description = validatedData.description
    if (validatedData.status !== undefined) updateData.status = validatedData.status
    if (validatedData.priority !== undefined) updateData.priority = validatedData.priority
    if (validatedData.assigneeUserId !== undefined) updateData.assigneeUserId = validatedData.assigneeUserId
    if (validatedData.dueDate !== undefined) updateData.dueDate = validatedData.dueDate
    if (validatedData.estimatedHours !== undefined) updateData.estimatedHours = validatedData.estimatedHours
    if (validatedData.tags !== undefined) updateData.tags = JSON.stringify(validatedData.tags)
    
    updateData.updatedAt = new Date()

    // Update task
    const updatedTask = await db
      .update(tasks)
      .set(updateData)
      .where(eq(tasks.id, taskId))
      .returning()

    if (updatedTask.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tâche non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updatedTask[0]
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error updating task:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la mise à jour de la tâche' },
      { status: 500 }
    )
  }
}

// DELETE /api/tasks/[taskId] - Delete a task
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params

    const deletedTask = await db
      .delete(tasks)
      .where(eq(tasks.id, taskId))
      .returning()

    if (deletedTask.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Tâche non trouvée' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { id: taskId }
    })
  } catch (error) {
    console.error('Error deleting task:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la suppression de la tâche' },
      { status: 500 }
    )
  }
} 