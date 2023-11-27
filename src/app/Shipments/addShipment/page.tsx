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
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Image from "next/image";
import imgBack from "/public/images/af4e63708de6ec3a46f9cfb41f4c5075.png";
import { getAllShipmentsData, shipments } from "@/firebase/firebase";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
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
  const [petition, setPetition] = useState(0);
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
      const petition = await shipments(data.guide, {
        ...data,
        intakeDate: getCurrentDateTime(),
        courierAttempt1: status === "mensajero" ? getCurrentDateTime() : null,
        status: status,
        deliverTo: status === "mensajero" ? "direccion" : "oficina",
      });
      enqueueSnackbar(
        petition ? "Guia guardada con exito" : "Error al guardar el paquete",
        {
          variant: petition ? "success" : "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        }
      );
      setData(dataDefault);
      setPetition((e) => e + 1);
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
      src: "/images/delivery.svg",
      onclick: () => createOnClickHandler("oficina"),
    },
    {
      name: "GUARDAR Y AGREGAR DOMICILIARIO",
      background: "#5C68D4",
      src: "/images/add.svg",
      onclick: () => createOnClickHandler("mensajero"),
    },
  ];

  const inputOnChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  useEffect(() => {
    setData({
      ...data,
      intakeDate: getCurrentDateTime(),
      status: "oficina",
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const allData = async () => {
      const allData: ShipmentData[] = await getAllShipmentsData();
      const array: any = [];
      allData.map((data) => {
        array.push(data.packageNumber);
      });
      const numerosOrdenados = array
        .map(Number)
        .sort((a: any, b: any) => a - b);
      let numeroFaltante = 1;
      for (const numero of numerosOrdenados) {
        if (numero === numeroFaltante) {
          numeroFaltante++;
        } else if (numero > numeroFaltante) {
          break;
        }
      }
      setData({ ...data, packageNumber: `${numeroFaltante}` });
    };
    allData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petition]);

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
              Agregar Envíos
            </Typography>
          </Box>
        </Box>
        <Box id='container-inputs'>
          {inputs.map((input, index) => {
            const style = {
              width: { xs: '100%', sm: `${input.whidth}` },
              marginLeft:
                { sm: input.whidth === "40%" && [3, 5].includes(index) ? "20%" : "0", }
            };
            const styleTypography = {
              textAlign: "left",
              color: "#0A0F37",
              fontFamily: "Nunito",
              fontSize: "24px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            };
            const inputSelect = (
              <Box>
                <Select
                  onChange={(e: any) =>
                    inputOnChange(input.field, e.target.value)
                  }
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
                  <MenuItem value={"direccion"}>{"direccion"}</MenuItem>
                  <MenuItem value={"oficina"}>{"oficina"}</MenuItem>
                </Select>
              </Box>
            );
            return (
              <>
                <FormControl sx={style} key={index * 3} variant='outlined'>
                  <Typography sx={styleTypography}>{input.name}</Typography>
                  {input.type === "select" ? (
                    inputSelect
                  ) : (
                    <OutlinedInput
                      value={data[input.field]}
                      onChange={(e) =>
                        inputOnChange(input.field, e.target.value)
                      }
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
                width: "40%",
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
          right: "-75px",
          bottom: "-30px",
        }}
      >
        <Image alt='img-background' src={imgBack} width={594} height={456} />
      </Box>
    </Box>
  );
};

export default Page;
