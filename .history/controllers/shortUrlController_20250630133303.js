const { nanoid } = require('nanoid');
const ShortUrl = require('../models/ShortUrl');

exports.createShortUrl = async (req, res, next) => {
  try {
    const { original_url, user_id, custom_alias, expires_at, metadata } = req.body;

    const _id = nanoid(); // Generate a custom ID using nanoid
    const short_code = custom_alias || `${_id}-${nanoid(5)}`; // Generate short code if no alias is provided

    const shortUrl = new ShortUrl({ _id, original_url, user_id, short_code, expires_at, metadata });
    await shortUrl.save();

    res.status(201).json({
      message: 'Short URL created successfully',
      shortUrl: {
        _id, // Include the generated _id in the response
        short_code,
        original_url,
        user_id,
        full_short_url: `http://localhost:8080/${short_code}`,
      },
    });
  } catch (err) {
    next(err); // Pass the error to the error handling middleware
  }
};

exports.getAllShortUrls = async (req, res) => {
  try {
    const urls = await ShortUrl.find();
    res.json(urls);
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to fetch URLs', details: err.message });
  }
};

exports.updateShortUrl = async (req, res) => {
  try {
    const updated = await ShortUrl.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: '❌ URL not found' });
    res.json({ message: '✅ Short URL updated', updated });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to update URL', details: err.message });
  }
};

exports.deleteShortUrl = async (req, res) => {
  try {
    const deleted = await ShortUrl.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: '❌ URL not found' });
    res.json({ message: '✅ Short URL deleted', deleted });
  } catch (err) {
    res.status(500).json({ error: '❌ Failed to delete URL', details: err.message });
  }
};

exports.redirectShortUrl = async (req, res) => {
  try {
    const code = req.params.short_code;
    const shortUrl = await ShortUrl.findOne({ short_code: code });

    if (!shortUrl) return res.status(404).send('Short URL not found');
    if (shortUrl.expires_at && new Date() > shortUrl.expires_at)
      return res.status(410).send('⏳ This short URL has expired');

    res.redirect(shortUrl.original_url);
  } catch {
    res.status(500).send('Server error');
  }
};
