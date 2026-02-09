"use client";
import { useEffect, useState } from "react";
import { Box, Typography, IconButton, Alert } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ErrorDisplay() {
  const [errors, setErrors] = useState<string[]>([]);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Capturar errores de consola
    const originalError = console.error;
    console.error = (...args) => {
      setErrors((prev) => [...prev, args.join(" ")]);
      setShow(true);
      originalError(...args);
    };

    // Capturar errores no manejados
    const handleError = (event: ErrorEvent) => {
      setErrors((prev) => [...prev, `Error: ${event.message} at ${event.filename}:${event.lineno}`]);
      setShow(true);
    };

    window.addEventListener("error", handleError);

    return () => {
      console.error = originalError;
      window.removeEventListener("error", handleError);
    };
  }, []);

  if (!show || errors.length === 0) return null;

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        maxHeight: "50vh",
        overflowY: "auto",
        backgroundColor: "rgba(0,0,0,0.95)",
        color: "#fff",
        zIndex: 9999,
        p: 2,
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
        <Typography variant="h6" sx={{ color: "#ff5252" }}>
          🐛 Errores ({errors.length})
        </Typography>
        <IconButton onClick={() => setShow(false)} size="small" sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>
      {errors.map((error, index) => (
        <Alert key={index} severity="error" sx={{ mb: 1, fontSize: "11px" }}>
          {error}
        </Alert>
      ))}
      <Typography variant="caption" sx={{ color: "#888", display: "block", mt: 1 }}>
        Toca el botón X para cerrar. Los errores se siguen capturando en segundo plano.
      </Typography>
    </Box>
  );
}
