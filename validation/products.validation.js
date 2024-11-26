const Joi = require("joi");

module.exports = {
  newProduct: (data) => {
    // Esquema de validación para una tienda
    const schema = Joi.object({
      name: Joi.string().min(3).max(100).required(),
      price: Joi.number().positive().precision(2).required(),
      description: Joi.string().max(500).optional(),
      sku: Joi.string().alphanum().min(3).max(12).required(),
      quantity: Joi.number().integer().min(0).required(),
    });
    return schema.validate(data);
  },

  updateProduct: (data) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(100).optional(),
      price: Joi.number().positive().precision(2).optional(),
      description: Joi.string().max(500).optional(),
      sku: Joi.string().alphanum().min(3).max(12).optional(),
      quantity: Joi.number().integer().min(0).optional(),
    }).min(1);
    return schema.validate(data);
  },
};
