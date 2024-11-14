const Joi = require("joi");
const { productSchema } = require("./products.validation");

module.exports = {
  /**
   * Validar datos de una tienda
   * @param {{name: string, address: string, postal_number: string, email: string, phone: string, products: Array}} data
   */
  newStore: function (data) {
    // Esquema de validación para una tienda
    const storeSchema = Joi.object({
      name: Joi.string().min(3).max(40).required(),
      address: Joi.string().min(5).max(100).required(),
      postal_number: Joi.string()
        .pattern(/^[0-9]{5}$/)
        .required(),
      email: Joi.string().email().required(),
      phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required(),
    });

    return storeSchema.validate(data);
  },
};
