const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');

router.post('/seed', attendanceController.seedDatabase);

router.post('/attendance', attendanceController.markAttendance);

router.get('/attendance', attendanceController.getStudentAttendanceOnDate);

router.get('/classes/:id/attendance', attendanceController.getClassAttendance);

router.get('/students/:id/attendance', attendanceController.getStudentAttendanceSummary);

module.exports = router;
