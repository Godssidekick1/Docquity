const AppRepository = require('../repositories/AppRepository');
const mongoose = require('mongoose');

const registerApp = async (req, res) => {
  try {
    const { name, base_url } = req.body;

    // Validate that both name and base_url are provided
    if (!name || !base_url) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'Both "name" and "base_url" are required.',
      });
    }

    // Register the app or get the existing app
    const app = await AppRepository.registerApp(name, base_url);

    // Return a 201 Created response with the app details
    return res.status(201).json({
      id: app._id,
      name: app.name,
      base_url: app.base_url,
      token: app.token,
    });
  } catch (error) {
    // Handle unexpected errors
    console.error('Error registering app:', error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while registering the app.',
    });
  }
};

exports.createShortUrl = async (req, res) => {
  try {
    const appContext = req.appContext;
    console.log('appContext:', appContext);
    console.log('appContext._id:', appContext._id);

    const { original_url, custom_alias, expires_at, metadata } = req.body;
    if (!original_url) {
      return res.status(400).json({
        error: 'Validation failed',
        message: 'The \"original_url\" field is required.',
      });
    }

    const short_code = custom_alias || nanoid(8);

    const shortUrl = new ShortUrl({
      app_id: mongoose.Types.ObjectId(appContext._id),
      original_url,
      short_code,
      expires_at,
      metadata,
    });

    await shortUrl.save();

    return res.status(201).json({
      message: 'Short URL created successfully',
      shortUrl: {
        app_id: shortUrl.app_id,
        original_url: shortUrl.original_url,
        short_code: shortUrl.short_code,
        full_short_url: `http://localhost:8080/shorten/${shortUrl.short_code}`,
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

module.exports = { registerApp};