import { TableCell, TextField } from "@mui/material";
import { FormEvent, useState } from "react";
import { createCourse } from "../../../api/courses";
import { useAuthContext } from "../../../context/AuthContext";
import { useCoursesContext } from "../../../context/CoursesContext";
import CreateForm from "../../form/CreateForm";

function CourseForm() {
  const { setLoading } = useAuthContext();
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
    <>
      <CreateForm
        titleName="Course"
        textLoading="Creating new Course..."
        textDefault="Create new Course"
        onSubmit={handleSubmit}
        message={message}
      >
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
      </CreateForm>
    </>
  );
}

export default CourseForm;
