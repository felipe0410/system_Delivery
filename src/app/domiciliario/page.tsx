"use client";
import ConfirmTable from "@/components/confirmTable/ConfirmTable";
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
        // Usar getFilteredShipmentsData en lugar de getAllShipmentsData
        // Solo trae envíos con status "mensajero" u "oficina"
        const { getFilteredShipmentsData } = await import("@/firebase/firebase");
        const dataRef = await getFilteredShipmentsData();
        setFirebaseData(dataRef || []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setFirebaseData([]);
      }
    };
    getFirebaseData();
  }, []);

  return (
    <GlobalProvider>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          height: { xs: "auto", md: "100%" },
          minHeight: { xs: "100vh", md: "auto" },
          alignItems: { xs: "stretch", md: "center" },
          justifyContent: "center",
          marginLeft: { xs: "0", sm: "60px" },
          paddingRight: { xs: "0", sm: "40px" },
          padding: { xs: "10px", sm: "0" },
          gap: { xs: "10px", md: "10px" },
        }}
      >
        <Paper
          sx={{
            borderRadius: { xs: "1rem", sm: "2.5rem" },
            background: "rgba(92, 104, 212, 0.33)",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            padding: { xs: "8px", sm: "2%" },
            marginTop: { xs: "0.5rem", sm: "3rem" },
            width: { xs: "100%", md: "80%" },
            minHeight: { xs: "60vh", sm: "17.8125rem" },
            height: { xs: "auto", md: "95%" },
            flex: { xs: "1", md: "0 0 auto" },
          }}
        >
          <Box sx={{ height: "100%" }} id="container-table">
            <TableDomi />
          </Box>
        </Paper>
        <Paper
          sx={{
            borderRadius: { xs: "1rem", sm: "2.5rem" },
            background: "rgba(92, 104, 212, 0.33)",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            padding: { xs: "8px", sm: "2%" },
            marginTop: { xs: "0", sm: "3rem" },
            width: { xs: "100%", md: "15%" },
            minHeight: { xs: "auto", sm: "17.8125rem" },
            height: { xs: "auto", md: "95%" },
            marginLeft: { xs: "0", md: "10px" },
          }}
        >
          <Box sx={{ textAlign: "-webkit-center" }}>
            <Box>
              <Typography
                sx={{
                  color: "#0A0F37",
                  textAlign: "center",
                  fontFamily: "Nunito",
                  fontSize: { xs: "1.2rem", sm: "2.0rem" },
                  fontStyle: "normal",
                  fontWeight: 900,
                  lineHeight: "normal",
                }}
              >
                ADICIONAL
              </Typography>
            </Box>
          </Box>
          <Box id="container-adicional" sx={{ height: { xs: "auto", md: "90%" } }} mt={{ xs: 2, md: 4 }}>
            <Sidebar />
          </Box>
        </Paper>
      </Box>
    </GlobalProvider>
  );
};

export default Page;
