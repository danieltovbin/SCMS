import express from 'express';
import { login, logout, register } from './authCont';
const router = express.Router();

router 
.post('/register', register)
.post('/login', login)
.post('/logout', logout)



export default router;