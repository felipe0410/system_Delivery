"use client";
import { getStatusShipmentsData } from "@/firebase/firebase";
import { Box, CircularProgress, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import MapView from "../domiciliario/MapView";

const CACHE_KEY = "mapa_entregas_cache";
const CACHE_DURATION = 8 * 60 * 60 * 1000; // 8 horas en milisegundos

const MapaPage = () => {
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [usingCache, setUsingCache] = useState(false);

  const forceRefresh = () => {
    setLoading(true);
    setUsingCache(false);
    
    // Limpiar caché
    localStorage.removeItem(CACHE_KEY);
    
    // Consultar Firebase
    const status = "mensajero";
    getStatusShipmentsData(status, (data) => {
      const packages = data || [];
      setPackages(packages);
      setLoading(false);
      
      // Guardar en caché
      try {
        const cacheData = {
          data: packages,
          timestamp: Date.now()
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
        console.log("💾 Datos actualizados y guardados en caché");
      } catch (error) {
        console.error("Error al guardar caché:", error);
      }
    });
  };

  useEffect(() => {
    const loadData = () => {
      try {
        // Intentar cargar desde caché
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          const now = Date.now();
          
          // Verificar si el caché es válido (menos de 8 horas)
          if (now - timestamp < CACHE_DURATION) {
            console.log("✅ Cargando desde caché (válido por", Math.round((CACHE_DURATION - (now - timestamp)) / 1000 / 60), "minutos más)");
            setPackages(data);
            setLoading(false);
            setUsingCache(true);
            return;
          } else {
            console.log("⏰ Caché expirado, consultando Firebase...");
          }
        }
      } catch (error) {
        console.error("Error al leer caché:", error);
      }

      // Si no hay caché válido, consultar Firebase
      const status = "mensajero";
      getStatusShipmentsData(status, (data) => {
        const packages = data || [];
        setPackages(packages);
        setLoading(false);
        
        // Guardar en caché
        try {
          const cacheData = {
            data: packages,
            timestamp: Date.now()
          };
          localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
          console.log("💾 Datos guardados en caché por 8 horas");
        } catch (error) {
          console.error("Error al guardar caché:", error);
        }
      });
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100vh",
          gap: 2,
          backgroundColor: "#fff",
        }}
      >
        <CircularProgress size={60} sx={{ color: "#d32f2f" }} />
        <Typography variant="h6" sx={{ color: "#d32f2f" }}>
          {usingCache ? "Cargando desde caché..." : "Consultando Firebase..."}
        </Typography>
      </Box>
    );
  }

  // Abrir el mapa directamente
  return (
    <Box sx={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000 }}>
      <MapView 
        packages={packages} 
        onClose={() => {
          // Opcional: redirigir o no hacer nada
          console.log("Mapa cerrado");
        }}
      />
    </Box>
  );
};

export default MapaPage;
