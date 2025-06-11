FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copier les fichiers racine nécessaires
COPY package*.json ./
COPY nest-cli.json tsconfig*.json ./

# Installer les dépendances
RUN npm install

# Copier tous les fichiers du projet Nest (mono-repo)
COPY apps ./apps

# Compiler uniquement le user-service
RUN npm run build user-service

# Étape finale - image légère
FROM node:18-alpine

WORKDIR /usr/src/app

# Copier le build et les dépendances
COPY --from=builder /usr/src/app/dist/apps/user-service ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/user-service/package*.json ./

# Lancer le service compilé
CMD ["node", "dist/main.js"]
