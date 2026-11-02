# Production image for the API. Build from the repository root:
#   docker build -f apps/api/Dockerfile -t erp-api .
# Uses `turbo prune` so the image only contains this app and the packages it depends on.

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS pruner
COPY . .
RUN pnpm dlx turbo prune @erp/api --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=@erp/api

FROM base AS runner
ENV NODE_ENV=production
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile --prod --filter @erp/api
COPY --from=builder /app/apps/api/dist ./apps/api/dist
USER node
WORKDIR /app/apps/api
EXPOSE 4000
CMD ["node", "dist/main.js"]
