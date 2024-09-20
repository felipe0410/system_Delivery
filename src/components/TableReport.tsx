import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Typography,
  Button,
  Chip,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import DeliveryModal from "./confirmTable/detailGuide";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const TableReport = ({ data }: { [x: string]: any }) => {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "red",
      color: "red",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 20,
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

  const generatePDF = async () => {
    const input = document.getElementById("table-to-pdf");
    if (!input) return;

    // Aumentar el tamaño de la fuente del contenido antes de capturar
    input.style.fontSize = "22px"; // Aumentar el tamaño de la fuente a 16px o el valor que prefieras

    const canvas = await html2canvas(input, {
      scale: 2, // Aumentar la escala para mejorar la calidad y tamaño del texto en el PDF
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgWidth = 210; // Width of A4 page in mm
    const pageHeight = 297; // Height of A4 page in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    const today = new Date();
    const day = String(today.getDate()).padStart(2, "0");
    const month = String(today.getMonth() + 1).padStart(2, "0"); // Los meses son 0-indexados
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;

    // Guardar el archivo con el nombre "reporte-DD-MM-YYYY.pdf"
    pdf.save(`reporte-${formattedDate}.pdf`);

    // Restablecer el estilo original después de la generación
    input.style.fontSize = "";
  };

  const buttons = [
    {
      name: "Generar Reporte",
      background: "#5C68D4",
      src: "/images/generarReporte.svg",
      onclick: () => generatePDF(),
      key: "123",
    },
  ];

  type StatusStyle = {
    background: string;
    color: string;
    border: string;
  };
  const getStatusStyle = (status: string): StatusStyle => {
    switch (status) {
      case "entregado":
        return {
          background: "#4caf5047",
          border: "solid #0b5412 1px",
          color: "#0b5412",
        };
      case "oficina":
        return {
          background: "#ffe50169",
          border: "solid #c58f0a 1px",
          color: "#000000",
        };
      case "mensajero":
        return {
          background: "#2421f352",
          border: "solid #1976d2 1px",
          color: "#000",
        };
      case "devolucion":
        return {
          background: "#f4433666",
          border: "solid #d32f2f 1px",
          color: "#ffffff",
        };
      default:
        return {
          background: "#9e9e9e",
          border: "solid #757575 1px",
          color: "#ffffff",
        };
    }
  };

  return (
    <>
      {data.length !== 0 && (
        <>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "400px", overflowY: "auto", borderRadius: "20px" }}
          >
            <Table
              id="table-to-pdf"
              sx={{ minWidth: 650 }}
              aria-label="simple table"
            >
              <TableHead sx={{ background: "#3C47A3" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff", fontSize:'20px' }}># Guía</TableCell>
                  <TableCell sx={{ color: "#fff", fontSize:'20px' }} align="center">
                    Nombre
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontSize:'20px' }} align="center">
                    Estado del envío
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontSize:'20px' }} align="center">
                    Paquete
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontSize:'20px' }} align="center">
                    Caja
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontSize:'20px' }} align="center">
                    Admision agencia
                  </TableCell>
                  <TableCell sx={{ color: "#fff", fontSize:'20px' }} align="center">
                    Detalles
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row: any) => (
                  <StyledTableRow
                    key={row.uid}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell component="th" scope="row">
                      {row.guide}
                    </StyledTableCell>
                    <StyledTableCell align="left">
                      {row.addressee}
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      <Chip
                        label={row.status}
                        sx={{
                          ...getStatusStyle(row.status),
                          fontSize: "16px",
                          marginLeft: "10px",
                          width: "100%",
                          fontWeight: 700,
                        }}
                      />
                    </StyledTableCell>
                    <StyledTableCell align="right">
                      {row.packageNumber}
                    </StyledTableCell>
                    <StyledTableCell align="right">{row.box}</StyledTableCell>
                    <StyledTableCell align="right">
                      {row.intakeDate}
                    </StyledTableCell>
                    <StyledTableCell>
                      <DeliveryModal data={row} />
                    </StyledTableCell>
                  </StyledTableRow>
                ))}
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
            {buttons.map((button) => (
              <Button
                onClick={button.onclick}
                key={button.key}
                sx={{
                  display: "flow",
                  width: "25%",
                  padding: "10px",
                  borderRadius: "40px",
                  background: button.background,
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  textAlign: "center",
                  justifyContent: "space-around",
                }}
              >
                <Box component={"img"} src={button.src} />
                <Typography
                  sx={{
                    color: "#FFF",
                    textAlign: "center",
                    fontFamily: "Nunito",
                    fontSize: "0.8rem",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                  }}
                >
                  {button.name}
                </Typography>
              </Button>
            ))}
          </Box>
        </>
      )}
    </>
  );
};

export default TableReport;
