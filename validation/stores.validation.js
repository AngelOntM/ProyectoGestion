const Joi = require('joi');

module.exports = {
    /**
     * Store data
     * @param {{nombre, descripcion, rfc, clave}} data 
     */
    newStore: function(data) {
        const schema = Joi.object({
            nombre: Joi.string().max(30).required(),
            descripcion: Joi.string().optional(),
            rfc: Joi.string().regex(/^[A-ZÑ]{4}\d{6}[A-ZÑ]\d{2}$/).required(),
            clave: Joi.string().regex(/^[A-ZÑ]\d{3}$/).required()
        });

        return schema.validate(data);
    }
}