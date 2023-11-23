# On utilise une image officielle de node, dans la version qui nous intéresse
FROM node:18.9.0-alpine as node

ENV NODE_ENV=production
WORKDIR /app

# on copie les répertoires et fichiers nécessaires au build de l'app
ADD src src/
ADD public public/
ADD package.json package-lock.json tsconfig.json ./

# on exécute la commande build, qui compile notre application
RUN NODE_ENV=development npm install -f && \
    npm run build

# les fichiers de notre app compilée sont maintenant dans /app/build

# maintenant on utilise une image d'un serveur web
FROM nginx:1.23.3-alpine as prod

WORKDIR /var/www/html

# on utilise un fichier de configuration que nous fournissons
COPY ./ci/default.conf /etc/nginx/conf.d/default.conf

# nous plaçons les fichiers de notre application à la racine servie par le serveur web
COPY --from=node /app/build /var/www/html