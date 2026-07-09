const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Book = sequelize.define('Book', {
  title: DataTypes.STRING,
  publicationYear: DataTypes.INTEGER,
  pages: DataTypes.INTEGER
});

module.exports = Book;
