FROM node:20-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

COPY . .
RUN npm run build

FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache postgresql-client

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules

COPY database ./database

COPY package.json ./
COPY drizzle.config.ts ./
COPY docker-entrypoint.sh ./

RUN chmod +x ./docker-entrypoint.sh

EXPOSE 8080

ENTRYPOINT ["./docker-entrypoint.sh"]
