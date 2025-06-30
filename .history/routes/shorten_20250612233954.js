const express = require('express');
const router = express.Router();
const { validate } = require('../middleware/validation');
const { createShortUrlSchema, updateShortUrlSchema } = require('../validations/shortUrlSchema');
const ShortUrlRepository = require('../repositories/ShortUrlRepository');

const shortUrlRepository = new ShortUrlRepository();

// Create a new short URL
router.post('/', validate(createShortUrlSchema), async (req, res) => {
  try {
    const { original_url, user_id, custom_alias, expires_at, metadata } = req.body;
    const shortUrl = await shortUrlRepository.create({
      original_url,
      user_id,
      custom_alias,
      expires_at,
      metadata
    });
    res.status(201).json({
      message: "✅ Short URL created",
      shortUrl
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all short URLs
router.get('/', async (req, res) => {
  try {
    const shortUrls = await shortUrlRepository.findAll();
    res.json(shortUrls);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update a short URL
router.put('/:id', validate(updateShortUrlSchema), async (req, res) => {
  try {
    const { id } = req.params;
    const { original_url, expires_at, metadata } = req.body;
    const updatedUrl = await shortUrlRepository.update(id, {
      original_url,
      expires_at,
      metadata
    });
    if (!updatedUrl) {
      return res.status(404).json({ error: "❌ Short URL not found" });
    }
    res.json({ message: "✅ Short URL updated", shortUrl: updatedUrl });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete a short URL
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await shortUrlRepository.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: "❌ Short URL not found" });
    }
    res.json({ message: "✅ Short URL deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 