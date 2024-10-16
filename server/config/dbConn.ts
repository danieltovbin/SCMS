import mysql from "mysql2";
import dotenv from "dotenv";
import { createUsersIfNotExists } from "../seeders/seedUsers";
import { createCoursesIfNotExists } from "../seeders/seedCourses";
import { createEnrollmentsIfNotExists } from "../seeders/seedEnrollments";
dotenv.config();
const { USER, PASSWORD } = process.env;

const connection = mysql.createConnection({
  host: "localhost",
  user: USER,
  password: PASSWORD,
  database: "student_course_management",
});

connection.connect((err) => {
  if (err) throw err;
  console.log("Connected!");

  connection.query("CREATE DATABASE IF NOT EXISTS student_course_management;", (err) => {
    if (err) throw err;
    console.log("Created database or already exists!");
    createUsersIfNotExists();
    createCoursesIfNotExists();
    createEnrollmentsIfNotExists();
  });
});

export default connection;
