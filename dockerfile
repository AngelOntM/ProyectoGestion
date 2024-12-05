# Etapa 1: Clonar el repositorio
FROM alpine:latest AS fetch-repo
RUN apk update && apk add --no-cache git
RUN git clone -b main https://github.com/AngelOntM/ProyectoGestion.git

# Etapa 2: Construir la aplicación con la imagen base
FROM proyecto-gestion/base AS app
WORKDIR /app

# Copiar el repositorio clonado
COPY --from=fetch-repo /ProyectoGestion /app

# Instalar dependencias del proyecto
RUN npm install

# Agregar permisos de ejecución a los binarios necesarios
RUN chmod +x node_modules/.bin/jest
