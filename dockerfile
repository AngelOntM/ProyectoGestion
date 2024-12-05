# Etapa 1: Clonar el repositorio
FROM alpine:latest AS primerLinux
RUN apk update && apk add --no-cache git
RUN git clone -b main https://github.com/AngelOntM/ProyectoGestion.git

# Etapa 2: Configurar Node.js, Chrome y dependencias
FROM node:20 AS base
WORKDIR /app

# Instalar dependencias del sistema
RUN apt-get -y update && apt-get -y install \
    curl git wget unzip libnss3 libatk1.0-0 libatk-bridge2.0-0 libcups2 \
    libdrm2 libxdamage1 libxrandr2 libgbm-dev libasound2 libxcomposite1 \
    libxrender1 libxi6 libxtst6 libglib2.0-0 libgconf-2-4 libfontconfig1 \
    --no-install-recommends && \
    apt-get clean && rm -rf /var/lib/apt/lists/*

# Instalar Google Chrome
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - && \
    echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" > /etc/apt/sources.list.d/google-chrome.list && \
    apt-get -y update && apt-get -y install google-chrome-stable

# Instalar ChromeDriver
RUN CHROMEDRIVER_VERSION=$(curl -sS chromedriver.storage.googleapis.com/LATEST_RELEASE) && \
    wget -q -O /tmp/chromedriver.zip "https://chromedriver.storage.googleapis.com/${CHROMEDRIVER_VERSION}/chromedriver_linux64.zip" && \
    unzip /tmp/chromedriver.zip -d /usr/local/bin && \
    chmod +x /usr/local/bin/chromedriver

# Agregar ChromeDriver y Google Chrome al PATH
ENV PATH="/usr/local/bin:/usr/bin:${PATH}"

# Copiar el repositorio clonado
COPY --from=primerLinux /ProyectoGestion /app

# Instalar dependencias del proyecto
RUN npm install

# Agregar permisos de ejecución a los binarios necesarios
RUN chmod +x node_modules/.bin/jest

# Agregar variables de entorno necesarias para ejecutar pruebas en modo headless
ENV CHROME_BIN="/usr/bin/google-chrome"
ENV CHROMEDRIVER_PATH="/usr/local/bin/chromedriver"

# Exponer el puerto (si es necesario para pruebas locales)
EXPOSE 8080

# Comando por defecto para ejecutar las pruebas
CMD ["npm", "start"]
