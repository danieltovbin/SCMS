import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow
} from "@mui/material";
import { FC } from "react";
import { useAuthContext } from "../../context/AuthContext";
import { createFormProps } from "./utils/formUtils";

export const CreateForm:FC<createFormProps> = ({titleName, children, textDefault, textLoading, onSubmit, message}) => {
  const { loading } = useAuthContext();

  return (
    <TableContainer className="create-form">
      <h2>Create New {titleName}</h2>
      <form onSubmit={onSubmit}>
        <Table>
          <TableBody>
            <TableRow>
              {children}
              <TableCell>
                <Button type="submit" disabled={loading}>
                  {loading ? textLoading : textDefault}
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

export default CreateForm;
