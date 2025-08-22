FROM node:20-alpine

WORKDIR /app

RUN npm install -g pnpm

COPY pnpm-lock.yaml pnpm-workspace.yaml ./
COPY package.json ./
COPY apps/client/package.json ./apps/client/
COPY apps/server/package.json ./apps/server/

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm --filter server exec prisma generate

RUN pnpm --filter server build

WORKDIR /app/apps/server
EXPOSE 3000
CMD ["pnpm", "start:prod"]