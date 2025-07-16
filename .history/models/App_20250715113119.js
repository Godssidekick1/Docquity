const mongoose = require('mongoose');
const { nanoid } = require('nanoid');

// Defining the App schema
const appSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, 
  },
  base_url: {
    type: String,
    required: true, 
  },
  token: {
    type: String,
    required: true,
    unique: true, 
    default: () => nanoid(32), // Generate a unique 32-character token
  },
  created_at: {
    type: Date,
    default: Date.now, //Curr date
  },
});

// Export!
module.exports = mongoose.model('App', appSchema);