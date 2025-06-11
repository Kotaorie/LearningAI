FROM node:22.11.0-alpine AS builder
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build

FROM node:22.11.0-alpine
WORKDIR /app
COPY --from=builder /app ./
ENV HOST 0.0.0.0
EXPOSE 3000
CMD [ "npm", "run", "preview" ]
