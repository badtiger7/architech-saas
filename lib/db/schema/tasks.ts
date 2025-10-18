import { pgTable, text, timestamp, integer, date } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { projects } from './projects'
import { users } from './organizations'

export const tasks = pgTable('tasks', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull().default('todo'), // 'todo', 'in-progress', 'review', 'done'
  priority: text('priority').notNull().default('medium'), // 'low', 'medium', 'high'
  assigneeUserId: text('assignee_user_id').references(() => users.id, { onDelete: 'set null' }),
  createdByUserId: text('created_by_user_id').notNull().references(() => users.id),
  dueDate: date('due_date'),
  estimatedHours: integer('estimated_hours').default(0),
  tags: text('tags'), // JSON array as string
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const taskComments = pgTable('task_comments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  authorUserId: text('author_user_id').notNull().references(() => users.id),
  content: text('content').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const taskAttachments = pgTable('task_attachments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  taskId: text('task_id').notNull().references(() => tasks.id, { onDelete: 'cascade' }),
  filename: text('filename').notNull(),
  fileSize: integer('file_size'),
  mimeType: text('mime_type'),
  uploadedByUserId: text('uploaded_by_user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}) 