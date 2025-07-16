// models/ShortUrl.js
const mongoose = require('mongoose');


// const shortUrlSchema = new mongoose.Schema({
//   _id: String, // Use nanoid as custom ID
//   short_code: String, // Will be custom_alias + '-' + _id
//   original_url: { type: String, required: true },
//   user_id: String,
//   created_at: { type: Date, default: Date.now },
//   expires_at: Date,
//   metadata: {
//     source: String
//   },
//   custom_alias: String
// });

const shortUrlSchema = new mongoose.Schema({
  original_url: { type: String, required: true },
  short_code: { type: String, required: true, unique: true },
  expires_at: { type: Date },
  metadata: { type: mongoose.Schema.Types.Mixed },
  app_id: { type: mongoose.Schema.Types.ObjectId, ref: 'App', required: true }
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);

// openapi documentation
const openapi = {
  openapi: "3.0.0",
  info: {
    title: "URL Shortener API",
    version: "1.0.0",
    description: "API for creating and managing shortened URLs"
  },
  servers: [
    {
      url: "http://localhost:8080",
      description: "Local development server"
    }
  ],
  paths: {
    "/healthcheck": {
      get: {
        summary: "Check API health",
        description: "Returns the health status of the API and its dependencies",
        responses: {
          "200": {
            description: "Health check successful",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    status: { type: "string" },
                    mongo: { type: "string" },
                    redis: { type: "string" }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/shorten": {
      post: {
        summary: "Create a new short URL",
        description: "Creates a new shortened URL with optional custom alias and required user ID",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["original_url", "user_id"],
                properties: {
                  original_url: {
                    type: "string",
                    format: "uri",
                    example: "https://example.com"
                  },
                  user_id: {
                    type: "string",
                    format: "uuid",
                    example: "123e4567-e89b-12d3-a456-426614174000"
                  },
                  custom_alias: {
                    type: "string",
                    example: "example-alias"
                  },
                  expires_at: {
                    type: "string",
                    format: "date-time",
                    example: "2025-12-31T23:59:59Z"
                  },
                  metadata: {
                    type: "object",
                    properties: {
                      source: {
                        type: "string",
                        example: "web"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        responses: {
          "201": {
            description: "Short URL created successfully",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: { type: "string" },
                    shortUrl: {
                      type: "object",
                      properties: {
                        short_code: {
                          type: "string",
                          example: "example-alias-123e4567"
                        },
                        original_url: {
                          type: "string",
                          format: "uri",
                          example: "https://example.com"
                        },
                        user_id: {
                          type: "string",
                          format: "uuid",
                          example: "123e4567-e89b-12d3-a456-426614174000"
                        },
                        full_short_url: {
                          type: "string",
                          format: "uri",
                          example: "http://localhost:8080/example-alias-123e4567"
                        }
                      }
                    }
                  }
                }
              }
            }
          },
          "400": {
            description: "Validation error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    error: { type: "string" },
                    details: {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          path: { type: "string" },
                          message: { type: "string" }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};

module.exports.openapi = openapi;