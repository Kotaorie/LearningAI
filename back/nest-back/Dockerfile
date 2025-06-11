FROM node:22.11.0-alpine AS builder
WORKDIR /usr/src/app

# Copier les fichiers de config en premier
COPY package*.json nest-cli.json tsconfig*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copier le code source
COPY apps ./apps
RUN npm run build:user-service

# Stage de production
FROM node:22.11.0-alpine
WORKDIR /usr/src/app
COPY --from=builder /usr/src/app/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
EXPOSE 3001
CMD ["node", "dist/main.js"]