import { pgTable, text, timestamp, date, integer, boolean } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { organizations, users } from './organizations'

export const projects = pgTable('projects', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  clientName: text('client_name').notNull(),
  status: text('status').notNull(), // 'active', 'completed', 'on_hold', 'cancelled'
  startDate: date('start_date'),
  endDate: date('end_date'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const projectMembers = pgTable('project_members', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  projectRole: text('project_role').notNull(), // 'manager', 'architect', 'engineer', 'viewer'
})

export const projectTemplates = pgTable('project_templates', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  isDefault: boolean('is_default').default(false).notNull(),
})

export const stepTemplates = pgTable('step_templates', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  projectTemplateId: text('project_template_id').notNull().references(() => projectTemplates.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  orderIndex: integer('order_index').notNull(),
})

export const projectSteps = pgTable('project_steps', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  orderIndex: integer('order_index').notNull(),
  startDate: date('start_date'),
  endDate: date('end_date'),
  description: text('description'),
  status: text('status').notNull(), // 'pending', 'in_progress', 'completed', 'blocked'
  progressRatio: integer('progress_ratio').default(0).notNull(), // 0-100
})

export const stepDependencies = pgTable('step_dependencies', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  stepId: text('step_id').notNull().references(() => projectSteps.id, { onDelete: 'cascade' }),
  dependsOnStepId: text('depends_on_step_id').notNull().references(() => projectSteps.id, { onDelete: 'cascade' }),
})

export const stepValidationLogs = pgTable('step_validation_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  stepId: text('step_id').notNull().references(() => projectSteps.id, { onDelete: 'cascade' }),
  validatedByUserId: text('validated_by_user_id').notNull().references(() => users.id),
  statusBefore: text('status_before').notNull(),
  statusAfter: text('status_after').notNull(),
  note: text('note'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}) 