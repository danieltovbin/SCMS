import express from 'express';
import { deleteUser, getUsers, updateUser } from './usersCont';
import { verifyAdmin } from '../../middleware/verifyAdmin';
import { verifyToken } from '../../middleware/verifyToken';
const router = express.Router();

router
.get('/users', getUsers)
.put('/user/:id',verifyToken, updateUser)
.delete('/user/:id', verifyAdmin, deleteUser)

export default router;