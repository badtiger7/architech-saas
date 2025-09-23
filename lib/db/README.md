# Database Setup for Architech SaaS

This directory contains the database schema and utilities for the Collaborative Construction Project Platform.

## Tech Stack

- **Database**: PostgreSQL 15+
- **ORM**: Drizzle ORM
- **Migrations**: Drizzle Kit
- **ID Generation**: CUID2

## Database Schema Overview

The database is designed around the construction project management domain with the following main entities:

### Core Entities

1. **Organizations & Users**
   - `organizations`: Company/organization information
   - `users`: User accounts with authentication data
   - `organization_members`: User membership in organizations
   - `external_contacts`: External contractors and contacts

2. **Projects & Workflow**
   - `projects`: Construction projects
   - `project_members`: Team members assigned to projects
   - `project_steps`: Workflow phases (e.g., Esquisse, APS, APD)
   - `project_templates`: Reusable project templates
   - `step_templates`: Template-based workflow steps

3. **Document Management**
   - `documents`: Document metadata
   - `document_versions`: Version control for documents
   - `document_steps`: Link documents to project phases
   - `annotations`: PDF annotations and markups
   - `annotation_comments`: Threaded comments on annotations

4. **Site Management**
   - `site_meetings`: Construction site meetings
   - `site_meeting_participants`: Meeting attendees
   - `site_attendance`: Attendance tracking
   - `work_items`: Tasks, issues, and observations
   - `meeting_photos`: Photo documentation

5. **System Features**
   - `acl_entries`: Access control permissions
   - `public_links`: Shareable public links
   - `share_invitations`: Email invitations
   - `notifications`: User notifications
   - `audit_logs`: Activity tracking

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file with:

```bash
# For local development with Docker
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/architech_db"

# For production or custom setup
# DATABASE_URL="postgresql://username:password@host:port/database"
```

### 2. Local Development with Docker

Start the PostgreSQL database:

```bash
docker-compose up -d
```

### 3. Install Dependencies

```bash
npm install
```

### 4. Generate and Run Migrations

Generate migration files from schema:

```bash
npm run db:generate
```

Run migrations to create tables:

```bash
npm run db:migrate
```

### 5. Optional: Database Studio

Launch Drizzle Studio for visual database management:

```bash
npm run db:studio
```

## Available Scripts

- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Apply pending migrations to database
- `npm run db:studio` - Launch Drizzle Studio GUI
- `npm run db:reset` - Reset database (⚠️ Development only)

## Database Structure

### Key Relationships

1. **Hierarchical Structure**: Organizations → Projects → Steps → Documents
2. **User Permissions**: Multi-level access control (organization, project, document)
3. **Document Versioning**: Complete version history with S3 storage
4. **Workflow Management**: Template-based project phases with dependencies
5. **Collaborative Features**: Annotations, comments, sharing, notifications

### Design Patterns

1. **Polymorphic Relationships**: ACL, public links, and audit logs use `resource_type`/`resource_id` patterns
2. **Soft References**: Some foreign keys are optional to handle edge cases
3. **Audit Trail**: Comprehensive logging of user actions
4. **Event Sourcing**: Outbox pattern for reliable event publishing

## Usage Examples

### Basic Queries

```typescript
import { db } from './connection'
import { organizations, users, projects } from './schema'

// Create a new organization
const org = await db.insert(organizations)
  .values({ name: 'Acme Construction' })
  .returning()

// Get user's projects
const userProjects = await db
  .select()
  .from(projects)
  .where(eq(projects.organizationId, orgId))
```

### Advanced Queries

See the `queries/` directory for more complex examples.

## Migration Strategy

1. **Schema First**: Define schema in TypeScript files
2. **Generate Migrations**: Use Drizzle Kit to generate SQL migrations
3. **Version Control**: Commit both schema and migration files
4. **Apply**: Run migrations in all environments

## Security Considerations

1. **Row-Level Security**: Implement through ACL system
2. **Audit Logging**: All significant actions are logged
3. **Data Encryption**: Sensitive data should be encrypted at application level
4. **Access Control**: Multi-level permissions (org, project, document)

## Performance Considerations

1. **Indexing**: Add indexes for frequently queried columns
2. **Partitioning**: Consider partitioning large tables like `audit_logs`
3. **Connection Pooling**: Use connection pooling in production
4. **Query Optimization**: Monitor and optimize slow queries

## Backup Strategy

1. **Regular Backups**: Automated daily backups
2. **Point-in-Time Recovery**: Enable WAL archiving
3. **Testing**: Regular restore testing
4. **Retention**: Define backup retention policies 