"use client";
import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();

  const [validation, setValidation] = useState(false);
  const validationCookie = cookies?.user?.length > 0;

  useEffect(() => {
    if (validationCookie) {
      if (validationRoutes) {
        // Solo redirigir si no estamos ya en una ruta válida
        if (pathname === "/sign_in" || pathname === "/sign_up") {
          router.push("/TableShipments");
        } else {
          setValidation(true);
        }
      } else {
        setValidation(true);
      }
    } else {
      if (!validationRoutes) {
        router.push("/sign_in");
      } else {
        setValidation(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validationCookie, validationRoutes, pathname]);

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
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
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
            </Typography>
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
          </Box>
        </Box>
      )}
    </>
  );
};

export default ContainerChildren;
