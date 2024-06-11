import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import {
  getAllShipmentsData,
  shipments,
  getStatusShipmentsData,
} from "@/firebase/firebase";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import { useState, useEffect } from "react";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import DeliveryModal from "@/components/confirmTable/detailGuide";
import DevolucionModal from "./Devolucion";
import EntregarModal from "./Entregar";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: "#3C47A3",
    color: theme.palette.common.white,
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

export default function TableDomi() {
  const [firebaseData, setFirebaseData] = useState<any[]>([]);
  const [selectedRows, setSelectedRows] = useState<any[]>([]);

  const handleSelectionChange = (newSelectedRows: any[]) => {
    setSelectedRows(newSelectedRows);
  };

  const handleCheckboxChange = (row: any) => {
    const isChecked = selectedRows.some(
      (selectedRow) => selectedRow.uid === row.uid
    );
    const updatedSelectedRows = isChecked
      ? selectedRows.filter((selectedRow) => selectedRow.uid !== row.uid)
      : [...selectedRows, row];
    handleSelectionChange(updatedSelectedRows);
  };

  const handleAutocompleteChange = (event: any, newValue: any[]) => {
    handleSelectionChange(newValue);
  };

  useEffect(() => {
    const status = "mensajero";
    getStatusShipmentsData(status, setFirebaseData);
  }, []);

  return (
    <Box sx={{ height: "100%" }}>
      <Box sx={{ display: "flex", justifyContent: "right" }}>
        <Typography
          sx={{
            fontFamily: "Nunito",
            fontSize: "30px",
            fontWeight: 800,
            lineHeight: "46.38px",
            textAlign: "center",
            marginRight: "10px",
          }}
        >
          Total paquetes
        </Typography>
        <Box
          sx={{
            borderRadius: "35px",
            opacity: "0px",
            background: "#11192F",
            padding: "12px",
            color: "#fff",
            width: "70px",
            textAlignLast: "center",
          }}
        >
          {firebaseData.length}
        </Box>
      </Box>
      <Box sx={{ textAlign: "-webkit-center" }}>
        <Box>
          <Typography
            sx={{
              color: "#0A0F37",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: { xs: "1.5rem", sm: "2.0rem" },
              fontStyle: "normal",
              fontWeight: 900,
              lineHeight: "normal",
            }}
          >
            RESUMEN DOMICILIARIO
          </Typography>
        </Box>
        <Box mt={1} width={"39.5625rem"}>
          <Typography
            sx={{
              color: "#000",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: "1.25rem",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "normal",
            }}
          >
            Paquetes asignados al domiciliario
          </Typography>
        </Box>
      </Box>

      <TableContainer
        id='container'
        sx={{ height: "900px", overflowY: "scroll", maxHeight: "450px" }}
        component={Paper}
      >
        <SnackbarProvider />
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell># Guía </StyledTableCell>
              <StyledTableCell align='left'>Nombre</StyledTableCell>
              <StyledTableCell align='center'>Recibido</StyledTableCell>
              <StyledTableCell align='center'>Pago</StyledTableCell>
              <StyledTableCell align='center'>Valor</StyledTableCell>
              <StyledTableCell align='center'>Celular</StyledTableCell>
              <StyledTableCell align='center'>Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {firebaseData?.map((row, i) => {
              const dateTimeString = row.intakeDate;
              const dateAndTime = dateTimeString
                .substring(0, 19)
                .replace("T", " ");

              return (
                <StyledTableRow key={row.uid}>
                  <StyledTableCell>
                    <Checkbox
                      checked={selectedRows.some(
                        (selectedRow) => selectedRow.uid === row.uid
                      )}
                      onChange={() => handleCheckboxChange(row)}
                    />
                  </StyledTableCell>
                  <StyledTableCell component='th' scope='row'>
                    {row.uid}
                  </StyledTableCell>
                  <StyledTableCell component='th' scope='row'>
                    {row.addressee}
                  </StyledTableCell>
                  <StyledTableCell align='center'>
                    {dateAndTime}
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    <Chip
                      sx={{
                        display: "flex",
                        m: 1,
                        borderRadius: "3rem",
                        background:
                          row.pago === "Crédito"
                            ? "#150E63"
                            : row.pago === "Contado"
                            ? "#545B58"
                            : "#106D14",
                        color: "#fff",
                      }}
                      variant='outlined'
                      label={row?.pago ?? "no definido"}
                    />
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    {row.shippingCost}
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    {row?.destinatario?.celular ?? ""}
                  </StyledTableCell>
                  <StyledTableCell align='right'>
                    <DeliveryModal data={row} />
                  </StyledTableCell>
                </StyledTableRow>
              );
            })}
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
        <Autocomplete
          multiple
          id='tags-outlined'
          options={firebaseData}
          getOptionLabel={(option) => option?.uid}
          value={selectedRows}
          onChange={handleAutocompleteChange}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder='Guias'
              sx={{
                backgroundColor: "white",
                borderRadius: "0.28rem",
                border: "0",
              }}
            />
          )}
          popupIcon={<QrCodeScannerIcon fontSize='inherit' />}
          sx={{ width: "60%", marginTop: "1rem" }}
        />
      </Box>
      <Box
        sx={{
          marginTop: "2rem",
          textAlign: "center",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
        }}
      >
        <DevolucionModal base={50000} data={selectedRows} />
        <EntregarModal base={50000} data={selectedRows} />
      </Box>
    </Box>
  );
}
