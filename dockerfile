# Etapa 1: Clonar el repositorio
FROM alpine AS primerLinux
RUN apk update && apk add --no-cache git
RUN git clone -b main https://github.com/AngelOntM/ProyectoGestion.git

# Etapa 2: Configurar Node.js y dependencias
FROM node:20 AS base
RUN apt-get -y update; apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_20.x | bash && \
    apt-get -qqy install nodejs
RUN apt-get -y update && apt-get -y install curl git
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \ 
    && echo "deb http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list
RUN apt-get update && apt-get -y install google-chrome-stable
WORKDIR /app
COPY --from=primerLinux /ProyectoGestion /app
RUN npm install
EXPOSE 8080
#Correr el comando chmod +x node_modules/.bin/jest
RUN chmod +x node_modules/.bin/jest
#CMD ["npm", "run", "start:prod"]
