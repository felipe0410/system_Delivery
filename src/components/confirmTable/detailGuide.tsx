import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Box,
  Typography,
  Button,
  Grid,
  IconButton,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import InfoIcon from "@mui/icons-material/Info";
import LocalOfferSharpIcon from "@mui/icons-material/LocalOfferSharp";
import { getAndSaveEnvios } from "@/firebase/firebase";

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

  useEffect(() => {
    getAndSaveEnvios();
  }, []);

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
              {/* Cabecera del envío con el logo */}
              <Grid item xs={12} sx={{ margin: 0, padding: 0 }}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    flexDirection: { xs: "column", sm: "row" },
                  }}
                >
                  <Box
                    component="img"
                    src="/logoInter.png"
                    alt="logoInter.png"
                    height={{ xs: "50px", sm: "70px" }}
                    display={{ xs: "none", sm: "block" }} // Ajusta el tamaño del logo en pantallas pequeñas
                  />

                  <Box
                    mt={{ xs: 2, sm: 0 }}
                    sx={{ display: { xs: "block", sm: "block" } }}
                  >
                    <Box
                      display="flex"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      <Typography sx={{ fontWeight: 800 }} variant="body2">
                        FECHA Y HORA DE ADMISION:
                      </Typography>
                      <Typography variant="body2">
                        {data?.fecha_de_admision ?? ""}
                      </Typography>
                    </Box>
                    <Box mt={1}>
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems="center"
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
                      <Box
                        display={
                          data.status == "oficina" || data.status == "mensajero"
                            ? "none"
                            : "flex"
                        }
                        justifyContent="space-between"
                        alignItems="center"
                        mt={1}
                        bgcolor={
                          data.status == "entregado" ? "#003A02" : "#a56b00"
                        }
                        color="white"
                        p={1}
                        borderRadius={"25px 0px 0px 25px"}
                      >
                        <Typography sx={{ fontWeight: 800 }} variant="body2">
                          {data.status == "entregado"
                            ? "ENTREGA:"
                            : data.status == "devolucion"
                            ? "DEVOLUCION"
                            : ""}
                        </Typography>
                        <Typography variant="body2">
                          {data?.deliveryDate ?? ""}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid>

              {/* Información del destinatario y remitente */}
              <Grid item xs={12} sm={6} style={{ paddingLeft: "0" }}>
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
                  {data?.destinatario?.nombre ?? ""}
                </Typography>
                <Typography variant="body2">
                  {data?.destinatario?.direccion ?? ""}
                </Typography>
                <Typography variant="body2">
                  {data?.destinatario?.correo ?? ""}
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  {data?.destinatario?.celular ?? ""}
                </Typography>
                <Typography variant="body2">
                  identificacion:{" "}
                  {data?.destinatario?.numero_identificacion ?? ""}
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                sm={6}
                sx={{ display: { xs: "none", sm: "auto" } }}
              >
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
                  {data?.remitente?.nombre ?? ""}
                </Typography>
                <Typography variant="body2">
                  {data?.remitente?.direccion ?? ""}
                </Typography>
                <Typography variant="body2">
                  {data?.remitente?.correo ?? ""}
                </Typography>
                <Typography fontWeight={700} variant="body2">
                  {data?.remitente?.celular ?? ""}
                </Typography>
                <Typography variant="body2">
                  identificacion: {data?.remitente?.numero_identificacion ?? ""}
                </Typography>
              </Grid>

              <Divider
                sx={{ background: "#000", width: "100%", marginY: "10px" }}
              />

              {/* Información del paquete y seguimiento */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  flexDirection: { xs: "column", sm: "row" },
                  alignItems: "center",
                }}
              >
                <Box
                  sx={{
                    width: { xs: "100%", sm: "60%" },
                    flexDirection: { xs: "column", sm: "row" },
                    display: { xs: "none", sm: "flex" },
                  }}
                >
                  <Typography
                    align="center"
                    sx={{
                      fontFamily: "Nunito",
                      fontSize: { xs: "16px", sm: "20px" },
                      fontWeight: 800,
                      textAlign: "center",
                    }}
                    variant="body2"
                  >
                    NUMERO DE GUIA PARA SEGUIMIENTO:
                  </Typography>
                  <Box
                    alignItems="center"
                    sx={{ marginTop: { xs: "10px", sm: "0" } }}
                  >
                    <Box component="img" src="/barcode.png" alt="Barcode" />
                    <Typography
                      sx={{
                        fontFamily: "Nunito",
                        fontSize: { xs: "16px", sm: "20px" },
                        fontWeight: 800,
                        textAlign: "center",
                      }}
                      variant="body2"
                      ml={2}
                    >
                      {data?.uid ?? ""}
                    </Typography>
                  </Box>
                </Box>

                <Box
                  sx={{
                    width: { xs: "100%", sm: "30%" },
                    marginTop: { xs: "20px", sm: "0" },
                  }}
                >
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
                            fontSize: { xs: "16px", sm: "20px" },
                            fontWeight: 800,
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
                          fontSize: { xs: "16px", sm: "20px" },
                          fontWeight: 800,
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
                            fontSize: { xs: "16px", sm: "20px" },
                            fontWeight: 800,
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
                          fontSize: { xs: "16px", sm: "20px" },
                          fontWeight: 800,
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
                        fontFamily: "Nunito",
                        fontSize: { xs: "16px", sm: "25px" },
                        fontWeight: 800,
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
                  flexDirection: { xs: "column", sm: "row" },
                  marginY: "10px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: { xs: "16px", sm: "25px" },
                    fontWeight: 800,
                    textAlign: "center",
                    width: { xs: "100%", sm: "45%" },
                    marginBottom: { xs: "10px", sm: "0" },
                  }}
                >
                  Valor a cobrar destinatario al momento de entregar
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: { xs: "30px", sm: "40px" },
                    fontWeight: 800,
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
