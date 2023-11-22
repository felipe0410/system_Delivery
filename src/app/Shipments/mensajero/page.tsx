"use client";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Image from "next/image";
import imgBack from "/public/images/e181331c8066f48085e340b5de3660ff.png";
import { getShipmentData, shipments } from "@/firebase/firebase";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { inputs } from "@/data/inputs";

const Page = () => {
  const dataDefault = {
    guide: "",
    addressee: "",
    shippingCost: "",
    box: "",
    packageNumber: "",
    deliverTo: "oficina",
    intakeDate: null,
    status: null,
    returnDate: null,
    deliveryDate: null,
    courierAttempt1: null,
    courierAttempt2: null,
    courierAttempt3: null,
    updateDate: null,
    modifyBy: null,
  };
  const [data, setData] = useState<ShipmentData>(dataDefault);
  const isNotEmpty = (fields: any) => {
    for (const value in fields) {
      if (
        fields.hasOwnProperty(value) &&
        typeof fields[value] === "string" &&
        fields[value].trim() === ""
      ) {
        return false;
      }
    }
    return true;
  };

  const getShipmentGuide = async (id: string) => {
    try {
      const guideToDeliver = await getShipmentData(id);
      const shipmentData: ShipmentData = guideToDeliver as ShipmentData;
      if (shipmentData) {
        setData(shipmentData);
      } else {
        enqueueSnackbar("Error al encontrar la guía", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (error) {
      enqueueSnackbar("Error al encontrar la guía", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
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
  const router = useRouter();
  const createOnClickHandler = async (status: string) => {
    try {
      const guideStatus = data.status;

      if (guideStatus === "entregado" || guideStatus === "devolucion") {
        enqueueSnackbar(`El paquete ya está ${guideStatus}`, {
          variant: "warning",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        return;
      }
      if (
        guideStatus === "oficina" &&
        data.courierAttempt1 &&
        data.courierAttempt2 &&
        data.courierAttempt3
      ) {
        enqueueSnackbar("Ya se agotaron los intentos de enviar", {
          variant: "warning",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        return;
      } else if (
        guideStatus === "oficina" &&
        data.courierAttempt1 &&
        data.courierAttempt2
      ) {
        await shipments(data.guide, {
          ...data,
          courierAttempt3: getCurrentDateTime(),
          status: status,
          deliverTo: status === "mensajero" ? "direccion" : "oficina",
        });
        enqueueSnackbar("Guía guardada con éxito", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else if (guideStatus === "oficina" && data.courierAttempt1) {
        await shipments(data.guide, {
          ...data,
          courierAttempt2: getCurrentDateTime(),
          status: status,
          deliverTo: status === "mensajero" ? "direccion" : "oficina",
        });
        enqueueSnackbar("Guía guardada con éxito", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        const petition = await shipments(data.guide, {
          ...data,
          courierAttempt1: getCurrentDateTime(),
          status: status,
          deliverTo: status === "mensajero" ? "direccion" : "oficina",
        });

        enqueueSnackbar(
          petition ? "Guía guardada con éxito" : "Error al guardar el paquete",
          {
            variant: petition ? "success" : "error",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          }
        );
      }

      setData(dataDefault);
    } catch (error) {
      enqueueSnackbar("Error al guardar el paquete", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  const buttons = [
    {
      name: "AGREGAR ENVIO",
      background: "#00A410",
      src: "/images/add.svg",
      onclick: () => createOnClickHandler("mensajero"),
    },
  ];

  const styleTypography = {
    textAlign: "left",
    color: "#0A0F37",
    fontFamily: "Nunito",
    fontSize: "24px",
    fontStyle: "normal",
    fontWeight: 700,
    lineHeight: "normal",
    marginTop: "5px",
  };
  const inputOnChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
      id='container_add_send'
    >
      <SnackbarProvider />
      <Paper
        sx={{
          maxWidth: "55%",
          borderRadius: "2.5rem",
          background: "rgba(132, 141, 223, 0.58)",
          boxShadow:
            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          padding: "2%",
          marginTop: "1.5rem",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "-6%",
            marginRight: "3%",
          }}
        >
          <Button
            onClick={() => router.push("/Shipments")}
            sx={{
              minWidth: "auto",
              borderRadius: "20PX",
            }}
          >
            <HighlightOffIcon fontSize='large' sx={{ color: "red" }} />
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography
              sx={{
                color: "#0A0F37",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "2.5rem",
                fontStyle: "normal",
                fontWeight: 900,
                lineHeight: "normal",
              }}
            >
              Agregar al mensajero
            </Typography>
          </Box>
        </Box>
        <Box id='container-inputs'>
          <FormControl fullWidth variant='outlined'>
            <Typography sx={styleTypography}>{"N· de guía:"}</Typography>
            {
              <OutlinedInput
                value={data["guide"]}
                endAdornment={
                  <InputAdornment position='end'>
                    <Button onClick={() => getShipmentGuide(data.guide)}>
                      <SearchIcon fontSize='large' sx={{ color: "#000" }} />
                    </Button>
                  </InputAdornment>
                }
                onChange={(e) => inputOnChange("guide", e.target.value)}
                type={"number"}
                sx={{
                  borderRadius: "40px",
                  background: "rgba(255, 255, 255, 0.77)",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  height: "3rem",
                }}
              />
            }
          </FormControl>
          {inputs.map((input, index) => {
            const style = {
              width: `${input.whidth}`,
              marginLeft:
                input.whidth === "40%" && [3, 5].includes(index) ? "20%" : "0",
            };

            const inputSelect = (
              <Box>
                <Select
                  disabled
                  label='selecciona una opcion'
                  value={data["deliverTo"]}
                  sx={{
                    width: "100%",
                    borderRadius: "40px",
                    background: "rgba(255, 255, 255, 0.77)",
                    boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    height: "3rem",
                  }}
                >
                  <MenuItem value='direccion'>Direccion</MenuItem>
                  <MenuItem value='oficina'>Oficina</MenuItem>
                </Select>
              </Box>
            );
            return (
              <>
                <FormControl
                  sx={{
                    ...style,
                    display: index === 0 ? "none" : "",
                  }}
                  key={index * 3}
                  variant='outlined'
                >
                  <Typography sx={styleTypography}>{input.name}</Typography>
                  {input.type === "select" ? (
                    inputSelect
                  ) : (
                    <OutlinedInput
                      disabled
                      value={data[input.field]}
                      type={input.type}
                      sx={{
                        borderRadius: "40px",
                        background: "rgba(255, 255, 255, 0.77)",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        height: "3rem",
                      }}
                    />
                  )}
                </FormControl>
              </>
            );
          })}
        </Box>
        <Box
          sx={{
            marginTop: "2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          {buttons.map((button, index) => (
            <Button
              onClick={button.onclick}
              disabled={!isNotEmpty(data)}
              key={index * 4}
              sx={{
                display: "flow",
                width: "35%",
                padding: "15px",
                borderRadius: "40px",
                background: !isNotEmpty(data) ? "gray" : `${button.background}`,
                boxShadow:
                  "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                textAlign: "center",
                justifyContent: "space-around",
              }}
            >
              <Box component={"img"} src={button.src} />
              <Typography
                sx={{
                  color: "#FFF",
                  textAlign: "center",
                  fontFamily: "Nunito",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                {button.name}
              </Typography>
            </Button>
          ))}
        </Box>
      </Paper>
      <Box
        sx={{
          zIndex: "-1",
          position: "absolute",
          right: "5px",
          bottom: "5px",
        }}
      >
        <Image alt='img-background' src={imgBack} width={226} height={456} />
      </Box>
    </Box>
  );
};

export default Page;
