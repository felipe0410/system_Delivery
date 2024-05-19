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
  bgcolor: "#fff",
  boxShadow: 24,
  borderRadius: "40px",
  pt: 2,
  px: 4,
  pb: 3,
};

export default function ModalComponent({
  numPackages,
  totalPackages,
  base,
}: {
  numPackages: string;
  totalPackages: string;
  base: string;
}) {
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
          sx={{
            fontFamily: "Nunito",
            textAlignLast: "left",
            fontSize: "30px",
            fontWeight: 800,
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
            width: "170px",
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
      <Button
        onClick={() => {
          setOpen(true);
        }}
        sx={{
          padding: "10px 20px",
          borderRadius: "40px",
          background: "#5C68D4",
          boxShadow:
            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          textAlign: "center",
          "&:hover": { backgroundColor: "#364094" },
        }}
      >
        <Typography
          sx={{
            color: "#fff",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: "1.5rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          TERMINAR
        </Typography>
      </Button>
      <Modal
        id="modal"
        open={open}
        sx={{ borderRadius: "40px" }}
        onClose={handleClose}
        aria-labelledby="parent-modal-title"
        aria-describedby="parent-modal-description"
      >
        <Box id="content" sx={{ ...style, width: "50%" }}>
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
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                width: "100%",
                justifyContent: "space-around",
              }}
            >
              <Box sx={{ width: "100%" }}>
                {box("PAQUETES ASIGNADOS:", `${numPackages}`)}
              </Box>
              <Box sx={{ width: "100%" }}>
                {box("TOTAL PAQUETES:", `${totalPackages}`)}
              </Box>
              <Box sx={{ width: "100%" }}>{box("BASE:", `${base}`)}</Box>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button
              onClick={() => setOpen(false)}
              sx={{
                boxShadow: "0px 4px 4px 0px #00000040",
                background: "#982400",
                fontFamily: "Nunito",
                fontSize: "24px",
                fontWeight: 700,
                lineHeight: "32.74px",
                textAlign: "center",
                color: "#FFF",
                borderRadius: "20px",
                padding: "10px",
                width: "40%",
                "&:hover": {
                  opacity: "60%",
                  background: "#982400",
                },
              }}
            >
              CANCELAR
            </Button>
            <Button
              sx={{
                boxShadow: "0px 4px 4px 0px #00000040",
                background: "#106D14",
                fontFamily: "Nunito",
                fontSize: "24px",
                fontWeight: 700,
                lineHeight: "32.74px",
                textAlign: "center",
                color: "#FFF",
                borderRadius: "20px",
                padding: "10px",
                width: "40%",
                "&:hover": {
                  opacity: "60%",
                  background: "#106D14",
                },
              }}
            >
              FINALIZAR
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}
