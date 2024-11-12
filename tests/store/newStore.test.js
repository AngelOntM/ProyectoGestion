test('Se valida que una tienda se cree', function() {
    const storesValidation = require("../../validation/stores.validation");
    const pruebasTienda = require('./mocks/stores.json');

    let validate = storesValidation.newStore(pruebasTienda.optionalDescription);
    expect(validate).not.toHaveProperty('error');

    validate = storesValidation.newStore(pruebasTienda.missingName);
    expect(validate.error.details).toEqual([{"context": {"key": "nombre", "label": "nombre"}, "message": "\"nombre\" is required", "path": ["nombre"], "type": "any.required"}]);

    validate = storesValidation.newStore(pruebasTienda.longName);
    expect(validate.error.details).toEqual([{"context": {"encoding": undefined, "key": "nombre", "label": "nombre", "limit": 30, "value": "Mi Tienda :3 ABC1234 ABC1234 ABC1234"}, "message": "\"nombre\" length must be less than or equal to 30 characters long", "path": ["nombre"], "type": "string.max"}]);
});