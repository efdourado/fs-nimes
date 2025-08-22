FROM node:20-alpine AS base
WORKDIR /app
RUN npm install -g pnpm

FROM base AS builder
COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
COPY apps/client/package.json ./apps/client/
COPY package.json ./
RUN pnpm install -r --filter server
COPY apps/server ./apps/server
RUN pnpm --filter server exec prisma generate
RUN pnpm --filter server build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN npm install -g pnpm

COPY pnpm-workspace.yaml ./
COPY apps/server/package.json ./apps/server/
RUN pnpm install -r --prod --filter server

COPY --from=builder /app/apps/server/dist ./apps/server/dist
COPY --from=builder /app/apps/server/prisma ./apps/server/prisma

RUN pnpm --filter server exec prisma generate

EXPOSE 3000
CMD ["node", "apps/server/dist/main.js"]