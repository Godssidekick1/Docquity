const { z } = require('zod');

const createShortUrlSchema = z.object({
  body: z.object({
    custom_alias: z.string().min(3, 'Custom alias must be at least 3 characters').optional(),
    expires_at: z.string().datetime('Invalid date format').optional(),
    metadata: z.record(z.any()).optional()
  })
});

const updateShortUrlSchema = z.object({
  params: z.object({
    id: z.string()
  }),
  body: z.object({
    original_url: z.string().url('Invalid URL format').optional(),
    expires_at: z.string().datetime('Invalid date format').optional(),
    metadata: z.record(z.any()).optional()
  })
});

module.exports = {
  createShortUrlSchema,
  updateShortUrlSchema
}; 