import { getAllShipmentsData, getAllUserData } from "@/firebase/firebase";
import { Box, Chip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

const Sidebar = () => {
  const [firebaseData, setFirebaseData] = useState<any[]>([]);
  const [firebaseUserData, setFirebaseUserData] = useState<any[]>([]);

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const month = months[now.getMonth()];
    const day = String(now.getDate()).padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const processData = () => {
    const totalMoney = firebaseData.reduce(
      (acc: any, item: { pago: string; valor: any }) => {
        const pagoNormalized = item.pago.replace(/\s+/g, "").toLowerCase();
        if (pagoNormalized === "alcobro") {
          return acc + item.valor;
        }
        return acc;
      },
      0
    );

    const formatNumber = (num: number) => {
      return num.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        style: "currency",
        currency: "COP",
      });
    };
    const formattedTotal = formatNumber(totalMoney);

    return {
      formattedTotal,
    };
  };

  const result = processData();

  useEffect(() => {
    const getFirebaseData = async () => {
      try {
        const dataRef = await getAllShipmentsData();
        const filteredData = dataRef.filter(
          (item: { status: string }) => item?.status === "mensajero"
        );
        setFirebaseData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getFirebaseData();
  }, []);

  useEffect(() => {
    const getFirebaseData = async () => {
      try {
        const dataRef = await getAllUserData();
        const filteredData = dataRef.filter(
          (item: { rol: string }) => item?.rol === "Mensajero"
        );
        setFirebaseUserData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getFirebaseData();
  }, []);

  return (
    <>
      <Box
        sx={{
          backgroundColor: "#FFF",
          borderRadius: "2rem",
          padding: "1rem",
          marginBottom: "2rem",
          width: "230px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontSize: { xs: "10px", sm: "20px" },
            fontStyle: "normal",
            fontWeight: 800,
            lineHeight: "normal",
          }}
        >
          Resumen
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography sx={{ textAlign: "center", alignContent: "center" }}>
            Base:{" "}
          </Typography>
          <Chip
            sx={{
              display: "flex",
              m: 1,
              borderRadius: "3rem",
              background: "#E0E0E0",
              color: "#000",
            }}
            variant='outlined'
            label={"$50.000"}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography sx={{ textAlign: "center", alignContent: "center" }}>
            Fecha:{" "}
          </Typography>
          <Typography>{getCurrentDateTime()}</Typography>
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography sx={{ textAlign: "center", alignContent: "center" }}>
            Entregados:{" "}
          </Typography>
          <Chip
            sx={{
              display: "flex",
              m: 1,
              borderRadius: "3rem",
              background: "#73d5a0",
              color: "#006400",
            }}
            variant='outlined'
            label={"50"}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography sx={{ textAlign: "center", alignContent: "center" }}>
            Devolucion:{" "}
          </Typography>
          <Chip
            sx={{
              display: "flex",
              m: 1,
              borderRadius: "3rem",
              background: "#FDC463",
              color: "#D14900",
            }}
            variant='outlined'
            label={"20"}
          />
        </Box>
      </Box>
      <Box
        sx={{
          backgroundColor: "#FFF",
          borderRadius: "2rem",
          padding: "1rem",
          marginBottom: "2rem",
          width: "230px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontSize: { xs: "10px", sm: "20px" },
            fontStyle: "normal",
            fontWeight: 800,
            lineHeight: "normal",
          }}
        >
          DINERO RECAUDADO
        </Typography>
        <Chip
          sx={{
            display: "flex",
            m: 1,
            borderRadius: "3rem",
            background: "#73d5a0",
            color: "#006400",
          }}
          variant='outlined'
          label={result.formattedTotal}
        />
      </Box>
      <Box
        sx={{
          backgroundColor: "#FFF",
          borderRadius: "2rem",
          padding: "1rem",
          width: "230px",
        }}
      >
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontSize: { xs: "10px", sm: "20px" },
            fontStyle: "normal",
            fontWeight: 800,
            lineHeight: "normal",
          }}
        >
          MENSAJERO
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box
            component={"img"}
            className='responsive-image'
            alt={`img avatar`}
            src={"/images/noPerson.png"}
            style={{
              borderRadius: "50%",
            }}
          />
          <Typography sx={{ textAlign: "center", alignContent: "center" }}>
            {firebaseUserData[1]?.name.toUpperCase()}
          </Typography>
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;
