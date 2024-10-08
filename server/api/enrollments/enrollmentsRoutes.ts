import { express } from 'express';
import { adminEnrollUser, deleteEnrollment, enrollUser, getEnrollments, updateUserGrade } from './enrollmentsCont';
const router = express.Router();

router
.post('/enrollment/admin', adminEnrollUser)
.get('/enrollments', getEnrollments)
.post('/enrollment', enrollUser)
.put('/enrollment/:id', updateUserGrade)
.delete('/enrollment/:userId/:courseId', deleteEnrollment)



