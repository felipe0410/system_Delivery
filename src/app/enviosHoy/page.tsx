"use client";
import { Box, Paper, Typography, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import imgBack from "/public/images/af4e63708de6ec3a46f9cfb41f4c5075.png";
import { getAllShipmentsData } from "@/firebase/firebase";
import { SnackbarProvider } from "notistack";
import Calendar from "./Calendar";

const Page = () => {

  return (
    <Box
      sx={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box sx={{width:'90%', height:'100%'}} mt={2}>
        <Calendar />
      </Box>
      <SnackbarProvider />
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
