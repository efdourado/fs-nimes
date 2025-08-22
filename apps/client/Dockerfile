FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

FROM base AS builder
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY apps/client/package.json ./apps/client/
COPY package.json ./
RUN pnpm install -r --filter client
COPY apps/client ./apps/client
RUN pnpm --filter client build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/apps/client/.next/standalone .
COPY --from=builder /app/apps/client/public ./public
COPY --from=builder /app/apps/client/.next/static ./.next/static

EXPOSE 3000
ENV PORT=3000
CMD ["node", "server.js"]