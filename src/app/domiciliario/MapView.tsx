"use client";
import React, { useState, useEffect, useCallback } from "react";
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api";
import { Box, Typography, Chip, IconButton, Alert, TextField, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import NavigationIcon from "@mui/icons-material/Navigation";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// Centro por defecto: Aquitania, Boyacá
const defaultCenter = {
  lat: 5.5167,
  lng: -72.9,
};

interface MapViewProps {
  packages: any[];
  onClose: () => void;
}

interface GeocodedLocation {
  lat: number;
  lng: number;
  direccionCorregida?: string;
  lastUpdated: string;
}

const MapView: React.FC<MapViewProps> = ({ packages, onClose }) => {
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [markers, setMarkers] = useState<any[]>([]);
  const [center, setCenter] = useState(defaultCenter);
  const [editingPackage, setEditingPackage] = useState<any>(null);
  const [editedAddress, setEditedAddress] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [filterStatus, setFilterStatus] = useState<"all" | "pending" | "delivered">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Cargar Google Maps API
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  });

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  // Filtrar marcadores según búsqueda
  const filteredMarkers = markers.filter((marker) => {
    const matchesSearch = 
      marker.package.addressee?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marker.package.uid?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      marker.address?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Función para guardar coordenadas en Firebase
  const saveGeocodedLocation = async (packageId: string, location: GeocodedLocation) => {
    try {
      const { doc, updateDoc } = await import("firebase/firestore");
      const { db } = await import("@/firebase/firebase");
      
      const packageRef = doc(db, "envios", packageId);
      await updateDoc(packageRef, {
        geocoded: location
      });
      
      console.log(`✅ Coordenadas guardadas para ${packageId}`);
    } catch (error) {
      console.error(`❌ Error guardando coordenadas para ${packageId}:`, error);
    }
  };

  // Función para marcar como entregado (sin cambiar status)
  const markAsDelivered = async (packageId: string) => {
    try {
      const { updatedShipments } = await import("@/firebase/firebase");
      
      // Solo marcamos como entregado, NO cambiamos el status
      await updatedShipments(packageId, {
        entregado: true,
        fechaEntrega: new Date().toISOString(),
      });
      
      // Remover del mapa
      setMarkers(prev => prev.filter(m => m.id !== packageId));
      if (selectedPackage?.id === packageId) {
        setSelectedPackage(null);
      }
      
      console.log(`✅ Paquete ${packageId} marcado como entregado (status sin cambios)`);
    } catch (error) {
      console.error(`❌ Error marcando como entregado ${packageId}:`, error);
      alert("Error al marcar como entregado. Intenta de nuevo.");
    }
  };

  // Función para guardar dirección corregida y re-geocodificar
  const saveEditedAddress = async () => {
    if (!editingPackage || !editedAddress.trim()) return;
    
    setIsSaving(true);
    try {
      const fullAddress = `${editedAddress}, Aquitania, Boyacá, Colombia`;
      
      // Intentar geocodificar la nueva dirección
      const location = await geocodeAddress(fullAddress);
      
      if (location) {
        // Guardar en Firebase
        await saveGeocodedLocation(editingPackage.id, {
          lat: location.lat,
          lng: location.lng,
          direccionCorregida: editedAddress,
          lastUpdated: new Date().toISOString()
        });
        
        // Actualizar también la dirección en el documento
        const { doc, updateDoc } = await import("firebase/firestore");
        const { db } = await import("@/firebase/firebase");
        const packageRef = doc(db, "envios", editingPackage.id);
        await updateDoc(packageRef, {
          "destinatario.direccion": editedAddress
        });
        
        // Actualizar marcador en el mapa
        setMarkers(prev => prev.map(m => 
          m.id === editingPackage.id 
            ? { ...m, position: location, address: editedAddress, fullAddress }
            : m
        ));
        
        alert("✅ Dirección actualizada y guardada correctamente");
      } else {
        alert("⚠️ No se pudo geocodificar la dirección. Verifica que sea correcta.");
      }
      
      setEditingPackage(null);
      setEditedAddress("");
    } catch (error) {
      console.error("Error guardando dirección:", error);
      alert("❌ Error al guardar la dirección");
    } finally {
      setIsSaving(false);
    }
  };

  // Función para limpiar direcciones - SOLO la dirección base
  const cleanAddress = (address: string): string => {
    let cleaned = address
      .replace(/�/g, "")
      .replace(/\s*,\s*\.\s*,\s*\.\s*/g, "")
      .replace(/\s*,\s*\.\s*/g, "")
      .replace(/^\/\/\s*/g, "")
      .replace(/,\s*$/g, "")
      .replace(/\s+/g, " ")
      .trim();

    // Eliminar todo después de palabras clave que indican referencias extras
    const stopWords = [
      /\s+BR\s+/i,           // Barrio
      /\s+BARRIO\s+/i,       // Barrio
      /\s+URB\s+/i,          // Urbanización
      /\s+CENTRO\s+/i,       // Centro (cuando viene después)
      /\s+LOCAL\s+/i,        // Local
      /\s+TIENDA\s+/i,       // Tienda
      /\s+CASA\s+/i,         // Casa
      /\s+OF\s+/i,           // Oficina
      /\s+CERCA\s+/i,        // Cerca de...
      /\s+FRENTE\s+/i,       // Frente a...
      /\s+\*.*\*/,           // Notas entre asteriscos
      /\s+,\s*[A-Z\s]+$/,    // Texto descriptivo al final después de coma
    ];

    for (const pattern of stopWords) {
      const match = cleaned.match(pattern);
      if (match) {
        cleaned = cleaned.substring(0, match.index).trim();
        break;
      }
    }

    // Limpiar guiones y espacios extras al final
    cleaned = cleaned.replace(/[-\s,]+$/, "").trim();

    return cleaned;
  };

  // Función para normalizar destino - simplificado
  const normalizeDestino = (destino: string): string => {
    return "Aquitania, Boyacá"; // Simplificado - todas las entregas son en Aquitania
  };

  // Función para geocodificar una dirección usando Google Geocoding API
  const geocodeAddress = useCallback(async (fullAddress: string): Promise<{ lat: number; lng: number } | null> => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(fullAddress)}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === "OK" && data.results.length > 0) {
        const location = data.results[0].geometry.location;
        console.log(`✅ Geocodificado: ${fullAddress} → ${location.lat}, ${location.lng}`);
        return { lat: location.lat, lng: location.lng };
      } else {
        console.warn(`⚠️ No se pudo geocodificar: ${fullAddress} (${data.status})`);
        return null;
      }
    } catch (error) {
      console.error(`❌ Error geocodificando: ${fullAddress}`, error);
      return null;
    }
  }, [apiKey]);

  // Geocodificar direcciones con Google Geocoding API
  useEffect(() => {
    const geocodePackages = async () => {
      if (isProcessing) return; // Evitar procesamiento concurrente
      
      setIsProcessing(true);
      console.log("=== PROCESANDO PAQUETES PARA MAPA ===");
      console.log("Total de paquetes recibidos:", packages.length);
      
      const processedMarkers = [];
      
      for (let index = 0; index < packages.length; index++) {
        const pkg = packages[index];
        
        if (!pkg?.destinatario?.direccion) continue;
        
        // Verificar si ya tiene coordenadas guardadas
        if (pkg.geocoded?.lat && pkg.geocoded?.lng) {
          console.log(`✅ Usando coordenadas guardadas para: ${pkg.uid}`);
          processedMarkers.push({
            id: pkg.uid,
            position: { lat: pkg.geocoded.lat, lng: pkg.geocoded.lng },
            package: pkg,
            address: pkg.geocoded.direccionCorregida || pkg.destinatario.direccion,
            fullAddress: `${pkg.geocoded.direccionCorregida || pkg.destinatario.direccion}, Aquitania, Boyacá`,
            label: `${index + 1}`,
          });
          continue;
        }
        
        const originalAddress = pkg.destinatario.direccion;
        const cleanedAddress = cleanAddress(originalAddress);
        const normalizedDestino = normalizeDestino(pkg.destino || 'Aquitania, Boyacá');
        const fullAddress = `${cleanedAddress}, ${normalizedDestino}, Colombia`;
        
        console.log(`\n📍 Paquete ${index + 1}:`, {
          guia: pkg.uid,
          destinatario: pkg.addressee,
          direccionLimpia: cleanedAddress,
          direccionCompleta: fullAddress,
        });
        
        // Intentar geocodificar la dirección
        let position = await geocodeAddress(fullAddress);
        
        // Si tiene éxito, guardar en Firebase (sin await para no bloquear)
        if (position && position.lat !== defaultCenter.lat) {
          saveGeocodedLocation(pkg.uid, {
            lat: position.lat,
            lng: position.lng,
            lastUpdated: new Date().toISOString()
          }).catch(err => console.error("Error guardando coordenadas:", err));
        } else {
          // Si falla, usar posición simulada
          console.log(`⚠️ Usando posición simulada para: ${fullAddress}`);
          position = {
            lat: 5.5167 + (Math.random() - 0.5) * 0.05,
            lng: -72.9 + (Math.random() - 0.5) * 0.05,
          };
        }

        processedMarkers.push({
          id: pkg.uid,
          position,
          package: pkg,
          address: cleanedAddress,
          fullAddress: fullAddress,
          label: `${index + 1}`,
        });
        
        // Pequeño delay para no saturar la API
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      console.log("\n✅ Total de marcadores creados:", processedMarkers.length);
      console.log("=== FIN PROCESAMIENTO ===\n");
      
      setMarkers(processedMarkers);
      
      // Centrar el mapa en el primer marcador si existe
      if (processedMarkers.length > 0) {
        setCenter(processedMarkers[0].position);
      }
      
      setIsProcessing(false);
    };

    if (apiKey && packages.length > 0 && !isProcessing) {
      geocodePackages();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packages.length, apiKey]); // Solo depender de la cantidad de paquetes, no del objeto completo

  const handleMarkerClick = (marker: any) => {
    setSelectedPackage(marker);
  };

  const handleNavigate = (marker: any) => {
    const address = marker.fullAddress || `${marker.address}, ${marker.package.destino || 'Aquitania, Boyacá'}`;
    console.log("🧭 Navegando a:", address);
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(address)}&travelmode=driving`;
    window.open(mapsUrl, "_blank");
  };

  if (!apiKey) {
    return (
      <Box
        sx={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 9999,
          backgroundColor: "#fff",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            height: "60px",
            backgroundColor: "#3C47A3",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 20px",
            color: "#fff",
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Configuración Requerida
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#fff" }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <Box sx={{ padding: "40px", maxWidth: "800px", margin: "0 auto" }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Google Maps API Key no configurada
            </Typography>
            <Typography variant="body1" sx={{ mb: 2 }}>
              Para usar el mapa interactivo, necesitas configurar una API Key de Google Maps.
            </Typography>
            <Typography variant="body2" sx={{ mb: 1 }}>
              <strong>Pasos rápidos:</strong>
            </Typography>
            <ol>
              <li>Ve a: <a href="https://console.cloud.google.com/google/maps-apis" target="_blank" rel="noopener noreferrer">Google Cloud Console</a></li>
              <li>Crea un proyecto y habilita &quot;Maps JavaScript API&quot;</li>
              <li>Crea una API Key en &quot;Credenciales&quot;</li>
              <li><strong>IMPORTANTE:</strong> En restricciones, selecciona &quot;Ninguna&quot; temporalmente</li>
              <li>Copia el archivo <code>.env.local.example</code> a <code>.env.local</code></li>
              <li>Agrega tu API Key en el archivo <code>.env.local</code></li>
              <li>Reinicia el servidor: <code>npm run dev</code></li>
            </ol>
            <Typography variant="body2" sx={{ mt: 2, color: "error.main" }}>
              <strong>Error común:</strong> Si ves &quot;ApiTargetBlockedMapError&quot;, ve a Google Cloud Console y 
              en tu API Key, cambia las restricciones a &quot;Ninguna&quot; temporalmente.
            </Typography>
          </Alert>
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "#fff",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          height: { xs: "56px", sm: "60px" },
          backgroundColor: "#3C47A3",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: { xs: "0 12px", sm: "0 20px" },
          color: "#fff",
        }}
      >
        <Typography 
          variant="h6" 
          sx={{ 
            fontWeight: 700,
            fontSize: { xs: "14px", sm: "18px" },
            flex: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Mapa de Entregas - {packages.length} paquetes
        </Typography>
        {isProcessing && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography sx={{ fontSize: "12px", color: "#fff" }}>
              Procesando...
            </Typography>
            <Box
              sx={{
                width: "16px",
                height: "16px",
                border: "2px solid rgba(255,255,255,0.3)",
                borderTop: "2px solid #fff",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
                "@keyframes spin": {
                  "0%": { transform: "rotate(0deg)" },
                  "100%": { transform: "rotate(360deg)" },
                },
              }}
            />
          </Box>
        )}
        <IconButton 
          onClick={() => setShowSidebar(!showSidebar)} 
          sx={{ 
            color: "#fff",
            display: { xs: "block", md: "none" },
            mr: 1,
          }}
        >
          <Typography sx={{ fontSize: "20px" }}>📋</Typography>
        </IconButton>
        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Main Content: Map + Sidebar */}
      <Box 
        sx={{ 
          display: "flex", 
          flexDirection: { xs: "column", md: "row" },
          height: { xs: "calc(100% - 56px)", sm: "calc(100% - 60px)" },
        }}
      >
        {/* Map Container */}
        <Box 
          sx={{ 
            flex: 1, 
            position: "relative",
            height: { xs: showSidebar ? "50%" : "100%", md: "100%" },
            transition: "height 0.3s ease",
          }}
        >
          {loadError && (
            <Box sx={{ p: 2 }}>
              <Alert severity="error">Error cargando Google Maps</Alert>
            </Box>
          )}
          
          {!isLoaded && (
            <Box sx={{ p: 2 }}>
              <Alert severity="info">Cargando mapa...</Alert>
            </Box>
          )}
          
          {isLoaded && (
            <>
              <GoogleMap
                mapContainerStyle={{ width: "100%", height: "100%" }}
                center={center}
                zoom={13}
                options={{
                  streetViewControl: false,
                  mapTypeControl: true,
                  fullscreenControl: true,
                  zoomControl: true,
                }}
              >
                {markers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={marker.position}
                    onClick={() => handleMarkerClick(marker)}
                    label={{
                      text: marker.label,
                      color: "white",
                      fontSize: "12px",
                      fontWeight: "bold",
                    }}
                    icon={{
                      path: window.google.maps.SymbolPath.CIRCLE,
                      scale: 10,
                      fillColor: selectedPackage?.id === marker.id ? "#FF5722" : "#4285F4",
                      fillOpacity: 1,
                      strokeColor: "#fff",
                      strokeWeight: 2,
                    }}
                />
              ))}

              {selectedPackage && (
                <InfoWindow
                  position={selectedPackage.position}
                  onCloseClick={() => setSelectedPackage(null)}
                >
                  <Box sx={{ padding: "10px", minWidth: "280px" }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 1, fontSize: "16px" }}>
                      {selectedPackage.package.addressee}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Guía:</strong> {selectedPackage.package.uid}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Dirección:</strong> {selectedPackage.address}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Destino:</strong> {selectedPackage.package.destino}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 0.5 }}>
                      <strong>Celular:</strong> {selectedPackage.package.destinatario?.celular || "N/A"}
                    </Typography>
                    <Box sx={{ display: "flex", gap: 1, mt: 1.5, alignItems: "center" }}>
                      <Chip
                        label={selectedPackage.package.shippingCost || "$ 0"}
                        size="small"
                        sx={{
                          backgroundColor: "#4285F4",
                          color: "#fff",
                          fontWeight: 700,
                        }}
                      />
                      <Chip
                        label={selectedPackage.package.pago || "N/A"}
                        size="small"
                        sx={{
                          backgroundColor: selectedPackage.package.pago === "Al Cobro" ? "#34A853" : "#666",
                          color: "#fff",
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                    <Box sx={{ mt: 1.5, display: "flex", gap: 1, flexWrap: "wrap" }}>
                      {selectedPackage.package.destinatario?.celular && (
                        <Chip
                          label="📞 Llamar"
                          component="a"
                          href={`tel:${selectedPackage.package.destinatario.celular}`}
                          clickable
                          sx={{
                            backgroundColor: "#34A853",
                            color: "#fff",
                            fontWeight: 700,
                            "&:hover": {
                              backgroundColor: "#2D8E47",
                            },
                          }}
                        />
                      )}
                      <Chip
                        icon={<NavigationIcon />}
                        label="Navegar aquí"
                        onClick={() => handleNavigate(selectedPackage)}
                        clickable
                        sx={{
                          backgroundColor: "#4285F4",
                          color: "#fff",
                          fontWeight: 700,
                          "&:hover": {
                            backgroundColor: "#3367D6",
                          },
                        }}
                      />
                    </Box>
                  </Box>
                </InfoWindow>
              )}
            </GoogleMap>

            {/* Botón flotante para centrar en ubicación actual */}
            <IconButton
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (position) => {
                      setCenter({
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                      });
                    },
                    () => {
                      alert("No se pudo obtener tu ubicación");
                    }
                  );
                }
              }}
              sx={{
                position: "absolute",
                bottom: { xs: 16, md: 24 },
                right: { xs: 16, md: 24 },
                backgroundColor: "#fff",
                boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
                "&:hover": {
                  backgroundColor: "#f5f5f5",
                },
                zIndex: 1,
              }}
            >
              <Typography sx={{ fontSize: "20px" }}>📍</Typography>
            </IconButton>
          </>
          )}
        </Box>

        {/* Sidebar with Address List */}
        <Box
          sx={{
            width: { xs: "100%", md: "350px" },
            height: { xs: showSidebar ? "50%" : "0", md: "100%" },
            backgroundColor: "#f5f5f5",
            borderLeft: { xs: "none", md: "1px solid #ddd" },
            borderTop: { xs: "1px solid #ddd", md: "none" },
            overflowY: "auto",
            padding: { xs: showSidebar ? "12px" : "0", md: "16px" },
            transition: "height 0.3s ease, padding 0.3s ease",
            display: { xs: showSidebar ? "block" : "none", md: "block" },
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
            <Typography 
              variant="h6" 
              sx={{ 
                fontWeight: 700,
                fontSize: { xs: "16px", md: "18px" },
              }}
            >
              Direcciones
            </Typography>
            <IconButton 
              onClick={() => setShowSidebar(false)}
              size="small"
              sx={{ 
                display: { xs: "block", md: "none" },
              }}
            >
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Estadísticas rápidas */}
          <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap" }}>
            <Chip 
              label={`Total: ${markers.length}`}
              size="small"
              sx={{ 
                backgroundColor: "#4285F4", 
                color: "#fff",
                fontWeight: 600,
                fontSize: { xs: "10px", md: "11px" },
              }}
            />
            <Chip 
              label={`Pendientes: ${markers.length}`}
              size="small"
              sx={{ 
                backgroundColor: "#FF9800", 
                color: "#fff",
                fontWeight: 600,
                fontSize: { xs: "10px", md: "11px" },
              }}
            />
          </Box>

          {/* Buscador */}
          <TextField
            fullWidth
            size="small"
            placeholder="Buscar por nombre, guía o dirección..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{
              mb: 2,
              backgroundColor: "#fff",
              "& .MuiInputBase-input": {
                fontSize: { xs: "12px", md: "14px" },
                py: { xs: 0.75, md: 1 },
              }
            }}
            InputProps={{
              startAdornment: <Typography sx={{ mr: 0.5 }}>🔍</Typography>,
            }}
          />
          
          {/* Modal de edición */}
          {editingPackage && (
            <Box
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 10,
                backgroundColor: "#fff",
                padding: { xs: "12px", md: "16px" },
                borderRadius: "8px",
                border: "2px solid #4285F4",
                mb: 2,
                boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
              }}
            >
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 1,
                  fontSize: { xs: "13px", md: "14px" },
                }}
              >
                Editar Dirección
              </Typography>
              <Typography 
                variant="caption" 
                sx={{ 
                  display: "block", 
                  mb: 1, 
                  color: "#666",
                  fontSize: { xs: "11px", md: "12px" },
                }}
              >
                {editingPackage.package.addressee}
              </Typography>
              <TextField
                fullWidth
                size="small"
                value={editedAddress}
                onChange={(e) => setEditedAddress(e.target.value)}
                placeholder="Ej: Calle 6 #7-77"
                sx={{ 
                  mb: 1,
                  "& .MuiInputBase-input": {
                    fontSize: { xs: "12px", md: "14px" },
                  }
                }}
              />
              <Box sx={{ display: "flex", gap: { xs: 0.5, md: 1 } }}>
                <Button
                  size="small"
                  variant="contained"
                  onClick={saveEditedAddress}
                  disabled={isSaving || !editedAddress.trim()}
                  sx={{ 
                    flex: 1, 
                    textTransform: "none",
                    fontSize: { xs: "11px", md: "13px" },
                    py: { xs: 0.5, md: 0.75 },
                  }}
                >
                  {isSaving ? "Guardando..." : "Guardar"}
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setEditingPackage(null);
                    setEditedAddress("");
                  }}
                  disabled={isSaving}
                  sx={{ 
                    textTransform: "none",
                    fontSize: { xs: "11px", md: "13px" },
                    py: { xs: 0.5, md: 0.75 },
                  }}
                >
                  Cancelar
                </Button>
              </Box>
            </Box>
          )}
          
          <Alert 
            severity="info" 
            sx={{ 
              mb: 2, 
              fontSize: { xs: "11px", md: "12px" },
              py: { xs: 0.5, md: 1 },
            }}
          >
            Haz clic en una dirección para ver detalles.
          </Alert>
          
          {filteredMarkers.length === 0 && searchQuery && (
            <Alert severity="info" sx={{ mb: 2, fontSize: { xs: "11px", md: "12px" } }}>
              No se encontraron resultados para &quot;{searchQuery}&quot;
            </Alert>
          )}
          
          {filteredMarkers.map((marker, index) => (
            <Box
              key={marker.id}
              sx={{
                backgroundColor: selectedPackage?.id === marker.id ? "#e3f2fd" : "#fff",
                padding: { xs: "8px", md: "12px" },
                marginBottom: { xs: "6px", md: "8px" },
                borderRadius: "12px",
                cursor: "pointer",
                border: selectedPackage?.id === marker.id ? "2px solid #4285F4" : "1px solid #e0e0e0",
                boxShadow: selectedPackage?.id === marker.id 
                  ? "0 4px 12px rgba(66, 133, 244, 0.3)" 
                  : "0 2px 4px rgba(0,0,0,0.05)",
                transition: "all 0.2s ease",
                "&:hover": {
                  backgroundColor: selectedPackage?.id === marker.id ? "#e3f2fd" : "#f8f9fa",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  transform: "translateY(-2px)",
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
                <Chip
                  label={marker.label}
                  size="small"
                  sx={{
                    backgroundColor: "#4285F4",
                    fontSize: { xs: "10px", md: "12px" },
                    height: { xs: "20px", md: "24px" },
                    color: "#fff",
                    fontWeight: 700,
                    mr: 1,
                  }}
                />
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 700, 
                    fontSize: { xs: "12px", md: "13px" }, 
                    flex: 1 
                  }}
                  onClick={() => handleMarkerClick(marker)}
                >
                  {marker.package.addressee}
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: "11px", md: "12px" }, 
                  color: "#666", 
                  mb: 0.5 
                }}
                onClick={() => handleMarkerClick(marker)}
              >
                📦 {marker.package.uid}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: "11px", md: "12px" }, 
                  mb: 0.5 
                }}
                onClick={() => handleMarkerClick(marker)}
              >
                📍 {marker.address}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: "10px", md: "11px" }, 
                  color: "#888", 
                  mb: 0.5
                }}
                onClick={() => handleMarkerClick(marker)}
              >
                🏙️ {marker.package.destino || "Aquitania, Boyacá"}
              </Typography>
              
              {/* Teléfono con botón de llamada */}
              {marker.package.destinatario?.celular && (
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontSize: { xs: "10px", md: "11px" }, 
                      color: "#666",
                      flex: 1,
                    }}
                  >
                    📱 {marker.package.destinatario.celular}
                  </Typography>
                  <Button
                    size="small"
                    variant="contained"
                    href={`tel:${marker.package.destinatario.celular}`}
                    sx={{
                      fontSize: { xs: "9px", md: "10px" },
                      textTransform: "none",
                      minWidth: "auto",
                      px: { xs: 1, md: 1.5 },
                      py: { xs: 0.25, md: 0.5 },
                      backgroundColor: "#34A853",
                      "&:hover": {
                        backgroundColor: "#2D8E47"
                      }
                    }}
                  >
                    📞 Llamar
                  </Button>
                </Box>
              )}
              
              {/* Botones de acción */}
              <Box sx={{ display: "flex", gap: { xs: 0.5, md: 1 }, mt: 1 }}>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    setEditingPackage(marker);
                    setEditedAddress(marker.address);
                  }}
                  sx={{
                    fontSize: { xs: "9px", md: "10px" },
                    textTransform: "none",
                    flex: 1,
                    py: { xs: 0.5, md: 0.75 },
                    borderColor: "#FF9800",
                    color: "#FF9800",
                    "&:hover": {
                      borderColor: "#F57C00",
                      backgroundColor: "rgba(255, 152, 0, 0.1)"
                    }
                  }}
                >
                  ✏️ Editar
                </Button>
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => {
                    if (confirm(`¿Marcar como entregado?\n${marker.package.addressee}`)) {
                      markAsDelivered(marker.id);
                    }
                  }}
                  sx={{
                    fontSize: { xs: "9px", md: "10px" },
                    textTransform: "none",
                    flex: 1,
                    py: { xs: 0.5, md: 0.75 },
                    backgroundColor: "#34A853",
                    "&:hover": {
                      backgroundColor: "#2D8E47"
                    }
                  }}
                >
                  ✓ Entregado
                </Button>
              </Box>
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export default MapView;
