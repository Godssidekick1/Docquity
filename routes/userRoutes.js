const express = require('express');
const router = express.Router();
const controller = require('../controllers/userController');

router.get('/init', controller.initTestData);
router.get('/fetch', controller.fetchTestData);

module.exports = router;