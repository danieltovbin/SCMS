import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
} from "@mui/material";
import { FC, FormEvent, useState } from "react";
import { Enrollments } from "../../../api/enrollments";
import { useAuthContext } from "../../../context/AuthContext";

interface EnrollFormProps {
  handleFetch: () => void;
}
const EnrollForm: FC<EnrollFormProps> = ({ handleFetch }) => {
  const { loading, setLoading } = useAuthContext();
  const [username, setUsername] = useState<string>("");
  const [grade, setGrade] = useState<number>(0);
  const [courseName, setCourseName] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setLoading(true);
    try {
      const response = await Enrollments(username, courseName, grade);

      if (response) {
        setUsername("");
        setGrade(0);
        setCourseName("");
        setMessage("User enrolled successfully");
        await handleFetch();
      }
    } catch (err) {
      console.error("Error submiting enrollment:", err);
      setMessage("Failed to submit user in course");
    } finally {
      setLoading(false);
    }
  };

  return (
    <TableContainer className="enroll-form">
      <h2>Enroll User in Course</h2>
      <form onSubmit={handleSubmit}>
        <Table>
          <TableBody>
            <TableRow>
              <TableCell>
                <TextField
                  type="text"
                  id="username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Enter the username"
                  label="Username"
                  variant="standard"
                  required
                />
              </TableCell>

              <TableCell className="form-group">
                <TextField
                  type="text"
                  id="courseName"
                  value={courseName}
                  onChange={(e) => setCourseName(e.target.value)}
                  placeholder="Enter the course name"
                  label="courseName"
                  variant="standard"
                  required
                />
              </TableCell>
              <TableCell className="form-group">
                <TextField
                  type="number"
                  id="grade"
                  value={grade}
                  onChange={(e) => setGrade(Number(e.target.value))}
                  placeholder="Enter a grade"
                  label="grade"
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
};

export default EnrollForm;
