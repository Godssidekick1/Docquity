const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const redisClient = require('../services/redisClient');

router.get('/healthcheck', async (req, res) => {
  const mongoStatus = mongoose.connection.readyState === 1 ? 'up' : 'down';
  const redisStatus = redisClient.isOpen ? 'up' : 'down';
  res.status(200).json({ status: 'ok', mongo: mongoStatus, redis: redisStatus });
});

module.exports = router; 