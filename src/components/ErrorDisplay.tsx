"use client";
import { useEffect, useState, useRef } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function ErrorDisplay() {
  const [errors, setErrors] = useState<Array<{ message: string; timestamp: number }>>([]);
  const [show, setShow] = useState(false);
  const errorCountRef = useRef(0);
  const isCapturingRef = useRef(false);

  useEffect(() => {
    if (isCapturingRef.current) return;
    isCapturingRef.current = true;

    // Capturar errores de consola
    const originalError = console.error;
    console.error = (...args) => {
      // Evitar capturar errores de React DevTools y warnings menores
      const message = args.join(" ");
      if (
        !message.includes("Warning:") &&
        !message.includes("Download the React DevTools") &&
        !message.includes("third-party cookies") &&
        errorCountRef.current < 50 // Límite de errores
      ) {
        errorCountRef.current++;
        setErrors((prev) => [...prev, { message, timestamp: Date.now() }]);
        setShow(true);
      }
      originalError(...args);
    };

    // Capturar errores no manejados
    const handleError = (event: ErrorEvent) => {
      if (errorCountRef.current < 50) {
        errorCountRef.current++;
        setErrors((prev) => [
          ...prev,
          {
            message: `${event.message}\nat ${event.filename}:${event.lineno}:${event.colno}`,
            timestamp: Date.now(),
          },
        ]);
        setShow(true);
      }
    };

    // Capturar rechazos de promesas
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      if (errorCountRef.current < 50) {
        errorCountRef.current++;
        setErrors((prev) => [
          ...prev,
          {
            message: `Unhandled Promise Rejection: ${event.reason}`,
            timestamp: Date.now(),
          },
        ]);
        setShow(true);
      }
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      console.error = originalError;
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleUnhandledRejection);
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
        maxHeight: "40vh",
        overflowY: "auto",
        backgroundColor: "rgba(0,0,0,0.98)",
        color: "#fff",
        zIndex: 99999,
        p: { xs: 1, sm: 2 },
        borderTop: "3px solid #ff5252",
      }}
    >
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
        <Typography variant="h6" sx={{ color: "#ff5252", fontSize: { xs: "14px", sm: "18px" } }}>
          🐛 Errores ({errors.length})
        </Typography>
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            onClick={() => {
              setErrors([]);
              errorCountRef.current = 0;
            }}
            size="small"
            sx={{ color: "#ffa726", fontSize: "12px" }}
          >
            🗑️
          </IconButton>
          <IconButton onClick={() => setShow(false)} size="small" sx={{ color: "#fff" }}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
      <Box sx={{ maxHeight: "30vh", overflowY: "auto" }}>
        {errors.map((error, index) => (
          <Box
            key={index}
            sx={{
              mb: 1,
              p: 1,
              backgroundColor: "rgba(255, 82, 82, 0.1)",
              borderLeft: "3px solid #ff5252",
              borderRadius: "4px",
            }}
          >
            <Typography
              sx={{
                fontSize: { xs: "10px", sm: "12px" },
                fontFamily: "monospace",
                color: "#ffcdd2",
                wordBreak: "break-word",
              }}
            >
              {error.message}
            </Typography>
            <Typography
              sx={{
                fontSize: "9px",
                color: "#888",
                mt: 0.5,
              }}
            >
              {new Date(error.timestamp).toLocaleTimeString()}
            </Typography>
          </Box>
        ))}
      </Box>
      <Typography
        variant="caption"
        sx={{
          color: "#888",
          display: "block",
          mt: 1,
          fontSize: { xs: "9px", sm: "11px" },
        }}
      >
        🗑️ = Limpiar | ✕ = Cerrar (sigue capturando)
      </Typography>
    </Box>
  );
}
