import { useEffect, useState } from "react";
import JsBarcode from "jsbarcode";
import {
  Box,
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
  CircularProgress,
} from "@mui/material";
import { SnackbarProvider } from "notistack";
import { getFilteredShipmentsDataTimestap } from "@/firebase/firebase";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";

const containerStyle = {
  width: {
    xs: "95%",
    sm: "90%",
    md: "85%",
    lg: "70%",
  },
  maxWidth: "1000px",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: {
    xs: 2,
    sm: 3,
    md: 4,
  },
  height: {
    xs: "95%",
    md: "90%",
  },
  overflowY: "auto",
  borderRadius: "10px",
  mx: "auto",
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
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState<
    "oficina" | "mensajero" | "entregado" | "devolucion" | "todos"
  >("oficina");

  useEffect(() => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const formatted = `${yyyy}-${mm}-${dd}`;
    setSelectedDate([formatted, formatted]);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (selectedDate?.length === 2) {
        try {
          setLoading(true);
          const shipments = await getFilteredShipmentsDataTimestap(selectedDate);
          setData(shipments || []);
        } catch (error) {
          console.error("Error al traer las guías:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchData();
  }, [selectedDate]);

  const filteredData = filterStatus === "todos"
    ? data
    : data.filter((s) => s.status === filterStatus);

  const getChipColor = (status: string) => {
    const colors: any = {
      mensajero: "primary",
      devolucion: "warning",
      entregado: "success",
      oficina: "secondary",
    };
    return colors[status] || "default";
  };

  const handleCopy = (msg: string) => {
    navigator.clipboard.writeText(msg).catch(console.error);
  };

  const generateMessage = (shipment: any) => {
    if (shipment.status === "mensajero") {
      return (
        ` _*INTERRAPIDISIMO AQUITANIA*_ le informa que su paquete ha llegado\n\n` +
        `📦 *Tu pedido será entregado hoy.* El *DOMICILIARIO* lo visitará durante el día.\n` +
        `Por favor tener el dinero en efectivo disponible. En caso de necesitarlo con urgencia,\n` +
        `puede acercarse a *PAPELERÍA DONDE NAZLY* y reclamarlo sin problema.\n\n` +
        `• *Destinatario*: ${shipment.addressee}\n` +
        `• *Valor*: $${shipment?.shippingCost ?? 0}\n` +
        `#️⃣ *Número de paquete*: ${shipment.packageNumber}\n` +
        `📦 *Caja*: ${shipment.box}`
      );
    }

    return (
      `_*INTERRAPIDÍSIMO AQUITANIA*_ le informa que su paquete ha llegado al momento de reclamar su paquete por favor indique el numero de paquete y la caja que se adjunta acontinuacion.\n\n` +
      `🗃️ *Caja:* ${shipment.box}\n` +
      `📦 *Paquete Nº:* ${shipment.packageNumber}\n` +
      `💰 *Valor a pagar:* $${shipment?.shippingCost ?? 0}\n\n` +
      `📌 *Destinatario:* ${shipment.addressee}\n` +
      `🕒 *Horario de atención:*\n` +
      `Lunes a Viernes: *9:00 am a 12:30 pm* y *3:00 pm a 7:00 pm*\n` +
      `Sábados: *4:00 pm a 7:00 pm*\n\n` +
      `📍 Reclame su paquete en: *PAPELERÍA DONDE NAZLY* — CRA 7 Nº 7-08\n\n` +
      `⚠️ Por su seguridad, este es el *único punto autorizado* para entregar correspondencia de *INTERRAPIDÍSIMO* ademas recuerde que cuenta con 10 dias para reclamar su paquete`
    );    
  };

  return (
    <Box width="100%">
      <SnackbarProvider />
      <Box sx={{ ...containerStyle, mt: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
            flexWrap: "wrap",
          }}
        >
          <ToggleButtonGroup
            value={filterStatus}
            exclusive
            onChange={(_, newStatus) => newStatus && setFilterStatus(newStatus)}
            sx={{ flexWrap: "wrap", fontSize: "10px" }}
          >
            {["todos", "oficina", "mensajero"].map((status) => (
              <ToggleButton key={status} sx={{ fontSize: "12px" }} value={status}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", my: 4, alignItems: "center" }}>
            <span style={{ marginRight: 10 }}>Cargando envíos...</span>
            <CircularProgress size={20} />
          </Box>
        ) : (
          <TableContainer component={Paper} sx={{ overflowX: "auto" }}>
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow>
                  {["Guía", "Nombre", "Celular", "Valor", "Status"].map((title) => (
                    <StyledTableCell key={title} align="center">
                      <b>{title}</b>
                    </StyledTableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData.map((shipment) => {
                  const msg = generateMessage(shipment);
                  const phone = shipment?.destinatario?.celular;
                  const fullPhone = phone?.startsWith("+57") ? phone : `+57${phone}`;
                  const waLink = `https://wa.me/${fullPhone}/?text=${encodeURIComponent(msg)}`;

                  const noContestoMsg =
                    `*NO CONTESTÓ*\n\n` +
                    `- *Guía:* ${shipment.uid}\n` +
                    `- *Nombre:* ${shipment.destinatario?.nombre || "N/A"}\n` +
                    `- *Celular:* ${phone || "N/A"}\n` +
                    `- *Valor:* $${shipment?.shippingCost ?? 0}\n` +
                    `#️⃣ *Número de paquete*: ${shipment.packageNumber}\n` +
                    `Caja: ${shipment.box}`;

                  return (
                    <StyledTableRow key={shipment.uid}>
                      <StyledTableCell align="center">
                        {shipment.uid}

                        {/* Botón verde al destinatario */}
                        <Link href={waLink} target="_blank">
                          <IconButton
                            color="success"
                            aria-label="Enviar por WhatsApp al destinatario"
                            onClick={() => handleCopy(msg)}
                          >
                            <WhatsAppIcon />
                          </IconButton>
                        </Link>

                        {/* Botón rojo a número fijo */}
                        <Link
                          href={`https://wa.me/573105762035?text=${encodeURIComponent(noContestoMsg)}`}
                          target="_blank"
                        >
                          <IconButton
                            sx={{ color: "red" }}
                            aria-label="Enviar mensaje de NO CONTESTÓ"
                            onClick={() => handleCopy(noContestoMsg)}
                          >
                            <WhatsAppIcon />
                          </IconButton>
                        </Link>
                      </StyledTableCell>

                      <StyledTableCell align="center">
                        {shipment.destinatario?.nombre || "N/A"}
                      </StyledTableCell>
                      <StyledTableCell align="center">
                        {phone || "N/A"}
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
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
}
