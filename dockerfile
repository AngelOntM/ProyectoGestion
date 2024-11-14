# Etapa 1: Clonar el repositorio
FROM alpine AS primerLinux
RUN apk update && apk add --no-cache git
RUN git clone -b main https://github.com/AngelOntM/ProyectoGestion.git

# Etapa 2: Configurar Node.js y dependencias
FROM node:20 AS base
RUN apt-get -y update && apt-get -y install curl git
WORKDIR /app
COPY --from=primerLinux /ProyectoGestion /app
RUN npm install
EXPOSE 8080
CMD ["npm", "start"]
