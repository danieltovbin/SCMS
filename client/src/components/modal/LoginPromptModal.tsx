import { Box, Typography } from "@mui/material";
import Modal from "@mui/material/Modal";
import { FC } from "react";
import { ModalUnauthorizedProps, style } from "./utils/ModalUtils";

const LoginPromptModal: FC<ModalUnauthorizedProps> = ({ open, close }) => {
  return (
    <div>
      <Modal
        open={open}
        onClose={close}
        aria-labelledby="login-modal-title"
        aria-describedby="login-modal-description"
      >
        <Box sx={style}>
          <Typography variant="h4" component="h2">
            Please Login
          </Typography>
          <Typography id="login-modal-description" sx={{ mt: 2 }}>
            You need to be logged in to access this card
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default LoginPromptModal;
