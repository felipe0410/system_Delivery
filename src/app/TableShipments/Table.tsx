import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Box, Button, Checkbox, InputBase } from "@mui/material";
import { updatedShipments } from "@/firebase/firebase";
import { enqueueSnackbar } from "notistack";
import { styled } from "@mui/material/styles";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import { useEffect, useState } from "react";

export default function BasicTable({ tableData }: { [x: string]: any }) {
  const [result, setResult] = useState([]);
  const [search, setsearch] = useState({});

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

  return (
    <Box>
      <Box sx={{ display: "flex", gap: 1, justifyContent: "center" }}>
        <Button sx={{ width: "30%" }} variant="contained">
          Edit
        </Button>
        <Button sx={{ width: "30%" }} variant="contained">
          Delete
        </Button>
        <Button sx={{ width: "30%" }} variant="contained">
          {"Entregado"}
        </Button>
      </Box>

      <TableContainer id={"table container"} sx={{ borderRadius: "20px" }}>
        <Table
          id={"table container"}
          sx={{ minWidth: 650 }}
          aria-label="simple table"
        >
          <TableHead sx={{ background: "#3C47A3" }}>
            <TableRow>
              <TableCell sx={{ color: "#fff" }} align="center">
                {"select"}
              </TableCell>
              <TableCell sx={{ color: "#fff" }} align="center">
                Nª GUIA
                {inputSearch("guide")}
              </TableCell>
              <TableCell sx={{ color: "#fff" }} align="center">
                Destinatario
                {inputSearch("addressee")}
              </TableCell>
              <TableCell sx={{ color: "#fff" }} align="center">
                Entregar en:
                {inputSearch("deliverTo")}
              </TableCell>
              <TableCell sx={{ color: "#fff" }} align="center">
                Caja
                {inputSearch("box")}
              </TableCell>
              <TableCell sx={{ color: "#fff" }} align="center">
                Paquete
                {inputSearch("packageNumber")}
              </TableCell>
              <TableCell sx={{ color: "#fff" }} align="center">
                Valor
                {inputSearch("shippingCost")}
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(result.length > 0 ? result : tableData).map((row: any) => (
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
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
