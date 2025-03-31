"use client";
import {
  Box,
  Chip,
  Divider,
  InputBase,
  Paper,
  Typography,
  Button,
  FormControl,
  InputLabel,
  IconButton,
  InputAdornment,
  OutlinedInput,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
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
import {
  addPackageNumberToEnvios,
  getAndSaveEnvios,
  getEnvios,
  getShipmentData,
  saveEnvios,
  shipments,
} from "@/firebase/firebase";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { NumericFormat } from "react-number-format";
import InventoryIcon from "@mui/icons-material/Inventory";
import NumbersIcon from "@mui/icons-material/Numbers";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import Shipments from "../Shipments/page";
import { serverTimestamp } from "firebase/firestore";

interface GuideData {
  guide: string;
  valor: number;
  packageNumber: number;
  pago: string;
  shippingCost: string;
  box: string;
  revision: boolean;
}

const Page = () => {
  const [password, setPassword] = useState("");
  const [step, setStep] = useState(0);
  const [guide, setGuide] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [valor, setValor] = useState(0);
  const [packageNumber, setPackageNumber] = useState(0);
  const [box, setBox] = useState("0");
  const [allData, setAllData] = useState<GuideData[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [guidiesDetails, setGuidiesDetails] = useState([]);
  const [load, setLoad] = useState(false);
  const [timer, setTimer] = useState(180);
  const [shipmentsSave, setShipmentsSave] = useState(0);
  const [showPassword, setShowPassword] = React.useState(false);
  const inputRef = useRef<HTMLInputElement>(null); // Referencia para el InputBase
  const [firebaseData, setFirebaseData] = React.useState<
    { [x: string]: any }[]
  >([]);
  const [arrayUniqueValue, setArrayUniqueValue] = useState<any>([]);
  const [num, setNumm] = useState(0);
  const [valorFormateado, setValorFormateado] = useState<string>(""); // Valor con formato ($121.200)

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  const handleInputChange = (event: any) => {
    setInputValue(event.target.value);
  };

  const handleInputKeyPress = async (event: { key: string }) => {
    // if (event.key === "Enter" && inputValue.trim() !== "") {
    //   const dataDB = (await getShipmentData(inputValue.trim())) ?? null;
    //   if (!guide.includes(inputValue.trim()) && dataDB === null) {
    //     setGuide((prevGuides) => [...prevGuides, inputValue.trim()]);
    //   } else {
    //     if (dataDB) {
    //       enqueueSnackbar("La guía ya se encuentra guardada en el sistema", {
    //         variant: "error",
    //         anchorOrigin: {
    //           vertical: "top",
    //           horizontal: "right",
    //         },
    //       });
    //     } else {
    //       enqueueSnackbar("La guía ya existe", {
    //         variant: "warning",
    //         anchorOrigin: {
    //           vertical: "top",
    //           horizontal: "right",
    //         },
    //       });
    //     }
    //   }
    //   setInputValue("");
    // }
  };

  const allDataFunction = async () => {
    const getArrayEnvios = await getEnvios();
    const arrayEnvios = (getArrayEnvios ?? [0])
      .map(Number)
      .filter(Number.isFinite);
    const array = firebaseData
      .map((data) => Number(data.packageNumber))
      .filter(Number.isFinite);

    const numerosFusionados = [...arrayEnvios, ...array].sort((a, b) => a - b);
    setArrayUniqueValue(numerosFusionados);

    let numeroFaltante = 1;
    for (const numero of numerosFusionados) {
      if (numero === numeroFaltante) {
        numeroFaltante++;
      } else if (numero > numeroFaltante) {
        break;
      }
    }
    setNumm(numeroFaltante);
  };

  const handleDelete = (chipToDelete: string) => () => {
    setAllData((prevAllData) =>
      prevAllData.filter((data) => data.guide !== chipToDelete)
    );
  };

  const handleSearchChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setSearchTerm(event.target.value);
  };

  function convertirMonedaANumero(monto: string): number {
    const montoSinSimbolos = monto.replace(/[^0-9,]/g, "");
    const montoFormateado = montoSinSimbolos.replace(/,/g, ".");
    const numero = parseFloat(montoFormateado);
    if (isNaN(numero)) {
      return 0;
    }
    return numero;
  }

  const fetchGuideDetails = async (domiciliary: boolean) => {
    setLoad(true);
    const guidesArray = allData.map((data) => data.guide);

    try {
      const response = await axios.post(
        "https://53fb-2803-1a00-153d-c030-2d2f-ceda-df23-4b73.ngrok-free.app/consult",
        {
          guias: guidesArray,
          password,
        }
      );

      const responseData = response.data;
      const processedUids = responseData.map(
        (item: { uid: string }) => item.uid
      );

      const updatedAllDataa = allData.filter(
        (shipment) => !processedUids.includes(shipment.guide)
      );
      setAllData(updatedAllDataa);
      const updatedAllData = responseData.map((shipment: any) => {
        const originalData = allData.find(
          (data) => data.guide === shipment.guide
        );

        if (originalData) {
          return {
            ...shipment,
            valor:
              originalData.valor ??
              convertirMonedaANumero(shipment?.shippingCost ?? "0"),
            box: originalData.box ?? shipment.box,
            shippingCost: originalData.shippingCost,
            packageNumber: originalData.packageNumber ?? shipment.packageNumber,
            status: domiciliary ? "mensajero" : "oficina",
            revision: originalData.revision,
            pago: originalData.pago,
            fecha_de_admision_timestamp: serverTimestamp(),
            fecha_de_admision_timestamp_local: Date.now(),
          };
        }

        return shipment;
      });
      for (const updatedShipment of updatedAllData) {
        const uid = updatedShipment.uid;

        const result = await shipments(
          uid,
          domiciliary
            ? {
                ...updatedShipment,
                status: "mensajero",
                box: "0",
                packageNumber: "0",
                courierAttempt1: Date.now(),
              }
            : {
                ...updatedShipment,
                status: "oficina",
              }
        );
        if (result) {
          setShipmentsSave((prevCount) => prevCount + 1);
        } else {
          console.error(
            `Error al guardar los datos para el envío con UID: ${uid}`
          );
        }
      }
      setGuidiesDetails(response.data);
      enqueueSnackbar("Datos cargados correctamente.", { variant: "success" });
      localStorage.removeItem("allData");
    } catch (error) {
      console.error("Error al cargar los datos:", error);
      enqueueSnackbar("Error al cargar los datos.", { variant: "error" });
    } finally {
      setLoad(false); // Asegurarse de que el estado de carga se desactive
    }
  };

  const handleAddPackage = () => {
    if (inputValue.trim()) {
      const newGuideData = {
        guide: inputValue.trim(),
        valor: valor,
        packageNumber: packageNumber || 0,
        box: box.trim() || "0",
        pago: valor > 0 ? "Al Cobro" : "Contado",
        shippingCost: valorFormateado,
        revision: true,
      };
      setAllData([...allData, newGuideData]);
      setInputValue("");
      setValor(0);
      setPackageNumber(0);
      setBox("");
      if (inputRef.current) {
        inputRef.current.focus(); // Mueve el cursor al input
      }
    }
  };

  const handleEndAdornmentClick = async () => {
    try {
      // Asignar el valor de `numm` a `packageNumber`
      setPackageNumber(num);

      // Guardar el número en la colección "consecutivo"
      const updatedEnvios = [...arrayUniqueValue, num]; // Agregar el nuevo número al array
      await saveEnvios(updatedEnvios); // Guardar el array actualizado

      // Recalcular el próximo número de paquete
      await allDataFunction();
    } catch (error) {
      console.error("Error al agregar el número de paquete:", error);
    }
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

  useEffect(() => {
    allDataFunction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const cachedData = localStorage.getItem("allData");
    if (cachedData) {
      setAllData(JSON.parse(cachedData));
    }
  }, []);

  useEffect(() => {
    if (allData.length > 0)
      localStorage.setItem("allData", JSON.stringify(allData));
  }, [allData]);

  useEffect(() => {
    getAndSaveEnvios();
  }, []);

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
      {step > 0 ? (
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
            <Button
              onClick={() => setStep(0)}
              sx={{
                background: "gray",
                color: "#fff",
                borderRadius: "25px",
                padding: "5px",
                width: "30px",
                minWidth: "0px",
                float: "left",
                "&:hover": { backgroundColor: "gray", opacity: "50%" },
              }}
            >
              <ArrowBackIosIcon sx={{ marginLeft: "7px" }} id="NextPlanIcon" />
            </Button>
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
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "right",
                  height: "40px",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: "30px",
                    fontWeight: 800,
                    lineHeight: "46.38px",
                    textAlign: "center",
                    marginRight: "10px",
                  }}
                >
                  #PAQUETE
                </Typography>
                <Box
                  sx={{
                    borderRadius: "35px",
                    opacity: "0px",
                    background: "#11192F",
                    padding: "12px",
                    color: "#fff",
                    width: "70px",
                    textAlignLast: "center",
                  }}
                >
                  {num}
                </Box>
              </Box>
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
                A cotinucacion se consultara los datos de las guias sumistradas
                la duracion es de aproximadamente 5 min.
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
              inputRef={inputRef}
              value={inputValue}
              onChange={handleInputChange}
              onKeyPress={handleInputKeyPress}
              placeholder="Escribe una guía"
              endAdornment={<DeliveryDiningIcon sx={{ fontSize: "30px" }} />}
            />
            <>
              <NumericFormat
                prefix="$ "
                thousandSeparator
                customInput={InputBase}
                value={valor}
                onValueChange={(e: any) => {
                  setValorFormateado(e.formattedValue);
                  setValor(e.floatValue);
                }}
                sx={{
                  background: "#f9eded",
                  padding: "10px",
                  borderRadius: "30px",
                  textAlignLast: "center",
                  marginTop: "10px",
                  width: "12%",
                  marginX: "10px",
                }}
                placeholder="Valor"
              />
            </>
            <InputBase
              sx={{
                background: "#f9eded",
                padding: "10px",
                borderRadius: "30px",
                textAlignLast: "center",
                marginTop: "10px",
                width: "10%",
              }}
              value={packageNumber}
              onChange={(e) => setPackageNumber(Number(e.target.value))}
              onKeyPress={handleInputKeyPress}
              placeholder="# paquete"
              endAdornment={
                <IconButton onClick={handleEndAdornmentClick}>
                  <NumbersIcon sx={{ fontSize: "30px" }} />
                </IconButton>
              }
            />
            <InputBase
              sx={{
                background: "#f9eded",
                padding: "10px",
                borderRadius: "30px",
                textAlignLast: "center",
                marginTop: "10px",
                width: "14%",
                marginLeft: "10px",
              }}
              value={box}
              onChange={(e) => setBox(e.target.value)}
              onKeyPress={handleInputKeyPress}
              placeholder="Caja"
              endAdornment={<InventoryIcon sx={{ fontSize: "30px" }} />}
            />
            <>
              <IconButton onClick={handleAddPackage}>
                <CheckCircleIcon sx={{ color: "green", fontSize: "40px" }} />
              </IconButton>
            </>
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
                  label={allData.length}
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
            {allData.map((data, index) => (
              <>
                <Chip
                  sx={{ background: "#fff", margin: "5px", fontSize: "15px" }}
                  key={index}
                  label={`Guía: ${data.guide}, Valor: $${data.valor}, Paquete: ${data.packageNumber}, Caja: ${data.box}`}
                  onDelete={handleDelete(data.guide)}
                />
              </>
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
                {Math.floor(timer / 60)}:{("0" + (timer % 60)).slice(-2)}{" "}
                minutos.
              </span>
            </Typography>
          )}
          <Box
            sx={{ textAlignLast: "center", display: "flex", flexWrap: "wrap" }}
          >
            <Button
              onClick={() => fetchGuideDetails(false)}
              disabled={!(allData.length > 0) || load}
              sx={{
                filter: allData.length > 0 ? "auto" : "grayscale(1)",
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
                "&:hover": { backgroundColor: "#5C68D4", opacity: "50%" },
              }}
              endIcon={
                <HomeWorkIcon sx={{ fontSize: "30px", color: "#fff" }} />
              }
            >
              {"OFICINA"}
            </Button>
            <Button
              onClick={() => fetchGuideDetails(true)}
              disabled={!(allData.length > 0) || load}
              sx={{
                filter: allData.length > 0 ? "auto" : "grayscale(1)",
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
                "&:hover": { backgroundColor: "#5C68D4", opacity: "50%" },
              }}
              endIcon={
                <DirectionsRunIcon sx={{ fontSize: "30px", color: "#fff" }} />
              }
            >
              {"DOMICILIARIO"}
            </Button>
          </Box>
        </Paper>
      ) : (
        <Paper
          sx={{
            borderRadius: "2.5rem",
            background: "rgba(92, 104, 212, 0.33)",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            padding: "2%",
            marginTop: "1.5rem",
            minWidth: { xs: "10px", sm: "36.625rem" },
            minHeight: { xs: "10px", sm: "17.8125rem" },
            width: "600px",
          }}
        >
          <Typography
            sx={{
              textAlign: "center",
              fontSize: "30px",
              fontFamily: "Nunito",
              fontWeight: 700,
            }}
          >
            INGRESA LA CONTRASEÑA
          </Typography>

          <Typography
            sx={{
              textAlign: "center",
              fontSize: "20px",
              fontFamily: "Nunito",
              marginY: "10px",
            }}
          >
            Asegurate que la contraseña debe ser la misma que se utiliza para
            ingresara controller y a la pagina de consulta de interrapidisimo
          </Typography>
          <Box sx={{ width: "100%", textAlignLast: "center" }}>
            <FormControl
              id="form-control"
              sx={{ m: 1, width: "25ch" }}
              variant="outlined"
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                sx={{ background: "#ffffff" }}
                id="outlined-adornment-password"
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={(e) => setPassword(e.target.value)}
                label="Password"
              />
            </FormControl>
          </Box>
          <Box sx={{ textAlignLast: "center" }}>
            <Button
              onClick={() => {
                localStorage.setItem("password", password);
                setStep(1);
              }}
              disabled={!(password.length > 0)}
              sx={{
                background: password.length > 0 ? "#5C68D4" : "#adadb0",
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
                "&:hover": { backgroundColor: "#5C68D4", opacity: "50%" },
              }}
            >
              GUARDAR
            </Button>
          </Box>
        </Paper>
      )}

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
