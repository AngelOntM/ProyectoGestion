const Joi = require("joi");

// Esquema de validación para un producto
const productSchema = Joi.object({
  name: Joi.string().min(3).max(100).required(),
  price: Joi.number().positive().precision(2).required(),
  description: Joi.string().max(500).optional(),
  sku: Joi.string().alphanum().min(3).max(50).required(),
  quantity: Joi.number().integer().min(0).required(),
});

module.exports = {
  /**
   * Validar datos de un producto
   * @param {{name: string, price: number, description: string, sku: string, quantity: number}} data
   */
  newProduct: function (data) {
    return productSchema.validate(data);
  },
  productSchema,
};
