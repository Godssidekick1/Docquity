// models/ShortUrl.js
const mongoose = require('mongoose');

const shortUrlSchema = new mongoose.Schema({
  short_code: String,
  original_url: String,
  user_id: String,
  created_at: { type: Date, default: Date.now },
  expires_at: Date,
  metadata: {
    source: String
  },
  custom_alias: String
});

module.exports = mongoose.model('ShortUrl', shortUrlSchema);
