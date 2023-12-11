"use client";
import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Avatar,
  Paper,
} from "@mui/material";
import SearchAutocomplete from "./SearchAutocomplete";

function Header() {
  // const [searchTerm, setSearchTerm] = useState("");

  return (
    <AppBar
      id='AppBar'
      sx={{
        background: "transparent",
        boxShadow: "none",
        padding: "15px",
      }}
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
              width: { xs: "15rem", sm: "20rem" },
              borderRadius: "40px",
              // background: "#0A0F37",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
           
            <SearchAutocomplete />
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

        </>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
