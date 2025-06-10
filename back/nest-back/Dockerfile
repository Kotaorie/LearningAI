FROM node:18-alpine AS builder

WORKDIR /usr/src/app

# Copier package.json et package-lock.json de la racine nest-back
COPY package*.json ./

RUN npm install

# Copier seulement le dossier user-service dans apps/
COPY ./apps/user-service ./apps/user-service

# Build si tu as un script build spécifique à user-service (à adapter)
WORKDIR /usr/src/app
RUN npm run start:userservice

FROM node:18-alpine
WORKDIR /usr/src/app/apps/user-service

COPY --from=builder /usr/src/app/apps/user-service/dist ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/apps/user-service/package*.json ./

CMD ["node", "dist/main.js"]
