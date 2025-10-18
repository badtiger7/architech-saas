import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/connection'
import { tasks } from '@/lib/db/schema/tasks'
import { projects } from '@/lib/db/schema/projects'
import { users } from '@/lib/db/schema/organizations'
import { eq, and, desc } from 'drizzle-orm'
import { z } from 'zod'

// Schema validation
const createTaskSchema = z.object({
  projectId: z.string().min(1),
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'review', 'done']).default('todo'),
  priority: z.enum(['low', 'medium', 'high']).default('medium'),
  assigneeUserId: z.string().optional(),
  dueDate: z.string().optional(), // ISO date string
  estimatedHours: z.number().min(0).optional(),
  tags: z.array(z.string()).optional(),
})

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

// GET /api/tasks - List all tasks with optional filters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const projectId = searchParams.get('projectId')
    const status = searchParams.get('status')
    const assigneeUserId = searchParams.get('assigneeUserId')

    let query = db
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
      .orderBy(desc(tasks.createdAt))

    // Apply filters
    const conditions = []
    if (projectId) conditions.push(eq(tasks.projectId, projectId))
    if (status) conditions.push(eq(tasks.status, status))
    if (assigneeUserId) conditions.push(eq(tasks.assigneeUserId, assigneeUserId))
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const allTasks = await query

    // Parse tags from JSON strings
    const formattedTasks = allTasks.map(task => ({
      ...task,
      tags: task.tags ? JSON.parse(task.tags) : [],
      assignee: task.assigneeName ? {
        name: task.assigneeName,
        email: task.assigneeEmail,
        avatar: task.assigneeName.split(' ').map(n => n[0]).join(''),
        company: "Architech"
      } : null,
      project: task.projectName,
      clientName: task.projectClientName,
    }))

    return NextResponse.json({
      success: true,
      data: formattedTasks
    })
  } catch (error) {
    console.error('Error fetching tasks:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors du chargement des tâches' },
      { status: 500 }
    )
  }
}

// POST /api/tasks - Create a new task
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createTaskSchema.parse(body)

    // Create task
    const newTask = await db
      .insert(tasks)
      .values({
        projectId: validatedData.projectId,
        title: validatedData.title,
        description: validatedData.description,
        status: validatedData.status,
        priority: validatedData.priority,
        assigneeUserId: validatedData.assigneeUserId,
        dueDate: validatedData.dueDate,
        estimatedHours: validatedData.estimatedHours || 0,
        tags: validatedData.tags ? JSON.stringify(validatedData.tags) : null,
        createdByUserId: 'user-test', // TODO: Get from auth
      })
      .returning()

    return NextResponse.json({
      success: true,
      data: newTask[0]
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Données invalides', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating task:', error)
    return NextResponse.json(
      { success: false, error: 'Erreur lors de la création de la tâche' },
      { status: 500 }
    )
  }
} 