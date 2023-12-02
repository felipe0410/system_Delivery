import * as React from "react";
import Box from "@mui/material/Box";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { tableCellClasses } from "@mui/material/TableCell";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { shipments } from "@/firebase/firebase";

export default function TableModalResponsive({ data }: { [x: string]: any }) {
  const [expandedRow, setExpandedRow] = React.useState<string | null>(null);

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

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const createOnClickHandler = async (row: any, status: string) => {
    try {
      const guideStatus = row.status;

      if (guideStatus === "entregado" || guideStatus === "devolucion") {
        enqueueSnackbar(`El paquete ${row.guide} ya está ${guideStatus}`, {
          variant: "warning",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        const updatedRow = {
          ...row,
          status: status,
          deliveryDate: status === "entregado" ? getCurrentDateTime() : null,
          returnDate: status === "devolucion" ? getCurrentDateTime() : null,
          deliverTo: status === "oficina" ? "oficina" : "direccion",
        };

        await shipments(row.guide, updatedRow);
        enqueueSnackbar(`Guia ${row.guide} guardada con éxito`, {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      }
    } catch (error) {
      enqueueSnackbar("Error al guardar el paquete", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  return (
    <>
      <SnackbarProvider />
      {data.length === 0 ? (
        <Typography variant='h6' align='center' mt={3}>
          No se encontraron datos.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "400px", overflowY: "auto", borderRadius: "20px" }}
        >
          <Table aria-label='collapsible table'>
            <TableHead sx={{ background: "#3C47A3" }}>
              <TableRow>
                <TableCell />
                <TableCell sx={{ color: "#fff" }}># Guía</TableCell>
                <TableCell sx={{ color: "#fff" }} align='center'>
                  Nombre
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((row: any) => (
                <React.Fragment key={row.uid}>
                  <StyledTableRow>
                    <StyledTableCell>
                      <IconButton
                        aria-label='expand row'
                        size='small'
                        onClick={() =>
                          setExpandedRow(
                            expandedRow === row.uid ? null : row.uid
                          )
                        }
                      >
                        {expandedRow === row.uid ? (
                          <KeyboardArrowUpIcon />
                        ) : (
                          <KeyboardArrowDownIcon />
                        )}
                      </IconButton>
                    </StyledTableCell>
                    <StyledTableCell component='th' scope='row'>
                      {row.guide}
                    </StyledTableCell>
                    <StyledTableCell align='left'>
                      {row.addressee}
                    </StyledTableCell>
                  </StyledTableRow>
                  <StyledTableRow>
                    <StyledTableCell
                      style={{ paddingBottom: 0, paddingTop: 0 }}
                      colSpan={6}
                    >
                      <Collapse
                        in={expandedRow === row.uid}
                        timeout='auto'
                        unmountOnExit
                      >
                        <Table>
                          <TableHead sx={{ background: "#3C47A3" }}>
                            <StyledTableRow>
                              <TableCell sx={{ color: "#fff" }} align='left'>
                                Estado del envío
                              </TableCell>
                              <TableCell sx={{ color: "#fff" }} align='left'>
                                Paquete
                              </TableCell>
                              <TableCell sx={{ color: "#fff" }} align='left'>
                                Caja
                              </TableCell>
                            </StyledTableRow>
                          </TableHead>
                          <StyledTableRow>
                            <StyledTableCell align='left'>
                              {row.status}
                            </StyledTableCell>
                            <StyledTableCell align='left'>
                              {row.packageNumber}
                            </StyledTableCell>
                            <StyledTableCell align='left'>
                              {row.box}
                            </StyledTableCell>
                          </StyledTableRow>
                          <Box
                            sx={{
                              marginTop: "1rem",
                              textAlign: "center",
                              display: "flex",
                              flexDirection: "row",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <Button
                              onClick={() =>
                                createOnClickHandler(row, "entregado")
                              }
                              sx={{
                                display: "flow",
                                width: "40%",
                                padding: "8px",
                                borderRadius: "40px",
                                background: "#00A410",
                                boxShadow:
                                  "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                textAlign: "center",
                                justifyContent: "space-around",
                              }}
                            >
                              <Box
                                component={"img"}
                                src='/images/deliver.svg'
                                sx={{ width: "24px" }}
                              />
                              <Typography
                                sx={{
                                  color: "#FFF",
                                  textAlign: "center",
                                  fontFamily: "Nunito",
                                  fontSize: "0.58rem",
                                  fontStyle: "normal",
                                  fontWeight: 700,
                                  lineHeight: "normal",
                                }}
                              >
                                ENTREGAR
                              </Typography>
                            </Button>
                            <Button
                              onClick={() =>
                                createOnClickHandler(row, "devolucion")
                              }
                              sx={{
                                display: "flow",
                                width: "40%",
                                padding: "8px",
                                borderRadius: "40px",
                                background: "#5C68D4",
                                boxShadow:
                                  "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                textAlign: "center",
                                justifyContent: "space-around",
                              }}
                            >
                              <Box
                                component={"img"}
                                src='/images/returnBack.svg'
                                sx={{ width: "24px" }}
                              />
                              <Typography
                                sx={{
                                  color: "#FFF",
                                  textAlign: "center",
                                  fontFamily: "Nunito",
                                  fontSize: "0.58rem",
                                  fontStyle: "normal",
                                  fontWeight: 700,
                                  lineHeight: "normal",
                                }}
                              >
                                DEVOLUCION
                              </Typography>
                            </Button>
                            <Button
                              onClick={() =>
                                createOnClickHandler(row, "oficina")
                              }
                              sx={{
                                display: "flow",
                                width: "40%",
                                padding: "8px",
                                borderRadius: "40px",
                                background: "#0A0F37",
                                boxShadow:
                                  "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                textAlign: "center",
                                justifyContent: "space-around",
                              }}
                            >
                              <Box
                                component={"img"}
                                src='/images/delete.svg'
                                sx={{ width: "24px" }}
                              />
                              <Typography
                                sx={{
                                  color: "#FFF",
                                  textAlign: "center",
                                  fontFamily: "Nunito",
                                  fontSize: "0.58rem",
                                  fontStyle: "normal",
                                  fontWeight: 700,
                                  lineHeight: "normal",
                                }}
                              >
                                ELIMINAR DE MENSAJERO
                              </Typography>
                            </Button>
                          </Box>
                        </Table>
                      </Collapse>
                    </StyledTableCell>
                  </StyledTableRow>
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
