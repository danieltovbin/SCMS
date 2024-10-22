import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography
} from "@mui/material";
import { useState } from "react";
import { removeCourse, updateCourse } from "../../api/courses";
import { Course } from "../../components/courses/utils/coursesUtils";
import SnackBar from "../../components/snackbar/SnackBar";
import { useCoursesContext } from "../../context/CoursesContext";
import CourseForm from "../../components/courses/utils/CourseForm";

function CoursesAdmin() {
  const {
    courses,
    setCourses,
    setSuccessMessage,
    error,
    setError,
    successMessage,
  } = useCoursesContext();
  const [open, setOpen] = useState(false);

  const [currentCourse, setCurrentCourse] = useState({
    title: "",
    description: "",
    id: 0,
  });

  const handleRemoveCourse = async (id: number) => {
    try {
      await removeCourse(id);
      setCourses((prevCourses) =>
        prevCourses.filter((course) => course.id !== id)
      );
      setSuccessMessage("Course deleted successfully.");
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      }
    }
  };

  const handleUpdateCourse = async (event: React.FormEvent<HTMLDivElement>) => {
    event.preventDefault();
    try {
      const message = await updateCourse(currentCourse.id, {
        title: currentCourse.title,
        description: currentCourse.description,
      });

      setCourses((prevCourses) =>
        prevCourses.map((course) =>
          course.id === currentCourse.id
            ? {
                ...course,
                title: currentCourse.title,
                description: currentCourse.description,
              }
            : course
        )
      );
      setSuccessMessage(message);
      handleCloseUpdateDialog();
    } catch (error) {
      setError("A course with that title already exists");
    }
  };

  const handleOpenUpdateDialog = (course: Course) => {
    setCurrentCourse({
      id: course.id,
      title: course.title,
      description: course.description,
    });
    setOpen(true);
  };

  const handleCloseUpdateDialog = () => {
    setOpen(false);
  };

  return (
    <>
      {courses.map((course) => {
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
            <Button onClick={() => handleRemoveCourse(course.id)} color="error">
              remove
            </Button>
            <Button onClick={() => handleOpenUpdateDialog(course)}>
              update
            </Button>
          </Card>
        );
      })}

      <Dialog
        aria-labelledby="update-course-dialog-title"
        onSubmit={handleUpdateCourse}
        component="form"
        open={open}
        onClose={handleCloseUpdateDialog}
      >
        <DialogTitle>Update Course</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            type="text"
            label="text"
            fullWidth
            variant="outlined"
            value={currentCourse.title}
            onChange={(e) =>
              setCurrentCourse({ ...currentCourse, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Description"
            type="text"
            fullWidth
            variant="outlined"
            value={currentCourse.description}
            onChange={(e) =>
              setCurrentCourse({
                ...currentCourse,
                description: e.target.value,
              })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseUpdateDialog} color="primary">
            Cancel
          </Button>
          <Button type="submit" color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
      <CourseForm />
      <SnackBar
        error={error}
        setError={setError}
        successMessage={successMessage}
        setSuccessMessage={setSuccessMessage}
      />
    </>
  );
}

export default CoursesAdmin;
