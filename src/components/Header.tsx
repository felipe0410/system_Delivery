"use client";
import React, { useEffect, useState } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Avatar,
  InputBase,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { collection, onSnapshot, query } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import SearchResultsModal from "./SearchResultsModal";

function Header() {
  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const [firebaseData, setFirebaseData] = React.useState<
    { [x: string]: any }[]
  >([]);

  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  useEffect(() => {
    const getFirebaseData = async () => {
      try {
        const dataRef = collection(db, "envios");
        const allDocsQuery = query(dataRef);
        onSnapshot(allDocsQuery, (snapshot) => {
          const todaLaData = snapshot.docs.map((doc) => ({
            ...doc.data(),
          }));
          setFirebaseData(todaLaData);
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getFirebaseData();
  }, []);

  return (
    <AppBar
      id='AppBar'
      sx={{ background: "transparent", boxShadow: "none", padding: "15px" }}
      position='static'
    >
      <Toolbar
        id='Toolbar'
        sx={{ display: "flex", justifyContent: "flex-end" }}
      >
        <>
          <Paper
            component='form'
            sx={{
              marginY: "-10px",
              display: "flex",
              alignItems: "center",
              color: "#fff",
              width: "20rem",
              borderRadius: "40px",
              background: "#0A0F37",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <IconButton
              type='button'
              sx={{ p: "10px" }}
              aria-label='search'
              onClick={handleOpenModal}
            >
              <SearchIcon sx={{ color: "#fff" }} />
            </IconButton>
            <InputBase
              onChange={(e) => setSearchTerm(e.target.value)}
              sx={{
                ml: 1,
                flex: 1,
                color: "#fff",
              }}
              placeholder='Buscar'
            />
            <Avatar
              sx={{
                width: 56,
                height: 56,
                marginLeft: "-9%",
                background: "orange",
                position: "absolute",
                right: "0px",
              }}
              alt='Cindy Baker'
              src='/2.jpg'
            />
          </Paper>
          <SearchResultsModal
            open={modalOpen}
            onClose={handleCloseModal}
            data={firebaseData}
            searchTerm={searchTerm}
          />
        </>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
