"use client";
import { Box, Typography, Button } from "@mui/material";
import SensorOccupiedIcon from "@mui/icons-material/SensorOccupied";
import FlipIcon from "@mui/icons-material/Flip";
import ScannerIcon from "@mui/icons-material/Scanner";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";

const CreateNote = () => {
  const [openZero, setOpenZero] = useState(false);
  const [openPrompt, setOpenPrompt] = useState(false);
  const [openStudio, setOpenStudio] = useState(false);
  const [petition, setPetition] = useState(0);
  const [cookies] = useCookies(["user"]);

  useEffect(() => {
    // const valueCookie = cookies.user;
    // const decodedUid = atob(valueCookie);
    // console.log(decodedUid)
    setOpenZero(false);
    setOpenPrompt(false);
    setOpenStudio(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [petition]);

  const typeScan = [
    {
      name: "Registros",
      icon: (
        <SensorOccupiedIcon
          sx={{ fontSize: { xs: "15vw", sm: "4vw" }, color: "#1aabff" }}
        />
      ),
      pacth: "/scan-zero",
      description: "Aqui va el form",
      endPoint: "https://api.verifik.co/v2/ocr/scan-zero",
      open: openZero,
      setOpen: setOpenZero,
    },
    {
      name: "Envios",
      icon: (
        <FlipIcon
          sx={{ fontSize: { xs: "15vw", sm: "4vw" }, color: "#1aabff" }}
        />
      ),
      pacth: "/Shipments",
      description: "Aqui va el form",
      endPoint: "https://api.verifik.co/v2/ocr/scan-prompt",
      open: openPrompt,
      setOpen: setOpenPrompt,
    },
    {
      name: "Formulario",
      icon: (
        <ScannerIcon
          sx={{ fontSize: { xs: "15vw", sm: "4vw" }, color: "#1aabff" }}
        />
      ),
      pacth: "/scan-studio",
      description: "Aqui va el form",
      endPoint: "https://api.verifik.co/v2/ocr/scan-studio",
      open: openStudio,
      setOpen: setOpenStudio,
    },
  ];

  return (
    <Box sx={{ color: "#fff", marginTop: "130px" }}>
      <Typography
        align='center'
        color='initial'
        sx={{
          color: "#FF6B00",
          fontFamily: "Nunito",
          fontSize: { xs: "30px", sm: "50px" },
          fontStyle: "normal",
          fontWeight: 800,
          lineHeight: "normal",
          marginBottom: "30px",
        }}
      >
        INTERRAPIDISIMO
      </Typography>
      <Box sx={{ width: "100%" }}>
        {
          <Box
            sx={{
              display: { sm: "flex" },
              justifyContent: "space-around",
            }}
          >
            {typeScan.map((button, index) => (
              <Button
                onClick={() => button.setOpen(true)}
                sx={{
                  marginY: { sm: "0", xs: "20px" },
                  width: { sm: "25%" },
                  padding: "20px",
                  borderRadius: "40px",
                  background: "#08315C",
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                key={index}
              >
                {
                  <Box>
                    <Typography
                      sx={{
                        color: "#FFF",
                        fontFamily: "Nunito",
                        fontSize: { xs: "16px", sm: "24px" },
                        fontStyle: "normal",
                        fontWeight: 700,
                        lineHeight: "normal",
                      }}
                    >
                      {button.name}
                    </Typography>
                    <Box>{button.description}</Box>
                  </Box>
                }
              </Button>
            ))}
          </Box>
        }
      </Box>
    </Box>
  );
};

export default CreateNote;
