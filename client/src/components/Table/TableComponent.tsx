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
import './utils/table.scss';

interface TableProps {
  headers: string[];
  children: ReactNode;
  width: string;
}

const TableComponent: FC<TableProps> = ({ headers, children,width }) => {
  return (
    <Box className="box">
      <Paper className="paper" sx={{ maxWidth: width, margin: "0 auto" }}>
        <TableContainer sx={{ maxWidth: width, margin: "0 auto" }}>
          <Table>
            <TableHead>
              <TableRow>
                {headers.map((header, index) => (
                  <TableCell className="table-cell" align="center" key={index}>
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
