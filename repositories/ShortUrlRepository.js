const ShortUrl = require('../models/ShortUrl');

class ShortUrlRepository {
    async create(shortUrlData) {
        const shortUrl = new ShortUrl(shortUrlData);
        return await shortUrl.save();
    }

    async findAll() {
        return await ShortUrl.find();
    }

    async findById(id) {
        return await ShortUrl.findById(id);
    }

    async findByShortCode(shortCode) {
        return await ShortUrl.findOne({ short_code: shortCode });
    }

    async update(id, updateData) {
        return await ShortUrl.findByIdAndUpdate(id, updateData, { new: true });
    }

    async delete(id) {
        return await ShortUrl.findByIdAndDelete(id);
    }
}

module.exports = new ShortUrlRepository(); 