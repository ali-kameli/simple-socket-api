const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const messageRoutes = require('./routes/messageRoutes');
const userRoutes = require('./routes/userRoutes');
const { Server } = require('socket.io');
const http = require('http');
const chatSocket = require('./socket/chatSocket');
const sequelize = require('./database');

const app = express();

app.use(bodyParser.json());
app.use(cors());
app.use('/api/auth', authRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);

const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    }
});

chatSocket(io);

sequelize.sync({ force: false })
    .then(() => console.log('Database synced'))
    .catch(err => console.log('Error syncing database:', err));

module.exports = server;
