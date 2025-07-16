const AppRepository = require('../repositories/AppRepository');

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

module.exports = { registerApp };