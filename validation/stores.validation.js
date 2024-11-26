const Joi = require("joi");

module.exports = {
  newStore: (data) => {
    const schema = Joi.object({
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
    return schema.validate(data);
  },

  updateStore: (data) => {
    const schema = Joi.object({
      name: Joi.string().min(3).max(40).optional(),
      address: Joi.string().min(5).max(100).optional(),
      postal_number: Joi.string()
        .pattern(/^[0-9]{5}$/)
        .optional(),
      email: Joi.string().email().optional(),
      phone: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .optional(),
    }).min(1); // Al menos un campo debe actualizarse
    return schema.validate(data);
  },
};
