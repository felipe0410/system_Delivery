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
import {
  getAllShipmentsData,
  getShipmentData,
  shipments,
} from "@/firebase/firebase";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { inputs } from "@/data/inputs";
import { NumericFormat } from "react-number-format";

const Page = () => {
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
          maxWidth: { xs: "75%", sm: "75%", md: "55%" },
          borderRadius: "2.5rem",
          background: "rgba(132, 141, 223, 0.58)",
          boxShadow:
            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          padding: "2%",
          marginTop: { xs: "2.5rem", sm: "1.5rem" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "-6%",
            marginRight: "3%",
          }}
        ></Box>
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
                fontSize: { xs: "1.5rem", sm: "2.5rem" },
                fontStyle: "normal",
                fontWeight: 900,
                lineHeight: "normal",
              }}
            >
              GENERAR REPORTE
            </Typography>
          </Box>
        </Box>
        <Box id='container-inputs'></Box>
      </Paper>
      <Box
        sx={{
          zIndex: "-1",
          position: "absolute",
          right: 0,
          bottom: "10px",
        }}
      >
        <Image alt='img-background' src={imgBack} width={594} height={456} />
      </Box>
    </Box>
  );
};

export default Page;
