import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { TextField } from "@mui/material";
import { useState } from "react";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import CancelIcon from "@mui/icons-material/Cancel";

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

export default function GuidesGroup({
  firebaseData,
  setTagsValue,
}: {
  firebaseData: any;
  setTagsValue: any;
}) {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inputGuides, setInputGuides] = useState("");

  const handleAddGuides = () => {
    const guideList = inputGuides.split("\n").map((guide) => guide.trim());
    const filteredData = firebaseData.filter((data: { guide: string }) =>
      guideList.includes(data.guide)
    );
    setTagsValue(filteredData);
    const notFoundGuides = guideList.filter(
      (guide) =>
        !filteredData.some((data: { guide: string }) => data.guide === guide)
    );
    if (notFoundGuides.length > 0) {
      enqueueSnackbar(
        `Las siguientes guías no se encontraron: ${notFoundGuides.join(", ")}`,
        { variant: "warning" }
      );
    }
    setInputGuides("");
    setOpen(false);
  };

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
        Agregar gurupo de guias
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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            <TextField
              multiline
              rows={4}
              placeholder="Ingrese las guías separadas por saltos de línea..."
              value={inputGuides}
              onChange={(e) => setInputGuides(e.target.value)}
              fullWidth
              sx={{ width: "100%" }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleAddGuides}
              sx={{ marginTop: "1rem", background: "#00005c" }}
            >
              Añadir Guías
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
