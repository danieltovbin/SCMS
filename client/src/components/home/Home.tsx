import { useNavigate } from "react-router-dom";
import Grid2 from "@mui/material/Grid2";
import { cards, Item } from "./utils/homeUtils";

function Home() {
  const navigate = useNavigate();

  const handleCardClick = (path:string) => {
    navigate(path)
  };

  return (
    <div>
      <Grid2
        alignItems="center"
        minHeight="80vh"
        container
        rowSpacing={1}
        columnSpacing={{ xs: 2, sm: 1, md: 4 }}
      >
        {cards &&
          cards.map((card) => {
            return (
              <Grid2 onClick={() => handleCardClick(card.path)} size={card.cardsSize}>
                <Item>{card.title}</Item>
              </Grid2>
            );
          })}
      </Grid2>
    </div>
  );
}

export default Home;
