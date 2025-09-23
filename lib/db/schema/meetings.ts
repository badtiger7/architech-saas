import { pgTable, text, timestamp, date } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { projects, projectSteps } from './projects'
import { users, externalContacts } from './organizations'
import { documents } from './documents'

export const siteMeetings = pgTable('site_meetings', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  meetingDate: timestamp('meeting_date').notNull(),
  location: text('location'),
  agenda: text('agenda'),
  createdByUserId: text('created_by_user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const siteMeetingParticipants = pgTable('site_meeting_participants', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  siteMeetingId: text('site_meeting_id').notNull().references(() => siteMeetings.id, { onDelete: 'cascade' }),
  participantType: text('participant_type').notNull(), // 'user' or 'external_contact'
  userId: text('user_id').references(() => users.id),
  externalContactId: text('external_contact_id').references(() => externalContacts.id),
})

export const siteAttendance = pgTable('site_attendance', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  siteMeetingId: text('site_meeting_id').notNull().references(() => siteMeetings.id, { onDelete: 'cascade' }),
  participantType: text('participant_type').notNull(), // 'user' or 'external_contact'
  userId: text('user_id').references(() => users.id),
  externalContactId: text('external_contact_id').references(() => externalContacts.id),
  status: text('status').notNull(), // 'present', 'absent', 'late'
  checkInAt: timestamp('check_in_at'),
})

export const workItems = pgTable('work_items', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  category: text('category').notNull(), // 'task', 'issue', 'observation', 'rework'
  title: text('title').notNull(),
  description: text('description'),
  status: text('status').notNull(), // 'open', 'in_progress', 'completed', 'cancelled'
  dueDate: date('due_date'),
  createdByUserId: text('created_by_user_id').notNull().references(() => users.id),
  stepId: text('step_id').references(() => projectSteps.id),
  companyId: text('company_id').references(() => externalContacts.id),
  assigneeUserId: text('assignee_user_id').references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const workItemComments = pgTable('work_item_comments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  workItemId: text('work_item_id').notNull().references(() => workItems.id, { onDelete: 'cascade' }),
  authorUserId: text('author_user_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const meetingPhotos = pgTable('meeting_photos', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  siteMeetingId: text('site_meeting_id').notNull().references(() => siteMeetings.id, { onDelete: 'cascade' }),
  s3Bucket: text('s3_bucket').notNull(),
  s3Key: text('s3_key').notNull(),
  uploadedByUserId: text('uploaded_by_user_id').notNull().references(() => users.id),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
})

export const meetingDocuments = pgTable('meeting_documents', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  siteMeetingId: text('site_meeting_id').notNull().references(() => siteMeetings.id, { onDelete: 'cascade' }),
  documentId: text('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
}) 