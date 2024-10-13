import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Grid2,
  Typography,
} from "@mui/material";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Course, coursePage } from "./utils/coursesUtils";
import './courses.scss';

const Courses: FC<coursePage> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("/api/courses/courses");
        setCourses(response.data.courses);
      } catch (err) {
        console.error("Error fetching courses");
      }
    };
    fetchCourses();
  }, []);

  return (
    <div className="Courses">
      <Grid2
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        container
        rowSpacing={8}
        columnSpacing={{ xs: 2, sm: 1, md: 4 }}
      >
        {courses &&
          courses.map((course) => {
            return (
              <Card sx={{ maxWidth: 370 }} key={course.id}>
                <CardHeader title={course.title} />
                <CardContent sx={{ padding: 0 }}>
                  <Typography sx={{ height: "60px" }} variant="body2">
                    {course.description}
                  </Typography>
                </CardContent>
                <CardMedia
                  component="img"
                  height="180"
                  image="https://media.geeksforgeeks.org/wp-content/uploads/20240502160218/Physics.webp"
                  alt=""
                />
                {children}
              </Card>
            );
          })}
      </Grid2>
    </div>
  );
};

export default Courses;
