const User = require('../models/User');
const redisClient = require('../services/redisClient');

exports.initTestData = async (req, res) => {
  const user = new User({ name: 'Aditya', email: 'aditya@example.com' });
  await user.save();
  await redisClient.set('test-key', 'Hello from Redis');
  res.send('Initialized test data');
};

exports.fetchTestData = async (req, res) => {
  const mongoData = await User.findOne();
  const redisData = await redisClient.get('test-key');
  res.json({ mongoData, redisData });
};