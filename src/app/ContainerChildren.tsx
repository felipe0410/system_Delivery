"use client";
import { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import { keyframes } from "@emotion/react";
import { useCookies } from "react-cookie";

const ContainerChildren = ({
  childrenn,
  validationRoutes,
}: {
  childrenn: any;
  validationRoutes: any;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cookies] = useCookies(["user"]);

  const [validation, setValidation] = useState(false);
  const validationCookie = cookies?.user?.length > 0;

  useEffect(() => {
    if (validationCookie) {
      if (validationRoutes) {
        window.location.href = "/TableShipments";
        setTimeout(() => {
          setValidation(true);
        }, 2000);
      } else {
        setValidation(true);
      }
    } else {
      if (!validationRoutes) {
        window.location.href = "/sign_in";
        setTimeout(() => {
          setValidation(true);
        }, 2000);
      } else {
        setValidation(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const myAnim = keyframes`
    0% {
      transform: scale(0.3);
    }
  
    100% {
      transform: scale(1);
    }
  `;

  return (
    <>
      {validation ? (
        <>{childrenn}</>
      ) : (
        <Box
          id="false"
          sx={{
            background: "black",
            position: "fixed",
            zIndex: 8,
            top: 0,
            left: 0,
            flexDirection: "column",
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            align="center"
            sx={{
              color: "#FFF",
              textShadow: "0px 0px 20px #69EAE2",
              fontFamily: "Nunito",
              fontSize: { xs: "8rem", sm: "12.75rem" },
              fontStyle: "normal",
              fontWeight: 800,
              lineHeight: "normal",
              animation: `${myAnim} 2s ease 0s 1 normal forwards`,
            }}
          >
            Interrapisino
            <Typography
              align="center"
              sx={{
                color: "#69EAE2",
                fontFamily: "Nunito",
                fontSize: { xs: "4rem", sm: "8rem" },
                fontStyle: "normal",
                fontWeight: 800,
                lineHeight: "normal",
                animation: `${myAnim} 2s ease 0s 1 normal forwards`,
              }}
            >
              Bienvenido
            </Typography>
          </Typography>
        </Box>
      )}
    </>
  );
};

export default ContainerChildren;
