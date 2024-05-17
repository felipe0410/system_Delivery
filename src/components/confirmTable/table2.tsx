import * as React from "react";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell, { tableCellClasses } from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TagIcon from "@mui/icons-material/Tag";
import { getAllShipmentsData, shipments } from "@/firebase/firebase";
import {
  Box,
  Button,
  Checkbox,
  Chip,
  IconButton,
  InputBase,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useState } from "react";
import { NumericFormat } from "react-number-format";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import ModalComponent from "./modal";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CustomizedTables() {
  const [firebaseData, setFirebaseData] = React.useState<
    { [x: string]: any }[]
  >([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [allData, setAllData] = useState<any>([]);
  const [check, setCheck] = useState(false);
  const [sucessFull, setsucessFull] = useState<any>({});
  const [num, setNumm] = useState(0);

  const inputBasePersonal = (row: any, field: any, index: any) => {
    return (
      <InputBase
        value={
          selectedRows.uid === row.uid && check
            ? selectedRows[field]
            : row[field] ?? 0
        }
        onChange={(e) => {
          if (selectedRows.uid === row.uid && check) {
            setSelectedRows({
              ...selectedRows,
              [field]: e.target.value,
            });
            const updatedFirebaseData = [...firebaseData];
            updatedFirebaseData[index] = {
              ...updatedFirebaseData[index],
              [field]: e.target.value,
            };

            setFirebaseData(updatedFirebaseData);
          }
        }}
        sx={
          selectedRows.uid === row.uid && check
            ? {
                borderRadius: "40px",
                background: "rgba(255, 255, 255, 0.77)",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                minWidth: "0px",
                width: "80px",
                border: "solid #000000 1px",
                textAlignLast: "center",
              }
            : {
                minWidth: "0px",
                width: "80px",
                textAlignLast: "center",
              }
        }
        startAdornment={
          <IconButton
            onClick={() => {
              setSelectedRows({
                ...selectedRows,
                [field]: num,
              });
              const updatedFirebaseData = [...firebaseData];
              updatedFirebaseData[index] = {
                ...updatedFirebaseData[index],
                [field]: num,
              };
              setFirebaseData(updatedFirebaseData);
            }}
            sx={{
              color: "#000",
              display:
                (selectedRows.uid === row.uid && check && field) ===
                "packageNumber"
                  ? "block"
                  : "none",
            }}
          >
            <TagIcon />
          </IconButton>
        }
      />
    );
  };

  const amountInput = (row: any, field: any) => (
    <NumericFormat
      onChange={(e) => {
        if (selectedRows.uid === row.uid && check) {
          setSelectedRows({
            ...selectedRows,
            [field]: e.target.value,
          });
        }
      }}
      value={
        selectedRows.uid === row.uid && check
          ? selectedRows[field]
          : row[field] ?? 0
      }
      prefix='$ '
      thousandSeparator
      customInput={InputBase}
      sx={
        selectedRows.uid === row.uid && check
          ? {
              borderRadius: "40px",
              background: "rgba(255, 255, 255, 0.77)",
              boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              minWidth: "0px",
              width: "120px",
              border: "solid #000000 1px",
              textAlignLast: "center",
            }
          : {
              color: "#000",
              minWidth: "0px",
              width: "120px",
              textAlignLast: "center",
            }
      }
    />
  );

  const inputSelect = (row: any) => (
    <Box>
      <Select
        onChange={(e) => {
          if (selectedRows.uid === row.uid) {
            setSelectedRows({
              ...selectedRows,
              pago: e.target.value,
            });
          }
        }}
        value={selectedRows["pago"]}
        sx={{
          width: "100%",
          borderRadius: "40px",
          background: "rgba(255, 255, 255, 0.77)",
          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          height: "3rem",
        }}
      >
        <MenuItem value={"Crédito"}>Crédito</MenuItem>
        <MenuItem value={"Contado"}>Contado</MenuItem>
        <MenuItem value={"Al Cobro"}>Al Cobro</MenuItem>
      </Select>
    </Box>
  );

  const updateData = (newRow: any, check: boolean) => {
    if (check) {
      const existingIndex = allData.findIndex(
        (item: { uid: any }) => item.uid === newRow.uid
      );
      let updatedData;
      if (existingIndex !== -1) {
        updatedData = [
          ...allData.slice(0, existingIndex),
          newRow,
          ...allData.slice(existingIndex + 1),
        ];
      } else {
        updatedData = [...allData, newRow];
      }

      setAllData(updatedData);
    }
  };

  React.useEffect(() => {
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
  }, [sucessFull]);
  React.useEffect(() => {
    const allData = async () => {
      const allData: ShipmentData[] = await getAllShipmentsData();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          #PAQUETE
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
            CONFIRMAR DATOS
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
            Acontinuacion se presenta los paquetes por confirmar datos
          </Typography>
        </Box>
      </Box>

      <TableContainer
        id='container'
        sx={{ height: "100%", overflowY: "scroll", maxHeight: "700px" }}
        component={Paper}
      >
        <SnackbarProvider />
        <Table sx={{ minWidth: 700 }} aria-label='customized table'>
          <TableHead>
            <TableRow>
              <StyledTableCell>select</StyledTableCell>
              <StyledTableCell># Guía </StyledTableCell>
              <StyledTableCell align='left'>Nombre</StyledTableCell>
              <StyledTableCell align='right'>#Paquete</StyledTableCell>
              <StyledTableCell align='right'>Caja </StyledTableCell>
              <StyledTableCell align='right'>Pago</StyledTableCell>
              <StyledTableCell align='right'>Valor</StyledTableCell>
              <StyledTableCell align='right'>Celular</StyledTableCell>
              <StyledTableCell align='right'>Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {firebaseData?.map((row, i) => (
              <StyledTableRow key={row.uid}>
                <StyledTableCell>
                  <Checkbox
                    checked={selectedRows?.uid === row.uid ? check : false}
                    onChange={() => {
                      updateData(row, !check);
                      setSelectedRows(row);
                      setCheck(!check);
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell component='th' scope='row'>
                  {row.uid}
                </StyledTableCell>
                <StyledTableCell component='th' scope='row'>
                  {row.addressee}
                </StyledTableCell>
                <StyledTableCell align='right'>
                  {inputBasePersonal(row, "packageNumber", i)}
                </StyledTableCell>
                <StyledTableCell align='right'>
                  {inputBasePersonal(row, "box", i)}
                </StyledTableCell>
                <StyledTableCell align='right'>
                  {selectedRows.uid === row.uid && check ? (
                    inputSelect(row)
                  ) : (
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
                            : "#a13e3e",
                        color: "#fff",
                      }}
                      variant='outlined'
                      label={row?.pago ?? "no definido"}
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell align='right'>
                  {amountInput(row, "shippingCost")}
                </StyledTableCell>
                <StyledTableCell align='right'>
                  {row?.destinatario?.celular ?? ""}
                </StyledTableCell>
                <StyledTableCell
                  align='right'
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  {
                    <IconButton
                      disabled={
                        allData.findIndex(
                          (item: { uid: any }) => item.uid === row.uid
                        ) === -1
                      }
                      onClick={async () => {
                        try {
                          const save = await shipments(
                            selectedRows.uid,
                            selectedRows
                          );
                          if (save !== null) {
                            setsucessFull({ ...sucessFull, [i]: true });
                          }
                          enqueueSnackbar("Envio Actualizado con exito", {
                            variant: "success",
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "right",
                            },
                          });
                        } catch (error) {
                          enqueueSnackbar("Error al actualizar el envio", {
                            variant: "error",
                            anchorOrigin: {
                              vertical: "bottom",
                              horizontal: "right",
                            },
                          });
                        }
                      }}
                      type='button'
                      sx={{ p: "10px" }}
                    >
                      <SaveIcon
                        sx={{
                          color:
                            allData.findIndex(
                              (item: { uid: any }) => item.uid === row.uid
                            ) === -1
                              ? "gray"
                              : "#00A907",
                        }}
                      />
                    </IconButton>
                  }
                  <Box
                    display={
                      (sucessFull ? sucessFull[i] ?? false : false)
                        ? "block"
                        : "none"
                    }
                  >
                    <DoneAllIcon sx={{ color: "#00A907" }} />
                  </Box>
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
        <Button
          onClick={() => {}}
          sx={{
            padding: "10px",
            width: "23%",
            borderRadius: "40px",
            background: "#5C68D4",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            textAlign: "center",
            "&:hover": { backgroundColor: "#364094" },
          }}
        >
          <ModalComponent />
          <Typography
            sx={{
              color: "#0A0F37",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: "1.5rem",
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "normal",
            }}
          >
            TERMINAR
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}
