const express = require('express');
const router = express.Router();
const controller = require('../controllers/shortUrlController');

router.post('/', controller.createShortUrl);
router.get('/', controller.getAllShortUrls);
router.put('/:id', controller.updateShortUrl);
router.delete('/:id', controller.deleteShortUrl);

module.exports = router;