import { Alert, Snackbar } from "@mui/material";
import { FC } from "react";

interface SnackBarProps {
  error: string | null;
  setError: (value: string | null) => void;
  successMessage: string | null;
  setSuccessMessage: (value: string | null) => void;
}

const SnackBar: FC<SnackBarProps> = ({
  error,
  setError,
  successMessage,
  setSuccessMessage,
}) => {
  return (
    <>
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
    </>
  );
};

export default SnackBar;
