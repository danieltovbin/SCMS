import express from 'express';
import { deleteUser, getUsers, updateUser } from './usersCont';
const router = express.Router();

router
.get('/users', getUsers)
.put('/user/:id', updateUser)
.delete('/user/:id', deleteUser)

export default router;