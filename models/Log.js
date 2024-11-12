const mongoose = require('mongoose');

module.exports = mongoose.model("Log", new mongoose.Schema({
    date: Date,
    action: String,
    source: String,
    params: {
        query: Object,
        path: Object
    },
    data: Object,
    geoInfo: Object
}), 'Logs');