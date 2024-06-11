"use client";
import {
  Box,
  Chip,
  Divider,
  InputBase,
  Paper,
  Typography,
  Button,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import imgBack from "/public/images/af4e63708de6ec3a46f9cfb41f4c5075.png";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import SearchIcon from "@mui/icons-material/Search";
import Mark from "mark.js";
import CheckCircleTwoToneIcon from "@mui/icons-material/CheckCircleTwoTone";
import HomeWorkTwoToneIcon from "@mui/icons-material/HomeWorkTwoTone";
import ReplaySharpIcon from "@mui/icons-material/ReplaySharp";
import SaveIcon from "@mui/icons-material/Save";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import {
  removePackageNumberFromEnvios,
  shipmentsDeliver,
} from "@/firebase/firebase";
import DeliveryDiningTwoToneIcon from "@mui/icons-material/DeliveryDiningTwoTone";

const Page = () => {
  const [guide, setGuide] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [load, setLoad] = useState(false);
  const [timer, setTimer] = useState(180);
  const [shipmentsSave, setShipmentsSave] = useState(0);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const updateStatus = async (newStatus: string) => {
    const updatePromises = guide.map(async (uid) => {
      try {
        const status = await shipmentsDeliver(uid, newStatus);
        if(['entregado','devolucion'].includes(uid)){
          removePackageNumberFromEnvios(uid);
        }
        if (status) {
          setGuide((prevGuide) => prevGuide.filter((id) => id !== uid));
          setShipmentsSave((prevCount) => prevCount + 1);
        }
      } catch (error) {
        console.error(
          `Error al actualizar UID: ${uid} con estado: ${newStatus}`,
          error
        );
      }
    });
    await Promise.all(updatePromises);
    enqueueSnackbar("Guias actualizadas", {
      variant: "success",
      anchorOrigin: {
        vertical: "top",
        horizontal: "right",
      },
    });
    console.log("Proceso de actualización completado para todos los estados.");
  };

  const handleInputKeyPress = async (event: { key: string }) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      if (!guide.includes(inputValue.trim())) {
        setGuide((prevGuides) => [...prevGuides, inputValue.trim()]);
      } else {
        enqueueSnackbar("La guía ya existe", {
          variant: "warning",
          anchorOrigin: {
            vertical: "top",
            horizontal: "right",
          },
        });
      }
      setInputValue("");
    }
  };

  const handleDelete = (chipToDelete: any) => () => {
    setGuide((prevGuides) =>
      prevGuides.filter((guide) => guide !== chipToDelete)
    );
  };

  const handleSearchChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    const element: any = document.querySelector("#container-inputs");

    if (element) {
      const markInstance = new Mark(element);
      if (searchTerm) {
        markInstance.mark(searchTerm);
      } else {
        markInstance.unmark();
      }

      return () => markInstance.unmark();
    }
  }, [searchTerm]);

  useEffect(() => {
    let interval: any = null;

    if (load && timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (!load || timer === 0) {
      clearInterval(interval);
      setTimer(180);
    }
    return () => clearInterval(interval);
  }, [load, timer]);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        maxWidth: "80%",
        margin: "0 auto",
      }}
    >
      <SnackbarProvider />(
      <Paper
        sx={{
          borderRadius: "2.5rem",
          background: "rgba(92, 104, 212, 0.33)",
          boxShadow:
            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          padding: "2%",
          marginTop: "1.5rem",
          minWidth: { xs: "10px", sm: "46.625rem" },
          minHeight: { xs: "10px", sm: "17.8125rem" },
        }}
      >
        <Box sx={{ textAlign: "-webkit-center" }}>
          <Box>
            <Typography
              sx={{
                color: "#0A0F37",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: { xs: "1.5rem", sm: "2.5rem" },
                fontStyle: "normal",
                fontWeight: 900,
                lineHeight: "normal",
              }}
            >
              ENTREGAR PAQUETES
            </Typography>
          </Box>
          <Box mt={2} width={{ xs: "auto", lg: "39.5625rem" }}>
            <Typography
              sx={{
                color: "#000",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "1.25rem",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
              }}
            >
              Debes ingresar las guias para actualizar su estado
            </Typography>
          </Box>
          <InputBase
            sx={{
              background: "#f9eded",
              padding: "10px",
              borderRadius: "30px",
              textAlignLast: "center",
              marginTop: "10px",
            }}
            value={inputValue}
            onChange={handleInputChange}
            onKeyPress={handleInputKeyPress}
            placeholder="Escribe una guía y presiona Enter"
            endAdornment={<DeliveryDiningIcon sx={{ fontSize: "30px" }} />}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            flexDirection: "column-reverse",
          }}
        >
          <>
            <InputBase
              type="text"
              placeholder="Buscar guía..."
              value={searchTerm}
              onChange={handleSearchChange}
              sx={{
                background: "#f9eded",
                padding: "10px",
                borderRadius: "32px",
                width: "40%",
                margin: "0 auto",
              }}
              endAdornment={<SearchIcon sx={{ fontSize: "30px" }} />}
            />
          </>
          <Box>
            <Typography
              sx={{
                marginY: "10px",
                color: "#0A0F37",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: { xs: "20px", sm: "30px" },
                fontStyle: "normal",
                fontWeight: 900,
                lineHeight: "normal",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <QrCode2Icon sx={{ fontSize: "40px" }} />
              Guias ingresadas:
              <Chip
                label={guide.length}
                sx={{
                  fontSize: "30px",
                  padding: "2px",
                  background: "rgb(0 0 0 / 51%)",
                  color: "#fff",
                  marginLeft: "10px",
                }}
              />
            </Typography>
            <Typography
              sx={{
                marginY: "10px",
                color: "#0A0F37",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: { xs: "20px", sm: "30px" },
                fontStyle: "normal",
                fontWeight: 900,
                lineHeight: "normal",
                display: "flex",
                justifyContent: "center",
              }}
            >
              <SaveIcon sx={{ fontSize: "40px" }} />
              Guias Actualizadas:
              <Chip
                label={shipmentsSave}
                sx={{
                  fontSize: "30px",
                  padding: "2px",
                  background: "rgb(0 0 0 / 51%)",
                  color: "#fff",
                  marginLeft: "10px",
                }}
              />
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ marginY: "10px" }} />
        <Box id="container-inputs">
          {guide.map((e, i) => (
            <Chip
              sx={{ background: "#fff", margin: "5px", fontSize: "15px" }}
              key={i}
              label={e}
              onDelete={handleDelete(e)}
            />
          ))}
        </Box>
        {load && (
          <Typography
            sx={{
              color: "#000",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: "15px",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
          >
            La petición puede tardar aproximadamente de 1 a 3 minutos. Tiempo
            restante:{" "}
            <span style={{ fontWeight: 900, fontSize: "25px", color: "red" }}>
              {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)} minutos.
            </span>
          </Typography>
        )}
        <Box
          sx={{ textAlignLast: "center", display: "flex", flexWrap: "wrap" }}
        >
          <Button
            onClick={() => updateStatus("entregado")}
            disabled={!(guide.length > 0) || load}
            sx={{
              width: "45%",
              filter: guide.length > 0 ? "auto" : "grayscale(1)",
              background: "#015101;",
              boxShadow: "0px 4px 4px 0px #00000040",
              color: "#fff",
              margin: "0 auto",
              marginY: "20px",
              borderRadius: "15px",
              fontFamily: "Nunito",
              fontSize: "25px",
              fontWeight: 600,
              lineHeight: "27.28px",
              textAlign: "center",
              padding: "10px",
              display: load ? "none" : "flex",
              "&:hover": { backgroundColor: "#015101", opacity: "50%" },
            }}
            endIcon={
              <CheckCircleTwoToneIcon
                sx={{ fontSize: "30px", color: "#fff" }}
              />
            }
          >
            {"Entregar"}
          </Button>
          <Button
            onClick={() => updateStatus("devolucion")}
            disabled={!(guide.length > 0) || load}
            sx={{
              width: "45%",
              filter: guide.length > 0 ? "auto" : "grayscale(1)",
              background: "#af7100",
              boxShadow: "0px 4px 4px 0px #00000040",
              color: "#fff",
              margin: "0 auto",
              marginY: "20px",
              borderRadius: "15px",
              fontFamily: "Nunito",
              fontSize: "25px",
              fontWeight: 600,
              lineHeight: "27.28px",
              textAlign: "center",
              padding: "10px",
              display: load ? "none" : "flex",
              "&:hover": { backgroundColor: "#af7100", opacity: "50%" },
            }}
            endIcon={
              <ReplaySharpIcon sx={{ fontSize: "30px", color: "#fff" }} />
            }
          >
            {"DEVOLUCION"}
          </Button>
          <Button
            onClick={() => updateStatus("mensajero")}
            disabled={!(guide.length > 0) || load}
            sx={{
              width: "45%",
              filter: guide.length > 0 ? "auto" : "grayscale(1)",
              background: "#010034",
              boxShadow: "0px 4px 4px 0px #00000040",
              color: "#fff",
              margin: "0 auto",
              marginY: "20px",
              borderRadius: "15px",
              fontFamily: "Nunito",
              fontSize: "25px",
              fontWeight: 600,
              lineHeight: "27.28px",
              textAlign: "center",
              padding: "10px",
              display: load ? "none" : "flex",
              "&:hover": { backgroundColor: "#010034", opacity: "50%" },
            }}
            endIcon={
              <DeliveryDiningTwoToneIcon
                sx={{ fontSize: "60px", color: "#fff" }}
              />
            }
          >
            {"Mensajero"}
          </Button>
          <Button
            onClick={() => updateStatus("oficina")}
            disabled={!(guide.length > 0) || load}
            sx={{
              width: "45%",
              filter: guide.length > 0 ? "auto" : "grayscale(1)",
              background: "#4b0000",
              boxShadow: "0px 4px 4px 0px #00000040",
              color: "#fff",
              margin: "0 auto",
              marginY: "20px",
              borderRadius: "15px",
              fontFamily: "Nunito",
              fontSize: "25px",
              fontWeight: 600,
              lineHeight: "27.28px",
              textAlign: "center",
              padding: "10px",
              display: load ? "none" : "flex",
              "&:hover": { backgroundColor: "#4b0000", opacity: "50%" },
            }}
            endIcon={
              <HomeWorkTwoToneIcon
                fontSize="large"
                sx={{ fontSize: "30px", color: "#fff" }}
              />
            }
          >
            {"Oficina"}
          </Button>
        </Box>
      </Paper>
      )
      <Box
        sx={{
          zIndex: "-1",
          position: "absolute",
          right: 0,
          bottom: "10px",
        }}
      >
        <Image alt="img-background" src={imgBack} width={594} height={456} />
      </Box>
    </Box>
  );
};

export default Page;
