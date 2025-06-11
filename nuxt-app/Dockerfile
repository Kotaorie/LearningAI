FROM node:22.11.0-alpine AS builder

WORKDIR /app

COPY nuxt-app/package*.json ./nuxt-app/
COPY nuxt-app ./nuxt-app

WORKDIR /app/nuxt-app
RUN npm ci
RUN npm run build

FROM node:22.11.0-alpine

WORKDIR /app

COPY --from=builder /app/nuxt-app/.output ./.output
COPY --from=builder /app/nuxt-app/node_modules ./node_modules
COPY --from=builder /app/nuxt-app/package*.json ./

ENV HOST 0.0.0.0
EXPOSE 3000
CMD ["npm", "run", "preview"]
