# Refonte du portfolio

La première section met désormais la spécialité C#/.NET au premier plan. Les projets Khoulafa Store, SchoolSaaS et e-commerce sont prioritaires ; les travaux académiques sont regroupés dans une section dépliable. Les captures existantes restent accessibles en taille complète.

La palette ivoire et vert profond, les espacements, les composants interactifs et les modes clair/sombre sont centralisés dans src/style.css. Le menu mobile possède des attributs accessibles, une fermeture au clavier et un retour du focus. Les fiches projets utilisent un dialogue natif. Les contenus restent dans public/content et les trois langues sont conservées.

Les tests exécutés vérifient le rendu statique FR/EN/AR, les titres et destinations internes, les fichiers CV et images, les certificats, le regroupement des projets et plusieurs contrastes de la palette. La validation JSON, ESLint, les tests, le build Vite et Prettier passent. L'installation pnpm avec lockfile figé passe également.

Limites : aucune inspection visuelle dans un navigateur, aucun test tactile réel ni exécution Docker n'ont été possibles dans cet environnement. Ces contrôles automatiques ne constituent pas une certification WCAG. Les destinations externes sont conservées à partir des données fournies ; leur disponibilité distante n'est pas garantie.
