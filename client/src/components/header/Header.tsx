import ArrowBackIosSharpIcon from "@mui/icons-material/ArrowBackIosSharp";
import {
  AppBar,
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ThemeProvider,
  Toolbar,
  Tooltip
} from "@mui/material";
import { MouseEvent, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { darkTheme } from "./utils/headerUtils";
import { useAuthContext } from "../../context/AuthContext";


function Header() {
  const { isAuthenticated} = useAuthContext();
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { logoutUser } = useAuthContext(); 

  const handleBackToHomePage = () => {
    navigate("/home");
  };

  const handleOpenMenu = (event: MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuItemClick = (setting: string) => {
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
        logoutUser();
        navigate('/home')
        break;
      default:
        break;
    }
    handleCloseMenu();
  };

  const settings = isAuthenticated ? ['Profile', 'Logout'] : ['Login'];

  return (
    <ThemeProvider theme={darkTheme}>
      <AppBar
        position="static"
        sx={{ position: "absolute", top: 0, left: 0, right: 0 }}
      >
        <Toolbar>
          {location.pathname !== "/home" ? (
            <Box sx={{ flexGrow: 1 }}>
              <IconButton onClick={handleBackToHomePage}>
                <ArrowBackIosSharpIcon />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ flexGrow: 1 }} />
          )}

          <Box sx={{ flexGrow: 0 }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenMenu} sx={{ p: 3 }}>
                <Avatar />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: "55px" }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              keepMounted
              open={Boolean(anchorElUser)}
              onClose={handleCloseMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={() => handleMenuItemClick(setting)}>
                  {setting}
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
    </ThemeProvider>
  );
}

export default Header;
