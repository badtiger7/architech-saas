# 🗄️ GUIDE : LANCER LA BASE DE DONNÉES EN LOCAL

## 📋 Prérequis

- Docker et Docker Compose installés
- Node.js (v18+)
- npm ou pnpm

---

## 🚀 ÉTAPE 1 : Lancer PostgreSQL avec Docker

Le projet utilise Docker Compose pour gérer PostgreSQL et pgAdmin.

### 1.1 Démarrer les services

```bash
docker-compose up -d
```

Cette commande va :
- ✅ Créer un container PostgreSQL (port 5432)
- ✅ Créer un container pgAdmin (port 8080)
- ✅ Initialiser la base de données `architech_db`
- ✅ Exécuter `init.sql` automatiquement

### 1.2 Vérifier que les containers sont actifs

```bash
docker-compose ps
```

Vous devriez voir :
```
NAME                   STATUS              PORTS
architech-saas-postgres-1   Up      0.0.0.0:5432->5432/tcp
architech-saas-pgadmin-1    Up      0.0.0.0:8080->80/tcp
```

### 1.3 Accéder à pgAdmin (optionnel)

- **URL:** http://localhost:8080
- **Email:** admin@example.com
- **Password:** admin123

Une fois connecté, ajoutez un serveur :
- **Host:** postgres (nom du service Docker)
- **Port:** 5432
- **Database:** architech_db
- **Username:** postgres
- **Password:** postgres

---

## 🔧 ÉTAPE 2 : Configurer les variables d'environnement

### 2.1 Créer le fichier `.env.local`

À la racine du projet, créez `.env.local` :

```bash
touch .env.local
```

### 2.2 Ajouter la DATABASE_URL

Ouvrez `.env.local` et ajoutez :

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/architech_db

# Cloudflare R2 (pour les fichiers)
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key
R2_SECRET_ACCESS_KEY=your_secret_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=https://your_public_url.com

# Notion API (pour le formulaire landing)
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id

# Next.js
NEXT_PUBLIC_APP_URL=http://localhost:3001
```

**Important:** Pour l'instant, vous avez seulement besoin de `DATABASE_URL` pour travailler sur le Drive.

---

## 📦 ÉTAPE 3 : Installer les dépendances (si pas déjà fait)

```bash
npm install
# ou
pnpm install
```

---

## 🔄 ÉTAPE 4 : Appliquer les migrations de base de données

Le projet utilise Drizzle ORM. Les migrations sont déjà créées dans `lib/db/migrations/`.

### 4.1 Appliquer les migrations

```bash
npm run db:migrate
```

Si cette commande n'existe pas ou échoue, vérifiez le fichier `lib/db/migrate.ts` ou créez-le.

### 4.2 Alternative : Appliquer manuellement via SQL

Vous pouvez aussi exécuter directement le fichier SQL :

```bash
# Via docker exec
docker exec -i architech-saas-postgres-1 psql -U postgres -d architech_db < lib/db/migrations/0000_chunky_thundra.sql
```

Ou via psql local :

```bash
psql -h localhost -U postgres -d architech_db -f lib/db/migrations/0000_chunky_thundra.sql
```

**Mot de passe:** `postgres`

---

## ✅ ÉTAPE 5 : Vérifier que tout fonctionne

### 5.1 Vérifier la connexion

Testez la connexion avec Drizzle Studio (interface graphique) :

```bash
npm run db:studio
```

Cela ouvrira une interface web sur `http://localhost:4983` où vous pourrez voir toutes les tables.

### 5.2 Vérifier les tables créées

Connectez-vous à PostgreSQL :

```bash
docker exec -it architech-saas-postgres-1 psql -U postgres -d architech_db
```

Puis listez les tables :

```sql
\dt
```

Vous devriez voir :
- `organizations`
- `users`
- `organization_members`
- `projects`
- `project_steps`
- `project_members`
- `tasks`
- `documents`
- `document_versions`
- `document_steps`
- `annotations`
- `annotation_comments`
- `notifications`
- `notification_prefs`
- `acl_entries`
- etc.

---

## 🛠️ COMMANDES UTILES

### Arrêter les containers

```bash
docker-compose down
```

### Arrêter et supprimer les données

```bash
docker-compose down -v
```

⚠️ **Attention:** Cela supprime toutes les données de la base !

### Voir les logs PostgreSQL

```bash
docker-compose logs postgres
```

### Redémarrer les containers

```bash
docker-compose restart
```

### Réinitialiser la base de données

```bash
npm run db:reset
```

---

## 🐛 DÉPANNAGE

### Erreur: "Port 5432 is already in use"

Si vous avez déjà PostgreSQL qui tourne localement :

1. **Option 1:** Arrêter votre instance locale
2. **Option 2:** Changer le port dans `docker-compose.yml` :
   ```yaml
   ports:
     - "5433:5432"  # Utiliser 5433 au lieu de 5432
   ```
   Puis mettre à jour `DATABASE_URL` :
   ```env
   DATABASE_URL=postgresql://postgres:postgres@localhost:5433/architech_db
   ```

### Erreur: "database architech_db does not exist"

Le container n'a pas été initialisé correctement :

```bash
docker-compose down -v
docker-compose up -d
```

Attendez quelques secondes et réessayez.

### Erreur de connexion depuis l'application

Vérifiez que :
1. ✅ `.env.local` existe et contient `DATABASE_URL`
2. ✅ Le container PostgreSQL est actif (`docker-compose ps`)
3. ✅ La variable d'environnement est bien chargée (redémarrez `npm run dev`)

### Réinitialiser complètement la base

```bash
# Arrêter et supprimer
docker-compose down -v

# Relancer
docker-compose up -d

# Réappliquer les migrations
npm run db:migrate
```

---

## 📚 PROCHAINES ÉTAPES

Une fois la base de données lancée :

1. ✅ Vérifier que tout fonctionne avec `npm run db:studio`
2. ✅ Démarrer l'app de développement : `npm run dev`
3. 🚀 Commencer à implémenter le Drive avec les vraies données !

---

## 📝 NOTES

- **Port PostgreSQL:** 5432 (standard)
- **Port pgAdmin:** 8080
- **Database:** architech_db
- **User:** postgres
- **Password:** postgres (⚠️ changer en production !)

- Les migrations sont dans `lib/db/migrations/`
- Les schémas sont dans `lib/db/schema/`

