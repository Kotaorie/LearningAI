FROM node:22.11.0-alpine AS builder
WORKDIR /app

# Copier package.json en premier pour le cache
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copier le reste du code
COPY . .
RUN npm run build

# Stage de production
FROM node:22.11.0-alpine
WORKDIR /app
COPY --from=builder /app/.output ./
ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000
CMD ["node", ".output/server/index.mjs"]