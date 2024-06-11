"use client";
import { Box, Paper, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import imgBack from "/public/images/af4e63708de6ec3a46f9cfb41f4c5075.png";
import { getAllShipmentsData } from "@/firebase/firebase";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import DocumentScannerOutlinedIcon from "@mui/icons-material/DocumentScannerOutlined";
import TableReport from "@/components/TableReport";
import GuidesGroup from "./modal_guias";

const Page = () => {
  const [firebaseData, setFirebaseData] = useState<{ [x: string]: any }[]>([]);
  const [tagsValue, setTagsValue] = useState<{ [x: string]: any }[]>([]);

  useEffect(() => {
    const getFirebaseData = async () => {
      try {
        const dataRef = await getAllShipmentsData();
        setFirebaseData(dataRef);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getFirebaseData();
  }, []);

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
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
          minWidth: "46.625rem",
          minHeight: "17.8125rem",
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
              GENERAR REPORTE
            </Typography>
          </Box>
          <Box mt={2} width={"39.5625rem"}>
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
              A continuación, ingrese las guías que desea agregar y presione el
              botón para añadirlas al listado.
            </Typography>
          </Box>

          <Box mt={2}>
            <GuidesGroup
              firebaseData={firebaseData}
              setTagsValue={setTagsValue}
            />
          </Box>
          <Autocomplete
            multiple
            id="tags-outlined"
            options={firebaseData}
            getOptionLabel={(option) => option.guide}
            value={tagsValue}
            onChange={(event, newValue) => {
              setTagsValue(newValue);
            }}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField {...params} placeholder="Guías Seleccionadas" />
            )}
            popupIcon={<DocumentScannerOutlinedIcon />}
            sx={{ width: "60%", marginTop: "1rem" }}
          />
        </Box>
        <Box id="container-table" mt={4}>
          <TableReport data={tagsValue} />
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
