FROM node:20

RUN apt-get update && apt-get install -y ghostscript libreoffice

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

EXPOSE 5000

CMD ["node", "server.js"]