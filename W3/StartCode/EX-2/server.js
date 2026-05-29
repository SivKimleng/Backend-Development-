// server.js
import express from 'express';
import courses from "./course.js";
const app = express();
const PORT = 3000;

// Route: GET /departments/:dept/courses
app.get('/departments/:dept/courses', (req, res) => {
    const { dept } = req.params;
    const { level, minCredits, maxCredits, semester, instructor } = req.query;
    const normalizedDept = dept.toUpperCase();
    const parsedMinCredits = minCredits !== undefined ? Number(minCredits) : undefined;
    const parsedMaxCredits = maxCredits !== undefined ? Number(maxCredits) : undefined;

    if (
        (minCredits !== undefined && Number.isNaN(parsedMinCredits)) ||
        (maxCredits !== undefined && Number.isNaN(parsedMaxCredits))
    ) {
        return res.status(400).json({
            error: 'Invalid credit range. minCredits and maxCredits must be numbers.'
        });
    }

    if (
        parsedMinCredits !== undefined &&
        parsedMaxCredits !== undefined &&
        parsedMinCredits > parsedMaxCredits
    ) {
        return res.status(400).json({
            error: 'Invalid credit range. minCredits cannot be greater than maxCredits.'
        });
    }

    const filteredCourses = courses.filter((course) => {
        if (course.department !== normalizedDept) return false;
        if (level && course.level !== level.toLowerCase()) return false;
        if (parsedMinCredits !== undefined && course.credits < parsedMinCredits) return false;
        if (parsedMaxCredits !== undefined && course.credits > parsedMaxCredits) return false;
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
