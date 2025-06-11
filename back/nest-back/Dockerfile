FROM node:22.11.0-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json nest-cli.json tsconfig*.json ./
COPY apps ./apps

RUN npm ci
RUN npm run build:user-service

FROM node:22.11.0-alpine

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/dist/user-service ./dist
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./

EXPOSE 3001
CMD ["node", "dist/main.js"]
