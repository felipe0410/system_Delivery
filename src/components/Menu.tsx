"use client";
import * as React from "react";
import Box from "@mui/material/Box";
import SpeedDial from "@mui/material/SpeedDial";
import SpeedDialAction from "@mui/material/SpeedDialAction";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import AssignmentIcon from "@mui/icons-material/Assignment";
import { useRouter } from "next/navigation";
const sections = [
  {
    section: "Inicio",
    icon: <HomeIcon fontSize='large' />,
    id: "/",
    name: "Inicio",
  },
  {
    section: "Envios",
    icon: <LocalShippingIcon fontSize='large' />,
    id: "/Shipments",
    name: "Envios",
  },
  {
    section: "Registro de Envios",
    icon: <AssignmentIcon fontSize='large' />,
    id: "/TableShipments",
    name: "Registro",
  },
];
export default function Menu() {
  const router = useRouter();

  return (
    <Box sx={{ height: 320, transform: "translateZ(0px)", flexGrow: 1 }}>
      <SpeedDial
        ariaLabel='SpeedDial openIcon example'
        sx={{ position: "absolute", top: "10px" }}
        icon={<MenuRoundedIcon />}
        direction='down'
      >
        {sections.map((action) => (
          <SpeedDialAction
            sx={{ padding: "20px" }}
            key={action.id}
            icon={action.icon}
            tooltipOpen
            tooltipTitle={action.name}
            tooltipPlacement='right'
            onClick={() => router.push(action.id)}
          />
        ))}
      </SpeedDial>
    </Box>
  );
}
