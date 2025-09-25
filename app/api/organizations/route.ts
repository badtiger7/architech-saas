import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db/connection'
import { organizations } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { z } from 'zod'

// Schema validation
const createOrganizationSchema = z.object({
  name: z.string().min(1, 'Organization name is required'),
})

// GET /api/organizations
export async function GET() {
  try {
    const allOrganizations = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        createdAt: organizations.createdAt,
        updatedAt: organizations.updatedAt,
      })
      .from(organizations)
      .orderBy(organizations.createdAt)

    return NextResponse.json({
      success: true,
      data: allOrganizations,
    })
  } catch (error) {
    console.error('Error fetching organizations:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST /api/organizations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const validatedData = createOrganizationSchema.parse(body)

    // Create organization
    const newOrganization = await db
      .insert(organizations)
      .values({
        name: validatedData.name,
      })
      .returning()

    return NextResponse.json({
      success: true,
      data: newOrganization[0],
    }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      )
    }

    console.error('Error creating organization:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 