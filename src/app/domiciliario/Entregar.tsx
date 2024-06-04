import * as React from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { shipments } from "@/firebase/firebase";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

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

export default function EntregarModal({
  data,
  base,
}: {
  data: any;
  base: number;
}) {
  const processData = () => {
    const totalPackages = data.reduce(
      (acc: any, item: { pago: string; valor: any }) => {
        const pagoNormalized = item.pago.replace(/\s+/g, "").toLowerCase();
        if (pagoNormalized === "alcobro") {
          return acc + item.valor;
        }
        return acc;
      },
      0
    );

    const formatNumber = (num: number) => {
      return num.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        style: "currency",
        currency: "COP",
      });
    };

    const baseFormatted = formatNumber(base);
    const formattedTotalPackages = formatNumber(totalPackages);

    return {
      formattedTotalPackages,
      baseFormatted,
    };
  };

  const result = processData();
  const [open, setOpen] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const createOnClickHandler = async (status: string) => {
    try {
      const updatePromises = data.map(async (selectedRow: any) => {
        const guideStatus = selectedRow.status;

        if (guideStatus === status) {
          enqueueSnackbar(`El paquete ya está ${guideStatus}`, {
            variant: "warning",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
          return;
        }

        await shipments(selectedRow.guide, {
          ...selectedRow,
          status: status,
          deliveryDate: getCurrentDateTime(),
        });
      });

      await Promise.all(updatePromises);

      enqueueSnackbar("Guías entregadas con éxito", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      setOpen(false);
    } catch (error) {
      enqueueSnackbar("Error al entregar los paquetes", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
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
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontSize: "30px",
              fontWeight: 800,
              color: "#FFF",
              textAlign: "center",
            }}
          >
            {value}
          </Typography>
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
          display: "flex",
          width: "100%",
          padding: { xs: "8px", sm: "15px" },
          borderRadius: "40px",
          background: "#00A410",
          boxShadow:
            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          textAlign: "center",
          justifyContent: "space-around",
          "&:hover": { backgroundColor: "#00A410" },
        }}
        endIcon={
          <Box
            component={"img"}
            src={"/oficina.png"}
            sx={{ width: { xs: "24px" } }}
          />
        }
      >
        <Typography
          sx={{
            color: "#FFF",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: { xs: "0.58rem", sm: "0.875rem" },
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          ENTREGAR
        </Typography>
      </Button>
      <SnackbarProvider />
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
              color: "#000",
            }}
          >
            ESTAS A PUNTO DE ENTREGAR LOS PAQUETES
          </Typography>
          <Box sx={{ display: "flex" }}>
            <Box>
              <Box component={"img"} src={"/delivery.png"} />
            </Box>
            <Box
              sx={{
                marginLeft: "-60px",
                alignItems: "flex-start",
                width: "100%",
                justifyContent: "space-evenly",
              }}
            >
              <Box sx={{ width: "100%", marginBottom: "3%", marginTop: "5%" }}>
                {box("# PAQUETES:", `${data?.length ?? 0}`)}
              </Box>
              <Box sx={{ width: "100%", marginBottom: "3%" }}>
                {box("$ AL COBROS:", `${result.formattedTotalPackages}`)}
              </Box>
              {/* <Box sx={{ width: "100%" }}>
                {box("BASE:", `${result.baseFormatted}`)}
              </Box> */}
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
              onClick={() => createOnClickHandler("entregado")}
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
