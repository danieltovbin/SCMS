import { createTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

export const darkTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#ebf0f4",
    },
  },
});
export const settings = ["Profile", "Login", "Logout"];

const navigate = useNavigate();

export const handleMenuItemClick = (setting: string) => {
  switch (setting) {
    case 'Profile':
      navigate('/profile');
      break;
    case 'Login':
      navigate('/login');
      break;
    case 'Register':
      navigate('/register');
      break;
    case 'Logout':
      break;
    default:
      break;
  }

};