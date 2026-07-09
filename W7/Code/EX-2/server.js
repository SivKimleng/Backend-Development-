const express = require('express');
require('dotenv').config();
const { sequelize } = require('./model');
const authorRoutes = require('./routes/authorRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Authors & Books',
    endpoints: {
      seedDatabase: 'POST /api/authors/seed',
      listAuthorsWithBooks: 'GET /api/authors',
      getBooksByAuthor: 'GET /api/authors/:id/books',
      createBookForAuthor: 'POST /api/authors/:id/books',
    },
  });
});

app.use('/api/authors', authorRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connection has been established successfully.');

    await sequelize.sync({ force: false });
    console.log('Database schema synchronized successfully.');

    app.listen(PORT, () => {
      console.log(`Server is running and listening on port ${PORT}`);
    });
  } catch (error) {
    console.error('Fatal error during server startup:', error);
    process.exit(1);
  }
};

startServer();
