# Dockerfile.front

# Étape 1 : build Nuxt
FROM node:22.11.0-alpine AS builder

WORKDIR /app

COPY nuxt-app/package*.json ./nuxt-app/
RUN cd nuxt-app && npm install

COPY nuxt-app ./nuxt-app
RUN cd nuxt-app && npm run build

# Étape 2 : runner léger
FROM node:22.11.0-alpine

WORKDIR /app
COPY --from=builder /app/nuxt-app/.output ./

EXPOSE 3000
CMD ["node", "server/index.mjs"]
