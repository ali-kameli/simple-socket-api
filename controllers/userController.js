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

exports.getUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: ['id', 'username'] });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    const { roomId } = req.params;
    try {
        const messages = await Message.findAll({ where: { roomId } });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
};
