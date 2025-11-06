import { pgTable, text, timestamp, integer, boolean } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { projects } from './projects'
import { users } from './organizations'
import { projectSteps } from './projects'

export const documents = pgTable('documents', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  projectId: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  category: text('category').notNull(), // 'plan', 'specification', 'photo', 'report', 'other'
  currentVersionId: text('current_version_id'), // Will be updated after document version creation
  createdByUserId: text('created_by_user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const documentVersions = pgTable('document_versions', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  documentId: text('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull(),
  s3Bucket: text('s3_bucket').notNull(),
  s3Key: text('s3_key').notNull(),
  s3Etag: text('s3_etag').notNull(),
  contentType: text('content_type').notNull(),
  sizeBytes: integer('size_bytes').notNull(),
  originalFileName: text('original_file_name'), // Nom original du fichier uploadé
  uploadedByUserId: text('uploaded_by_user_id').notNull().references(() => users.id),
  uploadedAt: timestamp('uploaded_at').defaultNow().notNull(),
  isLegalArchive: boolean('is_legal_archive').default(false).notNull(),
})

export const documentSteps = pgTable('document_steps', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  documentId: text('document_id').notNull().references(() => documents.id, { onDelete: 'cascade' }),
  stepId: text('step_id').notNull().references(() => projectSteps.id, { onDelete: 'cascade' }),
  selectedVersionId: text('selected_version_id').references(() => documentVersions.id),
})

export const documentViewLogs = pgTable('document_view_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  documentVersionId: text('document_version_id').notNull().references(() => documentVersions.id, { onDelete: 'cascade' }),
  actorUserId: text('actor_user_id').references(() => users.id),
  publicLinkId: text('public_link_id'),
  ip: text('ip'),
  userAgent: text('user_agent'),
  event: text('event').notNull(), // 'view', 'download', 'print'
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const annotations = pgTable('annotations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  documentVersionId: text('document_version_id').notNull().references(() => documentVersions.id, { onDelete: 'cascade' }),
  authorUserId: text('author_user_id').notNull().references(() => users.id),
  pageNumber: integer('page_number').notNull(),
  shapeType: text('shape_type').notNull(), // 'point', 'rectangle', 'circle', 'arrow', 'text'
  shapePayload: text('shape_payload').notNull(), // JSON string with shape data
  status: text('status').notNull(), // 'open', 'resolved', 'closed'
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const annotationComments = pgTable('annotation_comments', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  annotationId: text('annotation_id').notNull().references(() => annotations.id, { onDelete: 'cascade' }),
  authorUserId: text('author_user_id').notNull().references(() => users.id),
  message: text('message').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  parentCommentId: text('parent_comment_id').references(() => annotationComments.id),
}) 