const express = require('express');
require('dotenv').config();
const { sequelize } = require('./model');
const attendanceRoutes = require('./routes/attendanceRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to EX-3 Attendance System API',
    endpoints: {
      seed: 'POST /seed',
      markAttendance: 'POST /attendance?studentId=1&date=2025-06-17',
      getAttendance: 'GET /attendance?studentId=1&date=2025-06-17',
      getClassAttendance: 'GET /classes/:id/attendance',
      getStudentSummary: 'GET /students/:id/attendance',
    },
  });
});

app.use('/', attendanceRoutes);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL Database connection has been established successfully.');

    // sync({ force: false }) creates the new tables for Student, Class, and AttendanceRecord
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
