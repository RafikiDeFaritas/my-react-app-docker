# ---- Build stage ----
    FROM node:20-alpine AS builder
    WORKDIR /app
    COPY package*.json ./
    RUN npm ci
    COPY . .
    RUN npm run build  # génère /dist
    
    # ---- Runtime stage ----
    FROM nginx:alpine
    # copie la sortie Vite vers nginx
    COPY --from=builder /app/dist /usr/share/nginx/html
    # config nginx basique pour SPA (fallback vers index.html)
    RUN printf "server { \
      listen 80; \
      server_name _; \
      root /usr/share/nginx/html; \
      location / { try_files \$uri /index.html; } \
    }" > /etc/nginx/conf.d/default.conf
    EXPOSE 80
    CMD ["nginx", "-g", "daemon off;"]
