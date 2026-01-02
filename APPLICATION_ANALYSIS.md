# 📊 Application Analysis & Implementation Plan

## 🔍 Executive Summary

**Architech SaaS** is a comprehensive project management platform for architectural firms with the following features:
- Project management (Dashboard, Timeline, Archive)
- Document management (Drive with annotations)
- Task management (Journal/Kanban)
- Notifications system
- User/organization management

**Current Status**: ~60% dynamic (using real database), ~40% static (mock data)

---

## 📁 Features Inventory

### ✅ FULLY DYNAMIC (Connected to Database)

#### 1. **Dashboard** (`/dashboard`)
- ✅ Projects list - **DYNAMIC** (via `useProjects` hook)
- ✅ Create new project - **DYNAMIC** (API: `POST /api/projects`)
- ✅ Project thumbnails - **DYNAMIC** (upload to R2, stored in DB)
- ❌ Recent documents - **STATIC** (hardcoded array)
- ❌ Notifications - **STATIC** (hardcoded array)
- ❌ Project progress - **PARTIAL** (hardcoded 65%, should calculate from phases)
- ❌ Current phase - **STATIC** (hardcoded "APD")
- ❌ Team members - **STATIC** (hardcoded)
- ❌ Statistics (Documents count, Collaborators count) - **STATIC**

**API Routes Available:**
- ✅ `GET /api/projects` - List projects
- ✅ `POST /api/projects` - Create project
- ✅ `GET /api/projects/[projectId]` - Get project
- ✅ `PATCH /api/projects/[projectId]` - Update project
- ✅ `POST /api/projects/[projectId]/thumbnail` - Upload thumbnail
- ✅ `GET /api/projects/[projectId]/thumbnail/url` - Get thumbnail URL

#### 2. **Timeline** (`/timeline`)
- ✅ Projects list - **DYNAMIC** (via `useProjects`)
- ✅ Phases list - **DYNAMIC** (API: `GET /api/projects/[projectId]/phases`)
- ✅ Create phase - **DYNAMIC** (API: `POST /api/projects/[projectId]/phases`)
- ✅ Update phase status - **DYNAMIC** (API: `PATCH /api/projects/[projectId]/phases/[phaseId]`)
- ❌ Documents per phase - **STATIC** (shows "0 documents", should query `document_steps`)
- ❌ Collaborators per phase - **STATIC** (shows "0 collaborateurs")
- ❌ Comments per phase - **STATIC** (shows "0 commentaires")

**API Routes Available:**
- ✅ `GET /api/projects/[projectId]/phases`
- ✅ `POST /api/projects/[projectId]/phases`
- ✅ `GET /api/projects/[projectId]/phases/[phaseId]`
- ✅ `PATCH /api/projects/[projectId]/phases/[phaseId]`
- ✅ `GET /api/projects/[projectId]/phases/[phaseId]/documents`

#### 3. **Journal (Tasks)** (`/journal`)
- ✅ Tasks list - **DYNAMIC** (via `useTasks` hook)
- ✅ Create task - **DYNAMIC** (API: `POST /api/tasks`)
- ✅ Update task - **DYNAMIC** (API: `PATCH /api/tasks/[taskId]`)
- ✅ Delete task - **DYNAMIC** (API: `DELETE /api/tasks/[taskId]`)
- ✅ Drag & drop status change - **DYNAMIC**
- ❌ Task comments - **STATIC** (shows 0, schema exists but no API/UI)
- ❌ Task attachments - **STATIC** (shows 0, schema exists but no API/UI)
- ❌ User assignments - **PARTIAL** (hardcoded "user-test", no real users API)

**API Routes Available:**
- ✅ `GET /api/tasks` - List tasks with filters
- ✅ `POST /api/tasks` - Create task
- ✅ `GET /api/tasks/[taskId]` - Get task
- ✅ `PATCH /api/tasks/[taskId]` - Update task
- ✅ `DELETE /api/tasks/[taskId]` - Delete task

#### 4. **Organizations**
- ✅ Organizations list - **DYNAMIC** (API: `GET /api/organizations`)
- ✅ Create organization - **DYNAMIC** (API: `POST /api/organizations`)

**API Routes Available:**
- ✅ `GET /api/organizations`
- ✅ `POST /api/organizations`

---

### ❌ STATIC/MOCK DATA (Not Connected to Database)

#### 5. **Drive** (`/drive`)
- ❌ Projects list - **STATIC** (hardcoded array)
- ❌ Documents list - **STATIC** (hardcoded array with fake data)
- ❌ Folders - **STATIC** (hardcoded categories)
- ❌ Document upload - **DISABLED** (button disabled, upload API exists)
- ❌ Search - **DISABLED** (input disabled)
- ❌ Filters - **DISABLED** (select disabled)

