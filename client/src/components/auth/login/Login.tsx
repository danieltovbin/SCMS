import { ChangeEvent, FormEvent, useState } from "react";
import "./login.scss";
import {
    Box,
    Button,
    FormControl,
    FormLabel,
    TextField,
    Typography,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Card, SignInContainer } from "./utils/loginUtils";
import { useAuthContext } from "../../../context/AuthContext";


const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("")
  const navigate = useNavigate();
  const { loginUser } = useAuthContext(); 

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
        if (!username || !password) {
            setError("Please fill all fields");
            return;
        }
        await loginUser(username, password); 
        navigate("/home");
    } catch (error) {
        setError("Error during login");
        console.error("Error during login:", error);
    }
};

  const handleInputChange = async (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    if (name === 'username') {
        setUsername(value);
    } else if (name === 'password') {
        setPassword(value);
    }
  };

  return (
    <SignInContainer direction="column" className="Login">
      <Card>
        <Typography component="h1" variant="h4">
          Login
        </Typography>
        <Box
        component="form"
          onSubmit={handleLogin}
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100%",
            gap: 2,
          }}
        >
           {error && ( 
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}
          <FormControl>
            <FormLabel>Username</FormLabel>
            <TextField
              id="username"
              type="text"
              name="username"
              placeholder="name"
              value={username}
              onChange={handleInputChange}
              required
              fullWidth
              variant="outlined"
            />
          </FormControl>
          <FormControl>
            <Box>
              <FormLabel htmlFor="password">Password</FormLabel>
            </Box>
            <TextField
              name="password"
              placeholder="••••••"
              type="password"
              id="password"
              value={password}
              onChange={handleInputChange}
              autoFocus
              required
              fullWidth
            />
          </FormControl>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{
              backgroundColor: "#ebf0f4",
              color: "black",
              "&:hover": {
                backgroundColor: "#f0f0f0",
              },
            }}
          >
            Login
          </Button>
          <Typography>
            Don&apos;t have an account?{" "}
            <span>
              <Link to="/home">Register</Link>
            </span>
          </Typography>
        </Box>
      </Card>
    </SignInContainer>
  );
};

export default Login;
