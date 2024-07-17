require('dotenv').config();

module.exports = {
    secret: process.env.JWT_SECRET || 'your_secret_key',
    database: {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        name: process.env.DB_NAME || 'chat_app'
    }
};
