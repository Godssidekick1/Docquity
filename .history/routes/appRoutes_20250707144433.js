const express = require('express');
const { registerApp } = require('../controllers/appController');

const router = express.Router();

// Define the POST /api/apps/register endpoint
router.post('/register', registerApp);

module.exports = router;