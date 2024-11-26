const mongoose = require("mongoose");
const { config, ENV } = require("../config"); // Importar configuración

const connectToDatabase = async () => {
  try {
    await mongoose.connect(config.mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log(`Conectado a MongoDB (${ENV}): ${config.mongoUri}`);
  } catch (err) {
    console.error(`Error al conectar a MongoDB: ${err.message}`);
    process.exit(1); // Finalizar proceso en caso de error crítico
  }
};

module.exports = connectToDatabase;
