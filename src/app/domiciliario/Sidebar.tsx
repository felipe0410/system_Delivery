import {
  getStatusShipmentsData,
  getAllUserData,
  sidebarCollection,
} from "@/firebase/firebase";
import { Box, Button, Chip, Typography } from "@mui/material";
import { enqueueSnackbar } from "notistack";
import React, { useEffect, useState } from "react";

const Sidebar = () => {
  const [firebaseData, setFirebaseData] = useState<any[]>([]);
  const [firebaseUserData, setFirebaseUserData] = useState<any[]>([]);
  const [entregados, setEntregados] = useState<number>(0);
  const [devolucion, setDevolucion] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);

  const formatNumber = (num: number) => {
    return num.toLocaleString("es-CO", {
      minimumFractionDigits: 0,
      style: "currency",
      currency: "COP",
    });
  };
  const formattedTotal = formatNumber(total);
  const formattedBase = formatNumber(50000);

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

    const adjustedTotalMoney = totalMoney + 50000;

    const formatNumber = (num: number) => {
      return num.toLocaleString("es-CO", {
        minimumFractionDigits: 0,
        style: "currency",
        currency: "COP",
      });
    };
    const formattedTotal = formatNumber(adjustedTotalMoney);

    return {
      formattedTotal,
    };
  };

  const result = processData();

  const createOnClickHandler = async () => {
    try {
      await sidebarCollection(getCurrentDateTime(), {
        base: formattedBase,
        fecha: getCurrentDateTime(),
        entregados: entregados,
        devolucion: devolucion,
        dineroRecaudado: formattedTotal,
        dineroRecibir: result.formattedTotal,
        mensajero: firebaseUserData[1]?.name,
      });

      enqueueSnackbar("Resumen del día guardado con éxito", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    } catch (error) {
      enqueueSnackbar("Error al guardar el resumen del día", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  useEffect(() => {
    const status = "mensajero";
    getStatusShipmentsData(status, setFirebaseData);
  }, []);

  useEffect(() => {
    const storedData = localStorage.getItem("entregados");
    if (storedData !== null) {
      const currentCount = parseInt(storedData);
      setEntregados(currentCount);
    }
    const storedData2 = localStorage.getItem("devolucion");
    if (storedData2 !== null) {
      const currentCount2 = parseInt(storedData2);
      setDevolucion(currentCount2);
    }
    const totalData = localStorage.getItem("total");
    if (totalData !== null) {
      const currentTotal = parseInt(totalData);
      setTotal(currentTotal);
    }
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
    <Box
      sx={{
        height: "90%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-around",
      }}
    >
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
            label={entregados}
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
            label={devolucion}
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
          label={formattedTotal}
        />
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontSize: { xs: "10px", sm: "20px" },
            fontStyle: "normal",
            fontWeight: 800,
            lineHeight: "normal",
          }}
        >
          DINERO A RECIBIR
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
          marginBottom: "15%",
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
      <Button
        onClick={createOnClickHandler}
        sx={{
          padding: "8px",
          width: "80%",
          borderRadius: "40px",
          background: "#5C68D4",
          boxShadow:
            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          textAlign: "center",
          "&:hover": { backgroundColor: "#364094" },
        }}
      >
        <Typography
          sx={{
            color: "#FFF",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: "1.2rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          FINALIZAR
        </Typography>
      </Button>
    </Box>
  );
};

export default Sidebar;
