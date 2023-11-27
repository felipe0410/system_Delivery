"use client";
import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Box, Typography, Button, useMediaQuery, useTheme, SwipeableDrawer } from "@mui/material";
import { usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo.svg";
import LogoutIcon from "@mui/icons-material/Logout";
import { singOut } from "@/firebase/firebase";
import { Cookies, useCookies } from "react-cookie";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";


const Sidebar = () => {
  const [open, setOpen] = useState(false)
  const [cookies, removeCookie] = useCookies(["user"]);
  const theme = useTheme();
  const matchesSM = useMediaQuery(theme.breakpoints.down('sm'));
  const pathname = usePathname();

  const sections = [
    {
      section: "Inicio",
      icon: (
        <HomeIcon
          id='content icon home'
          sx={{ fontSize: { sm: '40px' } }}
          style={{ color: pathname === "/" ? "#0A0F37" : "#fff" }}
        />
      ),
      id: "/",
    },
    {
      section: "Envios",
      icon: (
        <LocalShippingIcon
          sx={{ fontSize: { sm: '40px' } }}
          style={{
            color: pathname.startsWith("/Shipments") ? "#0A0F37" : "#fff",
          }}
        />
      ),
      id: "/Shipments",
    },
    {
      section: "Registro de Envios",
      icon: (
        <AssignmentIcon
          sx={{ fontSize: { sm: '40px' } }}
          style={{
            color: pathname.startsWith("/TableShipments") ? "#0A0F37" : "#fff",
          }}
        />
      ),
      id: "/TableShipments",
    },
  ];

  return (
    <>
      <Button sx={{ paddingTop: '20px' }} onClick={() => setOpen(true)}>
        <MenuRoundedIcon sx={{ color: '#0A0F37C2', fontSize: '35px' }} />
      </Button>
      <SwipeableDrawer
        id='Drawer'
        variant={matchesSM ? undefined : 'permanent'}
        anchor='left'
        open={open}
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        PaperProps={{
          style: {
            background: "transparent",
            border: "none",
            maxWidth: matchesSM ? '45%' : 'auto'
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
            id='containerIMG'
            sx={{
              textAlignLast: "center",
              marginTop: "30px",
              marginBottom: "20px",
            }}
          >
            <Image style={{ width: '80%' }} alt='company-logo' src={logo} />
            <Box sx={{ textAlign: "-webkit-center", marginBottom: "20px" }}>
              <Box width={"90%"} height={"1px"} sx={{ background: "#87888C" }} />
            </Box>
          </Box>
          <Box id='containerSections'>
            {sections.map((section: any, index: number) => (
              <Box sx={{ marginY: "40px" }} key={index}>
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
                      marginLeft: { xs: '5px', sm: "10px" },
                      padding: { sm: "20px" },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: { xs: '35px', sm: '56px' } }}>{section.icon}</ListItemIcon>
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
                          fontSize: { xs: '16px', sm: "20px" },
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
            <Box sx={{ marginTop: '100%', position: 'absolute', bottom: '30px' }}>
              <Button
                onClick={async () => {
                  await singOut();
                  removeCookie("user", "");
                  window.location.reload();
                }}
                sx={{
                  margin: '0 auto',
                  display: "flex",
                  justifyContent: 'space-around',
                  width: "90%",
                  marginLeft: { xs: '7px', sm: "10px" },
                  padding: { sm: "20px" },
                }}
              >
                <LogoutIcon
                  sx={{
                    minWidth: { xs: '45px', sm: '56px' },
                    fontSize: { sm: '40px' },
                    color: "#fff",

                  }}
                />
                <Typography
                  sx={{
                    color: "#fff",
                    fontFamily: "Nunito",
                    fontSize: { xs: '16px', sm: "20px" },
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
