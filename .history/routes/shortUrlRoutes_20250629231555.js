const express = require('express');
const { validate } = require('../middleware/validation');
const { createShortUrlSchema } = require('../schemas/urlSchemas');
const { createShortUrl } = require('../controllers/shortUrlController');

const router = express.Router();

router.post('/', validate(createShortUrlSchema), createShortUrl);

module.exports = router;