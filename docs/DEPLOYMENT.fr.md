# Déployer le portfolio sur un VPS

Le portfolio est statique : React est compilé avec Node, puis les fichiers sont servis par Nginx sur le port interne 8080. Aucun backend, PostgreSQL ou Redis n'est nécessaire. L'image finale fonctionne avec l'utilisateur non-root `nginx`. Docker et Docker Compose doivent déjà être installés sur le VPS.

## 1. Construire et publier l'image depuis votre ordinateur

Dans le dossier qui contient le Dockerfile, remplacer `YOUR_DOCKERHUB_USER` par votre compte Docker Hub :

```sh
docker build --pull -t YOUR_DOCKERHUB_USER/guerbouz-portfolio:1.0.0 .
docker run --rm -p 8088:8080 YOUR_DOCKERHUB_USER/guerbouz-portfolio:1.0.0
```

Ouvrir http://localhost:8088 puis arrêter le conteneur avec Ctrl+C. Vérifier FR/EN/AR, les certificats et leurs téléchargements.

```sh
docker login
docker push YOUR_DOCKERHUB_USER/guerbouz-portfolio:1.0.0
```

Si la machine de build et le VPS n'ont pas la même architecture, construire pour celle du VPS, par exemple :

```sh
docker buildx build --platform linux/amd64 -t YOUR_DOCKERHUB_USER/guerbouz-portfolio:1.0.0 --push .
```

## 2. Déployer sur le VPS avec un reverse proxy installé sur l'hôte

Copier seulement `compose.yml` et `.env.example` dans `/srv/apps/guerbouz-portfolio/` sur le VPS. Le code source n'est pas nécessaire sur le serveur.

```sh
cd /srv/apps/guerbouz-portfolio
cp .env.example .env
nano .env
```

Définir `PORTFOLIO_IMAGE` avec l'image exacte publiée, puis :

```sh
docker compose pull
docker compose up -d
docker compose ps
curl -f http://127.0.0.1:8088/health
```

Le port est limité à 127.0.0.1 par défaut. Configurer le reverse proxy de l'hôte pour transférer vers `http://127.0.0.1:8088`, et terminer HTTPS au niveau de ce proxy. Le domaine est à choisir : aucun domaine existant n'est remplacé automatiquement.

Pour un test public direct, définir temporairement `BIND_ADDRESS=0.0.0.0` et autoriser le port 8088 au niveau réseau. En exploitation, utiliser HTTPS via le reverse proxy.

## 3. Alternative : Nginx Proxy Manager ou Caddy dans Docker

Utiliser `compose.proxy.yml` à la place de `compose.yml` ; ne pas fusionner ces deux fichiers. Copier ce fichier et `.env.example` sur le VPS, puis configurer `PROXY_NETWORK` avec le réseau Docker déjà utilisé par le reverse proxy.

```sh
docker network ls
docker compose -f compose.proxy.yml pull
docker compose -f compose.proxy.yml up -d
docker compose -f compose.proxy.yml ps
```

Dans Nginx Proxy Manager : schéma `http`, hôte `guerbouz-portfolio`, port `8080`. Le proxy et le portfolio doivent partager le réseau défini par `PROXY_NETWORK`. Activer ensuite le certificat HTTPS pour le domaine choisi. `127.0.0.1` dans le conteneur du proxy ne désigne pas le conteneur du portfolio.

## 4. Mise à jour et retour arrière

Modifier les JSON/images dans les sources, reconstruire avec un nouveau tag, par exemple `1.0.1`, puis pousser l'image. Modifier `PORTFOLIO_IMAGE` dans `.env` sur le VPS et relancer `pull` puis `up -d` avec le même fichier Compose. Pour revenir en arrière, rétablir l'ancien tag.

Les fichiers JSON et certificats sont inclus dans l'image. Ne pas éditer les fichiers à l'intérieur d'un conteneur : ils seraient perdus au prochain remplacement. Les assets Vite avec hash sont mis en cache ; le HTML et les JSON demandent une revalidation pour éviter de conserver un contenu ancien.

## 5. Diagnostic

```sh
docker compose logs --tail=100 portfolio
docker compose exec portfolio nginx -t
docker compose exec portfolio wget -qO- http://127.0.0.1:8080/health
```

Adapter les commandes avec `-f compose.proxy.yml` si vous utilisez cette variante. Un déploiement privé ChatGPT reste distinct de l'image que vous hébergez sur votre VPS.

## Vérification et limites

Build Vite et validation des contenus exécutés. Docker n'est pas installé dans l'environnement de livraison : la construction et le démarrage de l'image doivent être exécutés avec les commandes ci-dessus. Les images de base utilisent les canaux Node 22 et Nginx stable ; vous pouvez fixer leurs digests après validation dans votre propre registre.

Références : https://docs.docker.com/build/building/multi-stage/ ; https://docs.docker.com/reference/compose-file/
