"use client";
import React, { useState } from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import {
  Box,
  Typography,
  Button,
  useMediaQuery,
  useTheme,
  SwipeableDrawer,
} from "@mui/material";
import { usePathname } from "next/navigation";
import MarkAsUnreadTwoToneIcon from "@mui/icons-material/MarkAsUnreadTwoTone";
import AnalyticsTwoToneIcon from "@mui/icons-material/AnalyticsTwoTone";
import ReceiptLongTwoToneIcon from "@mui/icons-material/ReceiptLongTwoTone";
import AppRegistrationRoundedIcon from "@mui/icons-material/AppRegistrationRounded";
import DeliveryDiningTwoToneIcon from "@mui/icons-material/DeliveryDiningTwoTone";
import AssignmentTwoToneIcon from "@mui/icons-material/AssignmentTwoTone";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import { singOut } from "@/firebase/firebase";
import { useCookies } from "react-cookie";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import QrCode2OutlinedIcon from "@mui/icons-material/QrCode2Outlined";
import AppShortcutSharpIcon from "@mui/icons-material/AppShortcutSharp";

const Sidebar = () => {
  const [open, setOpen] = useState(false);
  const [cookies, removeCookie] = useCookies(["user"]);
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down("sm"));
  const pathname = usePathname();

  const sections = [
    {
      section: "Inicio",
      icon: (
        <AnalyticsTwoToneIcon
          id="content icon home"
          sx={{ fontSize: { sm: "40px" } }}
          style={{ color: pathname === "/" ? "#0A0F37" : "#fff" }}
        />
      ),
      id: "/",
    },
    {
      section: "Registro de Envios",
      icon: (
        <AssignmentTwoToneIcon
          sx={{ fontSize: { sm: "40px" } }}
          style={{
            color: pathname.startsWith("/TableShipments") ? "#0A0F37" : "#fff",
          }}
        />
      ),
      id: "/TableShipments",
    },
    {
      section: "Scanear envios",
      icon: (
        <QrCode2OutlinedIcon
          sx={{ fontSize: { sm: "40px" } }}
          style={{
            color: pathname.startsWith("/getData") ? "#0A0F37" : "#fff",
          }}
        />
      ),
      id: "/getData",
    },
    {
      section: "Editar Datos",
      icon: (
        <AppRegistrationRoundedIcon
          sx={{ fontSize: { sm: "40px" } }}
          style={{
            color: pathname.startsWith("/confirmData") ? "#0A0F37" : "#fff",
          }}
        />
      ),
      id: "/confirmData",
    },
    {
      section: "Domicilairio",
      icon: (
        <DeliveryDiningTwoToneIcon
          sx={{ fontSize: { sm: "40px" } }}
          style={{
            color: pathname.startsWith("/domiciliario") ? "#0A0F37" : "#fff",
          }}
        />
      ),
      id: "/domiciliario",
    },
    {
      section: "Entregar",
      icon: (
        <AppShortcutSharpIcon
          sx={{ fontSize: { sm: "40px" } }}
          style={{
            color: pathname.startsWith("/gestion") ? "#0A0F37" : "#fff",
          }}
        />
      ),
      id: "/gestion",
    },
    {
      section: "Envios",
      icon: (
        <MarkAsUnreadTwoToneIcon
          sx={{ fontSize: { sm: "40px" } }}
          style={{
            color: pathname.startsWith("/Shipments") ? "#0A0F37" : "#fff",
          }}
        />
      ),
      id: "/Shipments",
    },

    {
      section: "Generar Reporte",
      icon: (
        <ReceiptLongTwoToneIcon
          sx={{ fontSize: { sm: "40px" } }}
          style={{
            color: pathname.startsWith("/GenerateReport") ? "#0A0F37" : "#fff",
          }}
        />
      ),
      id: "/GenerateReport",
    },
  ];

  return (
    <>
      <Button sx={{ paddingTop: "20px" }} onClick={() => setOpen(true)}>
        <MenuRoundedIcon sx={{ color: "#0A0F37C2", fontSize: "35px" }} />
      </Button>
      <SwipeableDrawer
        id="Drawer"
        variant={matchesSM ? undefined : "permanent"}
        anchor="left"
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          style: {
            background: "transparent",
            border: "none",
            maxWidth: matchesSM ? "45%" : "auto",
          },
        }}
      >
        <List
          sx={{
            background: "#0A0F37",
            height: "100%",
            borderRadius: "0px 40px 40px 0px",
            overflow: "hidden",
          }}
        >
          <Box
            id="containerIMG"
            sx={{
              textAlignLast: "center",
              marginTop: "30px",
              marginBottom: "20px",
            }}
          >
            <Image
              style={{ width: "80%", height: "auto" }}
              alt="company-logo"
              src={logo}
            />
            <Box sx={{ textAlign: "-webkit-center", marginBottom: "20px" }}>
              <Box
                width={"90%"}
                height={"1px"}
                sx={{ background: "#87888C" }}
              />
            </Box>
          </Box>
          <Box id="containerSections">
            {sections.map((section: any) => (
              <Box sx={{ marginY: "2px" }} key={crypto.randomUUID()}>
                <Link
                  href={section.id}
                  style={{ textDecoration: "none", color: "#0A0F37" }}
                >
                  <ListItem
                    sx={{
                      background:
                        section.id === "/"
                          ? pathname === "/"
                            ? "#BCC1EE"
                            : "transparent"
                          : pathname.startsWith(section.id)
                          ? "#BCC1EE"
                          : "transparent",
                      borderRadius:
                        section.id === "/"
                          ? pathname === "/"
                            ? "40px 0px 0px 40px"
                            : "0"
                          : pathname.startsWith(section.id)
                          ? "40px 0px 0px 40px"
                          : "0",
                      marginLeft: { xs: "5px", sm: "10px" },
                      padding: { sm: "20px" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: { xs: "35px", sm: "56px" } }}>
                      {section.icon}
                    </ListItemIcon>
                    <ListItemText>
                      <Typography
                        sx={{
                          color:
                            section.id === "/"
                              ? pathname === "/"
                                ? "#0A0F37"
                                : "#FFF"
                              : pathname.startsWith(section.id)
                              ? "#0A0F37"
                              : "#FFF",
                          fontFamily: "Nunito",
                          fontSize: { xs: "16px", sm: "20px" },
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                          textDecoration: "none",
                        }}
                      >
                        {section.section}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                </Link>
              </Box>
            ))}
            <Box
              sx={{ marginTop: "100%", position: "absolute", bottom: "5px" }}
            >
              <Button
                onClick={async () => {
                  await singOut();
                  removeCookie("user", "");
                  window.location.reload();
                }}
                sx={{
                  margin: "0 auto",
                  display: "flex",
                  justifyContent: "space-around",
                  width: "90%",
                  marginLeft: { xs: "7px", sm: "10px", lg: "15px" },
                  padding: { sm: "20px", md: "10px", lg: "10px" },
                }}
              >
                <LogoutIcon
                  sx={{
                    minWidth: { xs: "45px", sm: "56px" },
                    fontSize: { sm: "40px" },
                    color: "#fff",
                  }}
                />
                <Typography
                  sx={{
                    color: "#fff",
                    fontFamily: "Nunito",
                    fontSize: { xs: "16px", sm: "20px" },
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                    textDecoration: "none",
                  }}
                >
                  Salir
                </Typography>
              </Button>
            </Box>
          </Box>
        </List>
      </SwipeableDrawer>
    </>
  );
};

export default Sidebar;
