import { eq, and } from 'drizzle-orm'
import { db } from '../connection'
import { organizations, users, organizationMembers } from '../schema'

export async function createOrganization(data: {
  name: string
}) {
  const [organization] = await db
    .insert(organizations)
    .values(data)
    .returning()
  
  return organization
}

export async function createUser(data: {
  email: string
  displayName: string
  authProvider: string
  avatarUrl?: string
}) {
  const [user] = await db
    .insert(users)
    .values(data)
    .returning()
  
  return user
}

export async function addUserToOrganization(data: {
  organizationId: string
  userId: string
  orgRole: string
}) {
  const [member] = await db
    .insert(organizationMembers)
    .values(data)
    .returning()
  
  return member
}

export async function getUserOrganizations(userId: string) {
  return await db
    .select({
      organization: organizations,
      role: organizationMembers.orgRole,
    })
    .from(organizationMembers)
    .innerJoin(organizations, eq(organizationMembers.organizationId, organizations.id))
    .where(eq(organizationMembers.userId, userId))
}

export async function getOrganizationMembers(organizationId: string) {
  return await db
    .select({
      user: users,
      role: organizationMembers.orgRole,
    })
    .from(organizationMembers)
    .innerJoin(users, eq(organizationMembers.userId, users.id))
    .where(eq(organizationMembers.organizationId, organizationId))
} 