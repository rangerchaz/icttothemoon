# Backend Dockerfile - Node.js API Server
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy application code
COPY . .

# Expose backend port
EXPOSE 3001

# Start the server
CMD ["npm", "start"]
