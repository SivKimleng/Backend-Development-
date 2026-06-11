// server.js
import express from 'express';
import courses from "./course.js";
import logger from "./logger.js";
import validateQuery from "./validateQuery.js";
import auth from "./auth.js";

const app = express();
const PORT = 3000;

app.use(logger);

// Route: GET /departments/:dept/courses
app.get('/departments/:dept/courses', auth, validateQuery, (req, res) => {
    const { dept } = req.params;
    const { level, semester, instructor } = req.query;
    const normalizedDept = dept.toUpperCase();
    const { minCredits, maxCredits } = req.validatedCredits;

    const filteredCourses = courses.filter((course) => {
        if (course.department !== normalizedDept) return false;
        if (level && course.level !== level.toLowerCase()) return false;
        if (minCredits !== undefined && course.credits < minCredits) return false;
        if (maxCredits !== undefined && course.credits > maxCredits) return false;
        if (semester && course.semester !== semester.toLowerCase()) return false;
        if (
            instructor &&
            !course.instructor.toLowerCase().includes(instructor.toLowerCase())
        ) {
            return false;
        }
        return true;
    });

    return res.json({
        results: filteredCourses,
        meta: {
            total: filteredCourses.length
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
