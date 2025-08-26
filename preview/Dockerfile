# Single-stage Dockerfile combining nginx, Node.js app, and SSE watcher in a single container
# This Dockerfile is designed for preview mode and includes:
# - nginx as reverse proxy on port 80
# - Next.js preview server on port 3000
# - SSE watcher for live LeadCMS updates
# 
# Usage from root folder:
# docker build -f preview/Dockerfile -t leadcms_site_preview .
FROM node:24.6-alpine

# Install nginx and supervisor
RUN apk add --no-cache nginx supervisor wget

# Create directories
RUN mkdir -p /var/log/supervisor
RUN mkdir -p /run/nginx

# Copy the application
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Add build args for environment variables
ARG NEXT_PUBLIC_LEADCMS_URL
ARG LEADCMS_API_KEY

# Export build args as environment variables
ENV NEXT_PUBLIC_LEADCMS_URL=$NEXT_PUBLIC_LEADCMS_URL
ENV LEADCMS_API_KEY=$LEADCMS_API_KEY

# Install dependencies (including SSE watcher dependencies)
RUN npm ci --verbose
RUN npm install -g eventsource

# Copy the rest of the application after dependencies are installed
COPY . .

# Copy nginx configuration as the main nginx.conf
COPY preview/nginx.conf /etc/nginx/nginx.conf

# Copy supervisor configuration
COPY preview/supervisord.conf /etc/supervisor/conf.d/supervisord.conf

# Create startup script
RUN echo '#!/bin/sh' > /start.sh && \
    echo '# Fetch initial LeadCMS content at startup when env vars are available' >> /start.sh && \
    echo '# Start supervisor which will manage both nginx and Node.js' >> /start.sh && \
    echo 'exec /usr/bin/supervisord -c /etc/supervisor/conf.d/supervisord.conf' >> /start.sh

RUN chmod +x /start.sh

# Expose port 80 (nginx will proxy to Node.js on port 3000)
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
    CMD wget --spider -q http://localhost:80 || exit 1

# Start both services
CMD ["/start.sh"]
