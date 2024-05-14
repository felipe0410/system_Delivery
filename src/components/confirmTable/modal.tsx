import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 900,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

export default function ModalComponent() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const box = (title: string, value: string) => {
    return (
      <Box
        sx={{ display: "flex", width: "100%", justifyContent: "space-between" }}
      >
        <Typography
          align="left"
          sx={{
            textAlign: "left",
            textAlignLast: "left",
            fontFamily: "Nunito",
            fontSize: "35px",
            fontweight: 800,
            lineHeight: "50.47px",
            color: "#002A96",
          }}
        >
          {title}
        </Typography>
        <Box
          sx={{
            background: "#0A0F37",
            fontFamily: "Nunito",
            fontSize: "25px",
            fontWeight: 700,
            lineHeight: "40.92px",
            textAlign: "center",
            padding: "10px",
            borderRadius: "30px",
            width: "100px",
          }}
        >
          {" "}
          {value}
        </Box>
      </Box>
    );
  };

  return (
    <div>
      <Button onClick={handleOpen}>Open modal</Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box sx={{ ...style, width: "50%" }}>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontSize: "41px",
              fontWeight: 800,
              lineHeight: "55.92px",
              textAlign: "center",
              color: "#002A96",
            }}
          >
            ESTAS SEGURO DE FINALIZAR LOS PAQUETES DEL MENSAJERO ?
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Box>
              <Box component={"img"} src="/delivery.png" />
            </Box>
            <Box
              sx={{
                marginLeft: "-60px",
                background: "red",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
              }}
            >
              <Box sx={{ width: "100%" }}>
                {box("PAQUETES ASIGNADOS:", "80")}
              </Box>
              <Box sx={{ width: "100%" }}>
                {box("TOTAL PAQUETES:", "$ 2.900.000")}
              </Box>
              <Box sx={{ width: "100%" }}>{box("BASE:", "$ 50.000")}</Box>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
