// server/routes/data.js
const express = require('express');
const router = express.Router();
const CoalData = require('../models/CoalData');

// API endpoint to get the latest data
router.get('/data', async (req, res) => {
  const data = await CoalData.find().sort({ timestamp: -1 }).limit(10);
  res.json(data);
});

module.exports = router;
