FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY docker-entrypoint.sh docker-bootstrap.sh ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/docker-entrypoint.sh ./docker-entrypoint.sh
COPY --from=builder /app/docker-bootstrap.sh ./docker-bootstrap.sh
RUN chmod +x docker-entrypoint.sh docker-bootstrap.sh
EXPOSE 8000
ENTRYPOINT ["/bin/sh", "./docker-entrypoint.sh"]
