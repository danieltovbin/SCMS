import Grid2 from "@mui/material/Grid2";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext";
import LoginPromptModal from "../modal/LoginPromptModal";
import './utils/home.scss';
import { cards, Item } from "./utils/homeUtils";
import TitleHeader from "../titleHeader/TitleHeader";

function Home() {
  const navigate = useNavigate();
  const { isAdmin, isAuthenticated } = useAuthContext();
  const [modalOpen, setModalOpen] = useState(false);

  const handleCardClick = (path: string) => {
    navigate(path);
  };

  const handleOpen = () => {
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
  };

  return (
    <div className="Home">
      <TitleHeader title="WELCOME TO SCMS!" />
      <Grid2
        alignItems="center"
        minHeight="50vh"
        container
        rowSpacing={1}
        columnSpacing={{ xs: 2, sm: 1, md: 4 }}
      >
        {cards &&
          cards.map((card) => {
            if (card.id === 3 && !isAdmin) {
              return null;
            }
            if (card.id === 2 && !isAuthenticated) {
              return (
                <Grid2 key={card.id} onClick={handleOpen} size={card.cardsSize}>
                  <Item className="item">{card.title}</Item>
                </Grid2>
              );
            }
            return (
              <Grid2
              
                key={card.id}
                onClick={() => handleCardClick(card.path)}
                size={card.cardsSize}
              >
                <Item className="item">{card.title}</Item>
              </Grid2>
            );
          })}
      </Grid2>
      <LoginPromptModal open={modalOpen} close={handleClose} />
    </div>
  );
}

export default Home;
