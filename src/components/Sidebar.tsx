"use client";
import React from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Box, Typography, Button } from "@mui/material";
import { usePathname } from "next/navigation";
import HomeIcon from "@mui/icons-material/Home";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import AssignmentIcon from "@mui/icons-material/Assignment";
import Link from "next/link";
import Image from "next/image";
import logo from "/public/images/logo.svg";
import LogoutIcon from '@mui/icons-material/Logout';
import { singOut } from "@/firebase/firebase";
import { Cookies, useCookies } from "react-cookie"

const Sidebar = () => {
  const [cookies, removeCookie] = useCookies(['user']);
  const pathname = usePathname();
  const sections = [
    {
      section: "Inicio",
      icon: <HomeIcon fontSize='large' style={{ color: pathname === '/' ? "#0A0F37" : "#fff" }} />,
      id: "/",
    },
    {
      section: "Envios",
      icon: <LocalShippingIcon fontSize='large' style={{ color: pathname === '/Shipments' ? "#0A0F37" : "#fff" }} />,
      id: "/Shipments",
    },
    {
      section: "Registro de Envios",
      icon: <AssignmentIcon fontSize='large' style={{ color: pathname === '/TableShipments' ? "#0A0F37" : "#fff" }} />,
      id: "/TableShipments",
    },
  ];

  return (
    <Drawer
      id='Drawer'
      variant='permanent'
      anchor='left'
      PaperProps={{
        style: {
          background: "transparent",
          border: 'none'
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
          <Image width={200} height={100} alt='company-logo' src={logo} />
        </Box>
        <Box sx={{ textAlign: "-webkit-center", marginBottom: "20px" }}>
          <Box width={"90%"} height={"1px"} sx={{ background: "#87888C" }} />
        </Box>
        <Box id='containerSections'>
          {sections.map((section: any, index: number) => (
            <Box sx={{ marginY: "40px" }} key={index}>
              <Link href={section.id} style={{ textDecoration: 'none', color: '#0A0F37' }} >
                <ListItem
                  sx={{
                    background:
                      pathname === section.id ? "#BCC1EE" : "transparent",
                    borderRadius:
                      pathname === section.id ? "40px 0px 0px 40px" : "0",
                    marginLeft: "10px",
                    padding: "20px",
                  }}
                >
                  <ListItemIcon>{section.icon}</ListItemIcon>
                  <ListItemText
                  >
                    <Typography sx={{
                      color: pathname === section.id ? "#0A0F37" : "#FFF",
                      fontFamily: "Nunito",
                      fontSize: "20px",
                      fontStyle: "normal",
                      fontWeight: 700,
                      lineHeight: "normal",
                      textDecoration: 'none'
                    }}>
                      {section.section}
                    </Typography>
                  </ListItemText>
                </ListItem>
              </Link>
            </Box>
          ))}
        </Box>
        <Box sx={{
          height: '40%',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'center'
        }}>
          <Button
            onClick={async () => {
              await singOut()
              removeCookie('user', '');
              window.location.reload();
            }}
            sx={{
              display: 'flex',
              width: '90%',
              justifyContent: 'space-around'
            }} >
            <LogoutIcon
              fontSize='large'
              sx={{
                color: '#fff'
              }} />
            <Typography sx={{
              color: '#fff',
              fontFamily: "Nunito",
              fontSize: "20px",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
              textDecoration: 'none'
            }}>
              CERRAR SESION
            </Typography>
          </Button>
        </Box>
      </List>
    </Drawer>
  );
}

export default Sidebar;
