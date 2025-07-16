const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

// Define the App schema
const appSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensure app names are unique
  },
  base_url: {
    type: String,
    required: true, // The app's base domain or URL
  },
  token: {
    type: String,
    required: true,
    unique: true, // Ensure tokens are unique
    default: () => nanoid(32), // Generate a unique 32-character token
  },
  created_at: {
    type: Date,
    default: Date.now, // Default to the current date
  },
});

// Export the App model
module.exports = mongoose.model('App', appSchema);