// models/index.js

const sequelize = require('../config/database');
const Contact = require('./contact');

// Sync the database to create the tables
sequelize.sync({ force: true })  // Use { force: true } to drop and recreate the tables each time
  .then(() => console.log("Database synced successfully"))
  .catch(err => console.error("Error syncing database:", err));
