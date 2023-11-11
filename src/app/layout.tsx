import Header from "@/components/Header";
import Menu from "@/components/Menu";
import Sidebar from "@/components/Sidebar";
import { Box } from "@mui/material";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

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
  return (
    <html lang='en'>
      <body
        style={{
          margin: "0",
          background:
            "linear-gradient(180deg, #5C68D4 0%, rgba(92, 104, 212, 0.55) 0%, rgba(92, 104, 212, 0.00) 100%)",
        }}
      >
        <Box
          id='Container Sidebar'
          sx={{
            display: { xs: "none", sm: "block" },
            position: "fixed",
            top: 0,
            left: 0,
            height: "100vh",
            zIndex: 1300,
          }}
        >
          <Sidebar />
        </Box>
        <Box
          sx={{
            display: { sm: "none", xs: "block" },
            bottom: "10px",
            right: "10px",
            zIndex: 10,
            position: "fixed",
          }}
        >
          <Menu />
        </Box>
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: "263px",
            right: 0,
            zIndex: 1400,
          }}
        >
          <Header />
        </Box>
        <Box
          id='container children layout'
          sx={{
            marginTop: "64px",
            marginLeft: { sm: "265px" },
          }}
        >
          {children}
        </Box>
        +{" "}
      </body>
    </html>
  );
}
