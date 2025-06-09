// models/ShortUrl.js
const mongoose = require('mongoose');


const shortUrlSchema = new mongoose.Schema({
  _id: String, // Use nanoid as custom ID
  short_code: String, // Will be custom_alias + '-' + _id
  original_url: { type: String, required: true },
  user_id: String,
  created_at: { type: Date, default: Date.now },
  expires_at: Date,
  metadata: {
    source: String
  },
  custom_alias: String
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);