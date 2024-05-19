import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Button,
  Grid,
  Chip,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import InfoIcon from "@mui/icons-material/Info";
import LocalOfferSharpIcon from "@mui/icons-material/LocalOfferSharp";

interface Destinatario {
  celular: string;
  correo: string;
  direccion: string;
  nombre: string;
  numero_identificacion: string;
  tipo_identificacion: string;
}

interface Remitente {
  celular: string;
  correo: string;
  direccion: string;
  nombre: string;
  numero_identificacion: string;
  tipo_identificacion: string;
}

interface Envio {
  name: string;
  box: string;
  ciudad: string;
  courierAttempt1: null | string;
  courierAttempt2: null | string;
  courierAttempt3: null | string;
  deliverTo: string;
  deliveryDate: null | string;
  destinatario: Destinatario;
  destino: string;
  fecha_de_admision: string;
  fecha_estimada_de_entrega: string;
  guide: string;
  intakeDate: string;
  packageNumber: string;
  pago: string;
  remitente: Remitente;
  returnDate: null | string;
  revision: boolean;
  servicio: string;
  shippingCost: string;
  status: string;
  uid: string;
  updateDate: null | string;
  valor: number;
}

interface DeliveryModalProps {
  data: Envio;
}

const DeliveryModal: React.FC<DeliveryModalProps> = ({ data }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <InfoIcon />
      </Button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        id="dialog"
        sx={{ borderRadius: "40px" }}
      >
        <DialogTitle>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6">Datos de Envío</Typography>
            <IconButton onClick={() => setOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box p={2}>
            <Grid
              container
              spacing={2}
              sx={{
                border: "solid 1px",
                borderRadius: "21px",
              }}
            >
              <Grid
                item
                xs={12}
                style={{ padding: 0 }}
                id="grid1"
                sx={{ margin: "0", padding: "0" }}
              >
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Box
                    component="img"
                    src="/logoInter.png"
                    alt="logoInter.png"
                    height="70px"
                  />

                  <Box>
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                      marginTop={2}
                    >
                      <Typography
                        sx={{
                          fontWeight: 800,
                        }}
                        variant="body2"
                      >
                        FECHA Y HORA DE ADMISION:
                      </Typography>
                      <Typography variant="body2">
                        {data?.fecha_de_admision ?? ""}
                      </Typography>
                    </Box>
                    <Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={1}
                      >
                        <Typography sx={{ fontWeight: 800 }} variant="body2">
                          TIEMPO ESTIMADO DE ENTREGA:
                        </Typography>
                        <Typography variant="body2">
                          {data?.fecha_estimada_de_entrega ?? ""}
                        </Typography>
                      </Box>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
                        mt={1}
                        bgcolor="#0A0F37"
                        color="white"
                        p={1}
                        borderRadius={"25px 0px 0px 25px"}
                      >
                        <Typography sx={{ fontWeight: 800 }} variant="body2">
                          ADMISION EN LA AGENCIA:
                        </Typography>
                        <Typography variant="body2">
                          {data.intakeDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>
              <Grid style={{ paddingLeft: "0" }} item xs={6}>
                <Typography
                  variant="body2"
                  bgcolor="#0A0F37"
                  color="white"
                  p={1}
                  borderRadius={"19px 0px 0px 0px"}
                >
                  DESTINATARIO
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  {data?.destinatario.nombre ?? ""}
                </Typography>
                <Typography variant="body2">
                  {data?.destinatario.direccion ?? ""}
                </Typography>
                <Typography variant="body2">
                  {data?.destinatario.correo ?? ""}
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  {data?.destinatario.celular ?? ""}
                </Typography>
                <Typography variant="body2">
                  identificacion:{" "}
                  {data?.destinatario.numero_identificacion ?? ""}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  variant="body2"
                  bgcolor="#0A0F37"
                  color="white"
                  p={1}
                  borderRadius={1}
                >
                  REMITENTE
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  {data?.remitente.nombre ?? ""}
                </Typography>
                <Typography variant="body2">
                  {data?.remitente.direccion ?? ""}
                </Typography>
                <Typography variant="body2">
                  {data?.remitente.correo ?? ""}
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  {data?.remitente.celular ?? ""}
                </Typography>
                <Typography variant="body2">
                  identificacion: {data?.remitente.numero_identificacion ?? ""}
                </Typography>
                <Typography variant="body2">
                  {data?.remitente.direccion ?? ""}
                </Typography>
              </Grid>
              <Divider
                sx={{ background: "#000", width: "100%", marginY: "10px" }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", width: "60%" }}>
                  <Typography
                    align="center"
                    sx={{
                      alignContent: "center",
                      fontFamily: "Nunito",
                      fontSize: "20px",
                      fontWeight: 800,
                      lineHeight: "34.1px",
                      textAlign: "center",
                    }}
                    variant="body2"
                  >
                    NUMERO DE GUIA PARA SEGUIMIENTO:
                  </Typography>
                  <Box alignItems="center">
                    <Box component="img" src="/barcode.png" alt="Barcode" />
                    <Typography
                      sx={{
                        fontFamily: "Nunito",
                        fontSize: "20px",
                        fontWeight: 800,
                        lineHeight: "38.19px",
                        textAlign: "center",
                      }}
                      variant="body2"
                      ml={2}
                    >
                      {data?.uid ?? ""}
                    </Typography>
                  </Box>
                </Box>
                {/*  */}
                <Box sx={{ width: "30%" }}>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Box>
                      <Box display="flex" alignItems="center">
                        <Typography
                          sx={{
                            fontFamily: "Nunito",
                            fontSize: "20px",
                            fontWeight: 800,
                            lineHeight: "34.1px",
                            textAlign: "center",
                          }}
                          variant="body2"
                          ml={1}
                        >
                          CAJA
                        </Typography>
                        <Inventory2RoundedIcon
                          sx={{ fontSize: "35px", marginLeft: "10px" }}
                        />
                      </Box>
                      <Box
                        sx={{
                          background: "#1C0057",
                          fontFamily: "Nunito",
                          fontSize: "20px",
                          fontWeight: 800,
                          lineHeight: "34.1px",
                          textAlign: "center",
                          borderRadius: "19px",
                          color: "#fff",
                        }}
                      >
                        {data?.box ?? ""}
                      </Box>
                    </Box>
                    <Box>
                      <Box display="flex" alignItems="center">
                        <Typography
                          sx={{
                            fontFamily: "Nunito",
                            fontSize: "20px",
                            fontWeight: 800,
                            lineHeight: "34.1px",
                            textAlign: "center",
                          }}
                          variant="body2"
                          ml={1}
                        >
                          # PAQ
                        </Typography>
                        <LocalOfferSharpIcon
                          sx={{ fontSize: "35px", marginLeft: "10px" }}
                        />
                      </Box>
                      <Box
                        sx={{
                          background: "#1C0057",
                          fontFamily: "Nunito",
                          fontSize: "20px",
                          fontWeight: 800,
                          lineHeight: "34.1px",
                          textAlign: "center",
                          borderRadius: "19px",
                          color: "#fff",
                        }}
                      >
                        {data?.packageNumber ?? ""}
                      </Box>
                    </Box>
                  </Box>
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                    mt={2}
                  >
                    <Button
                      sx={{
                        width: "100%",
                        background: "#003A02",
                        colo: "#fff",
                        fontFamily: "Nunito",
                        fontSize: "25px",
                        fontWeight: 800,
                        lineHeight: "34.1px",
                        textAlign: "center",
                        color: "#FFF",
                        borderRadius: "19px",
                        "&:hover": {
                          background: "#003A02",
                          opacity: "60%",
                        },
                      }}
                    >
                      {data?.status ?? ""}
                    </Button>
                  </Box>
                </Box>
              </Box>
              <Divider
                sx={{ background: "#000", width: "100%", marginTop: "10px" }}
              />
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-evenly",
                  marginY: "10px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: "25px",
                    fontWeight: 800,
                    lineHeight: "34.1px",
                    textAlign: "center",
                    width: "45%",
                  }}
                >
                  Valor a cobrar destinatario al momento de entregar
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: "40px",
                    fontWeight: 800,
                    lineHeight: "65.47px",
                    textAlign: "center",
                  }}
                  variant="h6"
                >
                  {data?.shippingCost ?? ""}
                </Typography>
              </Box>
            </Grid>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DeliveryModal;
