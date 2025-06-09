const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const shortUrlRoutes = require('./routes/shortUrlRoutes');
const redisClient = require('./services/redisClient');
const { redirectShortUrl } = require('./controllers/shortUrlController');

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

  app.get('/healthcheck', async (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'up' : 'down';
    const redisStatus = redisClient.isOpen ? 'up' : 'down';
    res.status(200).json({ status: 'ok', mongo: mongoStatus, redis: redisStatus });
  });

  app.use('/shorten', shortUrlRoutes);
  app.use('/', userRoutes);

  // ⚠️ This must be last
  app.get('/:short_code', redirectShortUrl);

  app.get('/', (req, res) => {
    res.send('✅ API is up and running!');
  });

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
})();
