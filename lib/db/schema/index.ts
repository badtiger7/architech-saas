// Organizations and Users
export * from './organizations'

// Projects and Steps
export * from './projects'

// Documents and Annotations
export * from './documents'

// Meetings and Work Items
export * from './meetings'

// Tasks Management
export * from './tasks'

// System Tables (ACL, Notifications, etc.)
export * from './system'

// Re-export everything for the main schema
import * as organizations from './organizations'
import * as projects from './projects'
import * as documents from './documents'
import * as meetings from './meetings'
import * as tasks from './tasks'
import * as system from './system'

export const schema = {
  ...organizations,
  ...projects,
  ...documents,
  ...meetings,
  ...tasks,
  ...system,
} 