import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  CircularProgress,
  Grid2,
  Typography,
} from "@mui/material";
import { useEffect } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { useCoursesContext } from "../../context/CoursesContext";
import TitleHeader from "../titleHeader/TitleHeader";
import "./courses.scss";
import CoursesAdmin from "../../pages/adminPages/CoursesAdmin";

const Courses = () => {
  const { loading, isAdmin } = useAuthContext();
  const { fetchCourses, courses } = useCoursesContext();

  useEffect(() => {
    fetchCourses();
  }, []);

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
          {isAdmin ? (
            <CoursesAdmin />
          ) : (
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
                </Card>
              );
            })
          )}
        </Grid2>
      )}
    </div>
  );
};

export default Courses;
