require("dotenv").config(); // Carga las variables de entorno desde un archivo .env

const express = require("express");
const mongoose = require("mongoose");
const expressip = require("express-ip");

const app = express();
app.use(expressip().getIpInfoMiddleware);
app.use(express.json());
app.use(express.static(__dirname + "/public"));

const storesRouter = require("./routers/stores.routes");
const productsRouter = require("./routers/products.routes");
const Log = require("./models/Log");

app.use("/api/stores", storesRouter);
app.use("/api/products", productsRouter);

app.use("/logs", async (req, res) => {
  try {
    const logs = await Log.find({});
    res.send(logs);
  } catch (error) {
    console.error("Error retrieving logs:", error);
    res.status(500).send({ message: "Error retrieving logs" });
  }
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ message: "Algo salió mal." });
});

// Usando variables de entorno para puerto y configuración de MongoDB
const PORT = process.env.PORT || 8080;
const MONGO_HOST = process.env.MONGO_HOST || "mongodb://localhost:27017";
const MONGO_DB = process.env.MONGO_DB || "Gestion";
const MONGO_PARAMS = process.env.MONGO_PARAMS || "";

app.listen(PORT, (error) => {
  if (error) {
    console.error("Error starting server:", error);
    process.exit(1);
  }

  console.log(`Servidor corriendo en el puerto: ${PORT}`);

  const mongoURI = `${MONGO_HOST}/${MONGO_DB}${MONGO_PARAMS}`;

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

module.exports = app;
