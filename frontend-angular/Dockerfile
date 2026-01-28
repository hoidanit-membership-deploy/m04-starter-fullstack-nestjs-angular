# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy source code
COPY . .

# Build the application (with default /api)
RUN npm run build

# Stage 2: Production with Caddy
FROM caddy:2-alpine

WORKDIR /srv

# Copy built assets from builder
COPY --from=builder /app/dist/frontend-angular/browser .

# Rename index.csr.html to index.html (Angular 17+ SSR build output)
RUN if [ -f index.csr.html ] && [ ! -f index.html ]; then mv index.csr.html index.html; fi

# Copy Caddyfile
COPY Caddyfile /etc/caddy/Caddyfile

# Default port and API URL (can be overridden by docker-compose)
ENV PORT=80
ENV API_URL=/api

# Expose port
EXPOSE ${PORT}

# At runtime: replace API URL in JS files, then start Caddy
CMD ["sh", "-c", "find . -name '*.js' -exec sed -i \"s|/api|${API_URL}|g\" {} + && caddy run --config /etc/caddy/Caddyfile --adapter caddyfile"]
