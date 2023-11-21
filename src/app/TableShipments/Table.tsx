import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button } from "@mui/material";
import { updatedShipments } from "@/firebase/firebase";
import { enqueueSnackbar } from "notistack";

export default function BasicTable({ tableData }: { [x: string]: any }) {
  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const deliverButton = async (status: string, id: string, data: any) => {
    try {
      const petition = await updatedShipments(id, {
        ...data,
        status: status,
        deliveryDate: status === "entregado" ? getCurrentDateTime() : null,
      });
      enqueueSnackbar(
        petition ? "Guia guardada con exito" : "Error al guardar el paquete",
        {
          variant: petition ? "success" : "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        }
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label='simple table'>
        <TableHead>
          <TableRow>
            <TableCell>Destinatario</TableCell>
            <TableCell align='right'>Entregar en:</TableCell>
            <TableCell align='right'>Caja</TableCell>
            <TableCell align='right'>Paquete</TableCell>
            <TableCell align='right'>Valor</TableCell>
            <TableCell>{"Acciones(admin)"}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {tableData.map((row: any) => (
            <TableRow
              key={row.uid}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component='th' scope='row'>
                {row.addressee}
              </TableCell>
              <TableCell align='right'>{row.deliverTo}</TableCell>
              <TableCell align='right'>{row.box}</TableCell>
              <TableCell align='right'>{row.packageNumber}</TableCell>
              <TableCell align='right'>{row.shippingCost}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button>Edit</Button>
                  <Button>Delete</Button>
                  <Button
                    onClick={() => deliverButton("entregado", row.uid, row)}
                  >
                    {row.status === "entregado" ? "Entregado" : "Entregar"}
                  </Button>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
