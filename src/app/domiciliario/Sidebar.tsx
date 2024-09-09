import { getStatusShipmentsData, sidebarCollection } from "@/firebase/firebase";
import { Box, Chip, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useGlobalContext } from "./context";
import { formatNumber, getCurrentDateTime } from "./hooks";

const Sidebar = () => {
  const [firebaseData, setFirebaseData] = useState<any[]>([]);

  const { step, entregados, devolucion, total, firebaseUserData, dataResumen } =
    useGlobalContext();
  const formattedTotal = formatNumber(total);
  const formattedBase = formatNumber(50000);

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

    const adjustedTotalMoney = totalMoney;

    const formattedTotal = formatNumber(adjustedTotalMoney);
    const totalBase = formatNumber(adjustedTotalMoney + 50000);
    return {
      formattedTotal,
      total: adjustedTotalMoney,
      totalBase,
    };
  };

  const result = processData();
  console.log(result?.totalBase === '$ 50.000')
  console.log(result?.totalBase )
  const createOnClickHandler = async () => {
    try {
      await sidebarCollection(getCurrentDateTime(), {
        baseFormeated: formattedBase,
        base: 50000,
        fecha: getCurrentDateTime(),
        entregados: entregados,
        devolucion: devolucion,
        dineroRecaudadoFormeated: formattedTotal,
        dineroRecaudado: total,
        dineroRecibirFormeated: result.formattedTotal,
        dineroRecibir: result.total,
        mensajero: firebaseUserData[1]?.name,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const status = "mensajero";
    getStatusShipmentsData(status, setFirebaseData);
  }, []);

  useEffect(() => {
    step > 0 && createOnClickHandler();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseData, step]);

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
              fontWeight: 500,
              fontSize: "18px",
            }}
            variant="outlined"
            label={"$50.000"}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Typography sx={{ textAlign: "center", alignContent: "center" }}>
            Fecha:{" "}
          </Typography>
          <Typography sx={{ fontWeight: 700 }}>
            _{getCurrentDateTime()}
          </Typography>
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
              fontWeight: 500,
              fontSize: "18px",
            }}
            variant="outlined"
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
              fontWeight: 500,
              fontSize: "18px",
            }}
            variant="outlined"
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
            fontWeight: 500,
            fontSize: "18px",
          }}
          variant="outlined"
          label={formattedTotal ?? ""}
        />
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
            }}
          >
            TOTAL
          </Typography>
          <Chip
            sx={{
              display: "flex",
              m: 1,
              borderRadius: "3rem",
              background: "#ffa7a7",
              color: "#000",
              fontWeight: 500,
              fontSize: "18px",
            }}
            variant="outlined"
            label={total ? formatNumber(total + 50000) : 0}
          />
        </Box>
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontSize: { xs: "10px", sm: "20px" },
            fontStyle: "normal",
            fontWeight: 800,
            lineHeight: "normal",
          }}
        >
          DINERO POR RECIBIR
        </Typography>
        <Chip
          sx={{
            display: "flex",
            m: 1,
            borderRadius: "3rem",
            background: "#73d5a0",
            color: "#006400",
            fontWeight: 500,
            fontSize: "18px",
          }}
          variant="outlined"
          label={result?.formattedTotal ?? ""}
        />
        <Box>
          <Typography
            sx={{
              fontWeight: 800,
            }}
          >
            TOTAL
          </Typography>
          <Chip
            sx={{
              display: "flex",
              m: 1,
              borderRadius: "3rem",
              background: "#ffa7a7",
              color: "#000",
              fontWeight: 500,
              fontSize: "18px",
            }}
            variant="outlined"
            label={result?.totalBase === '$ 50.000' ? 0 : result?.totalBase}
          />
        </Box>
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
        {" "}
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
            className="responsive-image"
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
    </Box>
  );
};

export default Sidebar;