**API Routes Available:**
- ✅ `POST /api/upload` - Upload document (exists but not connected to UI)

**Database Schema Exists:**
- ✅ `documents` table
- ✅ `document_versions` table
- ✅ `document_steps` table
- ✅ `annotations` table
- ✅ `annotation_comments` table

#### 6. **Notifications** (`/notifications`)
- ❌ Notifications list - **STATIC** (hardcoded array in component state)
- ❌ Notification preferences - **STATIC** (local state, not persisted)
- ❌ Mark as read - **STATIC** (only updates local state)

**Database Schema Exists:**
- ✅ `notifications` table
- ✅ `notification_prefs` table
- ✅ `notification_deliveries` table

**API Routes Needed:**
- ❌ `GET /api/notifications`
- ❌ `POST /api/notifications/[notificationId]/read`
- ❌ `PATCH /api/notifications/prefs`

#### 7. **Archive** (`/archive`)
- ❌ Projects list - **STATIC** (hardcoded array)
- ❌ Project details - **STATIC** (hardcoded in `[projectId]/page.tsx`)
- ❌ Documents per project - **STATIC** (hardcoded)
- ❌ Activity feed - **STATIC** (hardcoded array)

**API Routes Needed:**
- ❌ `GET /api/projects?status=completed` (filter archived projects)
- ❌ `GET /api/archive/[projectId]/documents`
- ❌ `GET /api/archive/activities`

#### 8. **Drive File Detail Pages**
- ❌ Document details - **STATIC** (hardcoded in `drive/[fileId]/page.tsx`)
- ❌ Annotations - **STATIC** (hardcoded array)
- ❌ Comments - **STATIC** (hardcoded array)
- ❌ Recent viewers - **STATIC** (hardcoded array)
- ❌ Contributors - **STATIC** (hardcoded array)

**API Routes Needed:**
- ❌ `GET /api/documents/[documentId]`
- ❌ `GET /api/documents/[documentId]/versions`
- ❌ `GET /api/documents/[documentId]/annotations`
- ❌ `POST /api/documents/[documentId]/annotations`
- ❌ `GET /api/documents/[documentId]/view-logs`

#### 9. **Settings** (`/settings`)
- ❌ User settings - **NOT IMPLEMENTED** (page exists but empty/static)
- ❌ Project permissions - **STATIC** (hardcoded array)

**Database Schema Exists:**
- ✅ `users` table
- ✅ `organization_members` table
- ✅ `project_members` table
- ✅ `acl_entries` table (access control)

---

## 📊 Database Schema Status

### ✅ Tables with Full CRUD Implementation
1. `organizations` - ✅ Full API + UI
2. `projects` - ✅ Full API + UI
3. `project_steps` (phases) - ✅ Full API + UI
4. `tasks` - ✅ Full API + UI

### ⚠️ Tables with Schema but No/Limited API
1. `users` - ❌ No API (hardcoded user IDs)
2. `organization_members` - ❌ No API
3. `project_members` - ❌ No API
4. `documents` - ⚠️ Upload API exists, but no list/get API
5. `document_versions` - ⚠️ Created via upload, no API
6. `document_steps` - ⚠️ No API
7. `annotations` - ❌ No API
8. `annotation_comments` - ❌ No API
9. `notifications` - ❌ No API
10. `notification_prefs` - ❌ No API
11. `audit_logs` - ❌ No API
12. `acl_entries` - ❌ No API
13. `public_links` - ❌ No API
14. `share_invitations` - ❌ No API
15. `site_meetings` - ❌ No API
16. `work_items` - ❌ No API (separate from tasks)

---

## 🎯 Implementation Priority & Plan

### Phase 1: Core Data (HIGH PRIORITY) 🔴

#### 1.1 Users & Organization Members
**Why**: Required for proper assignments and team features
**Tasks**:
- [ ] Create `GET /api/users` - List users in organization
- [ ] Create `GET /api/organizations/[orgId]/members` - List members
- [ ] Update Journal page to use real users for assignments
- [ ] Update Dashboard to show real team members

**Mock Data Needed**:
```typescript
// Seed data for users
const users = [
  { email: "jean.dupont@architech.fr", displayName: "Jean Dupont", orgRole: "admin" },
  { email: "marie.leroy@architech.fr", displayName: "Marie Leroy", orgRole: "member" },
  { email: "paul.leroy@architech.fr", displayName: "Paul Leroy", orgRole: "member" },
]
```

