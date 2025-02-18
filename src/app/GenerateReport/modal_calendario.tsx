import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { useState } from "react";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import CancelIcon from "@mui/icons-material/Cancel";
import ReactCalendar from "./ReactCalendar";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

export default function Calendar({
  searchTerm,
  selectedDate,
}: {
  searchTerm: any;
  selectedDate: any;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  return (
    <div>
      <SnackbarProvider />
      <Button
        sx={{
          background: "#00005c",
          color: "#fff",
          borderRadius: "10px",
          fontWeight: "700",
        }}
        onClick={handleOpen}
      >
        Fecha
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "flex-end" }}
          >
            <Button variant="text" onClick={handleClose}>
              <CancelIcon sx={{ color: "#000" }} />
            </Button>
          </Box>
          <Box>
            <ReactCalendar
              setSearchTerm={searchTerm}
              handleClose={handleClose}
              setSelectedDate={selectedDate}
            />
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
