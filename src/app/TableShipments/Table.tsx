import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  InputBase,
  TablePagination,
} from "@mui/material";
import { updatedShipments } from "@/firebase/firebase";
import { enqueueSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { useEffect, useState } from "react";
import DeliveryModal from "@/components/confirmTable/detailGuide";

export default function BasicTable({ tableData }: { [x: string]: any }) {
  const [result, setResult] = useState<any[]>([]);
  const [search, setSearch] = useState({});
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(70);

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
      backgroundColor: "#000041",
      // color: "red",
      position: "sticky",
      top: 0, // Fija la cabecera en la parte superior
      zIndex: theme.zIndex.appBar, // Asegura que esté encima de otras filas
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

  const inputSearch = (field: string) => (
    <InputBase
      sx={{
        ml: 1,
        flex: 1,
        background: "aliceblue",
        borderRadius: "14px",
        padding: "2px 10px",
      }}
      placeholder="Buscar"
      onChange={(e) => {
        const filterData = filterByField(field, e.target.value);
        setResult(filterData);
      }}
      inputProps={{ "aria-label": "Buscar" }}
    />
  );

  function filterByField(field: any, value: any) {
    if (field === undefined || value === undefined) {
      return [];
    }
    return tableData.filter((item: any) => {
      if (item[field] !== undefined && item[field] !== null) {
        return item[field]
          .toString()
          .toLowerCase()
          .includes(value.toString().toLowerCase());
      }
      return false;
    });
  }

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

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedRows = result.length > 0 ? result : tableData;
  const rowsToDisplay = displayedRows.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box>
      <TableContainer
        id={"table container"}
        sx={{ maxHeight: 840, borderRadius: "20px", overflow: "auto" }}
      >
        <Table
          id={"table container"}
          sx={{ minWidth: 650 }}
          aria-label="simple table"
          stickyHeader
        >
          <TableHead sx={{ background: "#3C47A3" }}>
            <TableRow>
              <StyledTableCell sx={{ color: "#fff" }} align="center">
                {"select"}
              </StyledTableCell>
              <StyledTableCell sx={{ color: "#fff" }} align="center">
                Nª GUIA
                {inputSearch("guide")}
              </StyledTableCell>
              <StyledTableCell sx={{ color: "#fff" }} align="center">
                Destinatario
                {inputSearch("addressee")}
              </StyledTableCell>
              <StyledTableCell sx={{ color: "#fff" }} align="center">
                Entregar en:
                {inputSearch("deliverTo")}
              </StyledTableCell>
              <StyledTableCell sx={{ color: "#fff" }} align="center">
                Caja
                {inputSearch("box")}
              </StyledTableCell>
              <StyledTableCell sx={{ color: "#fff" }} align="center">
                Paquete
                {inputSearch("packageNumber")}
              </StyledTableCell>
              <StyledTableCell sx={{ color: "#fff" }} align="center">
                Valor
                {inputSearch("shippingCost")}
              </StyledTableCell>
              <StyledTableCell sx={{ color: "#fff" }} align="center">
                Estado
              </StyledTableCell>
              <StyledTableCell sx={{ color: "#fff" }} align="center">
                Detalles
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToDisplay.map((row: any) => (
              <StyledTableRow
                key={row.uid}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <StyledTableCell align="center">
                  <Checkbox color="primary" />
                </StyledTableCell>
                <StyledTableCell align="center">{row.guide}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.addressee}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.deliverTo}
                </StyledTableCell>
                <StyledTableCell align="center">{row.box}</StyledTableCell>
                <StyledTableCell align="center">
                  {row.packageNumber}
                </StyledTableCell>
                <StyledTableCell align="center">
                  {row.shippingCost}
                </StyledTableCell>
                <StyledTableCell>
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
                <StyledTableCell>
                  <DeliveryModal data={row} />
                </StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 20, 50, 70]}
        component="div"
        count={displayedRows.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
