const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const Student = sequelize.define('Student', {
  name: DataTypes.STRING,
  email: {
    type: DataTypes.STRING,
    unique: true,
  }
});

module.exports = Student;
