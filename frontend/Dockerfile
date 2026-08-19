# ==========================================
# KisanO Frontend - Multi-Stage Dockerfile
# ==========================================

# STAGE 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Build the Vite React App for Production
RUN npm run build


# STAGE 2: Serve with NGINX
FROM nginx:alpine

# Copy built assets from builder
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom NGINX configuration for React Router (SPA fallback)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]
