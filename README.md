# Portfolio — Mohammed Alaa Eddine Guerbouz

Portfolio React, français par défaut, anglais et arabe avec RTL. Refonte du template Cleanfolio fourni ; licence MIT d'origine conservée. Migration de Create React App / Material UI vers React et Vite, sans dépendance UI.

## Déploiement gratuit avec GitHub Pages

Le portfolio peut être publié gratuitement, **sans Docker**, avec le workflow GitHub Actions inclus dans `.github/workflows/deploy.yml`. Créer un dépôt public `DingueT7n.github.io`, pousser le contenu du dossier `portfolio/` à la racine du dépôt et activer **Settings → Pages → GitHub Actions**. Le site sera disponible sur `https://DingueT7n.github.io/` une fois le déploiement réussi.

**Guide détaillé avec les commandes PowerShell : [docs/GITHUB_PAGES.md](docs/GITHUB_PAGES.md).**

## Démarrer

Node.js 22 recommandé.

```sh
pnpm install --frozen-lockfile
pnpm run dev
```

```sh
pnpm run check:content
pnpm run build
pnpm run preview
```

Déployer le contenu de `dist/` sur un hébergement statique. Pour un sous-dossier, ajouter `base: '/mon-portfolio/'` dans `vite.config.js`, puis reconstruire. Aucun backend ni clé secrète nécessaire. Le contact utilise mailto et téléphone, pas un faux formulaire d'envoi.

## Mettre à jour sans modifier React

Les contenus vivent dans `public/content/` :

| Fichier | Contenu |
| --- | --- |
| profile.json | Identité, titre, présentation, coordonnées, CV et réseaux |
| projects.json | Projets, catégorie, stack, besoin, contributions, liens, image |
| experience.json | Expériences, dates, missions |
| skills.json | Groupes de compétences |
| education.json | Diplômes et études |
| additional.json | Langues et formations complémentaires |
| locales/fr.json | Libellés d'interface français |
| locales/en.json | Libellés d'interface anglais |
| locales/ar.json | Libellés d'interface arabe |

Chaque texte traduit utilise `{ "fr": "...", "en": "...", "ar": "..." }`. Les noms techniques et propres peuvent rester de simples chaînes. Garder les trois traductions synchronisées. L'ordre des tableaux détermine l'ordre d'affichage.

Pour ajouter un projet : copier un objet dans `projects.json`, donner un `id` unique, renseigner ses traductions, sa catégorie (`web` ou `desktop`), ses contributions et sa stack. Mettre `featured: true` pour une carte large. `links` accepte `source` et `demo` (URL HTTPS), absents si indisponibles. `image` est null ou un chemin relatif à `public/`, par exemple `images/mon-projet.webp`. Les illustrations actuelles sont des compositions typographiques, pas des captures produit.

Pour ajouter une expérience : copier un objet, utiliser des dates `YYYY-MM`, et `endDate: null` pour le poste actuel. `points` contient un tableau de missions pour chaque langue. La validation détecte les IDs dupliqués, traductions manquantes, liens invalides, CV/images absents et différences de clés d'interface.

Après modification : `pnpm run build`, puis redéployer `dist/`. Les fichiers JSON du dossier déployé peuvent aussi être remplacés directement, mais maintenir les sources à jour pour le prochain build. Toutes les données de `public/` sont accessibles aux visiteurs : ne jamais y ajouter de secret.

## Fonctions

- Sélecteur FR / EN / AR, langue mémorisée et lien `?lang=en` ou `?lang=ar`.
- Arabe RTL, dates avec chiffres latins.
- Thème clair/sombre mémorisé, navigation mobile, focus visible, réduction des animations.
- Filtres de projets, fiche détaillée avec boîte de dialogue native et fermeture Échap.
- CV locaux, liens GitHub/LinkedIn, email, téléphone et copie de l'adresse.
- Chargement JSON avec état d'erreur et action réessayer.
- Polices Google optionnelles, avec polices système de repli.

