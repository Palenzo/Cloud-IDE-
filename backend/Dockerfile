# Backend API image.
# Connects to the host Docker daemon via the mounted /var/run/docker.sock
# (see docker-compose.yml) to create per-user dev containers.
FROM node:20-bookworm

WORKDIR /app

# Install deps first for better layer caching.
COPY package.json package-lock.json ./
RUN npm install --omit=dev

# App source (node_modules/.env excluded via .dockerignore).
COPY . .

ENV NODE_ENV=production
EXPOSE 3000

# Run directly (not nodemon, which is a dev dependency).
CMD ["node", "app.js"]