#### 1.2 Documents API & Drive Page
**Why**: Core feature, currently completely static
**Tasks**:
- [ ] Create `GET /api/documents?projectId=xxx` - List documents
- [ ] Create `GET /api/documents/[documentId]` - Get document details
- [ ] Create `GET /api/documents/[documentId]/versions` - List versions
- [ ] Connect Drive page to real API
- [ ] Enable document upload functionality
- [ ] Enable search and filters

**Mock Data Needed**:
```typescript
// Seed documents for projects
const documents = [
  {
    projectId: "project-1",
    title: "Plans Facade - v2.3.dwg",
    category: "plan",
    stepId: "phase-1-id",
    uploadedBy: "user-1-id"
  },
  // ... more documents
]
```

### Phase 2: Enhanced Features (MEDIUM PRIORITY) 🟡

#### 2.1 Notifications System
**Tasks**:
- [ ] Create `GET /api/notifications` - List notifications
- [ ] Create `PATCH /api/notifications/[id]/read` - Mark as read
- [ ] Create `GET /api/notifications/prefs` - Get preferences
- [ ] Create `PATCH /api/notifications/prefs` - Update preferences
- [ ] Connect Notifications page to API
- [ ] Implement notification creation triggers (when documents uploaded, tasks created, etc.)

#### 2.2 Document Annotations
**Tasks**:
- [ ] Create `GET /api/documents/[id]/annotations` - List annotations
- [ ] Create `POST /api/documents/[id]/annotations` - Create annotation
- [ ] Create `GET /api/annotations/[id]/comments` - List comments
- [ ] Create `POST /api/annotations/[id]/comments` - Add comment
- [ ] Connect annotation UI to API

#### 2.3 Archive & Activity Logs
**Tasks**:
- [ ] Create `GET /api/projects?status=completed` - Get archived projects
- [ ] Create `GET /api/audit-logs` - Get activity logs
- [ ] Connect Archive page to API
- [ ] Implement project archiving functionality

#### 2.4 Task Comments & Attachments
**Tasks**:
- [ ] Create `GET /api/tasks/[id]/comments` - List comments
- [ ] Create `POST /api/tasks/[id]/comments` - Add comment
- [ ] Create `GET /api/tasks/[id]/attachments` - List attachments
- [ ] Create `POST /api/tasks/[id]/attachments` - Upload attachment
- [ ] Add UI for comments and attachments in Journal

### Phase 3: Advanced Features (LOW PRIORITY) 🟢

#### 3.1 Settings & Permissions
**Tasks**:
- [ ] Create user settings API
- [ ] Create ACL/permissions API
- [ ] Build Settings page UI
- [ ] Implement permission checks across app

#### 3.2 Project Templates
**Tasks**:
- [ ] Create project template API
- [ ] Add template selection to project creation
- [ ] Auto-create phases from template

#### 3.3 Dashboard Statistics
**Tasks**:
- [ ] Calculate real project progress from phases
- [ ] Calculate real document counts
- [ ] Calculate real collaborator counts
- [ ] Add real-time statistics API

---

## 📝 Mock Data Requirements

### Minimum Viable Seed Data

#### 1. Organization & Users
```sql
-- Organization (already exists: y1dz7q6fj91e3cf0i0p7t67d)
-- Need to add:
INSERT INTO users (email, display_name, auth_provider) VALUES
  ('jean.dupont@architech.fr', 'Jean Dupont', 'email'),
  ('marie.leroy@architech.fr', 'Marie Leroy', 'email'),
  ('paul.leroy@architech.fr', 'Paul Leroy', 'email'),
  ('sophie.durand@architech.fr', 'Sophie Durand', 'email');

INSERT INTO organization_members (organization_id, user_id, org_role) VALUES
  -- Link users to organization y1dz7q6fj91e3cf0i0p7t67d
  ('y1dz7q6fj91e3cf0i0p7t67d', 'user-jean-id', 'admin'),
  ('y1dz7q6fj91e3cf0i0p7t67d', 'user-marie-id', 'member'),
  ('y1dz7q6fj91e3cf0i0p7t67d', 'user-paul-id', 'member');
```

#### 2. Projects (if none exist)
```sql
-- Projects should already exist from Dashboard usage
-- But need to ensure project_members are linked:
INSERT INTO project_members (project_id, user_id, project_role) VALUES
  -- Link team members to projects
  ('project-id-1', 'user-jean-id', 'manager'),
  ('project-id-1', 'user-marie-id', 'architect'),
  ('project-id-2', 'user-paul-id', 'engineer');
```

