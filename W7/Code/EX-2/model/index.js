const sequelize = require('../db/database');
const Author = require('./author');
const Book = require('./book');

Author.hasMany(Book, {
  foreignKey: 'authorId',
  as: 'books',
  onDelete: 'CASCADE',
});

Book.belongsTo(Author, {
  foreignKey: 'authorId',
  as: 'author',
});

module.exports = { sequelize, Author, Book };
