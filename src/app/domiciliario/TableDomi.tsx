import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { getAllShipmentsData, shipments } from "@/firebase/firebase";
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
  const [num, setNumm] = useState(0);

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

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const createOnClickHandler = async (status: string) => {
    try {
      for (const selectedRow of selectedRows) {
        const guideStatus = selectedRow.status;

        if (guideStatus === status) {
          enqueueSnackbar(`El paquete ya está ${guideStatus}`, {
            variant: "warning",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
          continue;
        }
        await shipments(selectedRow.guide, {
          ...selectedRow,
          status: status,
          returnDate: status === "devolucion" ? getCurrentDateTime() : null,
          deliveryDate: status === "entregado" ? getCurrentDateTime() : null,
        });
        enqueueSnackbar("Guía guardada con éxito", {
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

  const buttons = [
    {
      name: "DEVOLVER AGENCIA",
      background: "#5C68D4",
      src: "/devolucion.png",
      onclick: () => createOnClickHandler("devolucion"),
    },
    {
      name: "ENTREGAR",
      background: "#00A410",
      src: "/oficina.png",
      onclick: () => createOnClickHandler("entregado"),
    },
  ];

  useEffect(() => {
    const getFirebaseData = async () => {
      try {
        const dataRef = await getAllShipmentsData();
        const filteredData = dataRef.filter(
          (item: { revision: boolean }) => item?.revision === false
        );
        setFirebaseData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getFirebaseData();
  }, []);

  useEffect(() => {
    const allData = async () => {
      const allData: any[] = await getAllShipmentsData();
      const array: any = [];
      allData.map((data) => {
        array.push(data.packageNumber);
      });
      const numerosOrdenados = array
        .map(Number)
        .sort((a: any, b: any) => a - b);
      let numeroFaltante = 1;
      for (const numero of numerosOrdenados) {
        if (numero === numeroFaltante) {
          numeroFaltante++;
        } else if (numero > numeroFaltante) {
          break;
        }
      }
      setNumm(numeroFaltante);
    };
    allData();
  }, []);

  return (
    <Box>
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
          {num}
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
        sx={{ height: "100%", overflowY: "scroll", maxHeight: "350px" }}
        component={Paper}
      >
        <SnackbarProvider />
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell></StyledTableCell>
              <StyledTableCell># Guía </StyledTableCell>
              <StyledTableCell align='left'>Nombre</StyledTableCell>
              <StyledTableCell align='right'>#Paquete</StyledTableCell>
              <StyledTableCell align='right'>Caja </StyledTableCell>
              <StyledTableCell align='right'>Pago</StyledTableCell>
              <StyledTableCell align='right'>Valor</StyledTableCell>
              <StyledTableCell align='right'>Celular</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {firebaseData?.map((row, i) => (
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
                <StyledTableCell align='right'>
                  {row.packageNumber}
                </StyledTableCell>
                <StyledTableCell align='right'>{row.box}</StyledTableCell>
                <StyledTableCell align='right'>
                  {
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
                  }
                </StyledTableCell>
                <StyledTableCell align='right'>
                  {row.shippingCost}
                </StyledTableCell>
                <StyledTableCell align='right'>
                  {row?.destinatario?.celular ?? ""}
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
        {buttons.map((button) => (
          <Button
            onClick={button.onclick}
            key={crypto.randomUUID()}
            sx={{
              display: "flex",
              width: "40%",
              padding: { xs: "8px", sm: "15px" },
              borderRadius: "40px",
              background: button.background,
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              textAlign: "center",
              justifyContent: "space-around",
              "&:hover": { backgroundColor: button.background },
            }}
            endIcon={
              <Box
                component={"img"}
                src={button.src}
                sx={{ width: { xs: "24px" } }}
              />
            }
          >
            <Typography
              sx={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: { xs: "0.58rem", sm: "0.875rem" },
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
    </Box>
  );
}
