const { DataTypes } = require('sequelize');
const sequelize = require('../database');
const User = require('./User');

const Message = sequelize.define('Message', {
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    senderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    receiverId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    roomId: {
        type: DataTypes.STRING,
        allowNull: false,
    }
});

User.hasMany(Message, { foreignKey: 'senderId' });
User.hasMany(Message, { foreignKey: 'receiverId' });

module.exports = Message;
