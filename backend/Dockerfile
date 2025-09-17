# Use official Node.js Alpine image
FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install curl for health checks
RUN apk --no-cache add curl

# Copy package files
COPY package*.json ./
COPY package-lock.json* ./

# Install dependencies
RUN npm install --production

# Copy application code
COPY . .

# Expose the app port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8000/ || exit 1

# Command to run the application with better error handling
CMD ["sh", "-c", "node server.js || tail -f /dev/null"]
