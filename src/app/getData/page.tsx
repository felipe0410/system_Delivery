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
import CircularProgress from "@mui/material/CircularProgress";
import React, { useEffect, useState } from "react";

import Image from "next/image";
import imgBack from "/public/images/af4e63708de6ec3a46f9cfb41f4c5075.png";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import SearchIcon from "@mui/icons-material/Search";
import Mark from "mark.js";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import DirectionsRunIcon from "@mui/icons-material/DirectionsRun";
import SaveIcon from "@mui/icons-material/Save";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import axios from "axios";
import { getShipmentData, shipments } from "@/firebase/firebase";

const Page = () => {
  const [guide, setGuide] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [guidiesDetails, setGuidiesDetails] = useState([]);
  const [load, setLoad] = useState(false);
  const [timer, setTimer] = useState(180);
  const [shipmentsSave, setShipmentsSave] = useState(0);

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyPress = async (event: { key: string }) => {
    if (event.key === "Enter" && inputValue.trim() !== "") {
      const dataDB = (await getShipmentData(inputValue.trim())) ?? null;
      if (!guide.includes(inputValue.trim()) && dataDB === null) {
        setGuide((prevGuides) => [...prevGuides, inputValue.trim()]);
      } else {
        if (dataDB) {
          enqueueSnackbar("La guía ya se encuentra guardada en el sistema", {
            variant: "error",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          });
        } else {
          enqueueSnackbar("La guía ya existe", {
            variant: "warning",
            anchorOrigin: {
              vertical: "top",
              horizontal: "right",
            },
          });
        }
      }
      setInputValue(""); // Clear input after adding
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

  const fetchGuideDetails = () => {
    setLoad(true);
    axios
      .post("http://localhost:8080/consult", { guias: guide })
      .then(async (response: { data: any }) => {
        console.log(response.data);
        for (const shipment of response.data) {
          const uid = shipment.uid;
          const result = await shipments(uid, shipment);
          if (result) {
            console.log(`Datos guardados para el envío con UID: ${uid}`);
            setShipmentsSave((prevCount) => prevCount + 1);
          } else {
            console.error(
              `Error al guardar los datos para el envío con UID: ${uid}`
            );
          }
        }
        setGuidiesDetails(response.data);
        enqueueSnackbar("Datos cargados correctamente.", {
          variant: "success",
        });
        setLoad(false);
      })
      .catch((error: any) => {
        console.error("Error al cargar los datos:", error);
        enqueueSnackbar("Error al cargar los datos.", { variant: "error" });
        setLoad(false);
      });
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
      <SnackbarProvider />
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
              Ingresa las guias a consultar
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
              A cotinucacion se consultara los datos de las guias sumistradas la
              duracion es de aproximadamente 5 min.
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
              Guias guardadas:
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
            onClick={fetchGuideDetails}
            disabled={!(guide.length > 0) || load}
            sx={{
              filter: guide.length > 0 ? "auto" : "grayscale(1)",
              background: "#5C68D4",
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
            }}
            endIcon={<HomeWorkIcon sx={{ fontSize: "30px", color: "#fff" }} />}
          >
            {"OFICINA"}
          </Button>
          <Button
            onClick={fetchGuideDetails}
            disabled={!(guide.length > 0) || load}
            sx={{
              filter: guide.length > 0 ? "auto" : "grayscale(1)",
              background: "#5C68D4",
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
            }}
            endIcon={
              <DirectionsRunIcon sx={{ fontSize: "30px", color: "#fff" }} />
            }
          >
            {"DOMICILIARIO"}
          </Button>
        </Box>
      </Paper>
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
