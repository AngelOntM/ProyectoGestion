const express = require("express");
const router = express.Router();
const Store = require("../models/Store");
const Log = require("../models/Log");
const productsValidation = require("../validation/products.validation");

// Obtener todos los productos de una tienda
router.get("/:storeId/products", async (req, res) => {
  const { storeId } = req.params;
  const store = await Store.findById(storeId);

  if (!store) {
    return res.status(404).send({ message: "La tienda no existe" });
  }

  res.send(store.products);
});

// Agregar un producto a una tienda----------------------------------------------
router.post("/:storeId/products", async (req, res) => {
  const { storeId } = req.params;
  const store = await Store.findById(storeId);

  if (!store) {
    return res.status(404).send({ message: "La tienda no existe" });
  }

  const newProduct = req.body;
  const validate = productsValidation.newProduct(newProduct);

  if (validate.error) {
    return res.status(400).send(validate.error.details);
  }

  store.products.push(newProduct);
  await store.save();
  res.send({ created: true });
});

// Actualizar un producto en una tienda----------------------------------------------
router.put("/:storeId/products/:sku", async (req, res) => {
  const { storeId, sku } = req.params;
  const store = await Store.findById(storeId);

  if (!store) {
    return res.status(404).send({ message: "La tienda no existe" });
  }

  const productIndex = store.products.findIndex((p) => p.sku === sku);
  if (productIndex === -1) {
    return res.status(404).send({ message: "El producto no existe" });
  }

  const validate = productsValidation.newProduct(req.body);
  if (validate.error) {
    return res.status(400).send(validate.error.details);
  }

  store.products[productIndex] = {
    ...store.products[productIndex],
    ...req.body,
  };
  await store.save();
  res.send({ updated: true });
});

// Eliminar un producto de una tienda----------------------------------------------
router.delete("/:storeId/products/:sku", async (req, res) => {
  const { storeId, sku } = req.params;
  const store = await Store.findById(storeId);

  if (!store) {
    return res.status(404).send({ message: "La tienda no existe" });
  }

  const productIndex = store.products.findIndex((p) => p.sku === sku);
  if (productIndex === -1) {
    return res.status(404).send({ message: "El producto no existe" });
  }

  store.products.splice(productIndex, 1);
  await store.save();
  res.send({ deleted: true });
});

module.exports = router;
