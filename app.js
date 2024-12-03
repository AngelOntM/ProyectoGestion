//app.js
const express = require("express");
const connectToDatabase = require("./database/mongoose");
const { config, ENV } = require("./config");

const storesRouter = require("./routers/stores.routes");
const productsRouter = require("./routers/products.routes");
const Log = require("./models/Log");
const Backup = require("./models/Backup");

const app = express(); // Crear la instancia de la app Express

// Función para iniciar el servidor
app.use(express.static(__dirname + "/public"));

// Conectar a la base de datos
connectToDatabase();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
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

app.use("/backups", async (req, res) => {
  try {
    const backups = await Backup.find({});
    res.send(backups);
  } catch (error) {
    res.status(500).send({ message: "Error retrieving backups" });
  }
});

// Exportar la aplicación y la función para iniciar el servidor
module.exports = app;
