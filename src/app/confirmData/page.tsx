"use client";
import ConfirmTable from "@/components/confirmTable/ConfirmTable";
import EnhancedTable from "@/components/confirmTable/table2";
import CustomizedTables from "@/components/confirmTable/table2";
import DataTable from "@/components/confirmTable/table2";
import { getAllShipmentsData } from "@/firebase/firebase";
import { Box, Paper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

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
    <Box
      sx={{
        display: "flex",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
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
          minWidth: "46.625rem",
          minHeight: "17.8125rem",
        }}
      >
        {/* <Box sx={{ textAlign: "-webkit-center" }}>
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
              CONFIRMAR DATOS
            </Typography>
          </Box>
          <Box mt={1} width={"39.5625rem"}>
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
              Acontinuacion se presenta los paquetes por confirmar datos
            </Typography>
          </Box>
        </Box> */}
        <Box id="container-table" mt={4}>
          {/* <ConfirmTable data={firebaseData} /> */}
          <CustomizedTables />
        </Box>
      </Paper>
    </Box>
  );
};

export default Page;
