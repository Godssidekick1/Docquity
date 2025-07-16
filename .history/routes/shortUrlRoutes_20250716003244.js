const express = require('express');
const router = express.Router();
const authenticateApp = require('../middleware/authenticateApp');
const { createShortUrl, redirectShortUrl } = require('../controllers/shortUrlController');

router.post('/', authenticateApp, createShortUrl);
router.get('/:short_code', redirectShortUrl);

module.exports = router;