const express = require("express");
const productsValidation = require("../validation/products.validation");
const router = express.Router();

const Product = require("../models/Product");
const Backup = require("../models/Backup");
const Log = require("../models/Log");

// Crear una nueva tienda----------------------------------------------
router.post("/", async (req, res) => {
  try {
    new Log({
      date: new Date(),
      action: "POST",
      source: "/products/new",
      params: {
        query: req.query || null,
        path: req.params || null,
      },
      data: req.body || null,
      geoInfo: req.ipInfo,
    }).save();

    const body = req.body;
    const validate = productsValidation.newProduct(body);

    if (validate.error) {
      return res.status(400).send({ error: validate.error.details });
    }

    const duplicado = await Product.findOne({
      $or: [{ name: body.name }, { sku: body.sku }],
    });

    if (duplicado) {
      return res.status(409).send({
        message: "El nombre o sku ya existen",
        info: body,
      });
    }

    const newStore = new Product(body);
    await newStore.save();
    res.status(201).send({ created: true, store: newStore });
  } catch (error) {
    console.error("Error al crear la tienda:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

// Eliminar una tienda----------------------------------------------
router.delete("/:name_sku", async (req, res) => {
  try {
    new Log({
      date: new Date(),
      action: "DELETE",
      source: "/products/:name_sku",
      params: {
        query: req.query || null,
        path: req.params || null,
      },
      data: req.body || null,
      geoInfo: req.ipInfo,
    }).save();

    const name_sku = req.params.name_sku;
    const exists = await Product.findOne({
      $or: [{ name: name_sku }, { sku: name_sku }],
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
    await Product.deleteOne({ _id: exists._id });

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

    const stores = await Product.find({});
    res.send(stores);
  } catch (error) {
    console.error("Error al obtener las tiendas:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

// Modificar una tienda----------------------------------------------
router.put("/:name_sku", async (req, res) => {
  try {
    new Log({
      date: new Date(),
      action: "PUT",
      source: "/stores/:name_sku",
      params: {
        query: req.query || null,
        path: req.params || null,
      },
      data: req.body || null,
      geoInfo: req.ipInfo,
    }).save();

    const name_sku = req.params.name_sku;
    const exists = await Product.findOne({
      $or: [{ name: name_sku }, { sku: name_sku }],
    });

    if (!exists) {
      return res.status(404).send({
        message: "El nombre o email de la tienda no existe",
      });
    }

    const body = req.body;
    const validate = productsValidation.newProduct(body);

    if (validate.error) {
      return res.status(400).send({ error: validate.error.details });
    }

    // Respaldar la tienda antes de modificarla
    const backup = new Backup({
      registro: exists.toObject(),
      sourceType: "Store",
      sourceId: exists._id,
    });
    await backup.save();

    // Modificar la tienda
    await Product.updateOne({ _id: exists._id }, body);

    res.send({ modified: true });
  } catch (error) {
    console.error("Error al modificar la tienda:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});
module.exports = router;
