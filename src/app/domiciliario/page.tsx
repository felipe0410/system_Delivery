"use client";
import ConfirmTable from "@/components/confirmTable/ConfirmTable";
import { getAllShipmentsData } from "@/firebase/firebase";
import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import TableDomi from "./TableDomi";
import Sidebar from "./Sidebar";
import { GlobalProvider } from "./context";

const Page = () => {
  const [firebaseData, setFirebaseData] = useState<{ [x: string]: any }[]>([]);

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
    <GlobalProvider>
      <Box
        sx={{
          display: "flex",
          height: "100%",
          alignItems: "center",
          justifyContent: "center",
          marginLeft: "60px",
          paddingRight: "40px",
        }}
      >
        <Paper
          sx={{
            borderRadius: "2.5rem",
            background: "rgba(92, 104, 212, 0.33)",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            padding: "2%",
            marginTop: "3rem",
            minWidth: "80%",
            minHeight: "17.8125rem",
            height: "95%",
          }}
        >
          <Box sx={{ height: "100%" }} id="container-table">
            <TableDomi />
          </Box>
        </Paper>
        <Paper
          sx={{
            borderRadius: "2.5rem",
            background: "rgba(92, 104, 212, 0.33)",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            padding: "2%",
            marginTop: "3rem",
            minWidth: "15%",
            minHeight: "17.8125rem",
            height: "95%",
            marginLeft: "10px",
          }}
        >
          <Box sx={{ textAlign: "-webkit-center" }}>
            <Box>
              <Typography
                sx={{
                  color: "#0A0F37",
                  textAlign: "center",
                  fontFamily: "Nunito",
                  fontSize: { xs: "1.5rem", sm: "2.0rem" },
                  fontStyle: "normal",
                  fontWeight: 900,
                  lineHeight: "normal",
                }}
              >
                ADICIONAL
              </Typography>
            </Box>
          </Box>
          <Box id="container-adicional" sx={{ height: "90%" }} mt={4}>
            <Sidebar />
          </Box>
        </Paper>
      </Box>
    </GlobalProvider>
  );
};

export default Page;
