const sequelize = require('../db/database');
const Student = require('./student');
const Class = require('./class');
const AttendanceRecord = require('./attendanceRecord');

// Relationship between Student and Class
Student.belongsTo(Class, {
  foreignKey: 'classId',
  as: 'class',
});
Class.hasMany(Student, {
  foreignKey: 'classId',
  as: 'students',
  onDelete: 'SET NULL',
});

// Relationship between AttendanceRecord and Student
AttendanceRecord.belongsTo(Student, {
  foreignKey: 'studentId',
  as: 'student',
});
Student.hasMany(AttendanceRecord, {
  foreignKey: 'studentId',
  as: 'attendanceRecords',
  onDelete: 'CASCADE',
});

// Relationship between AttendanceRecord and Class
AttendanceRecord.belongsTo(Class, {
  foreignKey: 'classId',
  as: 'class',
});
Class.hasMany(AttendanceRecord, {
  foreignKey: 'classId',
  as: 'attendanceRecords',
  onDelete: 'CASCADE',
});

module.exports = { sequelize, Student, Class, AttendanceRecord };
