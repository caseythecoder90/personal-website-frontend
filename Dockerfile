# syntax=docker/dockerfile:1.7
#
# Multi-stage build for the Vite/React frontend.
# Stage 1 builds the static bundle; Stage 2 serves it from a minimal Nginx.
# Final image contains no Node, no source, no node_modules — only the built
# assets and the SPA-aware nginx config.

# ------------------------------------------------------------------ Stage 1
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies first so this layer can be cached when only source
# files change. `npm ci` is the production-safe install: it requires
# package-lock.json to exist and is fully reproducible.
COPY package.json package-lock.json ./
RUN npm ci

# Vite inlines `import.meta.env.VITE_*` values at build time, so the
# production API URL must be supplied as a build argument and exposed as
# an environment variable before `npm run build` runs.
ARG VITE_API_BASE_URL
ENV VITE_API_BASE_URL=${VITE_API_BASE_URL}

COPY . .
RUN npm run build

# ------------------------------------------------------------------ Stage 2
FROM nginx:alpine

# Replace the stock server block with the SPA-aware config (history
# fallback, asset cache headers).
COPY nginx/spa.conf /etc/nginx/conf.d/default.conf

# Copy the built static bundle.
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Use the default nginx entrypoint/cmd from the base image.
