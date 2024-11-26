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
router.delete("/:id", async (req, res) => {
  try {
    // Registrar el log
    new Log({
      date: new Date(),
      action: "DELETE",
      source: "/products/:id",
      params: {
        query: req.query || null,
        path: req.params || null,
      },
      data: req.body || null,
      geoInfo: req.ipInfo,
    }).save();

    const id = req.params.id;

    // Validar el formato del ID
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ message: "El ID proporcionado no es válido" });
    }

    // Verificar si el producto existe
    const exists = await Product.findById(id);

    if (!exists) {
      return res.status(404).send({
        message: "El producto con el ID especificado no existe",
      });
    }

    // Respaldar el producto antes de eliminarlo
    const backup = new Backup({
      registro: exists.toObject(),
      sourceType: "Product",
      sourceId: exists._id,
    });
    await backup.save();

    // Eliminar el producto
    await Product.deleteOne({ _id: id });

    res.send({ deleted: true });
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
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
router.put("/:id", async (req, res) => {
  try {
    // Registrar el log
    new Log({
      date: new Date(),
      action: "PUT",
      source: "/products/:id",
      params: {
        query: req.query || null,
        path: req.params || null,
      },
      data: req.body || null,
      geoInfo: req.ipInfo,
    }).save();

    const id = req.params.id;

    // Validar el formato del ID
    const mongoose = require("mongoose");
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res
        .status(400)
        .send({ message: "El ID proporcionado no es válido" });
    }

    // Verificar si el producto existe
    const exists = await Product.findById(id);

    if (!exists) {
      return res.status(404).send({
        message: "El producto con el ID especificado no existe",
      });
    }

    const body = req.body;

    // Validar el cuerpo de la solicitud
    const validate = productsValidation.updateProduct(body);
    if (validate.error) {
      return res.status(400).send({ error: validate.error.details });
    }

    // Respaldar el producto antes de modificarlo
    const backup = new Backup({
      registro: exists.toObject(),
      sourceType: "Product",
      sourceId: exists._id,
    });
    await backup.save();

    // Modificar el producto
    await Product.updateOne({ _id: id }, body);

    res.send({ modified: true });
  } catch (error) {
    console.error("Error al modificar el producto:", error);
    res.status(500).send({ error: "Error interno del servidor" });
  }
});

module.exports = router;
