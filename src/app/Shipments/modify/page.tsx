"use client";
import {
  Box,
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SearchIcon from "@mui/icons-material/Search";
import DriveFileRenameOutlineOutlinedIcon from "@mui/icons-material/DriveFileRenameOutlineOutlined";
import Image from "next/image";
import imgBack from "/public/images/9514099e5193291f5148687e8c14464d.png";

const Page = () => {
  const router = useRouter();

  return (
    <>
      <Paper
        sx={{
          marginTop: "150px",
          borderRadius: "2.5rem",
          background: "rgba(132, 141, 223, 0.58)",
          boxShadow:
            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          paddingLeft: "20px",
          paddingBottom: "2rem",
          marginRight: "4rem",
          marginLeft: "2rem",
        }}
      >
        <Box>
          <Box
            id='title'
            sx={{
              width: '65%',
              display: "flex",
              justifyContent: 'space-between',
              marginLeft: 'auto',
              alignItems: 'center'
            }}
          >
            <Box>
              <Typography
                sx={{
                  color: "#0A0F37",
                  textAlign: "center",
                  fontFamily: "Nunito",
                  fontSize: "2.5rem",
                  fontStyle: "normal",
                  fontWeight: 900,
                  lineHeight: "normal",
                }}
              >
                Modificar Envío
              </Typography>
            </Box>
            <Box>
              <Button
                onClick={() => router.push("/Shipments")}
                sx={{
                  minWidth: "auto",
                  borderRadius: "20PX",
                }}
              >
                <HighlightOffIcon sx={{ color: "red" }} />
              </Button>
            </Box>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            marginLeft: "2rem",
          }}
        >
          <FormControl fullWidth variant='outlined'>
            <Typography
              sx={{
                textAlign: "left",
                color: "#0A0F37",
                fontFamily: "Nunito",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Buscar por guía:
            </Typography>
            <OutlinedInput
              type='text'
              fullWidth
              endAdornment={
                <InputAdornment position='end'>
                  <IconButton
                    aria-label='toggle password visibility'
                    edge='end'
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              }
              sx={{
                borderRadius: "40px",
                background: "rgba(255, 255, 255, 0.77)",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                height: "3rem",
                width: " 90%",
              }}
            />
          </FormControl>
          <FormControl fullWidth variant='outlined'>
            <Typography
              sx={{
                textAlign: "left",
                color: "#0A0F37",
                fontFamily: "Nunito",
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Destinatario:
            </Typography>
            <OutlinedInput
              type='text'
              fullWidth
              sx={{
                borderRadius: "40px",
                background: "rgba(255, 255, 255, 0.77)",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                height: "3rem",
                width: " 90%",
              }}
            />
          </FormControl>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "1rem",
            }}
          >
            <FormControl fullWidth variant='outlined'>
              <Typography
                sx={{
                  textAlign: "left",
                  color: "#0A0F37",
                  fontFamily: "Nunito",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                Valor envío:
              </Typography>
              <OutlinedInput
                type='text'
                fullWidth
                sx={{
                  borderRadius: "40px",
                  background: "rgba(255, 255, 255, 0.77)",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  height: "3rem",
                  width: " 80%",
                }}
              />
            </FormControl>
            <FormControl fullWidth variant='outlined'>
              <Typography
                sx={{
                  textAlign: "left",
                  color: "#0A0F37",
                  fontFamily: "Nunito",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                Caja:
              </Typography>
              <OutlinedInput
                type='text'
                fullWidth
                sx={{
                  borderRadius: "40px",
                  background: "rgba(255, 255, 255, 0.77)",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  height: "3rem",
                  width: " 80%",
                }}
              />
            </FormControl>
            <FormControl fullWidth variant='outlined'>
              <Typography
                sx={{
                  textAlign: "left",
                  color: "#0A0F37",
                  fontFamily: "Nunito",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                N. de paquete:
              </Typography>
              <OutlinedInput
                type='text'
                fullWidth
                sx={{
                  borderRadius: "40px",
                  background: "rgba(255, 255, 255, 0.77)",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  height: "3rem",
                  width: " 80%",
                }}
              />
            </FormControl>
            <FormControl fullWidth variant='outlined'>
              <Typography
                sx={{
                  textAlign: "left",
                  color: "#0A0F37",
                  fontFamily: "Nunito",
                  fontSize: "24px",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                Entregar:
              </Typography>
              <Select
                sx={{
                  borderRadius: "40px",
                  background: "rgba(255, 255, 255, 0.77)",
                  boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  height: "3rem",
                  width: " 80%",
                }}
              >
                <MenuItem value='mensajero'>Mensajero</MenuItem>
                <MenuItem value='domicilio'>Domicilio</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <Box
          sx={{
            marginTop: "2rem",
            textAlign: "center",
          }}
        >
          <Button
            sx={{
              padding: "15px",
              borderRadius: "40px",
              background: "#00A410",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              textAlign: "center",
              justifyContent: "space-around",
            }}
          >
            <DriveFileRenameOutlineOutlinedIcon style={{ color: "#fff" }} />
            <Typography
              sx={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "0.875rem",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              MODIFICAR
            </Typography>
          </Button>
        </Box>
      </Paper>
      <Box
        sx={{
          zIndex: "-1",
          position: "absolute",
          right: "-25px",
          bottom: "-30px",
        }}
      >
        <Image alt='img-background' src={imgBack} width={456} height={456} />
      </Box>
    </>
  );
};

export default Page;
