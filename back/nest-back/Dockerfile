# Stage de build
FROM node:22.11.0-alpine AS builder
WORKDIR /usr/src/app

# Copier les fichiers de configuration et dépendances en premier
COPY package*.json nest-cli.json tsconfig*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY apps ./apps

# Build de l'application
RUN npm run build:user-service

# Stage de production
FROM node:22.11.0-alpine AS runner
WORKDIR /usr/src/app

# Installer dumb-init pour gérer les signaux
RUN apk add --no-cache dumb-init

# Copier les fichiers de production
COPY --from=builder --chown=nestjs:nestjs /usr/src/app/dist ./dist
COPY --from=builder --chown=nestjs:nestjs /usr/src/app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nestjs /usr/src/app/package*.json ./

USER nestjs

EXPOSE 3001

CMD ["dumb-init", "node", "dist/main.js"]