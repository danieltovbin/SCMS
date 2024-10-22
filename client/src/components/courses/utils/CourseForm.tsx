import { FormEvent, useState } from "react";
import { useAuthContext } from "../../../context/AuthContext";
import { createCourse } from "../../../api/courses";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { useCoursesContext } from "../../../context/CoursesContext";

function CourseForm() {
  const { loading, setLoading } = useAuthContext();
  const { fetchCourses } = useCoursesContext();
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await createCourse(title, description);

      if (response) {
        setDescription("");
        setTitle("");
        setMessage("created course successfully");
        await fetchCourses();
      }
    } catch (err) {
      console.error("Error submiting course:", err);
      setMessage("Failed to create course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableContainer className="enroll-form">
      <h2>Create New Course</h2>
      <form onSubmit={handleSubmit}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Enter the course title"
                  label="Title"
                  variant="standard"
                  required
                />
              </TableCell>

              <TableCell className="form-group">
                <TextField
                  type="text"
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Enter the course description"
                  label="Description"
                  variant="standard"
                  required
                />
              </TableCell>
              <TableCell>
                <Button type="submit" disabled={loading}>
                  {loading ? "Enrolling..." : "Enroll"}
                </Button>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </form>

      {message && <p>{message}</p>}
    </TableContainer>
  );
}

export default CourseForm;
