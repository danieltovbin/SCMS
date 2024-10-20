import {
  Alert,
  Button,
  Snackbar,
  TableCell,
  TableRow,
  TextField,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getEnrollments,
  removeEnrollment,
  updateUserGrade,
} from "../../api/enrollments";
import { useAuthContext } from "../../context/AuthContext";
import TableComponent from "../Table/TableComponent";
import EnrollForm from "./utils/EnrollForm";
import { Enrollment } from "./utils/enrollmentsUtil";

const Enrollments = () => {
  const { isAuthenticated, isAdmin } = useAuthContext();
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const headers = isAdmin
    ? ["Id", "Username", "Course", "Grade"]
    : ["Course", "Grade"];

  const handleFetch = async () => {
    try {
      if (!isAuthenticated) {
        navigate("/home");
      }
      const data = await getEnrollments();
      setEnrollments(data.enrollments);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError("Failed to fetch enrollments");
    }
  };

  const handleUpdateGrade = async (enrollmentId: number, newGrade: number) => {
    try {
      if (isAdmin) {
        const response = await updateUserGrade(enrollmentId, newGrade);
        setSuccessMessage(response);
        handleFetch();
      }
    } catch (err) {
      console.error("Error updating grade:", err);
      setError("Failed to update grade");
    }
  };

  const handleRemoveEnrollment = async (enrollmentId: number) => {
    try {
      if (isAdmin) {
        await removeEnrollment(enrollmentId);
        handleFetch();
      }
    } catch (err) {
      console.error("Error deleting enrollment", err);
    }
  };

  useEffect(() => {
    handleFetch();
  }, []);

  return (
    <div>
      <h2>Enrollments</h2>
      <TableComponent headers={headers}>
        {enrollments.map((enrollment) => (
          <TableRow key={enrollment.enrollmentId} sx={{ padding: 0 }}>
            {isAdmin && (
              <TableCell align="center">{enrollment.enrollmentId}</TableCell>
            )}
            {isAdmin && (
              <TableCell align="center">{enrollment.username}</TableCell>
            )}
            <TableCell align="center">{enrollment.courseName}</TableCell>
            <TableCell align="center">
              {isAdmin ? (
                <TextField
                  type="number"
                  value={enrollment.grade !== null ? enrollment.grade : 0}
                  onChange={(e) => {
                    const newGrade = parseFloat(e.target.value);
                    setEnrollments((prevEnrollments) =>
                      prevEnrollments.map((enroll) =>
                        enroll.enrollmentId === enrollment.enrollmentId
                          ? { ...enroll, grade: newGrade }
                          : enroll
                      )
                    );
                  }}
                  onBlur={() =>
                    handleUpdateGrade(enrollment.enrollmentId, enrollment.grade)
                  }
                />
              ) : (
                enrollment.grade
              )}
            </TableCell>
            {isAdmin && (
              <TableCell
                align="right"
                sx={{ padding: 1, textAlign: "initial", width: "15%" }}
              >
                <Button
                  onClick={() =>
                    handleUpdateGrade(enrollment.enrollmentId, enrollment.grade)
                  }
                  sx={{ fontSize: "10px", marginLeft: 1 }}
                  variant="contained"
                >
                  Update
                </Button>
                <Button
                  onClick={() =>
                    handleRemoveEnrollment(enrollment.enrollmentId)
                  }
                  sx={{ fontSize: "10px", marginLeft: 1 }}
                  variant="contained"
                  color="error"
                >
                  Remove
                </Button>
              </TableCell>
            )}
          </TableRow>
        ))}
      </TableComponent>
      {isAdmin && <EnrollForm handleFetch={handleFetch} />}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert
          onClose={() => setError(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage(null)}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Enrollments;
