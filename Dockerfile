# Single Container Dockerfile - Wichita to the Moon
# Combines Frontend + Backend in one simple Express server

FROM node:18-alpine AS base

# ============================================
# Stage 1: Build Frontend
# ============================================
FROM base AS frontend-builder

WORKDIR /app/frontend

COPY frontend/package*.json ./
RUN npm ci

COPY frontend/ ./

# Build Next.js in standalone mode
ENV NEXT_TELEMETRY_DISABLED 1
RUN npm run build

# ============================================
# Stage 2: Production Runtime
# ============================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Install production dependencies for unified server
COPY package*.json ./
RUN npm ci --only=production

# Copy backend source
COPY backend/ ./backend/

# Copy frontend build
COPY --from=frontend-builder /app/frontend/.next/standalone ./frontend/
COPY --from=frontend-builder /app/frontend/.next/static ./frontend/.next/static
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Copy unified server
COPY server.js ./

# Create non-root user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 appuser && \
    chown -R appuser:nodejs /app

USER appuser

EXPOSE 8080

ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
