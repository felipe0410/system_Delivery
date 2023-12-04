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
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";

const TableReport = ({ data }: { [x: string]: any }) => {
  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "red",
      color: "red",
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

  const generateReport = () => {
    console.log("estoy generando el reporte");
  };

  const downloadReport = () => {
    console.log("estoy descargando el reporte");
  };

  const buttons = [
    {
      name: "Generar Reporte",
      background: "#5C68D4",
      src: "/images/generarReporte.svg",
      onclick: () => generateReport(),
      key: "123",
    },
    {
      name: "Descargar Reporte",
      background: "#5C68D4",
      src: "/images/download.svg",
      onclick: () => downloadReport(),
      key: "1234",
    },
  ];

  return (
    <>
      {data.length !== 0 && (
        <>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: "400px", overflowY: "auto", borderRadius: "20px" }}
          >
            <Table sx={{ minWidth: 650 }} aria-label='simple table'>
              <TableHead sx={{ background: "#3C47A3" }}>
                <TableRow>
                  <TableCell sx={{ color: "#fff" }}># Guía</TableCell>
                  <TableCell sx={{ color: "#fff" }} align='center'>
                    Nombre
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }} align='center'>
                    Estado del envío
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }} align='center'>
                    Paquete
                  </TableCell>
                  <TableCell sx={{ color: "#fff" }} align='center'>
                    Caja
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row: any) => (
                  <StyledTableRow
                    key={row.uid}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell component='th' scope='row'>
                      {row.guide}
                    </StyledTableCell>
                    <StyledTableCell align='left'>
                      {row.addressee}
                    </StyledTableCell>
                    <StyledTableCell align='right'>
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell align='right'>
                      {row.packageNumber}
                    </StyledTableCell>
                    <StyledTableCell align='right'>{row.box}</StyledTableCell>
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
