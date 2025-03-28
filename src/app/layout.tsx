import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Box } from "@mui/material";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import "@fontsource/nunito/200.css";
import "@fontsource/nunito/300.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@fontsource/nunito/900.css";
import ContainerChildren from "./ContainerChildren";
// import { useRouter } from "next/navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Interrapidisimo",
  description: "Delivery system",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const route: any =
    (children as React.ReactElement)?.props?.childProp?.segment ?? null;
  const validationRoutes = ["sign_up", "sign_in", "enviosHoy", "__DEFAULT__"].includes(
    route
  );

  return (
    <html lang="en" style={{ height: "100%" }}>
      <body
        style={{
          height: "100%",
          margin: "0",
          background: validationRoutes
            ? ""
            : "linear-gradient(180deg, #5C68D4 0%, rgba(92, 104, 212, 0.55) 0%, rgba(92, 104, 212, 0.00) 100%)",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      >
        {validationRoutes ? (
          <>{children}</>
        ) : (
          <>
            (
            <Box
              id="Container Sidebar"
              sx={{
                position: "fixed",
                top: 0,
                left: 0,
                height: "100%",
                zIndex: 7,
              }}
            >
              <Sidebar />
            </Box>
            <Box
              sx={{
                position: "fixed",
                top: 0,
                left: { xs: "100px", sm: "263px" },
                right: 0,
                zIndex: 5,
              }}
            >
              <Header />
            </Box>
            <Box
              id="container children layout"
              sx={{
                height: validationRoutes ? "100%" : "80%",
                marginTop: "64px",
                marginLeft: { sm: "265px" },
              }}
            >
              {
                <>
                  <ContainerChildren
                    childrenn={children}
                    validationRoutes={validationRoutes}
                  />
                </>
              }
            </Box>
            )
          </>
        )}
      </body>
    </html>
  );
}
