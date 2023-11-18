import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  Avatar,
  Divider,
  InputBase,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import DirectionsIcon from '@mui/icons-material/Directions';


function Header() {
  return (
    <AppBar
      id='AppBar'
      sx={{ background: "transparent", boxShadow: "none", padding: "15px" }}
      position='static'
    >
      <Toolbar id='Toolbar' sx={{ display: "flex", justifyContent: "flex-end" }}>
        <>
          <Paper
            component="form"
            sx={{
              marginY: '-10px',
              display: 'flex',
              alignItems: 'center',
              color: "#fff",
              width: "20rem",
              borderRadius: "40px",
              background: "#0A0F37",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          >
            <IconButton type="button" sx={{ p: '10px' }} aria-label="search">
              <SearchIcon sx={{ color: "#fff" }} />
            </IconButton>
            <InputBase
              sx={{
                ml: 1, flex: 1, color: "#fff"
              }}
              placeholder='Buscar'
            />
            <Avatar
              sx={{
                width: 56, height: 56, marginLeft: '-9%', background: 'orange',
                position: 'absolute',
                right: '0px'

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
