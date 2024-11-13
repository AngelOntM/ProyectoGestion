const constants = require("./utils/constants");
const helpers = require("./utils/helpers");
const entorno = helpers.processArguments();

const express = require("express");
const mongoose = require("mongoose");
const expressip = require("express-ip");

const app = express();
app.use(expressip().getIpInfoMiddleware);
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const config = require("./config.json");

const storesRouter = require("./routers/stores.routes");
const productsRouter = require("./routers/products.routes");
const Log = require("./models/Log");

// Rutas para gestionar las tiendas y productos
app.use("/api/stores", storesRouter);
app.use("/api/products", productsRouter);
// Ruta para obtener logs
app.use("/logs", async (req, res) => {
  try {
    const logs = await Log.find({});
    res.send(logs);
  } catch (error) {
    console.error("Error retrieving logs:", error);
    res.status(500).send({ message: "Error retrieving logs" });
  }
});

// Middleware para manejar errores globalmente
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Algo salió mal." });
});

const PORT = config.mongo[entorno].port || 8080;
app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }

  console.log(`Servidor corriendo en el puerto: ${PORT}`);

  // Conectar a MongoDB-------------------------------------------------------------
  const dbConfig = config.mongo[entorno];
  const params = dbConfig.params || "";
  const mongoURI = `${dbConfig.host}/${dbConfig.defaultDB}${params}`;

  mongoose
    .connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
      console.log(`Conectado a MongoDB: ${mongoURI}`);
    })
    .catch((error) => {
      console.error("Error al conectar a MongoDB:", error);
      process.exit(1);
    });
});
