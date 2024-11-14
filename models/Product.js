const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 100,
    },
    price: {
      type: Number,
      required: true,
      min: 0, // No se permite un precio negativo
    },
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: /^[a-zA-Z0-9_-]+$/, // Permite caracteres alfanuméricos, guiones y guiones bajos
    },
    quantity: {
      type: Number,
      required: true,
      min: 0, // No se permite una cantidad negativa
      default: 0,
    },
  },
  { timestamps: true } // Añade campos createdAt y updatedAt automáticamente
);

module.exports = mongoose.model("Product", productSchema, "Products");
