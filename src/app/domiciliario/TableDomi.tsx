import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  getAllShipmentsData,
  shipments,
  getStatusShipmentsData,
} from "@/firebase/firebase";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import DeliveryModal from "@/components/confirmTable/detailGuide";
import DevolucionModal from "./Devolucion";
import EntregarModal from "./Entregar";
import PaidIcon from "@mui/icons-material/Paid";
import MapIcon from "@mui/icons-material/Map";
import DirectionsIcon from "@mui/icons-material/Directions";
import MapView from "./MapView";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#3C47A3",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#3c47a338",
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

const formatCOP = (n: any) =>
  new Intl.NumberFormat("es-CO", { style: "currency", currency: "COP", maximumFractionDigits: 0 })
    .format(Number(n || 0));

export default function TableDomi() {
  const [firebaseData, setFirebaseData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showMap, setShowMap] = useState(false);
  
  const handleSelectionChange = (newSelectedRows: any[]) => {
    setSelectedRows(newSelectedRows);
  };

  const handleCheckboxChange = (row: any) => {
    const isChecked = selectedRows.some(
      (selectedRow) => selectedRow.uid === row.uid
    );
    const updatedSelectedRows = isChecked
      ? selectedRows.filter((selectedRow) => selectedRow.uid !== row.uid)
      : [...selectedRows, row];
    handleSelectionChange(updatedSelectedRows);
  };

  const showShipmentToast = (row: any) => {
    enqueueSnackbar(
      <Box sx={{ p: 1 }}>
        <Typography sx={{ fontSize: '30px' }}>Destinatario: {row?.addressee ?? "—"}</Typography>
        <Chip
          icon={<PaidIcon sx={{ color: "inherit" }} />}  // <-- opcional, puedes quitarlo
          label={`Valor del envío: ${(row?.shippingCost)}`}
          sx={{
            bgcolor: "#000",
            color: "#fff",
            borderRadius: "9999px",
            fontWeight: 800,
            height: "auto",                     // permite crecer con el texto
            "& .MuiChip-label": {
              px: 2.5,                          // padding horizontal
              py: 1.25,                         // padding vertical
              fontSize: { xs: 18, sm: 22, md: 30 }, // tamaño similar a 30px en desktop
              lineHeight: 1.2,
              whiteSpace: "normal",             // por si necesita dos líneas
              textAlign: "center",
            },
          }}
        />
      </Box>,
      {
        variant: "info",
        autoHideDuration: 3500, // <<< 5 segundos
        preventDuplicate: true,
        anchorOrigin: {
          vertical: "top",
          horizontal: "center",
        },
      },
    );
  };

  const handleAutocompleteChange = (event: any, newValue: any[]) => {
    const added = newValue.find(
      (nv) => !selectedRows.some((sr) => sr.uid === nv.uid)
    );
    handleSelectionChange(newValue);
    if (added) showShipmentToast(added);
  };

  const handleKeyPress = (event: any) => {
    if (event.key === "Enter") {
      const matchingItem = firebaseData.find((item) =>
        item.uid.toLowerCase().includes(inputValue.toLowerCase())
      );
      if (matchingItem) {
        if (!selectedRows.some((row) => row.uid === matchingItem.uid)) {
          handleSelectionChange([...selectedRows, matchingItem]);
        }
        showShipmentToast(matchingItem);
        setInputValue("");
      }
    }
  };

  const cleanAddress = (address: string): string => {
    // Limpiar caracteres raros y formatear dirección
    return address
      .replace(/�/g, '') // Quitar caracteres raros
      .replace(/\s*,\s*\.\s*,\s*\.\s*/g, '') // Quitar ", ., ."
      .replace(/\s*,\s*\.\s*/g, '') // Quitar ", ."
      .replace(/\s+/g, ' ') // Normalizar espacios
      .trim();
  };

  const handleOpenMapsRoute = () => {
    // Usar todos los paquetes del día si no hay selección
    const packagesToRoute = selectedRows.length > 0 ? selectedRows : firebaseData;

    if (packagesToRoute.length === 0) {
      enqueueSnackbar("No hay paquetes disponibles para generar la ruta", {
        variant: "warning",
        autoHideDuration: 3000,
      });
      return;
    }

    // Filtrar paquetes que tengan dirección válida y limpiarlas
    const packagesWithAddress = packagesToRoute
      .filter((pkg) => pkg?.destinatario?.direccion && pkg.destinatario.direccion.trim() !== "")
      .map((pkg) => ({
        ...pkg,
        cleanedAddress: cleanAddress(pkg.destinatario.direccion),
        fullAddress: `${cleanAddress(pkg.destinatario.direccion)}, ${pkg.destino || 'Aquitania, Boyacá'}`,
      }));

    if (packagesWithAddress.length === 0) {
      enqueueSnackbar("Los paquetes no tienen direcciones válidas", {
        variant: "error",
        autoHideDuration: 3000,
      });
      return;
    }

    // Google Maps limita a 10 waypoints + origen + destino = 12 puntos máximo
    const MAX_WAYPOINTS = 9; // Dejamos espacio para origen y destino
    
    if (packagesWithAddress.length <= MAX_WAYPOINTS + 2) {
      // Si caben todos en una ruta
      const addresses = packagesWithAddress.map(pkg => pkg.fullAddress);
      const origin = addresses[0];
      const destination = addresses[addresses.length - 1];
      const waypoints = addresses.slice(1, -1).join("|");

      let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
      
      if (waypoints) {
        mapsUrl += `&waypoints=${encodeURIComponent(waypoints)}`;
      }

      window.open(mapsUrl, "_blank");
      enqueueSnackbar(`Ruta generada con ${packagesWithAddress.length} parada(s)`, {
        variant: "success",
        autoHideDuration: 2000,
      });
    } else {
      // Dividir en grupos de 10
      const groups = [];
      for (let i = 0; i < packagesWithAddress.length; i += 10) {
        groups.push(packagesWithAddress.slice(i, i + 10));
      }

      enqueueSnackbar(
        `Son ${packagesWithAddress.length} paquetes. Se abrirán ${groups.length} rutas de máximo 10 paradas cada una.`,
        {
          variant: "info",
          autoHideDuration: 5000,
        }
      );

      // Abrir cada grupo en una pestaña diferente con un pequeño delay
      groups.forEach((group, index) => {
        setTimeout(() => {
          const addresses = group.map(pkg => pkg.fullAddress);
          const origin = addresses[0];
          const destination = addresses[addresses.length - 1];
          const waypoints = addresses.slice(1, -1).join("|");

          let mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=driving`;
          
          if (waypoints) {
            mapsUrl += `&waypoints=${encodeURIComponent(waypoints)}`;
          }

          window.open(mapsUrl, "_blank");
        }, index * 1000); // 1 segundo de delay entre cada pestaña
      });
    }
  };

  const handleShowAllMarkers = () => {
    // Abrir vista de mapa interactivo
    setShowMap(true);
  };


  useEffect(() => {
    const status = "mensajero";
    getStatusShipmentsData(status, setFirebaseData);
  }, []);

  useEffect(() => {
    setSelectedRows([]);
  }, [firebaseData]);

  // Mostrar mapa si está activo
  if (showMap) {
    const packagesToShow = selectedRows.length > 0 ? selectedRows : firebaseData;
    return <MapView packages={packagesToShow} onClose={() => setShowMap(false)} />;
  }

  return (
    <SnackbarProvider
      maxSnack={3}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Box sx={{ height: "100%" }}>
        <Box sx={{ display: "flex", justifyContent: "right" }}>
          <Typography
            sx={{
              fontFamily: "Nunito",
              fontSize: "30px",
              fontWeight: 800,
              lineHeight: "46.38px",
              textAlign: "center",
              marginRight: "10px",
            }}
          >
            Total paquetes
          </Typography>
          <Box
            sx={{
              borderRadius: "35px",
              opacity: "0px",
              background: "#11192F",
              padding: "12px",
              color: "#fff",
              width: "70px",
              textAlignLast: "center",
            }}
          >
            {firebaseData.length}
          </Box>
        </Box>
        <Box sx={{ textAlign: "-webkit-center" }}>
          <Box>
            <Typography
              sx={{
                color: "#0A0F37",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: { xs: "1.5rem", sm: "2.0rem" },
                fontStyle: "normal",
                fontWeight: 900,
                lineHeight: "normal",
              }}
            >
              RESUMEN DOMICILIARIO
            </Typography>
          </Box>
          <Box mt={1} width={"39.5625rem"}>
            <Typography
              sx={{
                color: "#000",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "1.25rem",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "normal",
              }}
            >
              Paquetes asignados al domiciliario
            </Typography>
          </Box>
        </Box>

        <TableContainer
          id="container"
          sx={{ height: "900px", overflowY: "scroll", maxHeight: "450px" }}
          component={Paper}
        >
          <SnackbarProvider />
          <Table sx={{ minWidth: 700 }} aria-label="customized table">
            <TableHead>
              <TableRow>
                <StyledTableCell></StyledTableCell>
                <StyledTableCell># Guía </StyledTableCell>
                <StyledTableCell align="left">Nombre</StyledTableCell>
                <StyledTableCell align="center">Recibido</StyledTableCell>
                <StyledTableCell align="center">Pago</StyledTableCell>
                <StyledTableCell align="center">Valor</StyledTableCell>
                <StyledTableCell align="center">Celular</StyledTableCell>
                <StyledTableCell align="center">Acciones</StyledTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {firebaseData?.map((row, i) => {
                const dateTimeString = row.intakeDate;
                const dateAndTime = dateTimeString
                  .substring(0, 19)
                  .replace("T", " ");

                return (
                  <StyledTableRow key={row.uid}>
                    <StyledTableCell>
                      <Checkbox
                        checked={selectedRows.some(
                          (selectedRow) => selectedRow.uid === row.uid
                        )}
                        onChange={() => handleCheckboxChange(row)}
                      />
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.uid}
                    </StyledTableCell>
                    <StyledTableCell component="th" scope="row">
                      {row.addressee}
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      {dateAndTime}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Chip
                        sx={{
                          display: "flex",
                          m: 1,
                          borderRadius: "3rem",
                          background:
                            row.pago === "Crédito"
                              ? "#150E63"
                              : row.pago === "Contado"
                                ? "#545B58"
                                : "#106D14",
                          color: "#fff",
                        }}
                        variant="outlined"
                        label={row?.pago ?? "no definido"}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.shippingCost}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row?.destinatario?.celular ?? ""}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <DeliveryModal data={row} />
                    </StyledTableCell>
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Box
          sx={{
            marginTop: "2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <Autocomplete
            multiple
            id="tags-outlined"
            options={firebaseData}
            getOptionLabel={(option) => option?.uid}
            value={selectedRows}
            onKeyPress={handleKeyPress}
            onChange={handleAutocompleteChange}
            onInputChange={(event, newInputValue) => {
              setInputValue(newInputValue);
            }}
            filterSelectedOptions
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Guias"
                sx={{
                  backgroundColor: "white",
                  borderRadius: "0.28rem",
                  border: "0",
                }}
              />
            )}
            popupIcon={<QrCodeScannerIcon fontSize="inherit" />}
            sx={{ width: "60%", marginTop: "1rem" }}
          />
        </Box>
        <Box
          sx={{
            marginTop: "2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            gap: "1rem",
          }}
        >
          <Button
            variant="contained"
            startIcon={<DirectionsIcon />}
            onClick={handleOpenMapsRoute}
            sx={{
              backgroundColor: "#4285F4",
              color: "#fff",
              fontWeight: 700,
              fontSize: "14px",
              padding: "12px 20px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#357AE8",
              },
            }}
          >
            {selectedRows.length > 0 
              ? `Ruta Optimizada (${selectedRows.length})` 
              : `Ruta del Día (${firebaseData.length})`
            }
          </Button>
          <Button
            variant="outlined"
            startIcon={<MapIcon />}
            onClick={handleShowAllMarkers}
            sx={{
              borderColor: "#34A853",
              color: "#34A853",
              fontWeight: 700,
              fontSize: "14px",
              padding: "12px 20px",
              borderRadius: "8px",
              textTransform: "none",
              "&:hover": {
                borderColor: "#2D8E47",
                backgroundColor: "rgba(52, 168, 83, 0.1)",
              },
            }}
          >
            {selectedRows.length > 0 
              ? `Ver Mapa (${selectedRows.length})` 
              : `Ver Mapa Completo (${firebaseData.length})`
            }
          </Button>
        </Box>
        <Box
          sx={{
            marginTop: "2rem",
            textAlign: "center",
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
          }}
        >
          <DevolucionModal base={50000} data={selectedRows} />
          <EntregarModal base={50000} data={selectedRows} />
        </Box>
      </Box>
    </SnackbarProvider>
  );
}
