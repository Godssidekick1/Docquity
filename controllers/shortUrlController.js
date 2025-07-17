const { nanoid } = require('nanoid');
const ShortUrl = require('../models/ShortUrl');
const mongoose = require('mongoose');

exports.createShortUrl = async (req, res) => {
  try {
    // Ensure authenticateApp middleware has run
    const appContext = req.appContext;
    if (!appContext) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'App authentication is required to create a short URL.',
      });
    }

    console.log('appContext:', appContext);
    console.log('appContext._id:', appContext._id);

    // Read required fields from the request body
    const { target_url, custom_alias, expires_at, metadata } = req.body;

    // Validate required fields
    if (!target_url) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'The "target_url" field is required.',
      });
    }

    // Always generate short_code with nanoid
    const short_code = nanoid(8);

    // Optionally, store custom_alias separately if needed
    const shortUrl = new ShortUrl({
      app_id: appContext._id,
      original_url: appContext.base_url, // Use the app's base_url
      short_code,
      target_url, // Store the target URL to redirect to
      expires_at,
      metadata,
    });

    // Save the document to the database
    await shortUrl.save();

    // Return a 201 Created response with the short URL data
    return res.status(201).json({
      message: 'Short URL created successfully',
      shortUrl: {
        app_id: shortUrl.app_id,
        original_url: shortUrl.original_url, // The app's base_url
        target_url: shortUrl.target_url, // The URL to redirect to
        short_code: shortUrl.short_code,
        full_short_url: `${appContext.base_url}/${shortUrl.short_code}`,
        expires_at: shortUrl.expires_at,
        metadata: shortUrl.metadata,
      },
    });
  } catch (error) {
    console.error('Error creating short URL:', error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while creating the short URL.',
    });
  }
};

exports.getAllShortUrls = async (req, res) => {
  try {
    const urls = await ShortUrl.find();
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch URLs', details: err.message });
  }
};

exports.updateShortUrl = async (req, res) => {
  try {
    const updated = await ShortUrl.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: 'URL not found' });
    res.json({ message: 'Short URL updated', updated });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update URL', details: err.message });
  }
};

exports.deleteShortUrl = async (req, res) => {
  try {
    const deleted = await ShortUrl.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'URL not found' });
    res.json({ message: 'Short URL deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete URL', details: err.message });
  }
};

exports.redirectShortUrl = async (req, res) => {
  try {
    const code = req.params.short_code;
    const shortUrl = await ShortUrl.findOne({ short_code: code });

    if (!shortUrl) return res.status(404).send('Short URL not found');
    if (shortUrl.expires_at && new Date() > shortUrl.expires_at)
      return res.status(410).send('⏳ This short URL has expired');

    res.redirect(shortUrl.target_url);
  } catch {
    res.status(500).send('Server error');
  }
};

// Updated ShortUrl schema to include app_id field
ShortUrl.schema.add({
  app_id: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true }
});
