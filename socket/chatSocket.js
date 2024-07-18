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
        console.log('A user connected with socket id:', socket.id);

        socket.on('join_room', (roomId) => {
            socket.join(roomId);
            console.log(`User with socket id ${socket.id} joined room ${roomId}`);
        });

        socket.on('private_message', async (data) => {
            const { content, to, roomId } = data;
            const from = socket.userId;
            try {
                const message = await Message.create({ senderId: from, receiverId: to, content, roomId });
                const receiver = await User.findByPk(to);
                if (receiver && receiver.socketId) {
                    io.to(roomId).emit('private_message', {
                        content: message.content,
                        from: message.senderId
                    });
                }
            } catch (error) {
                console.error('Error sending message', error);
            }
        });

        socket.on('disconnect', async () => {
            console.log('A user disconnected with socket id:', socket.id);
            await User.update({ socketId: null }, { where: { id: socket.userId } });
        });

        // Notify all clients about the updated user list
        User.findAll({ attributes: ['id', 'username'] }).then(users => {
            io.emit('user_list', users);
        }).catch(error => {
            console.error('Error fetching users', error);
        });
    });
};
