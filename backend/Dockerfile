# ==============================
# FRONTEND BUILD
# ==============================

FROM node:20 AS frontend

WORKDIR /frontend

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build


# ==============================
# BACKEND
# ==============================

FROM node:20

RUN apt-get update && \
    apt-get install -y ghostscript libreoffice && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Backend package files
COPY backend/package*.json ./

RUN npm install

# Backend source
COPY backend/ ./

# React production build
COPY --from=frontend /frontend/dist ./dist

RUN mkdir -p uploads

EXPOSE 5000

CMD ["node", "server.js"]