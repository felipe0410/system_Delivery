import * as React from "react";
import { useEffect, useState, useRef } from "react";
import JsBarcode from "jsbarcode";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import {
  Box,
  Button,
  Modal,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  styled,
  tableCellClasses,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  IconButton,
  Link,
  FormControlLabel,
  Checkbox,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import CancelIcon from "@mui/icons-material/Cancel";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SortIcon from "@mui/icons-material/Sort";
import ReactCalendar from "./ReactCalendar";
import { getFilteredShipmentsDataTimestap } from "@/firebase/firebase";
import LocalPhoneIcon from "@mui/icons-material/LocalPhone";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "80%",
  maxWidth: "900px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  height: "90%",
  overflowY: "auto",
  borderRadius: "10px",
};

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 12,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState<any>();
  const [open, setOpen] = useState(false);
  const barcodeRef = useRef(null);
  const [data, setData] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState<
    "oficina" | "mensajero" | "entregado" | "devolucion" | "todos"
  >("todos");
  const printRef = useRef<HTMLDivElement>(null);

  // Estado para controlar qué columnas están visibles
  const [visibleColumns, setVisibleColumns] = useState({
    guia: true,
    codigoBarras: true,
    reclamarEn: true,
    nombreDestinatario: true,
    direccion: true,
    celular: true,
    valor: true,
    status: true,
  });

  // Estado para controlar el ordenamiento
  const [sortByAddress, setSortByAddress] = useState(false);

  // Función para alternar la visibilidad de una columna
  const toggleColumn = (columnKey: keyof typeof visibleColumns) => {
    setVisibleColumns(prev => ({
      ...prev,
      [columnKey]: !prev[columnKey]
    }));
  };

  // Función para normalizar y extraer información de direcciones
  const parseAddress = (address: string) => {
    if (!address || address === "N/A") return { type: "zzz", number: 999999, full: address };
    
    const normalizedAddress = address.toUpperCase().trim();
    
    // Patrones para diferentes tipos de vías
    const patterns = {
      calle: /(?:CALLE|CLL|CL|CALL)\s*(\d+)/,
      carrera: /(?:CARRERA|KRA|CRR|CR|KR)\s*(\d+)/,
      transversal: /(?:TRANSVERSAL|TV|TRANS|TR)\s*(\d+)/,
      diagonal: /(?:DIAGONAL|DG|DIAG)\s*(\d+)/,
      avenida: /(?:AVENIDA|AV|AVE)\s*(\d+)/,
    };

    // Buscar coincidencias en orden de prioridad
    for (const [type, pattern] of Object.entries(patterns)) {
      const match = normalizedAddress.match(pattern);
      if (match) {
        const number = parseInt(match[1]) || 0;
        return { type, number, full: address };
      }
    }

    // Si no coincide con ningún patrón, buscar solo números
    const numberMatch = normalizedAddress.match(/(\d+)/);
    const number = numberMatch ? parseInt(numberMatch[1]) : 999999;
    
    return { type: "otros", number, full: address };
  };

  // Función para ordenar los datos por dirección de forma inteligente
  const sortDataByAddress = (data: any[]) => {
    if (!sortByAddress) return data;

    return [...data].sort((a, b) => {
      const addressA = a.destinatario?.direccion || a.address || "N/A";
      const addressB = b.destinatario?.direccion || b.address || "N/A";
      
      const parsedA = parseAddress(addressA);
      const parsedB = parseAddress(addressB);
      
      // Orden de prioridad: calle -> carrera -> transversal -> diagonal -> avenida -> otros
      const typeOrder = {
        calle: 1,
        carrera: 2,
        transversal: 3,
        diagonal: 4,
        avenida: 5,
        otros: 6,
        zzz: 7
      };
      
      // Primero ordenar por tipo de vía
      const typeComparison = typeOrder[parsedA.type as keyof typeof typeOrder] - typeOrder[parsedB.type as keyof typeof typeOrder];
      if (typeComparison !== 0) return typeComparison;
      
      // Luego ordenar por número
      const numberComparison = parsedA.number - parsedB.number;
      if (numberComparison !== 0) return numberComparison;
      
      // Finalmente ordenar alfabéticamente por la dirección completa
      return parsedA.full.localeCompare(parsedB.full);
    });
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const fetchShipmentsByDateRange = async () => {
    if (selectedDate?.length === 2) {
      try {
        const shipments = await getFilteredShipmentsDataTimestap(selectedDate);
        setData(shipments || []);
      } catch (error) {
        console.error("Error al traer las guías por rango de fechas:", error);
      }
    }
  };

  useEffect(() => {
    if (selectedDate && selectedDate.length === 2) {
      fetchShipmentsByDateRange();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedDate]);

  // Filtrar datos según el estado seleccionado
  const baseFilteredData =
    filterStatus === "todos"
      ? data
      : data.filter((shipment) => shipment.status === filterStatus);

  // Aplicar ordenamiento inteligente por dirección
  const filteredData = sortDataByAddress(baseFilteredData);

  // Generar código de barras
  useEffect(() => {
    if (barcodeRef.current && filteredData) {
      filteredData.forEach((shipment) => {
        if (shipment.uid) {
          JsBarcode(`#barcode-${shipment.uid}`, shipment.uid, {
            format: "CODE128",
            width: 1.2,
            height: 30,
            displayValue: false,
          });
        }
      });
    }
  }, [filteredData]);

  // Función para obtener color del Chip según el estado
  const getChipColor = (status: string) => {
    switch (status) {
      case "mensajero":
        return "primary"; // Azul
      case "devolucion":
        return "warning"; // Naranja
      case "entregado":
        return "success"; // Verde
      case "oficina":
        return "secondary"; // Amarillo
      default:
        return "default";
    }
  };

  // Función para imprimir la tabla completa
  const handlePrint = () => {
    if (printRef.current) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Imprimir Tabla</title>
              <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 8px; text-align: center; }
              </style>
            </head>
            <body>
              ${printRef.current.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  // Función para generar PDF de la tabla completa
  const handleGeneratePDF = async () => {
    if (printRef.current) {
      const canvas = await html2canvas(printRef.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      pdf.addImage(imgData, "PNG", 10, 10, 190, 0);
      pdf.save("envios.pdf");
    }
  };

  const handleCopyToClipboard = (message: string) => {
    navigator.clipboard.writeText(message)
      .catch((err) => console.error("Error al copiar el mensaje: ", err));
  };

  return (
    <div>
      <SnackbarProvider />
      <Button
        sx={{
          background: "#00005c",
          color: "#fff",
          borderRadius: "10px",
          fontWeight: "700",
        }}
        onClick={handleOpen}
      >
        Fecha
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Button variant="contained" color="success" onClick={handlePrint}>
              Imprimir
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={handleGeneratePDF}
            >
              Generar PDF
            </Button>
            <Button variant="text" onClick={handleClose}>
              <CancelIcon sx={{ color: "#000" }} />
            </Button>
          </Box>

          {/* Input para seleccionar fechas */}
          <Box sx={{ mb: 2 }}>
            <ReactCalendar
              setSearchTerm={setSelectedDate}
              setSelectedDate={selectedDate}
            />
          </Box>

          {/* Botones para filtrar por status */}
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <ToggleButtonGroup
              value={filterStatus}
              exclusive
              onChange={(_, newStatus) =>
                newStatus && setFilterStatus(newStatus)
              }
            >
              <ToggleButton value="todos">Todos</ToggleButton>
              <ToggleButton value="oficina">Oficina</ToggleButton>
              <ToggleButton value="mensajero">Mensajero</ToggleButton>
              <ToggleButton value="entregado">Entregado</ToggleButton>
              <ToggleButton value="devolucion">Devolución</ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* Panel de control de columnas */}
          <Box sx={{ mb: 2 }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <VisibilityIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Configurar Columnas Visibles</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={visibleColumns.guia}
                        onChange={() => toggleColumn('guia')}
                      />
                    }
                    label="Guía"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={visibleColumns.codigoBarras}
                        onChange={() => toggleColumn('codigoBarras')}
                      />
                    }
                    label="Código de Barras"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={visibleColumns.reclamarEn}
                        onChange={() => toggleColumn('reclamarEn')}
                      />
                    }
                    label="Reclamar en"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={visibleColumns.nombreDestinatario}
                        onChange={() => toggleColumn('nombreDestinatario')}
                      />
                    }
                    label="Nombre Destinatario"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={visibleColumns.direccion}
                        onChange={() => toggleColumn('direccion')}
                      />
                    }
                    label="Dirección"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={visibleColumns.celular}
                        onChange={() => toggleColumn('celular')}
                      />
                    }
                    label="Celular"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={visibleColumns.valor}
                        onChange={() => toggleColumn('valor')}
                      />
                    }
                    label="Valor"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={visibleColumns.status}
                        onChange={() => toggleColumn('status')}
                      />
                    }
                    label="Status"
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Panel de ordenamiento inteligente */}
          <Box sx={{ mb: 2 }}>
            <Accordion>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <SortIcon sx={{ mr: 1 }} />
                <Typography variant="h6">Ordenamiento Inteligente por Dirección</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={sortByAddress}
                        onChange={(e) => setSortByAddress(e.target.checked)}
                      />
                    }
                    label="Activar ordenamiento por dirección"
                  />
                  
                  {sortByAddress && (
                    <Box sx={{ 
                      backgroundColor: "#f5f5f5", 
                      padding: 2, 
                      borderRadius: 1,
                      border: "1px solid #e0e0e0"
                    }}>
                      <Typography variant="body2" sx={{ fontWeight: "bold", mb: 1 }}>
                        📋 Orden de organización:
                      </Typography>
                      <Typography variant="body2" component="div">
                        1. <strong>Calles</strong> (Calle, CLL, CL) - ordenadas numéricamente<br/>
                        2. <strong>Carreras</strong> (Carrera, KRA, CRR, CR, KR) - ordenadas numéricamente<br/>
                        3. <strong>Transversales</strong> (Transversal, TV, TRANS, TR) - ordenadas numéricamente<br/>
                        4. <strong>Diagonales</strong> (Diagonal, DG, DIAG) - ordenadas numéricamente<br/>
                        5. <strong>Avenidas</strong> (Avenida, AV, AVE) - ordenadas numéricamente<br/>
                        6. <strong>Otras direcciones</strong> - ordenadas alfabéticamente
                      </Typography>
                      
                      <Typography variant="body2" sx={{ mt: 2, fontStyle: "italic", color: "#666" }}>
                        💡 <strong>Ejemplo:</strong> Calle 7, Calle 8, Calle 10, Carrera 5, Carrera 7, Carrera 15...
                      </Typography>
                    </Box>
                  )}
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>

          {/* Tabla de envíos */}
          <Box ref={printRef}>
            <TableContainer component={Paper}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    {visibleColumns.guia && (
                      <StyledTableCell align="center">
                        <b>Guía</b>
                      </StyledTableCell>
                    )}
                    {visibleColumns.codigoBarras && (
                      <StyledTableCell align="center">
                        <b>Código de Barras</b>
                      </StyledTableCell>
                    )}
                    {visibleColumns.reclamarEn && (
                      <StyledTableCell align="center">
                        <b>Reclamar en</b>
                      </StyledTableCell>
                    )}
                    {visibleColumns.nombreDestinatario && (
                      <StyledTableCell align="center">
                        <b>Nombre Destinatario</b>
                      </StyledTableCell>
                    )}
                    {visibleColumns.direccion && (
                      <StyledTableCell align="center">
                        <b>Dirección</b>
                      </StyledTableCell>
                    )}
                    {visibleColumns.celular && (
                      <StyledTableCell align="center">
                        <b>Celular</b>
                      </StyledTableCell>
                    )}
                    {visibleColumns.valor && (
                      <StyledTableCell align="center">
                        <b>Valor</b>
                      </StyledTableCell>
                    )}
                    {visibleColumns.status && (
                      <StyledTableCell align="center">
                        <b>Status</b>
                      </StyledTableCell>
                    )}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((shipment) => (
                    <StyledTableRow key={shipment.uid}>
                      {visibleColumns.guia && (
                        <StyledTableCell align="center">
                          {shipment.uid}
                          <IconButton color="primary" aria-label="Llamar">
                            <LocalPhoneIcon />
                          </IconButton>
                          <Link
                            href={`https://wa.me/${
                              shipment?.destinatario?.celular
                                ? shipment.destinatario.celular.startsWith("+57")
                                  ? shipment.destinatario.celular
                                  : `+57${shipment.destinatario.celular}`
                                : "null"
                            }/?text=${encodeURIComponent(
                              `_*INTERRAPIDISIMO AQUITANIA*_ le informa que su pedido ha llegado\n\n` +
                                `• *Destinatario*: ${shipment.addressee}\n` +
                                `• *Valor*: ${shipment?.shippingCost ?? 0}\n` +
                                `Al momento de reclamar indique que su paquete es:\n` +
                                `• *Número de paquete*: ${shipment.packageNumber}\n` +
                                `• *Caja*: ${shipment.box}\n` +
                                `puede reclamar su paquete en : *PAPELERIA DONDE NAZLY*, por su seguridad recuerde que es el unico punto fisico para reclamar correspondencia de *INTERRAPIDISIMO* \n`
                            )}`}
                            target="_blank"
                          >
                            <IconButton
                              color="success"
                              aria-label="Enviar mensaje por WhatsApp"
                              onClick={()=>{handleCopyToClipboard((
                                `_*INTERRAPIDISIMO AQUITANIA*_ le informa que su pedido ha llegado\n\n` +
                                  `• *Destinatario*: ${shipment.addressee}\n` +
                                  `• *Valor*: ${shipment?.shippingCost ?? 0}\n` +
                                  `Al momento de reclamar indique que su paquete es:\n` +
                                  `• *Número de paquete*: ${shipment.packageNumber}\n` +
                                  `• *Caja*: ${shipment.box}\n` +
                                  `puede reclamar su paquete en : *PAPELERIA DONDE NAZLY*, por su seguridad recuerde que es el unico punto fisico para reclamar correspondencia de *INTERRAPIDISIMO* \n`
                              ))}}
                            >
                              <WhatsAppIcon />
                            </IconButton>
                          </Link>
                        </StyledTableCell>
                      )}
                      {visibleColumns.codigoBarras && (
                        <StyledTableCell ref={barcodeRef} align="center">
                          <svg id={`barcode-${shipment.uid}`} />
                        </StyledTableCell>
                      )}
                      {visibleColumns.reclamarEn && (
                        <StyledTableCell align="center">
                          {shipment.deliverTo}
                        </StyledTableCell>
                      )}
                      {visibleColumns.nombreDestinatario && (
                        <StyledTableCell align="center">
                          {shipment.destinatario?.nombre || shipment.addressee || "N/A"}
                        </StyledTableCell>
                      )}
                      {visibleColumns.direccion && (
                        <StyledTableCell align="center">
                          {shipment.destinatario?.direccion || shipment.address || "N/A"}
                        </StyledTableCell>
                      )}
                      {visibleColumns.celular && (
                        <StyledTableCell align="center">
                          {shipment.destinatario?.celular || "N/A"}
                        </StyledTableCell>
                      )}
                      {visibleColumns.valor && (
                        <StyledTableCell align="center">
                          {shipment.valor || shipment.shippingCost || "0"}
                        </StyledTableCell>
                      )}
                      {visibleColumns.status && (
                        <StyledTableCell align="center">
                          <Chip
                            label={shipment.status}
                            color={getChipColor(shipment.status)}
                          />
                        </StyledTableCell>
                      )}
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}