"use client";

import { Box, Button } from "@mui/material";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import ForwardToInboxOutlinedIcon from "@mui/icons-material/ForwardToInboxOutlined";
import CachedIcon from "@mui/icons-material/Cached";
import ControlPointIcon from "@mui/icons-material/ControlPoint";
import Link from "next/link";
import Image from "next/image";
import imgBack from "/public/images/e181331c8066f48085e340b5de3660ff.png";

const Shipments = () => {
  const sectionsShipments = [
    {
      name: "ENTREGAR",
      icon: (
        <ForwardToInboxOutlinedIcon
          sx={{ fontSize: { xs: "15vw", sm: "3rem" }, color: "#FFF" }}
        />
      ),
      id: "/Shipments/deliver",
    },
    {
      name: "MODIFICAR ENVIO",
      icon: (
        <CachedIcon
          sx={{ fontSize: { xs: "15vw", sm: "3rem" }, color: "#FFF" }}
        />
      ),
      id: "/Shipments/modify",
    },
    {
      name: "AGREGAR ENVIO",
      icon: (
        <ControlPointIcon
          sx={{ fontSize: { xs: "15vw", sm: "3rem" }, color: "#FFF" }}
        />
      ),
      id: "/Shipments/addShipment",
    },
    {
      name: "MENSAJERO",
      icon: (
        <LocalShippingOutlinedIcon
          sx={{ fontSize: { xs: "15vw", sm: "3rem" }, color: "#FFF" }}
        />
      ),
      id: "/Shipments/mensajero",
    },
  ];
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "80vh",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "40vh",
        }}
      >
        {sectionsShipments.map((button) => {
          return (
            <Box sx={{ width: "40%" }} key={button.name}>
              <Link href={button.id}>
                <Button
                  sx={{
                    padding: "15px",
                    width: "90%",
                    borderRadius: "40px",
                    background: "#5C68D4",
                    boxShadow:
                      "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                    textAlign: "center",
                    justifyContent: "space-around",
                  }}
                >
                  <Box>{button.icon}</Box>
                  <Box
                    sx={{
                      fontFamily: "Nunito",
                      color: "#FFF",
                      fontSize: "1.5rem",
                      fontStyle: "normal",
                      fontWeight: 700,
                    }}
                  >
                    {button.name}
                  </Box>
                </Button>
              </Link>
            </Box>
          );
        })}
      </Box>
      <Box
        sx={{ zIndex: "-1", position: "absolute", right: "1px", bottom: "5px" }}
      >
        <Image alt='img-background' src={imgBack} width={226} height={456} />
      </Box>
    </Box>
  );
};

export default Shipments;
