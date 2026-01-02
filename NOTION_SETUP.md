# Configuration Notion pour le formulaire d'inscription

## Étapes de configuration

### 1. Créer une base de données Notion

1. Allez dans votre workspace Notion
2. Créez une nouvelle page ou ouvrez une page existante
3. Tapez `/database` et sélectionnez "Database - Full page"
4. Configurez les colonnes suivantes :

| Nom de la colonne | Type        | Options/Format                                    |
|-------------------|-------------|---------------------------------------------------|
| Email             | Title       | (par défaut)                                      |
| Date d'inscription| Date        | Format: Date                                      |
| Status            | Select      | Options: "Nouveau", "Contacté", "Inscrit", etc.  |
| Variante A/B      | Select      | Options: "A", "B"                                 |
| Kit demandé       | Checkbox    | (par défaut)                                      |

### 2. Partager la base de données avec votre intégration

1. Cliquez sur "Share" en haut à droite de votre base de données
2. Ajoutez votre intégration Notion (celle liée à votre API key)
3. Donnez les permissions "Can edit" ou "Can insert"

### 3. Obtenir l'ID de la base de données

1. Ouvrez votre base de données dans Notion
2. L'URL ressemblera à : `https://www.notion.so/workspace/DATABASE_ID?v=...`
3. L'ID est la longue chaîne de caractères entre le dernier `/` et le `?`
   - Exemple : Si l'URL est `https://www.notion.so/abc123def456?v=...`
   - L'ID est : `abc123def456`
   - (En réalité, l'ID est plus long, format: 32 caractères avec des tirets)

### 4. Configurer les variables d'environnement

#### Localement (.env.local)
```env
NOTION_API_KEY=secret_xxxxxxxxxxxxx
NOTION_DATABASE_ID=your-database-id-here
```

#### Sur Vercel
1. Allez dans votre projet Vercel
2. Settings → Environment Variables
3. Ajoutez :
   - `NOTION_API_KEY` = votre clé API
   - `NOTION_DATABASE_ID` = l'ID de votre base de données

## Structure attendue

Le code envoie les données suivantes à Notion :
- **Email** : L'adresse email du visiteur
- **Date d'inscription** : Date et heure actuelles
- **Status** : Toujours "Nouveau" pour les nouveaux inscrits
- **Variante A/B** : "A" ou "B" selon la variante de test A/B
- **Kit demandé** : true/false selon si le visiteur a coché la case

## Vérification

Pour tester si tout fonctionne :
1. Remplissez le formulaire sur votre page d'accueil
2. Vérifiez dans votre base Notion qu'une nouvelle ligne a été créée
3. Vérifiez les logs Vercel en cas d'erreur


