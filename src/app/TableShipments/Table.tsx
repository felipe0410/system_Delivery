import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Box, Button, Checkbox } from "@mui/material";
import { updatedShipments } from "@/firebase/firebase";
import { enqueueSnackbar } from "notistack";
import { styled } from '@mui/material/styles';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';

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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: 'red',
      color: 'red',
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));

  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: '#3c47a338',
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));

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
    <Box>
      <Box sx={{ display: "flex", gap: 1, justifyContent: 'center' }}>
        <Button sx={{ width: '30%' }} variant="contained" >Edit</Button>
        <Button sx={{ width: '30%' }} variant="contained">Delete</Button>
        <Button
          sx={{ width: '30%' }}
          variant="contained"
        >
          {"Entregado"}
        </Button>
      </Box>

      <TableContainer id={'table container'} sx={{ borderRadius: '20px' }}>
        <Table id={'table container'} sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead sx={{ background: '#3C47A3' }} >
            <TableRow>
              <TableCell sx={{ color: '#fff' }} align='center'>{"select"}</TableCell>
              <TableCell sx={{ color: '#fff' }} >Destinatario</TableCell>
              <TableCell sx={{ color: '#fff' }} align='right'>Entregar en:</TableCell>
              <TableCell sx={{ color: '#fff' }} align='right'>Caja</TableCell>
              <TableCell sx={{ color: '#fff' }} align='right'>Paquete</TableCell>
              <TableCell sx={{ color: '#fff' }} align='right'>Valor</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row: any) => (
              <StyledTableRow
                key={row.uid}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell align='center' >
                  <Checkbox
                    color="primary"
                  // checked={isItemSelected}
                  // inputProps={{
                  //   'aria-labelledby': labelId,
                  // }}
                  />
                </StyledTableCell>
                <StyledTableCell align='right'>{row.addressee}</StyledTableCell>
                <StyledTableCell align='right'>{row.deliverTo}</StyledTableCell>
                <StyledTableCell align='right'>{row.box}</StyledTableCell>
                <StyledTableCell align='right'>{row.packageNumber}</StyledTableCell>
                <StyledTableCell align='right'>{row.shippingCost}</StyledTableCell>

              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
