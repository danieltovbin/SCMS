import express from 'express';
import { adminEnrollUser, deleteEnrollment, enrollUser, getEnrollments, updateUserGrade } from './enrollmentsCont';
import { verifyAdmin } from '../../middleware/verifyAdmin';
import { verifyToken } from '../../middleware/verifyToken';
const router = express.Router();

router
.post('/enrollment/admin',verifyAdmin, adminEnrollUser)
.get('/enrollments',verifyToken, getEnrollments)
.post('/enrollment',verifyToken, enrollUser)
.patch('/enrollment/:id',verifyAdmin, updateUserGrade)
.delete('/enrollment/:id',verifyAdmin, deleteEnrollment)


export default router;