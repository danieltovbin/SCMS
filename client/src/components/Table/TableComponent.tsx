import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { FC, ReactNode } from "react";

interface TableProps {
  headers: string[];
  children: ReactNode;
}

const TableComponent: FC<TableProps> = ({ headers, children }) => {
  return (
    <Box>
      <Paper>
        <TableContainer>
          <Table sx={{ minWidth: 150 }}>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell align="center" key={index} sx={{ fontWeight: "bold" }}>
                    {header}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>{children}</TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default TableComponent;
