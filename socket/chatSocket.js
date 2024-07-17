const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Message = require('../models/Message');

module.exports = (io) => {
    io.use(async (socket, next) => {
        const token = socket.handshake.auth.token;
        if (token) {
            try {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                socket.userId = decoded.userId;
                await User.update({ socketId: socket.id }, { where: { id: socket.userId } });
                next();
            } catch (error) {
                return next(new Error('Authentication error'));
            }
        } else {
            next(new Error('Authentication error'));
        }
    });

    io.on('connection', (socket) => {
        console.log('A user connected');

        socket.on('private_message', async (data) => {
            const { content, to } = data;
            const from = socket.userId;
            try {
                const message = await Message.create({ senderId: from, receiverId: to, content });
                const receiver = await User.findByPk(to);
                if (receiver && receiver.socketId) {
                    io.to(receiver.socketId).emit('private_message', {
                        content: message.content,
                        from: message.senderId
                    });
                }
                // Emit to sender as well
                io.to(socket.id).emit('private_message', {
                    content: message.content,
                    from: message.senderId
                });
            } catch (error) {
                console.error('Error sending message', error);
            }
        });

        socket.on('disconnect', async () => {
            console.log('A user disconnected');
            await User.update({ socketId: null }, { where: { id: socket.userId } });
        });
    });
};
