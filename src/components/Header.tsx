import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

function Header() {
  return (
    <AppBar
      id='AppBar'
      sx={{ background: "transparent", boxShadow: "none", padding: "15px" }}
      position='static'
    >
      <Toolbar sx={{ display: "flex", justifyContent: "flex-end" }}>
        <TextField
          variant='outlined'
          id='Search'
          sx={{
            right: "6rem",
            top: "3rem",
            color: "#fff",
            width: "20rem",
            borderRadius: "40px",
            background: "#0A0F37",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
          placeholder='Buscar'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: "#fff" }} />
              </InputAdornment>
            ),
            style: {
              color: "#FFF",
            },
          }}
        />
        <Avatar
          sx={{
            width: 65,
            height: 65,
            marginLeft: "-40px",
            right: "6rem",
            top: "3rem",
          }}
          alt='Cindy Baker'
          src='/2.jpg'
        />
      </Toolbar>
    </AppBar>
  );
}

export default Header;
