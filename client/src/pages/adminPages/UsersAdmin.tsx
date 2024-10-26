import { Button, TableCell, TableRow } from "@mui/material";
import { useEffect, useState } from "react";
import { getUsers, removeUser } from "../../api/users";
import Header from "../../components/header/Header";
import TableComponent from "../../components/Table/TableComponent";
import TitleHeader from "../../components/titleHeader/TitleHeader";
import { User } from "./utils/adminUtils";
import "./admin.scss";

function UsersAdmin() {
  const [users, setUsers] = useState<User[]>([]);
  const headers = ["Id", "Username"];

  const handleFetchUsers = async () => {
    try {
      const response = await getUsers();
      setUsers(response);
      console.log(response);
    } catch (error) {
      console.error("Error fetching users", error);
    }
  };

  const handleRemoveUser = async (id: number) => {
    try {
      await removeUser(id);
      setUsers((prevUsers) => prevUsers.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Error deleting user", error);
    }
  };

  useEffect(() => {
    handleFetchUsers();
  }, []);

  return (
    <>
      <Header />
      <div className="Users">
        <TitleHeader title="Users" />
        <TableComponent width="500px" headers={headers}>
          {users.map((user) => (
            <TableRow key={user.id} >
              <TableCell align="center">{user.id}</TableCell>
              <TableCell align="center">{user.username}</TableCell>
              <TableCell
                align="right"
                sx={{ width: "60px", borderBottom: 'none' }}
              >
                <Button
                  onClick={() => handleRemoveUser(user.id)}
                  sx={{ fontSize: "10px" }}
                  variant="contained"
                  color="error"
                >
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableComponent>
      </div>
    </>
  );
}

export default UsersAdmin;
