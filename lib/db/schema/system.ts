import { pgTable, text, timestamp, boolean } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'
import { users, organizations } from './organizations'

export const aclEntries = pgTable('acl_entries', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  resourceType: text('resource_type').notNull(), // 'project', 'project_step', 'document'
  resourceId: text('resource_id').notNull(),
  subjectType: text('subject_type').notNull(), // 'user', 'organization'
  subjectId: text('subject_id').notNull(),
  permission: text('permission').notNull(), // 'read', 'write', 'admin', 'comment'
  grantedByUserId: text('granted_by_user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const publicLinks = pgTable('public_links', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  resourceType: text('resource_type').notNull(), // 'project', 'project_step', 'document'
  resourceId: text('resource_id').notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at'),
  disabled: boolean('disabled').default(false).notNull(),
  scope: text('scope').notNull(), // 'read', 'comment'
  createdByUserId: text('created_by_user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const shareInvitations = pgTable('share_invitations', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  email: text('email').notNull(),
  roleHint: text('role_hint'), // suggested role for the invitation
  resourceType: text('resource_type').notNull(), // 'project', 'project_step', 'document'
  resourceId: text('resource_id').notNull(),
  status: text('status').notNull(), // 'pending', 'accepted', 'declined', 'expired'
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdByUserId: text('created_by_user_id').notNull().references(() => users.id),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const notifications = pgTable('notifications', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // 'project_update', 'document_shared', 'deadline_reminder', etc.
  title: text('title').notNull(),
  body: text('body').notNull(),
  payload: text('payload'), // JSON string with additional data
  priority: text('priority').notNull(), // 'low', 'normal', 'high', 'urgent'
  isRead: boolean('is_read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
})

export const notificationPrefs = pgTable('notification_prefs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  type: text('type').notNull(), // notification type
  viaWeb: boolean('via_web').default(true).notNull(),
  viaPush: boolean('via_push').default(true).notNull(),
  viaEmail: boolean('via_email').default(false).notNull(),
})

export const notificationDeliveries = pgTable('notification_deliveries', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  notificationId: text('notification_id').notNull().references(() => notifications.id, { onDelete: 'cascade' }),
  channel: text('channel').notNull(), // 'web', 'push', 'email'
  status: text('status').notNull(), // 'pending', 'sent', 'failed', 'delivered'
  providerMsgId: text('provider_msg_id'), // external provider message ID
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
})

export const outboxEvents = pgTable('outbox_events', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  aggregateType: text('aggregate_type').notNull(),
  aggregateId: text('aggregate_id').notNull(),
  eventType: text('event_type').notNull(),
  payload: text('payload').notNull(), // JSON string
  processedAt: timestamp('processed_at'),
})

export const auditLogs = pgTable('audit_logs', {
  id: text('id').primaryKey().$defaultFn(() => createId()),
  organizationId: text('organization_id').notNull().references(() => organizations.id, { onDelete: 'cascade' }),
  actorUserId: text('actor_user_id').references(() => users.id),
  action: text('action').notNull(), // 'create', 'update', 'delete', 'view', 'download'
  resourceType: text('resource_type').notNull(),
  resourceId: text('resource_id').notNull(),
  metadata: text('metadata'), // JSON string with action details
  createdAt: timestamp('created_at').defaultNow().notNull(),
}) 