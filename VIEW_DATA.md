# 📊 Comment voir vos données dans la base de données

## Option 1 : Via psql (RECOMMANDÉ - Simple et rapide)

### Voir toutes les tables :
```bash
docker exec -it architech-saas-postgres-1 psql -U postgres -d architech_db
```

Puis dans psql :
```sql
\dt                    -- Lister toutes les tables
\q                     -- Quitter
```

### Voir les données d'une table spécifique :
```bash
# Voir toutes les organizations
docker exec architech-saas-postgres-1 psql -U postgres -d architech_db -c "SELECT * FROM organizations;"

# Voir tous les projets
docker exec architech-saas-postgres-1 psql -U postgres -d architech_db -c "SELECT id, name, \"clientName\", status FROM projects;"

# Voir tous les documents
docker exec architech-saas-postgres-1 psql -U postgres -d architech_db -c "SELECT id, title, category FROM documents LIMIT 10;"

# Compter les enregistrements
docker exec architech-saas-postgres-1 psql -U postgres -d architech_db -c "SELECT 'organizations' as table_name, COUNT(*) FROM organizations UNION ALL SELECT 'projects', COUNT(*) FROM projects UNION ALL SELECT 'documents', COUNT(*) FROM documents;"
```

## Option 2 : Via pgAdmin (Interface graphique)

1. Allez sur http://localhost:8080
2. Connectez-vous avec :
   - Email: `admin@example.com`
   - Password: `admin123`
3. Si le serveur "Architech Database" n'apparaît pas :
   - Clic droit sur "Servers" > "Register" > "Server"
   - Dans "General" : Name = `Architech Database`
   - Dans "Connection" :
     - **Host:** `postgres` (IMPORTANT: pas localhost!)
     - Port: `5432`
     - Database: `architech_db`
     - Username: `postgres`
     - Password: `postgres`
4. Une fois connecté :
   - Naviguez: Servers > Architech Database > Databases > architech_db > Schemas > public > Tables
   - Clic droit sur une table > "View/Edit Data" > "All Rows"

## Option 3 : Via Drizzle Studio (Si ça fonctionne)

Drizzle Studio utilise maintenant `https://local.drizzle.studio` mais peut avoir des problèmes de connexion avec Docker.

Pour que ça fonctionne, assurez-vous que votre `.env.local` contient :
```env
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/architech_db
```

Puis lancez :
```bash
npm run db:studio
```

## Commandes utiles rapides

```bash
# Lister toutes les tables
docker exec architech-saas-postgres-1 psql -U postgres -d architech_db -c "\dt"

# Voir les 5 premiers projets
docker exec architech-saas-postgres-1 psql -U postgres -d architech_db -c "SELECT * FROM projects LIMIT 5;"

# Voir les 5 premiers documents
docker exec architech-saas-postgres-1 psql -U postgres -d architech_db -c "SELECT * FROM documents LIMIT 5;"

# Entrer dans psql en mode interactif
docker exec -it architech-saas-postgres-1 psql -U postgres -d architech_db
```

## Tables disponibles

Votre base de données contient ces tables principales :
- `organizations` - Organisations
- `users` - Utilisateurs
- `projects` - Projets
- `project_steps` - Phases de projets
- `tasks` - Tâches (si elle existe)
- `documents` - Documents
- `document_versions` - Versions de documents
- `annotations` - Annotations
- `notifications` - Notifications
- etc.

