const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Author = sequelize.define('Author', {
  name: DataTypes.STRING,
  birthYear: DataTypes.INTEGER
});

module.exports = Author;
