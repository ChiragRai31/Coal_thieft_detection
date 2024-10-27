// server/models/CoalData.js
const mongoose = require('mongoose');

const CoalDataSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  location: { type: String },
  loadWeight: { type: Number },
  temperature: { type: Number },
  humidity: { type: Number },
});

module.exports = mongoose.model('CoalData', CoalDataSchema);
