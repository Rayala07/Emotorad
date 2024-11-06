// config/database.js

const { Sequelize } = require('sequelize');

// Setup SQLite database connection
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite', // Path to your database file
});

module.exports = sequelize;
