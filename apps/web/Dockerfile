# Production image for the web app (static files served by nginx). Build from the repository root:
#   docker build -f apps/web/Dockerfile --build-arg VITE_API_URL=https://api.example.com/api/v1 -t erp-web .

FROM node:24-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS pruner
COPY . .
RUN pnpm dlx turbo prune @erp/web --docker

FROM base AS builder
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm turbo run build --filter=@erp/web

FROM nginx:1.27-alpine AS runner
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
