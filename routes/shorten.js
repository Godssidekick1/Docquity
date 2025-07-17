const express = require('express');
const router = express.Router();
const { nanoid } = require('nanoid');
const { validate } = require('../middleware/validation');
const { createShortUrlSchema, updateShortUrlSchema } = require('../validations/shortUrlSchema');
const shortUrlRepository = require('../repositories/ShortUrlRepository');
const authenticateApp = require('../middleware/authenticateApp');
const { z } = require('zod');
const shortCodeParamSchema = z.object({
  params: z.object({
    short_code: z.string().min(1, 'Short code is required')
  })
});
const App = require('../models/App');

// Create a new short URL (requires authentication)
router.post('/', authenticateApp, validate(createShortUrlSchema), async (req, res) => {
  try {
    const { user_id, custom_alias, expires_at, metadata } = req.body;
    const nanoidCode = nanoid(8);
    const short_code = custom_alias ? `${custom_alias}-${nanoidCode}` : nanoidCode;
    const app_id = req.appContext._id;
    const original_url = req.appContext.base_url; // Use app's base_url as original_url
    const shortUrl = await shortUrlRepository.create({
      original_url,
      user_id,
      short_code,
      custom_alias,
      expires_at,
      metadata,
      app_id
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
router.put('/:id', authenticateApp, validate(updateShortUrlSchema), async (req, res) => {
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
router.delete('/:id', authenticateApp, async (req, res) => {
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

// Get details for a short URL by short_code (no authentication required)
router.get('/details/:short_code', validate(shortCodeParamSchema), async (req, res) => {
  try {
    const { short_code } = req.params;
    const shortUrl = await shortUrlRepository.findByShortCode(short_code);
    if (!shortUrl) {
      return res.status(404).json({ error: 'Short URL not found' });
    }
    // Populate app details
    const app = await App.findById(shortUrl.app_id);
    const response = {
      ...shortUrl.toObject(),
      app_name: app ? app.name : undefined,
      app_url: app ? app.base_url : undefined
    };
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router; 