## Sources et points à compléter

Voir `docs/RECRUITER_REVIEW.fr.md` : arbitrages entre les deux CV, limites des preuves, recommandations avant diffusion.

## Vérification réalisée

Installation des dépendances, validation des contenus et build de production réussis. Pas de test visuel navigateur disponible dans l'environnement de livraison. Vérifier à 390 px et 1440 px : trois langues, RTL, thèmes, filtres, ouverture/fermeture clavier des fiches et téléchargements. Les profils externes et les réalisations n'ont pas été vérifiés indépendamment.

## Projets, logos et photos (mise à jour)

`public/content/project-settings.json` est la source des catégories et du logo par défaut. Chaque projet peut remplacer ce logo avec `logo.src`. Une valeur `null` utilise le logo commun ; une erreur de chargement du logo personnalisé déclenche aussi le repli.

Exemple à placer dans un objet de `projects.json` :

```json
{
  "logo": {
    "src": "images/projects/mon-projet/logo.svg",
    "alt": {"fr": "Logo du projet", "en": "Project logo", "ar": "شعار المشروع"}
  },
  "gallery": [
    {
      "src": "images/projects/mon-projet/dashboard.webp",
      "alt": {"fr": "Tableau de bord", "en": "Dashboard", "ar": "لوحة المتابعة"},
      "caption": {"fr": "Vue des indicateurs", "en": "Analytics view", "ar": "عرض المؤشرات"}
    }
  ],
  "details": [
    {
      "title": {"fr": "Architecture", "en": "Architecture", "ar": "البنية"},
      "body": {"fr": "Vos choix techniques vérifiés.", "en": "Your verified technical decisions.", "ar": "خياراتك التقنية الموثقة."}
    }
  ],
  "links": {"source": "https://github.com/votre-compte/votre-projet"}
}
```

Cet extrait complète un projet existant ; ce n'est pas un objet projet complet. Copier les images dans `public/images/projects/mon-projet/`. Utiliser de préférence WebP/PNG/JPG pour les captures et SVG/PNG pour les logos. Les URL HTTPS sont aussi acceptées pour les logos et les galeries. Les photos apparaissent sous les détails à l'ouverture de la fiche ; un clic ouvre l'image en grand. Aucun lien GitHub n'est affiché tant que `links.source` est absent ou vide.

Les galeries sont initialement vides : aucune capture réelle n'a été jointe. L'interface l'indique sans présenter de fausse capture. Les légendes et descriptions d'image sont traduites. `displayName` contrôle le nom court illustré sur la carte ; `name` contrôle le titre complet.

Une expérience sans dates connues utilise `startDate: null`, `endDate: null` et `period` traduit. C'est le cas de la mission Move Masters Calgary. Aucun calendrier n'a été inventé.

Les huit projets actuels incluent trois réalisations initiales et cinq nouvelles entrées. Les TP ML/DL et INGETIS sont regroupés en portfolios académiques, et ne sont pas présentés comme des produits en production. Pour distinguer EcoTrack des TP GenAI, créer ultérieurement deux objets quand les livrables sont disponibles.

## Portrait, carte d'introduction et dépôts multiples

- `profile.json > photo` : chemin du portrait et texte alternatif FR/EN/AR. La photo remplace les initiales dans l'en-tête ; l'original est conservé, l'affichage circulaire est réalisé en CSS.
- `profile.json > heroCard` : libellé et liste des domaines affichés dans la première carte (Full Stack, Data Science, IA agentique).
- `profile.json > stackRibbon` : technologies de la bande sous l'introduction.
- `skills.json` : compétences techniques, dont Python/Django, TypeScript et WordPress. `additional.json > languages` reste réservé aux langues parlées.
- `projects.json > repositories` : liste optionnelle de `{ "label": { "fr": "API", "en": "API", "ar": "API" }, "url": "https://github.com/..." }`. Permet plusieurs dépôts dans une même fiche (API + frontend, ou plusieurs TP). `links.source` reste disponible pour un dépôt unique.

