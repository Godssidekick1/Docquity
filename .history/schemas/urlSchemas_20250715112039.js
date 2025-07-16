const { z } = require('zod');
const { extendZodWithOpenApi } = require('zod-openapi');
const AppRepository = require('../repositories/AppRepository');

// Extend Zod with OpenAPI 
extendZodWithOpenApi(z);

// Create Short URL Schema
const createShortUrlSchema = z.object({
  original_url: z.string().url('Invalid URL format'),
  //user_id: z.string(), 
  custom_alias: z.string().min(3, 'Custom alias must be at least 3 characters').optional(),
  expires_at: z.string().datetime().optional(),
  metadata: z.object({}).optional()
}).openapi({
  example: {
    original_url: 'https://example.com',
    user_id: '123', // just an example user ID
    custom_alias: 'example',
    expires_at: '2025-12-31T23:59:59Z',
    metadata: {} 
  }
});

const authenticateApp = async (req, res, next) => {
  try {
    // Debug: Log headers
    console.log('Auth Header:', req.headers.authorization);

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('Missing/Invalid auth header');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Missing or invalid Authorization header.',
      });
    }

    // Extract token and debug
    const token = authHeader.split(' ')[1];
    console.log('Extracted token:', token);

    // Find app and debug
    const app = await AppRepository.findByToken(token);
    console.log('Found app:', app);

    if (!app) {
      console.log('No app found for token');
      return res.status(401).json({
        error: 'Unauthorized',
        message: 'Invalid app token.',
      });
    }

    req.appContext = app;
    next();
  } catch (error) {
    console.error('Auth error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Authentication failed.',
    });
  }
};

module.exports = { createShortUrlSchema, authenticateApp };