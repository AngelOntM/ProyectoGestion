const mongoose = require('mongoose');

module.exports = mongoose.model("Store", new mongoose.Schema({
    nombre: String,
    descripcion: String,
    rfc: String,
    clave: String
}), 'Stores');