const express = require('express');
const router = express.Router();
const authenticateApp = require('../middleware/authenticateApp');
const { createShortUrl, redirectShortUrl } = require('../controllers/shortUrlController');

// POST /shorten
router.post('/', authenticateApp, createShortUrl);

// GET /shorten/:short_code
router.get('/:short_code', redirectShortUrl);

module.exports = router;