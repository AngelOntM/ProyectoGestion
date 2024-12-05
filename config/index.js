//config/index.js
const minimist = require("minimist");
require("dotenv").config(); // Cargar las variables del .env

// Detectar el entorno desde los argumentos de línea de comandos
const args = minimist(process.argv.slice(2));
const ENV = args.entorno || "prod"; // Por defecto, 'dev'

const config = {
  dev: {
    baseUrl: process.env.DEV_BASE_URL,
    mongoUri: process.env.DEV_MONGO_URI,
  },
  test: {
    baseUrl: process.env.TEST_BASE_URL,
    mongoUri: process.env.TEST_MONGO_URI,
  },
  prod: {
    baseUrl: process.env.PROD_BASE_URL,
    mongoUri: process.env.PROD_MONGO_URI,
  },
}[ENV];

// Validar el entorno
if (!config) {
  console.error(`Entorno no válido: "${ENV}". Usa "dev", "test" o "prod".`);
  process.exit(1);
}

module.exports = {
  ENV,
  config,
};
