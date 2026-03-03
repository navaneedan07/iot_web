FROM node:20-alpine AS build

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

COPY index.html vite.config.js tailwind.config.js postcss.config.js ./
COPY src/ ./src/

RUN npm run build

# --- Production image ---
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html
# nginx config is mounted via docker-compose
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
