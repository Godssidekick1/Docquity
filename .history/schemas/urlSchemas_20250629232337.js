const { z } = require('zod');
const { extendZodWithOpenApi } = require('zod-openapi');

// Extend Zod with OpenAPI functionality
extendZodWithOpenApi(z);

// Create Short URL Schema
const createShortUrlSchema = z.object({
  original_url: z.string().url('Invalid URL format'),
  user_id: z.string().uuid('Invalid UserID format'), // UserID must be a valid UUID
  custom_alias: z.string().min(3, 'Custom alias must be at least 3 characters').optional(),
  expires_at: z.string().datetime().optional(),
  metadata: z.object({}).optional()
}).openapi({
  example: {
    original_url: 'https://example.com',
    user_id: '123', // Example UUID
    custom_alias: 'example',
    expires_at: '2025-12-31T23:59:59Z',
    metadata: {}
  }
});

module.exports = { createShortUrlSchema };