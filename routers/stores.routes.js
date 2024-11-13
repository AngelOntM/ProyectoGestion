const express = require("express");
const storesValidation = require("../validation/stores.validation");
const router = express.Router();

const Store = require("../models/Store");
const Backup = require("../models/Backup");
const Log = require("../models/Log");

// Crear una nueva tienda----------------------------------------------
router.post("/new", async (req, res) => {
  try {
    new Log({
      date: new Date(),
      action: "POST",
      source: "/stores/new",
      params: {
        query: req.query || null,
        path: req.params || null,
      },
      data: req.body || null,
      geoInfo: req.ipInfo,
    }).save();

    const body = req.body;
    const validate = storesValidation.newStore(body);

    if (validate.error) {
      return res.status(400).send({ error: validate.error.details });
    }

    const duplicado = await Store.findOne({
      $or: [{ name: body.name }, { email: body.email }],
    });

    if (duplicado) {
      return res.status(409).send({
        message: "El nombre o email ya existen",
        info: body,
      });
    }

    const newStore = new Store(body);
    await newStore.save();
    res.status(201).send({ created: true, store: newStore });
  } catch (error) {
    console.error("Error al crear la tienda:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

// Eliminar una tienda----------------------------------------------
router.delete("/:name_email", async (req, res) => {
  try {
    new Log({
      date: new Date(),
      action: "DELETE",
      source: "/stores/:name_email",
      params: {
        query: req.query || null,
        path: req.params || null,
      },
      data: req.body || null,
      geoInfo: req.ipInfo,
    }).save();

    const name_email = req.params.name_email;
    const exists = await Store.findOne({
      $or: [{ name: name_email }, { email: name_email }],
    });

    if (!exists) {
      return res.status(404).send({
        message: "El nombre o email de la tienda no existe",
      });
    }

    // Respaldar la tienda antes de eliminarla
    const backup = new Backup({
      registro: exists.toObject(),
      sourceType: "Store",
      sourceId: exists._id,
    });
    await backup.save();

    // Eliminar la tienda
    await Store.deleteOne({ _id: exists._id });

    res.send({ deleted: true });
  } catch (error) {
    console.error("Error al eliminar la tienda:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

// Obtener todas las tiendas----------------------------------------------
router.get("/", async (req, res) => {
  try {
    new Log({
      date: new Date(),
      action: "GET",
      source: "/stores/",
      params: {
        query: req.query || null,
        path: req.params || null,
      },
      data: req.body || null,
      geoInfo: req.ipInfo,
    }).save();

    const stores = await Store.find({});
    res.send(stores);
  } catch (error) {
    console.error("Error al obtener las tiendas:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

module.exports = router;
