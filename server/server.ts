import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connection from './config/dbConn';
import { createCoursesIfNotExists } from './seeders/seedCourses';
import { createUsersIfNotExists } from './seeders/seedUsers';
import { createEnrollmentsIfNotExists } from './seeders/seedEnrollments';
import { errorHandler } from './middleware/errorHandler';

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser())
connection
createUsersIfNotExists()
createCoursesIfNotExists()
createEnrollmentsIfNotExists()

import authRouter from './api/auth/authRoutes'
app.use("/api/auth", authRouter)

import usersRouter from './api/users/usersRoutes'
app.use("/api/users", usersRouter)

import enrollmentRouter from './api/enrollments/enrollmentsRoutes'
app.use("/api/enrollments", enrollmentRouter)

import coursesRouter from './api/courses/coursesRoutes'
app.use("/api/courses", coursesRouter)

app.use(errorHandler)

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});