#### 3. Documents (for Drive)
```sql
-- Create sample documents linked to projects and phases
INSERT INTO documents (project_id, title, category, created_by_user_id) VALUES
  ('project-id-1', 'Plans Facade - v2.3.dwg', 'plan', 'user-jean-id'),
  ('project-id-1', 'Rapport Structure.pdf', 'report', 'user-marie-id'),
  ('project-id-1', 'Perspectives 3D.zip', 'other', 'user-paul-id');

-- Create document versions (requires S3 uploads, so this might need to wait)
-- For now, create placeholder versions
INSERT INTO document_versions (document_id, version_number, s3_bucket, s3_key, s3_etag, content_type, size_bytes, uploaded_by_user_id) VALUES
  ('doc-1-id', 1, 'architech-docs', 'placeholder-key', 'etag', 'application/x-dwg', 2500000, 'user-jean-id');
```

#### 4. Tasks (should already exist from Journal usage)
```sql
-- Tasks should already exist, but ensure they're properly linked to users
UPDATE tasks SET assignee_user_id = 'user-jean-id' WHERE id IN (...);
```

#### 5. Notifications (for testing)
```sql
INSERT INTO notifications (user_id, type, title, body, priority, is_read) VALUES
  ('user-jean-id', 'deadline', 'Échéance APD - Résidence Les Jardins', 'La phase APD se termine dans 3 jours', 'high', false),
  ('user-marie-id', 'document', 'Nouveau document ajouté', 'Jean Dupont a ajouté un document', 'medium', false);
```

---

## 🚀 Next Steps (Recommended Order)

### Step 1: Users API (1-2 hours)
1. Create `GET /api/users` endpoint
2. Create `GET /api/organizations/[orgId]/members` endpoint
3. Update Journal page to use real users
4. Create seed script for users

### Step 2: Documents API - List & Get (2-3 hours)
1. Create `GET /api/documents` endpoint with filters
2. Create `GET /api/documents/[id]` endpoint
3. Connect Drive page to API
4. Enable search and filters

### Step 3: Document Upload Connection (1 hour)
1. Connect upload button to existing `/api/upload`
2. Refresh document list after upload
3. Handle errors and success states

### Step 4: Notifications API (2-3 hours)
1. Create notifications CRUD endpoints
2. Connect Notifications page to API
3. Add notification triggers in existing APIs

### Step 5: Dashboard Statistics (1-2 hours)
1. Calculate real project progress
2. Calculate real document counts
3. Calculate real team member counts
4. Show real recent documents

### Step 6: Archive Page (2 hours)
1. Filter projects by status
2. Connect Archive page to projects API
3. Add activity logs API

---

## 📈 Completion Estimates

| Feature | Current Status | Estimated Time | Priority |
|---------|---------------|----------------|----------|
| Users API | 0% | 2h | 🔴 HIGH |
| Documents List/Get API | 0% | 3h | 🔴 HIGH |
| Drive Page Connection | 0% | 2h | 🔴 HIGH |
| Notifications API | 0% | 3h | 🟡 MEDIUM |
| Document Annotations API | 0% | 4h | 🟡 MEDIUM |
| Archive API | 0% | 2h | 🟡 MEDIUM |
| Dashboard Statistics | 30% | 2h | 🟡 MEDIUM |
| Task Comments/Attachments | 0% | 3h | 🟢 LOW |
| Settings Page | 0% | 4h | 🟢 LOW |

**Total Estimated Time**: ~21 hours for all features

---

## 🔧 Technical Notes

### Hardcoded Organization ID
- Current organization ID: `"y1dz7q6fj91e3cf0i0p7t67d"` is hardcoded in multiple places
- **TODO**: Implement authentication/session management to get current user's organization

### File Storage
- R2 (Cloudflare) is configured for file storage
- Thumbnails and documents should be uploaded to R2
- Signed URLs are used for access

### Database Connection
- Using Drizzle ORM with PostgreSQL
- Connection is in `lib/db/connection.ts`
- Migrations are in `lib/db/migrations/`

### API Client
- Centralized API client in `lib/api/client.ts`
- Uses `useApi()` hook for React components
- Hooks like `useProjects` and `useTasks` wrap the API client

---

## ✅ Checklist for Making Everything Dynamic

- [ ] Users API and seed data
- [ ] Documents API (list, get, upload)
- [ ] Drive page connected to API
- [ ] Notifications API and page
- [ ] Document annotations API
- [ ] Archive page connected to API
- [ ] Dashboard statistics (real calculations)
- [ ] Task comments and attachments
- [ ] Settings page with user/org management
- [ ] Remove all hardcoded arrays
- [ ] Implement proper error handling
- [ ] Add loading states everywhere
- [ ] Implement authentication/session
- [ ] Add permission checks

---

**Last Updated**: After migration script creation
**Status**: Ready for implementation