Les liens transmis ont été intégrés, mais leur contenu n'a pas pu être consulté automatiquement. La stack et les fonctions détaillées du projet EmployeesManagment ne sont donc pas supposées. Sa date de création (juillet 2024) provient de l'auteur. Les projets universitaires sont désormais liés aux dépôts disponibles.

## Formation et attestations

Cette version repart de votre archive modifiée, en conservant les captures StoreApp, le logo SchoolSaaS et vos changements de projets.

`education.json` affiche maintenant `project`, `summary`, `detail`, `technologies` et `github`. Le texte détaillé est dépliable pour garder une lecture agréable sur mobile. INGETIS est présenté comme formation en cours ; le master LTE et le projet hospitalier WinForms/Kotlin reprennent les informations fournies.

`additional.json > courses` contient désormais des objets structurés, et non une simple liste de chaînes. Exemple :

```json
{
  "id": "nouvelle-formation",
  "title": "Nom exact de la formation",
  "issuer": "Organisme",
  "date": "2026-01-03",
  "kind": "course",
  "image": "certificates/nouvelle-formation.jpg",
  "pdf": "certificates/nouvelle-formation.pdf",
  "url": null,
  "description": {
    "fr": "Attestation de formation.",
    "en": "Course certificate.",
    "ar": "شهادة إتمام دورة."
  }
}
```

`image` et `pdf` sont des chemins relatifs à `public/`. `url` est un lien HTTPS facultatif vers la page de vérification de l'organisme (laisser null sans lien confirmé). `kind` vaut `course` pour une formation ou `research` pour une contribution scientifique. Les six PDF originaux et leurs images JPEG sont dans `public/certificates/`.

Le document AAIET est classé comme contribution scientifique : le certificat est au nom du présentateur Guerbouz Tahar et mentionne Mohammed Alaa Eddine Guerbouz comme coauteur. Les dates des attestations proviennent des documents, pas des dates de modification des fichiers.

## Docker et VPS

Consulter `docs/DEPLOYMENT.fr.md`. Inclus : `Dockerfile`, `.dockerignore`, `deploy/nginx.conf`, `compose.yml`, `compose.proxy.yml` et `.env.example`. Construction multi-stage, Nginx non-root, endpoint `/health`, et deux modes de connexion à votre reverse proxy.

## Compatibilité avec `images`

Les projets acceptent aussi `images: ["/images/projects/StoreApp/HomeScreen.jpg", "..."]`. Les chemins locaux fonctionnent avec ou sans `/` initial. La galerie combine `gallery` (objets avec légendes) et `images` (chemins simples), sans doublons ; les métadonnées de `gallery` sont prioritaires. Les sept captures StoreApp sont conservées et affichées à l'ouverture du projet.


## Refonte UI/UX

- `src/App.jsx` : sections principales et états de langue/thème.
- `src/Header.jsx` : navigation mobile à bouton, Échap et attributs ARIA.
- `src/Projects.jsx` : trois études de cas prioritaires, réalisations complémentaires, travaux académiques et dialogue de détail.
- `src/ui.jsx` : liens externes, titres de section, technologies et résolution des assets.
- `src/style.css` : tokens, thèmes et mises en page à 1080 / 800 / 480 px.
- `project-settings.json` : `featuredIds` et `academicIds` contrôlent le regroupement sans modifier React.

Le gestionnaire est désormais pnpm, fixé via `packageManager`, avec `pnpm-lock.yaml`. Le Dockerfile utilise aussi pnpm. Aucun ajout de dépendance runtime ; ESLint, Prettier et esbuild sont des outils de développement. Utiliser Node 22.13 ou plus récent.

Commandes : `pnpm run check:content`, `pnpm run lint`, `pnpm test`, `pnpm run build`, `pnpm run format:check`.
