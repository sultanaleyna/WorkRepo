// smodels/recordModel.js

const mongoose = require('mongoose');

const recordSchema = new mongoose.Schema({
    hesapKodu: { type: String, required: true },
    toplamBorc: { type: Number, required: true }
});

module.exports = mongoose.model('Record', recordSchema);
