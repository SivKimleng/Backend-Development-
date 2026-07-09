const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Class = sequelize.define('Class', {
  name: DataTypes.STRING,
  code: {
    type: DataTypes.STRING,
    unique: true,
  }
});

module.exports = Class;
