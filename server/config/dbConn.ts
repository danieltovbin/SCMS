import mysql from "mysql2";
import dotenv from "dotenv";
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
  });
});

export default connection;
