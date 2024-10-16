import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Grid2,
  Typography,
} from "@mui/material";
import axios from "axios";
import { FC, useEffect, useState } from "react";
import { Course, coursePage } from "./utils/coursesUtils";
import "./courses.scss";
import TitleHeader from "../titleHeader/TitleHeader";
import { useAuthContext } from "../../context/AuthContext";

const Courses: FC<coursePage> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>([]);
  const { loading, setLoading } = useAuthContext();

  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const response = await axios.get("/api/courses/courses");
        setCourses(response.data.courses);
      } catch (err) {
        console.error("Error fetching courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [setLoading]);

  return (
    <div className="Courses">
      <TitleHeader title="Courses" />
      {loading ? (
        <div>
          <CircularProgress />
        </div>
      ) : (
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
                <Card sx={{ maxWidth: 300 }} key={course.id}>
                  <CardHeader title={course.title} />
                  <CardContent sx={{ padding: 0 }}>
                    <Typography sx={{ height: "60px" }} variant="body2">
                      {course.description}
                    </Typography>
                  </CardContent>
                  <CardMedia
                    component="img"
                    height="180"
                    image="https://manual-handling.ie/wp-content/uploads/2021/03/2.png"
                    alt="Course image"
                  />
                  {children}
                </Card>
              );
            })}
        </Grid2>
      )}
    </div>
  );
};

export default Courses;
