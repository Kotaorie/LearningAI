# Stage de build
FROM node:22.11.0-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .
RUN npm run build

FROM node:22.11.0-alpine AS runner
WORKDIR /app

COPY --from=builder /app/.output ./
COPY --from=builder /app/package*.json ./

ENV HOST=0.0.0.0
ENV PORT=3000
EXPOSE 3000

CMD ["node", ".output/server/index.mjs"]