import express from 'express';
import { createCourse, deleteCourse, getCourses, updateCourse } from './coursesCont';
const router = express.Router();

router
.get('/courses',getCourses)
.post('/course', createCourse)
.put('/course/:id', updateCourse)
.delete('/course/:id', deleteCourse)

export default router;