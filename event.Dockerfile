FROM node:18-slim AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
RUN corepack prepare pnpm@10.11.0 --activate

COPY . /app
WORKDIR /app

FROM base AS build
WORKDIR /app
# COPY config/* ./config/
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile
ARG NODE_ENV
ENV NODE_ENV=${NODE_ENV}
# RUN pnpm run lint
RUN pnpm run build event-server

FROM base
COPY --from=build /app/dist /app/dist
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile