import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connection from './config/dbConn';
import { createCoursesIfNotExists } from './seeders/seedCourses';
import { createUsersIfNotExists } from './seeders/seedUsers';
import { createEnrollmentsIfNotExists } from './seeders/seedEnrollments';

dotenv.config()
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(cookieParser())
connection
createCoursesIfNotExists()
createUsersIfNotExists()
createEnrollmentsIfNotExists()

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});