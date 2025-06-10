const express = require('express');
const mongoose = require('mongoose');  
require('dotenv').config(); // Load environment variables from .env file, import mongoose and express

const userRoutes = require('./routes/userRoutes'); // Import user routes
const shortUrlRoutes = require('./routes/shortUrlRoutes'); // Import short url routes
const healthRoutes = require('./routes/healthRoutes');
const redisClient = require('./services/redisClient'); // Import redis client
const { redirectShortUrl } = require('./controllers/shortUrlController'); // Import redirect short url controller

const app = express();
const port = process.env.PORT || 8080;

app.use(express.json());

// Connect MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch((err) => console.error('❌ MongoDB error:', err));

(async () => {
  await redisClient.connect();
  console.log('✅ Redis connected');

  // Use routes
  app.use('/health', healthRoutes);
  app.use('/shorten', shortUrlRoutes); // Use short url routes
  app.use('/', userRoutes); // Use user routes
  app.get('/:short_code', redirectShortUrl); // Redirect short url

  app.get('/', (req, res) => {
    res.send('✅ API is up and running!');
  });

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
})();
