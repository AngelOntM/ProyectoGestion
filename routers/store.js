const express = require('express');
const storesValidation = require('../validation/stores.validation');
const router = express.Router();

const Tienda = require('../models/Tienda');
const Backup = require('../models/Backup');
const Log = require('../models/Log');

router.post('/new', async (req, res) => {

    new Log({
        date: new Date(),
        action: 'POST',
        source: '/stores/new',
        params: {
            query: req.query || null,
            path: req.params || null
        },
        data: req.body || null,
        geoInfo: req.ipInfo
    }).save();
    const body = req.body;
    const validate = storesValidation.newStore(body);
    
    //Inversión: Si sabes cuándo o porqué falla, no verifiques nada
    //Simplemente, retorna o regresa el error
    if(validate.error) {
        return res.status(400).send(validate.error.details);
    }

    //Validar que no se dupliquen
    const duplicado = await Tienda.findOne({ $or: [
        {clave: body.clave},
        {rfc: body.rfc}
    ]});

    if(duplicado) {
        return res.status(409).send({
            message: "La clave ó RFC ya existen",
            info: body
        });
    }

    //Crear la nueva tienda
    const nuevaTienda = new Tienda(body);
    await nuevaTienda.save();
    res.send({
        created: true
    });
});

router.delete('/:clave_rfc', async (req, res) => {
    new Log({
        date: new Date(),
        action: 'DELETE',
        source: '/stores/:RFC_CLAVE',
        params: {
            query: req.query || null,
            path: req.params || null
        },
        data: req.body || null,
        geoInfo: req.ipInfo
    }).save();

    const clave_rfc = req.params.clave_rfc;
    const existe = await Tienda.findOne({ $or: [
        {clave: clave_rfc},
        {rfc: clave_rfc}
    ]});

    /*if(!existe) {
        return res.status(404).send({
            message: "La clave ó RFC no existen",
        });
    }*/

    if(existe) {

        const backup = new Backup(existe.toObject());
        await backup.save();

        await Tienda.deleteOne({ $or: [
            {clave: clave_rfc},
            {rfc: clave_rfc}
        ]});
    }

    res.send({
        deleted: true
    });
});

router.put('/:clave_rfc', async (req, res) => {
    new Log({
        date: new Date(),
        action: 'PUT',
        source: '/stores/:RFC_CLAVE',
        params: {
            query: req.query || null,
            path: req.params || null
        },
        data: req.body || null,
        geoInfo: req.ipInfo
    }).save();

    const clave_rfc = req.params.clave_rfc;
    const existe = await Tienda.findOne({ $or: [
        {clave: clave_rfc},
        {rfc: clave_rfc}
    ]});

    if(!existe) {
        return res.status(404).send({
            message: "La clave ó RFC no existen",
        });
    }

    const body = req.body;
    const properties = Object.keys(body);
    for(let i = 0; i < properties.length; i++) {
        const property = properties[i];

        switch(property.toLowerCase()) {
            case "nombre":
            case "rfc":
            case "descripcion":
                existe[property] = body[property];
                break;
        }
    }

    await existe.save();
    res.send({
        ok: true
    });
});

router.get('/all', async (req, res) => {
    new Log({
        date: new Date(),
        action: 'GET',
        source: '/stores/all',
        params: {
            query: req.query || null,
            path: req.params || null
        },
        data: req.body || null,
        geoInfo: req.ipInfo
    }).save();

    const tiendas = await Tienda.find({});
    res.send(tiendas);
});

module.exports = router;