const { DataTypes } = require('sequelize');
const sequelize = require('../db/database');

const AttendanceRecord = sequelize.define('AttendanceRecord', {
  date: DataTypes.DATEONLY,
  status: {
    type: DataTypes.ENUM('Present', 'Absent', 'Late'),
    defaultValue: 'Present',
  },
});

module.exports = AttendanceRecord;
