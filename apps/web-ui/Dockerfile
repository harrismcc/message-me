ARG APP_DIRNAME=web-ui
ARG APP_PKG_NAME=web-ui

FROM node:20-bookworm-slim AS pruner
ARG APP_PKG_NAME
RUN apt-get update && apt-get install -y openssl
WORKDIR /app
RUN yarn global add turbo
COPY . .
RUN turbo prune --scope=$APP_PKG_NAME --docker
RUN find . -name "node_modules" -type d -prune -exec rm -rf '{}' +

FROM node:20-bookworm-slim AS base
RUN apt-get update && apt-get install -y openssl
RUN corepack enable
WORKDIR /app
COPY .gitignore .gitignore
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=pruner /app/out/pnpm-workspace.yaml ./pnpm-workspace.yaml

FROM base AS dev-deps
WORKDIR /app
RUN pnpm install

FROM base AS production-deps
WORKDIR /app
ENV NODE_ENV production
RUN pnpm install --prod

FROM base AS builder
ARG APP_PKG_NAME
WORKDIR /app
RUN corepack enable
ENV NODE_ENV production
COPY --from=pruner /app/out/full/ .
COPY --from=dev-deps /app/ .
COPY turbo.json turbo.json
RUN pnpm turbo run build --filter=$APP_PKG_NAME...


# Runner
FROM base AS runner
ARG APP_DIRNAME

ENV NODE_ENV production


COPY --from=pruner /app/out/full/ .
COPY --from=production-deps /app .
COPY --from=builder /app/apps/$APP_DIRNAME/build ./apps/$APP_DIRNAME/build
COPY --from=builder /app/apps/$APP_DIRNAME/public ./apps/$APP_DIRNAME/public

CMD ["pnpm", "--filter", "web-ui", "start"]
