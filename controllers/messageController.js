const { Op } = require('sequelize');
const Message = require('../models/Message');

exports.getMessages = async (req, res) => {
    const { userId } = req;
    const { receiverId } = req.params;
    try {
        const messages = await Message.findAll({
            where: {
                [Op.or]: [
                    { senderId: userId, receiverId },
                    { senderId: receiverId, receiverId: userId }
                ]
            }
        });
        res.json(messages);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching messages', error });
    }
};

exports.sendMessage = async (req, res) => {
    const { userId } = req;
    const { receiverId, content } = req.body;
    try {
        const message = await Message.create({ senderId: userId, receiverId, content });
        res.status(201).json(message);
    } catch (error) {
        res.status(500).json({ message: 'Error sending message', error });
    }
};
