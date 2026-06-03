# Frontend image: build the Vite app, then serve the static output with nginx.
# VITE_* values are baked in at BUILD time, so they are passed as build args.
FROM node:20-bookworm AS build

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# Public URLs the browser will use to reach the backend and the dev containers.
ARG VITE_API_URL=http://localhost:3000
ARG VITE_CONTAINER_HOST=http://localhost
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CONTAINER_HOST=$VITE_CONTAINER_HOST
RUN npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
