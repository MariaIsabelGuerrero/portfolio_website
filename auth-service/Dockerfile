# Build stage
FROM node:20-alpine AS build

WORKDIR /app

# Copy package files first for better caching
COPY package.json package-lock.json* ./

# Install dependencies with cache mount for faster rebuilds
RUN --mount=type=cache,target=/root/.npm \
    npm ci

# Copy source code
COPY . .

# Build Next.js app
RUN npm run build

# Production stage
FROM node:20-alpine AS production

WORKDIR /app

ENV NODE_ENV=production

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Copy package files
COPY package.json package-lock.json* ./

# Install production dependencies only
RUN npm ci --only=production

# Copy built application
COPY --from=build /app/.next ./.next
COPY --from=build /app/next.config.js ./next.config.js
COPY --from=build /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=build /app/src/lib/db ./src/lib/db

# Expose port
EXPOSE 3001

# Install postgresql-client for psql
RUN apk add --no-cache postgresql-client

# Copy scripts directory
COPY scripts ./scripts

# Convert line endings from CRLF to LF (Windows to Unix)
RUN sed -i 's/\r$//' ./scripts/setup-db.sh && \
    sed -i 's/\r$//' ./scripts/start.sh

# Make scripts executable and change ownership to non-root user
RUN chmod +x ./scripts/setup-db.sh && \
    chmod +x ./scripts/start.sh && \
    chown -R nextjs:nodejs /app

# Switch to non-root user
USER nextjs

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=40s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3001/api/health || exit 1

# Start the application with DB initialization
CMD ["./scripts/start.sh"]
