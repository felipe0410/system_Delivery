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
  TextField,
  IconButton,
  Link,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import CancelIcon from "@mui/icons-material/Cancel";
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
  const filteredData =
    filterStatus === "todos"
      ? data
      : data.filter((shipment) => shipment.status === filterStatus);

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

          {/* Tabla de envíos */}
          <Box ref={printRef}>
            <TableContainer component={Paper}>
              <Table stickyHeader size="small">
                <TableHead>
                  <TableRow>
                    <StyledTableCell align="center">
                      <b>Guía</b>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <b>Código de Barras</b>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <b>Reclamar en</b>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <b>Nombre Destinatario</b>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <b>Celular</b>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <b>Valor</b>
                    </StyledTableCell>
                    <StyledTableCell align="center">
                      <b>Status</b>
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredData.map((shipment) => (
                    <StyledTableRow key={shipment.uid}>
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
                              `• *Valor*: $${shipment?.shippingCost ?? 0}\n` +
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
                                `• *Valor*: $${shipment?.shippingCost ?? 0}\n` +
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
                      <StyledTableCell ref={barcodeRef} align="center">
                        <svg id={`barcode-${shipment.uid}`} />
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {shipment.deliverTo}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {shipment.destinatario?.nombre || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {shipment.destinatario?.celular || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {shipment.valor || "0"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        <Chip
                          label={shipment.status}
                          color={getChipColor(shipment.status)}
                        />
                      </StyledTableCell>
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
