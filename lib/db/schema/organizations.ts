import { pgTable, text, timestamp, varchar, boolean } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const organizations = pgTable('organizations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const users = pgTable('users', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  email: text('email').notNull().unique(),
  displayName: text('display_name').notNull(),
  authProvider: text('auth_provider').notNull(),
  avatarUrl: text('avatar_url'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const organizationMembers = pgTable('organization_members', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  orgRole: text('org_role').notNull(), // 'admin', 'member', 'viewer'
})

export const externalContacts = pgTable('external_contacts', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  companyName: text('company_name').notNull(),
  contactName: text('contact_name').notNull(),
  email: text('email'),
  phone: text('phone'),
}) 