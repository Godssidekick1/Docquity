const express = require('express');
const mongoose = require('mongoose');
const redis = require('redis');
require('dotenv').config();

const User = require('./models/User');
const ShortUrl = require('./models/ShortUrl');

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

// Connect Redis
const redisClient = redis.createClient({ url: process.env.REDIS_URL });
redisClient.on('error', (err) => console.error('❌ Redis error:', err));

(async () => {
  await redisClient.connect();
  console.log('✅ Redis connected');

  // Healthcheck
  app.get('/healthcheck', async (req, res) => {
    const mongoStatus = mongoose.connection.readyState === 1 ? 'up' : 'down';
    const redisStatus = redisClient.isOpen ? 'up' : 'down';
    res.status(200).json({ status: 'ok', mongo: mongoStatus, redis: redisStatus });
  });

  // Init test data
  app.get('/init', async (req, res) => {
    const user = new User({ name: 'Aditya', email: 'aditya@example.com' });
    await user.save();
    await redisClient.set('test-key', 'Hello from Redis');
    res.send('✅ Initialized test data');
  });

  app.get('/fetch', async (req, res) => {
    const mongoData = await User.findOne();
    const redisData = await redisClient.get('test-key');
    res.json({ mongoData, redisData });
  });

  // CREATE short URL
  app.post('/shorten', async (req, res) => {
    try {
      const data = req.body;
      const shortUrl = new ShortUrl(data);
      await shortUrl.save();
      res.status(201).json({ message: '✅ Short URL created', shortUrl });
    } catch (err) {
      res.status(500).json({ error: '❌ Failed to create short URL', details: err.message });
    }
  });

  // READ all short URLs
  app.get('/shorten', async (req, res) => {
    try {
      const urls = await ShortUrl.find();
      res.json(urls);
    } catch (err) {
      res.status(500).json({ error: '❌ Failed to fetch URLs', details: err.message });
    }
  });

  // UPDATE a short URL by ID
  app.put('/shorten/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const updated = await ShortUrl.findByIdAndUpdate(id, req.body, { new: true });
      if (!updated) {
        return res.status(404).json({ message: '❌ URL not found' });
      }
      res.json({ message: '✅ Short URL updated', updated });
    } catch (err) {
      res.status(500).json({ error: '❌ Failed to update URL', details: err.message });
    }
  });

  // DELETE a short URL by ID
  app.delete('/shorten/:id', async (req, res) => {
    try {
      const id = req.params.id;
      const result = await ShortUrl.findByIdAndDelete(id);
      if (!result) {
        return res.status(404).json({ message: '❌ URL not found' });
      }
      res.json({ message: '✅ Short URL deleted', deleted: result });
    } catch (err) {
      res.status(500).json({ error: '❌ Failed to delete URL', details: err.message });
    }
  });

  // REDIRECT by short code
  app.get('/:short_code', async (req, res) => {
    try {
      const code = req.params.short_code;
      const shortUrl = await ShortUrl.findOne({ short_code: code });

      if (!shortUrl) {
        return res.status(404).send('❌ Short URL not found');
      }

      if (shortUrl.expires_at && new Date() > shortUrl.expires_at) {
        return res.status(410).send('⏳ This short URL has expired');
      }

      res.redirect(shortUrl.original_url);
    } catch (err) {
      res.status(500).send('❌ Server error');
    }
  });

  app.get('/', (req, res) => {
    res.send('✅ API is up and running!');
  });

  app.listen(port, () => {
    console.log(`🚀 Server running on http://localhost:${port}`);
  });
})();