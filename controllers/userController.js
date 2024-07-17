// controllers/userController.js

const User = require('../models/User');

exports.getCurrentUser = async (req, res) => {
    try {
        // Assuming userId is stored in req.userId after authentication middleware
        const user = await User.findByPk(req.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ id: user.id, username: user.username });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
};
