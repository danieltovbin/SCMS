import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";

export const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: "#fff",
  ...theme.typography.body2,
  height: "40vh",
  fontSize: 40,
  cursor: "pointer",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  color: theme.palette.text.secondary,
  ...theme.applyStyles("dark", {
    backgroundColor: "#1A2027",
  }),
}));

const cardsSize = { xs: 12, sm: 6, md: 4 };

export const cards = [
  { id: 1, title: "Courses", cardsSize, path: "/courses" },
  { id: 2, title: "Enrollments", cardsSize, path: "/enrollments" },
  { id: 3, title: "Users", cardsSize, path: "/users", role: "admin" },
];
