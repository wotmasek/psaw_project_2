FROM node:20-alpine AS base

WORKDIR /app

# Install dependencies first for better layer caching.
COPY package.json ./
RUN npm install --omit=dev

# Copy application skeleton.
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# Use a non-root user available in the official Node image.
USER node

CMD ["node", "src/server.js"]

