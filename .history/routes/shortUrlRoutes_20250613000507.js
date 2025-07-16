const express = require('express');
const router = express.Router();
const controller = require('../controllers/shortUrlController');
const validateRequest = require('../middleware/validateRequest');
const { createShortUrlSchema, updateShortUrlSchema } = require('../schemas/urlSchemas');

router.post('/', validateRequest(createShortUrlSchema), controller.createShortUrl);
router.get('/', controller.getAllShortUrls);
router.put('/:id', validateRequest(updateShortUrlSchema), controller.updateShortUrl);
router.delete('/:id', controller.deleteShortUrl);

module.exports = router;