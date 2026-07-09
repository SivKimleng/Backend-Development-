const { Student, Class, AttendanceRecord } = require('../model');

const seedDatabase = async (req, res) => {
  try {
    await AttendanceRecord.destroy({ where: {} });
    await Student.destroy({ where: {} });
    await Class.destroy({ where: {} });

    // Create classes
    const classA = await Class.create({ name: 'Web Development', code: 'WD101' });
    const classB = await Class.create({ name: 'Mobile Programming', code: 'MP102' });

    // Create students in those classes
    const student1 = await Student.create({ name: 'John Doe', email: 'john@example.com', classId: classA.id });
    const student2 = await Student.create({ name: 'Jane Smith', email: 'jane@example.com', classId: classA.id });
    const student3 = await Student.create({ name: 'Bob Johnson', email: 'bob@example.com', classId: classB.id });

    res.status(201).json({
      message: 'Database successfully seeded with classes and students!',
      data: {
        classes: [classA, classB],
        students: [student1, student2, student3],
      },
    });
  } catch (error) {
    console.error('Error seeding database:', error);
    res.status(500).json({ error: 'Failed to seed database', details: error.message });
  }
};

const markAttendance = async (req, res) => {
  try {
    const studentId = req.query.studentId || req.body.studentId;
    const date = req.query.date || req.body.date;
    const classId = req.body.classId || req.query.classId;
    const status = req.body.status || req.query.status || 'Present';

    if (!studentId || !date) {
      return res.status(400).json({ error: 'StudentId and Date are required' });
    }

    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({ error: `Student with ID ${studentId} is not found` });
    }

    const resolvedClassId = classId || student.classId;
    if (!resolvedClassId) {
      return res.status(400).json({
        error: 'ClassId must be provided in the request body/query or set on the student profile',
      });
    }

    const classObj = await Class.findByPk(resolvedClassId);
    if (!classObj) {
      return res.status(404).json({ error: `Class with ID ${resolvedClassId} is not found` });
    }

    let record = await AttendanceRecord.findOne({
      where: {
        studentId,
        date,
        classId: resolvedClassId,
      },
    });

    if (record) {
      record.status = status;
      await record.save();
    } else {
      record = await AttendanceRecord.create({
        studentId,
        date,
        classId: resolvedClassId,
        status,
      });
    }

    res.status(200).json({
      message: 'Attendance marked successfully',
      record,
    });
  } catch (error) {
    console.error('Error marking attendance:', error);
    res.status(500).json({ error: 'Failed to mark attendance', details: error.message });
  }
};

const getStudentAttendanceOnDate = async (req, res) => {
  try {
    const studentId = req.query.studentId;
    const date = req.query.date;

    if (!studentId || !date) {
      return res.status(400).json({ error: 'StudentId and Date are required' });
    }

    const record = await AttendanceRecord.findOne({
      where: { studentId, date },
      include: [
        { model: Student, as: 'student' },
        { model: Class, as: 'class' },
      ],
    });

    if (!record) {
      return res.status(404).json({ error: 'No attendance record found for this student on this date' });
    }

    res.status(200).json(record);
  } catch (error) {
    console.error('Error fetching attendance on date:', error);
    res.status(500).json({ error: 'Failed to fetch attendance record', details: error.message });
  }
};

const getClassAttendance = async (req, res) => {
  try {
    const classId = req.params.id;

    const classObj = await Class.findByPk(classId);
    if (!classObj) {
      return res.status(404).json({ error: `Class with ID ${classId} is not found` });
    }

    const records = await AttendanceRecord.findAll({
      where: { classId },
      include: [{ model: Student, as: 'student' }],
    });

    res.status(200).json({
      class: classObj,
      records,
    });
  } catch (error) {
    console.error('Error fetching class attendance:', error);
    res.status(500).json({ error: 'Failed to fetch class attendance', details: error.message });
  }
};

const getStudentAttendanceSummary = async (req, res) => {
  try {
    const studentId = req.params.id;

    const student = await Student.findByPk(studentId, {
      include: [{ model: Class, as: 'class' }],
    });

    if (!student) {
      return res.status(404).json({ error: `Student with ID ${studentId} is not found` });
    }

    const records = await AttendanceRecord.findAll({
      where: { studentId },
      include: [{ model: Class, as: 'class' }],
    });

    const summary = {
      totalDays: records.length,
      Present: 0,
      Absent: 0,
      Late: 0,
    };

    records.forEach(rec => {
      if (summary[rec.status] !== undefined) {
        summary[rec.status]++;
      }
    });

    res.status(200).json({
      student,
      summary,
      records,
    });
  } catch (error) {
    console.error('Error fetching student attendance summary:', error);
    res.status(500).json({ error: 'Failed to fetch student attendance summary', details: error.message });
  }
};

module.exports = {
  seedDatabase,
  markAttendance,
  getStudentAttendanceOnDate,
  getClassAttendance,
  getStudentAttendanceSummary
};
