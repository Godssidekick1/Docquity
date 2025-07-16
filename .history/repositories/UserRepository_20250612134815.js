const User = require('../models/User');

class UserRepository {
    async create(userData) {
        const user = new User(userData);
        return await user.save();
    }

    async findOne() {
        return await User.findOne();
    }
}

module.exports = new UserRepository(); 