const express = require('express');
const { Sequelize, DataTypes, Op } = require('sequelize');
const bodyParser = require('body-parser');

// Set up Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Database setup (SQLite example)
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite',  // Change this path if necessary
});

// Define the Contact model
const Contact = sequelize.define('Contact', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  phoneNumber: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  linkedId: {
    type: DataTypes.INTEGER,
    allowNull: true,  // To link contacts
  },
  linkPrecedence: {
    type: DataTypes.STRING,
    allowNull: false,  // Can be 'primary' or 'secondary'
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
  },
  deletedAt: {
    type: DataTypes.DATE,
    allowNull: true,
  },
});

// Sync the database with the model
sequelize.sync({ force: true })  // Use { force: true } during development to recreate the table
  .then(() => {
    console.log('Database & tables synced!');
  })
  .catch((err) => {
    console.error('Error syncing the database:', err);
  });

// Test database connection
sequelize.authenticate()
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection error:', err));

// Define /identify endpoint
app.post('/identify', async (req, res) => {
  const { email, phoneNumber } = req.body;

  // Validate input
  if (!email || !phoneNumber) {
    return res.status(400).json({ message: 'Email and phone number are required' });
  }

  try {
    // Try to find an existing contact with the same email or phone number
    let contact = await Contact.findOne({
      where: {
        [Op.or]: [{ email }, { phoneNumber }],
      },
    });

    // If no contact is found, create a new primary contact
    if (!contact) {
      contact = await Contact.create({
        email,
        phoneNumber,
        linkPrecedence: 'primary',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      return res.status(200).json({
        primaryContactId: contact.id,
        emails: [email],
        phoneNumbers: [phoneNumber],
        secondaryContactIds: [],
      });
    }

    // If a contact is found, create a secondary contact entry
    const secondaryContact = await Contact.create({
      email,
      phoneNumber,
      linkedId: contact.id,
      linkPrecedence: 'secondary',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    // Respond with consolidated contact information
    return res.status(200).json({
      primaryContactId: contact.id,
      emails: [contact.email, email],
      phoneNumbers: [contact.phoneNumber, phoneNumber],
      secondaryContactIds: [secondaryContact.id],
    });
  } catch (error) {
    // Log error for debugging
    console.error('Error processing contact:', error);
    // Respond with a generic error message
    return res.status(500).json({ message: 'An error occurred', error: error.message });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
