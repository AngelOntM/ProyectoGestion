const mongoose = require('mongoose');

module.exports = mongoose.model("Backup", new mongoose.Schema({
    registro: Object
}), 'Backups');