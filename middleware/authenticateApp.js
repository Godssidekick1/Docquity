const AppRepository = require('../repositories/AppRepository');

const authenticateApp = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header.',
      });
    }

    const token = authHeader.split(' ')[1];
    const app = await AppRepository.findByToken(token);
    if (!app) {
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid app token.',
      });
    }

    req.appContext = app;
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