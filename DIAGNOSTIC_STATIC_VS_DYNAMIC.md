# 🔍 DIAGNOSTIC COMPLET : STATIQUE VS DYNAMIQUE

## 📊 RÉSUMÉ EXÉCUTIF

**Application:** Architech SaaS - Plateforme de gestion de projets architecturaux

**État actuel:** Interface UI/UX complète avec backend partiellement implémenté

**Pourcentage d'implémentation:**
- **Backend API:** ~60% (projets, tâches, phases fonctionnels)
- **Frontend Connecté:** ~40% (quelques pages utilisent réellement l'API)
- **Données Statiques:** ~60% (mock data dans plusieurs pages)

---

## ✅ CE QUI EST DÉJÀ DYNAMIQUE (IMPLÉMENTÉ)

### 1. **Projets (Projects)**
- ✅ **API Routes:** `/api/projects`, `/api/projects/[projectId]`
- ✅ **Hook:** `useProjects()` dans `hooks/use-projects.ts`
- ✅ **Fonctionnalités:**
  - Création de projets (POST)
  - Lecture de projets (GET)
  - Mise à jour de projets (PATCH)
  - Upload de thumbnail (POST `/api/projects/[projectId]/thumbnail`)
  - Récupération URL signée thumbnail (GET `/api/projects/[projectId]/thumbnail/url`)
- ✅ **Pages connectées:**
  - `/dashboard` - Liste des projets dynamique
  - `/timeline` - Sélection de projet dynamique
- ⚠️ **Partiellement statique:**
  - Progression (`progress: 65`) - codée en dur, TODO: calculer depuis phases
  - Phase actuelle (`currentPhase: "APD"`) - codée en dur
  - Équipe (`team: [{ name: "Équipe", ... }]`) - mock data

### 2. **Tâches (Tasks)**
- ✅ **API Routes:** `/api/tasks`, `/api/tasks/[taskId]`
- ✅ **Hook:** `useTasks()` dans `hooks/use-tasks.ts`
- ✅ **Fonctionnalités:**
  - CRUD complet (Create, Read, Update, Delete)
  - Filtres par projet, statut, assigné
  - Drag & drop pour changement de statut
- ✅ **Pages connectées:**
  - `/journal` - Kanban board complètement dynamique
  - `/journal/[taskId]` - Détails de tâche (à vérifier)

### 3. **Phases de Projet (Project Steps/Phases)**
- ✅ **API Routes:** `/api/projects/[projectId]/phases`, `/api/projects/[projectId]/phases/[phaseId]`
- ✅ **Fonctionnalités:**
  - Création de phases
  - Mise à jour de phases (statut, progression)
  - Liste des phases par projet
- ✅ **Pages connectées:**
  - `/timeline` - Timeline dynamique avec phases réelles

### 4. **Organisations**
- ✅ **API Routes:** `/api/organizations`
- ✅ **Hook:** Disponible via `useApi()`
- ✅ **Fonctionnalités:**
  - Création et lecture d'organisations
- ⚠️ **Limitation:** ID hardcodé `"y1dz7q6fj91e3cf0i0p7t67d"` dans plusieurs pages

### 5. **Newsletter/Landing**
- ✅ **API Route:** `/api/landing` (POST)
- ✅ **Intégration Notion:** Fonctionnelle
- ✅ **Page connectée:**
  - `/landing` - Formulaire d'inscription avec sauvegarde Notion

---

## ❌ CE QUI EST STATIQUE (À IMPLÉMENTER)

### 1. **Documents & Drive** 🔴 CRITIQUE
**Fichier:** `app/drive/page.tsx`

**Données statiques:**
- ❌ `projects` array (lignes 48-63) - Hardcodé
- ❌ `folders` array (lignes 65-71) - Hardcodé
- ❌ `documents` array (lignes 73-146) - Hardcodé
- ❌ Projets: Résidence Les Jardins, Centre Commercial Atlantis, etc.
- ❌ Dossiers: Plans, Documents, Modèles 3D, Photos
- ❌ Documents: Plans Facade, Rapport Structure, etc.

**Schéma DB existant:** ✅ `documents`, `documentVersions`, `documentSteps`
**API Routes existantes:**
- ✅ `/api/upload` - Upload document vers phase (existe)
- ✅ `/api/projects/[projectId]/phases/[phaseId]/documents` - Documents par phase (existe)

**API Routes nécessaires:**
- ❌ `GET /api/documents?projectId=xxx&folder=xxx` - Liste des documents par projet (pas par phase)
- ❌ `GET /api/documents/[documentId]` - Détails document
- ❌ `DELETE /api/documents/[documentId]` - Supprimer document
- ❌ `GET /api/documents/[documentId]/versions` - Historique versions
- ❌ `GET /api/projects/[projectId]/folders` - Liste dossiers/catégories

**Pages affectées:**
- `/drive` - Liste documents statique
- `/drive/[fileId]` - Détails document statique
- `/drive/[fileId]/annotate` - Annotations statiques
- `/drive/[fileId]/preview` - Preview statique

**Priorité:** 🔴 **HAUTE**

---

### 2. **Dashboard - Statistiques & Activité** 🔴 CRITIQUE
**Fichier:** `app/dashboard/page.tsx`

**Données statiques:**
- ❌ `recentDocuments` (lignes 173-177) - Hardcodé
  - Plans Facade, Rapport Structure, Perspectives 3D
- ❌ `notifications` (lignes 179-183) - Hardcodé
  - Échéances, nouveaux documents, validations
- ❌ Statistiques calculées:
  - Nombre de documents: `recentDocuments.length` (3) - Faux
  - Collaborateurs: `8` - Hardcodé
  - Échéances: `2` - Hardcodé
- ❌ Données projet partiellement statiques:
  - `progress: 65` - TODO: Calculer depuis phases
  - `status: "En cours"` - Devrait venir de DB
  - `currentPhase: "APD"` - TODO: Récupérer depuis phases
  - `team: [{ name: "Équipe", ... }]` - Mock data

**API Routes nécessaires:**
- ❌ `GET /api/documents/recent?limit=5` - Documents récents
- ❌ `GET /api/notifications` - Notifications utilisateur
- ❌ `GET /api/stats/dashboard` - Statistiques agrégées
- ❌ `GET /api/projects/[projectId]/members` - Membres équipe
- ❌ `GET /api/projects/[projectId]/progress` - Calcul progression

**Priorité:** 🔴 **HAUTE**

---

### 3. **Archive & Historique** 🔴 CRITIQUE
**Fichier:** `app/archive/page.tsx`

**Données statiques:**
- ❌ `projects` array (lignes 33-94) - Complètement hardcodé
  - Résidence Les Jardins, Bureaux Tech Center, Villa Moderne, Centre Commercial
- ❌ `activities` array (lignes 96-137) - Hardcodé
  - Téléchargements, consultations, validations, uploads, archivages
- ❌ Métadonnées:
  - `totalDocuments`, `totalVersions` - Hardcodés
  - `lastActivity` - Hardcodé
  - `team` - Hardcodé
  - `location` - Hardcodé

**API Routes nécessaires:**
- ❌ `GET /api/projects?status=archived` - Projets archivés
- ❌ `GET /api/activities?projectId=xxx` - Historique activités
- ❌ `GET /api/projects/[projectId]/stats` - Statistiques projet (docs, versions)
- ❌ `POST /api/projects/[projectId]/archive` - Archiver un projet

**Priorité:** 🔴 **HAUTE**

---

### 4. **Documents - Détails & Annotations** 🔴 CRITIQUE
**Fichiers:** 
- `app/drive/[fileId]/page.tsx`
- `app/drive/[fileId]/annotate/page.tsx`
- `app/drive/[fileId]/preview/page.tsx`

**Données statiques:**
- ❌ `file` object (lignes 32-45) - Mock data complet
- ❌ `annotations` array (lignes 47-69) - Hardcodé
- ❌ `comments` array (lignes 71-86) - Hardcodé
- ❌ `recentViewers` array (lignes 88-93) - Hardcodé
- ❌ `contributors` array - Hardcodé

**Schéma DB existant:** ✅ `annotations`, `annotationComments`
**API Routes nécessaires:**
- ❌ `GET /api/documents/[documentId]` - Détails document
- ❌ `GET /api/documents/[documentId]/annotations` - Liste annotations
- ❌ `POST /api/documents/[documentId]/annotations` - Créer annotation
- ❌ `GET /api/documents/[documentId]/comments` - Liste commentaires
- ❌ `POST /api/documents/[documentId]/comments` - Créer commentaire
- ❌ `GET /api/documents/[documentId]/viewers` - Derniers viewers
- ❌ `GET /api/documents/[documentId]/preview` - URL preview (R2)
- ❌ `GET /api/documents/[documentId]/download` - URL téléchargement (R2)

**Priorité:** 🔴 **HAUTE**

---

### 5. **Notifications** 🔴 CRITIQUE
**Fichier:** `app/notifications/page.tsx`

**Données statiques:**
- ❌ `notifications` array (lignes 24-85) - Complètement hardcodé
- ❌ `preferences` (lignes 87-95) - État local non persisté

**Schéma DB existant:** ✅ Tables complètes dans `lib/db/schema/system.ts`
  - `notifications` - Notifications utilisateur
  - `notificationPrefs` - Préférences notifications
  - `notificationDeliveries` - Historique envois
**API Routes nécessaires:**
- ❌ `GET /api/notifications` - Liste notifications
- ❌ `PATCH /api/notifications/[notificationId]/read` - Marquer comme lu
- ❌ `PATCH /api/notifications/read-all` - Tout marquer comme lu
- ❌ `DELETE /api/notifications/[notificationId]` - Supprimer
- ❌ `GET /api/notifications/preferences` - Préférences utilisateur
- ❌ `PATCH /api/notifications/preferences` - Mettre à jour préférences

**Priorité:** 🔴 **HAUTE**

---

### 6. **Settings/Paramètres** 🟡 MOYENNE
**Fichier:** `app/settings/page.tsx`

**Données statiques:**
- ❌ `profile` (lignes 26-33) - Mock data
  - Jean Dupont, jean.dupont@architech.com, etc.
- ❌ `projects` (lignes 35-57) - Mock data
- ❌ `notifications` preferences (lignes 59-67) - Non persisté

**API Routes nécessaires:**
- ❌ `GET /api/users/me` - Profil utilisateur actuel
- ❌ `PATCH /api/users/me` - Mettre à jour profil
- ❌ `POST /api/users/me/avatar` - Upload avatar
- ❌ `GET /api/users/me/projects` - Projets de l'utilisateur avec rôles
- ❌ `GET /api/users/me/preferences` - Préférences
- ❌ `PATCH /api/users/me/preferences` - Mettre à jour préférences
- ❌ `POST /api/users/me/change-password` - Changer mot de passe

**Priorité:** 🟡 **MOYENNE**

---

### 7. **Archive - Détails Projet** 🟡 MOYENNE
**Fichier:** `app/archive/[projectId]/page.tsx`

**Données statiques:**
- ❌ `projectData` object - Mock data complet
- ❌ `documents` array - Hardcodé

**API Routes nécessaires:**
- ❌ `GET /api/projects/[projectId]` - Détails projet (existe mais peut être enrichi)
- ❌ `GET /api/projects/[projectId]/documents?archived=true` - Documents archivés
- ❌ `GET /api/projects/[projectId]/timeline` - Historique complet

**Priorité:** 🟡 **MOYENNE**

---

### 8. **Journal - Détails Tâche** ✅ DYNAMIQUE
**Fichier:** `app/journal/[taskId]/page.tsx`

**Statut:** ✅ **CONNECTÉ**
- Utilise `useApi()` pour récupérer la tâche
- Utilise `useProjects()` pour la liste des projets
- `fetchTask()` appelé dynamiquement

**Priorité:** ✅ **FAIT** - Aucune action nécessaire

---

### 9. **Timeline - Détails Phase** 🟡 MOYENNE
**Fichier:** `app/timeline/[phaseId]/page.tsx`

**Statut:** À vérifier
**API Routes nécessaires:**
- ✅ `GET /api/projects/[projectId]/phases/[phaseId]` - Probablement existe
- ❌ `GET /api/projects/[projectId]/phases/[phaseId]/documents` - Documents de phase
- ❌ `GET /api/projects/[projectId]/phases/[phaseId]/activities` - Activités phase

**Priorité:** 🟡 **MOYENNE**

---

### 10. **Navbar - Utilisateur** 🟡 MOYENNE
**Fichier:** `components/navbar.tsx`

**Données statiques:**
- ❌ Avatar: `/placeholder-user.jpg` - Hardcodé
- ❌ Nom: "Jean Dupont" - Hardcodé
- ❌ Email: "jean.dupont@architech.com" - Hardcodé
- ❌ Badge notifications: `3` - Hardcodé

**API Routes nécessaires:**
- ❌ `GET /api/users/me` - Profil utilisateur
- ❌ `GET /api/notifications/unread-count` - Nombre non lues

**Priorité:** 🟡 **MOYENNE**

---

## 📋 PLAN D'IMPLÉMENTATION PRIORISÉ

### 🔴 PHASE 1 : CRITIQUE (Semaines 1-2)

#### 1.1 Documents & Drive (Fondation)
**Objectif:** Rendre le Drive complètement fonctionnel

**Tâches:**
1. **API Routes Documents:**
   - [ ] `GET /api/documents?projectId=xxx&folder=xxx` - Liste documents
   - [ ] `POST /api/documents` - Upload document
   - [ ] `GET /api/documents/[documentId]` - Détails document
   - [ ] `DELETE /api/documents/[documentId]` - Supprimer
   - [ ] `GET /api/documents/[documentId]/preview` - URL preview R2
   - [ ] `GET /api/documents/[documentId]/download` - URL download R2

2. **API Routes Folders:**
   - [ ] `GET /api/projects/[projectId]/folders` - Liste dossiers
   - [ ] `POST /api/projects/[projectId]/folders` - Créer dossier

3. **Hook:**
   - [ ] Créer `hooks/use-documents.ts`
   - [ ] Créer `hooks/use-folders.ts`

4. **Frontend:**
   - [ ] Connecter `app/drive/page.tsx` à API
   - [ ] Remplacer mock `projects` par `useProjects()`
   - [ ] Remplacer mock `documents` par `useDocuments()`
   - [ ] Remplacer mock `folders` par `useFolders()`

**Estimation:** 3-5 jours

**Note:** Route `/api/upload` existe mais upload vers phase. Besoin d'une route plus générale pour upload direct vers projet avec catégorie/dossier.

---

#### 1.2 Annotations & Commentaires
**Objectif:** Système d'annotations fonctionnel

**Tâches:**
1. **API Routes:**
   - [ ] `GET /api/documents/[documentId]/annotations` - Liste annotations
   - [ ] `POST /api/documents/[documentId]/annotations` - Créer annotation
   - [ ] `PATCH /api/annotations/[annotationId]` - Mettre à jour
   - [ ] `DELETE /api/annotations/[annotationId]` - Supprimer
   - [ ] `GET /api/annotations/[annotationId]/comments` - Commentaires
   - [ ] `POST /api/annotations/[annotationId]/comments` - Créer commentaire

2. **Frontend:**
   - [ ] Connecter `app/drive/[fileId]/annotate/page.tsx`
   - [ ] Connecter `app/drive/[fileId]/page.tsx` (annotations + comments)

**Estimation:** 2-3 jours

---

#### 1.3 Dashboard - Statistiques Réelles
**Objectif:** Dashboard avec vraies données

**Tâches:**
1. **API Routes:**
   - [ ] `GET /api/stats/dashboard` - Stats agrégées
     - Total documents
     - Total collaborateurs
     - Échéances à venir
     - Projets actifs
   - [ ] `GET /api/documents/recent?limit=5` - Documents récents
   - [ ] `GET /api/projects/[projectId]/progress` - Calcul progression
   - [ ] `GET /api/projects/[projectId]/members` - Membres équipe

2. **Frontend:**
   - [ ] Connecter statistiques dashboard
   - [ ] Connecter documents récents
   - [ ] Calculer progression depuis phases
   - [ ] Afficher vraie phase actuelle
   - [ ] Afficher vraie équipe

**Estimation:** 2-3 jours

---

#### 1.4 Notifications Système
**Objectif:** Notifications fonctionnelles

**Tâches:**
1. **Vérifier Schéma DB:**
   - [ ] Vérifier table `notifications` dans `lib/db/schema/system.ts`
   - [ ] Créer si n'existe pas

2. **API Routes:**
   - [ ] `GET /api/notifications` - Liste notifications
   - [ ] `PATCH /api/notifications/[notificationId]/read` - Marquer lu
   - [ ] `PATCH /api/notifications/read-all` - Tout marquer lu
   - [ ] `DELETE /api/notifications/[notificationId]` - Supprimer
   - [ ] `GET /api/notifications/preferences` - Préférences
   - [ ] `PATCH /api/notifications/preferences` - Mettre à jour

3. **Hook:**
   - [ ] Créer `hooks/use-notifications.ts`

4. **Frontend:**
   - [ ] Connecter `app/notifications/page.tsx`
   - [ ] Connecter navbar (badge count)

5. **Backend Events (Futur):**
   - [ ] Créer notifications automatiques (nouveau doc, échéance, etc.)

**Estimation:** 3-4 jours

---

### 🟡 PHASE 2 : IMPORTANT (Semaines 3-4)

#### 2.1 Archive & Historique
**Tâches:**
1. **API Routes:**
   - [ ] `GET /api/projects?status=archived` - Projets archivés
   - [ ] `POST /api/projects/[projectId]/archive` - Archiver projet
   - [ ] `GET /api/activities` - Historique activités global
   - [ ] `GET /api/projects/[projectId]/activities` - Activités projet
   - [ ] `GET /api/projects/[projectId]/stats` - Stats projet (docs, versions)

2. **Frontend:**
   - [ ] Connecter `app/archive/page.tsx`
   - [ ] Remplacer mock `projects` et `activities`

**Estimation:** 2-3 jours

---

#### 2.2 Authentification & Utilisateurs
**Tâches:**
1. **Système Auth:**
   - [ ] Implémenter NextAuth.js ou Clerk
   - [ ] Session management
   - [ ] Récupérer utilisateur actuel

2. **API Routes:**
   - [ ] `GET /api/users/me` - Profil utilisateur
   - [ ] `PATCH /api/users/me` - Mettre à jour profil
   - [ ] `POST /api/users/me/avatar` - Upload avatar
   - [ ] `POST /api/users/me/change-password` - Changer mot de passe

3. **Frontend:**
   - [ ] Connecter `components/navbar.tsx`
   - [ ] Connecter `app/settings/page.tsx`
   - [ ] Remplacer tous les `'user-test'` par vraie auth

**Estimation:** 4-5 jours

---

#### 2.3 Settings Complets
**Tâches:**
1. **API Routes:**
   - [ ] `GET /api/users/me/projects` - Projets avec rôles
   - [ ] `PATCH /api/users/me/preferences` - Préférences
   - [ ] `POST /api/projects/join` - Rejoindre projet (code invitation)

2. **Frontend:**
   - [ ] Connecter profil utilisateur
   - [ ] Connecter projets utilisateur
   - [ ] Connecter préférences notifications

**Estimation:** 2-3 jours

---

### 🟢 PHASE 3 : AMÉLIORATIONS (Semaines 5-6)

#### 3.1 Partage & Permissions
**Tâches:**
1. **API Routes:**
   - [ ] `POST /api/documents/[documentId]/share` - Partager document
   - [ ] `GET /api/documents/[documentId]/shares` - Liste partages
   - [ ] `DELETE /api/documents/[documentId]/shares/[shareId]` - Révoquer partage
   - [ ] `GET /api/projects/[projectId]/permissions` - Permissions projet

**Estimation:** 3-4 jours

---

#### 3.2 Recherche Globale
**Tâches:**
1. **API Route:**
   - [ ] `GET /api/search?q=xxx&type=xxx` - Recherche globale
     - Rechercher dans projets, documents, tâches, phases

2. **Frontend:**
   - [ ] Barre de recherche globale (header)
   - [ ] Résultats avec highlights

**Estimation:** 2-3 jours

---

#### 3.3 Export & Rapports
**Tâches:**
1. **API Routes:**
   - [ ] `GET /api/projects/[projectId]/export?format=pdf` - Export projet
   - [ ] `GET /api/tasks/export?format=csv` - Export tâches

**Estimation:** 2-3 jours

---

## 🔧 AMÉLIORATIONS TECHNIQUES NÉCESSAIRES

### 1. **Gestion des Erreurs**
- [ ] Error boundaries React
- [ ] Messages d'erreur utilisateur-friendly
- [ ] Retry logic pour requêtes échouées

### 2. **Loading States**
- [ ] Skeletons pour toutes les pages
- [ ] Loading indicators cohérents
- [ ] Optimistic updates où approprié

### 3. **Optimisation Performance**
- [ ] Pagination pour listes longues
- [ ] Infinite scroll ou pagination
- [ ] Cache React Query ou SWR
- [ ] Debounce sur recherche

### 4. **Tests**
- [ ] Tests unitaires API routes
- [ ] Tests d'intégration
- [ ] Tests E2E critiques

---

## 📊 RÉCAPITULATIF PAR PRIORITÉ

### 🔴 CRITIQUE (À faire en premier)
1. Documents & Drive - 3-5 jours
2. Annotations & Commentaires - 2-3 jours
3. Dashboard Statistiques - 2-3 jours
4. Notifications - 3-4 jours
**Total:** 10-15 jours

### 🟡 IMPORTANT (Ensuite)
5. Archive & Historique - 2-3 jours
6. Authentification - 4-5 jours
7. Settings - 2-3 jours
**Total:** 8-11 jours

### 🟢 AMÉLIORATIONS (Plus tard)
8. Partage & Permissions - 3-4 jours
9. Recherche Globale - 2-3 jours
10. Export & Rapports - 2-3 jours
**Total:** 7-10 jours

---

## 🎯 PROCHAINES ÉTAPES IMMÉDIATES

1. **Décider de la priorité** entre Documents vs Dashboard
2. **Commencer par Documents** si Drive est critique
3. **Créer les hooks** manquants (`use-documents.ts`, `use-notifications.ts`)
4. **Implémenter les routes API** documents
5. **Connecter progressivement** les pages frontend

---

## 📝 NOTES TECHNIQUES

### Schémas DB Existants
- ✅ `projects` - Table complète
- ✅ `projectSteps` (phases) - Table complète
- ✅ `tasks` - Table complète
- ✅ `documents` - Table complète
- ✅ `documentVersions` - Table complète
- ✅ `annotations` - Table complète
- ✅ `annotationComments` - Table complète
- ✅ `notifications` - Tables complètes dans `system.ts`
- ✅ `users` - Table complète dans `organizations.ts`
- ✅ `organizationMembers` - Membres organisation
- ✅ `aclEntries` - Permissions (ACL)
- ✅ `publicLinks` - Liens publics de partage
- ✅ `shareInvitations` - Invitations partage
- ✅ `auditLogs` - Logs d'audit

### Points d'Attention
- `organizationId` hardcodé: `"y1dz7q6fj91e3cf0i0p7t67d"` dans plusieurs fichiers
- `'user-test'` utilisé comme mock userId dans plusieurs API routes
- Progression projet calculée statiquement: `progress: 65`
- Phase actuelle hardcodée: `currentPhase: "APD"`

### Patterns à Suivre
- Utiliser les hooks existants (`useProjects`, `useTasks`) comme modèle
- Suivre la structure API existante (`/api/projects/[projectId]/...`)
- Utiliser Drizzle ORM pour queries DB
- Stocker fichiers dans R2 (Cloudflare)

---

---

## 📋 TABLEAU RÉCAPITULATIF PAR PAGE

| Page | État | Données Statiques | Priorité | Est. Temps |
|------|------|-------------------|----------|------------|
| `/dashboard` | 🟡 Partiel | Stats, documents récents, notifications, équipe | 🔴 HAUTE | 2-3j |
| `/drive` | ❌ Statique | Projects, folders, documents (100%) | 🔴 HAUTE | 3-5j |
| `/drive/[fileId]` | ❌ Statique | File, annotations, comments, viewers | 🔴 HAUTE | 2-3j |
| `/drive/[fileId]/annotate` | ❌ Statique | Annotations | 🔴 HAUTE | 1-2j |
| `/drive/[fileId]/preview` | ❌ Statique | Document preview | 🔴 HAUTE | 1j |
| `/journal` | ✅ Dynamique | - | ✅ FAIT | - |
| `/journal/[taskId]` | ✅ Dynamique | - | ✅ FAIT | - |
| `/timeline` | ✅ Dynamique | - | ✅ FAIT | - |
| `/archive` | ❌ Statique | Projects, activities (100%) | 🔴 HAUTE | 2-3j |
| `/archive/[projectId]` | ❌ Statique | Project data, documents | 🟡 MOYENNE | 1-2j |
| `/notifications` | ❌ Statique | Notifications, preferences (100%) | 🔴 HAUTE | 3-4j |
| `/settings` | ❌ Statique | Profile, projects, preferences | 🟡 MOYENNE | 2-3j |
| `components/navbar` | ❌ Statique | User profile, notification count | 🟡 MOYENNE | 1j |

**Légende:**
- ✅ = Dynamique/Fait
- 🟡 = Partiellement dynamique
- ❌ = Complètement statique
- 🔴 = Haute priorité
- 🟡 = Moyenne priorité
- 🟢 = Basse priorité

---

**Date de création:** 2024-01-XX
**Dernière mise à jour:** 2024-01-XX

