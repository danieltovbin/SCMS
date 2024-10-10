import express from 'express';
import { createCourse, deleteCourse, getCourses, updateCourse } from './coursesCont';
import { verifyAdmin } from '../../middleware/verifyAdmin';
const router = express.Router();

router
.get('/courses',getCourses)
.post('/course',verifyAdmin, createCourse)
.put('/course/:id',verifyAdmin, updateCourse)
.delete('/course/:id',verifyAdmin, deleteCourse)

export default router;