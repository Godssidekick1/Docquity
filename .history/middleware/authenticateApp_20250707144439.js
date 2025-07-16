const AppRepository = require('../repositories/AppRepository');

const authenticateApp = async (req, res, next) => {
  try {
    // Check for the Authorization header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header.',
      });
    }

    // Extract the token from the Authorization header
    const token = authHeader.split(' ')[1];

    // Find the app by token
    const app = await AppRepository.findByToken(token);
    if (!app) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid app token.',
      });
    }

    // Attach the app document to req.appContext
    req.appContext = app;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Error authenticating app:', error.message);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred while authenticating the app.',
    });
  }
};

module.exports = authenticateApp;