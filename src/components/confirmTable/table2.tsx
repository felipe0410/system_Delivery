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
  BottomNavigation,
  BottomNavigationAction,
  Box,
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
import DeliveryModal from "./detailGuide";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ApartmentIcon from "@mui/icons-material/Apartment";

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
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));

export default function CustomizedTables() {
  const [firebaseData, setFirebaseData] = React.useState<
    { [x: string]: any }[]
  >([]);
  const [selectedRows, setSelectedRows] = useState<any>([]);
  const [allData, setAllData] = useState<any>({
    domiciliario: [],
    oficina: [],
  });
  const [check, setCheck] = useState(false);
  const [sucessFull, setsucessFull] = useState<any>({});
  const [num, setNumm] = useState(0);
  const [value, setValue] = React.useState(0);
  console.log(allData);
  console.log("firebaseData::::>", firebaseData);

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

  const updateData = (newRow: { uid: any }, check: boolean) => {
    const field = value === 0 ? "domiciliario" : "oficina";
    if (check) {
      const existingIndex = allData[field].findIndex(
        (item: { uid: any }) => item.uid === newRow.uid
      );
      let updatedData;
      if (existingIndex !== -1) {
        updatedData = [
          ...allData[field].slice(0, existingIndex),
          newRow,
          ...allData[field].slice(existingIndex + 1),
        ];
      } else {
        updatedData = [...allData[field], newRow];
      }
      setAllData((prev: any) => ({
        ...prev,
        [field]: updatedData,
      }));
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

  const deliveryTo = (opcion: string) => {
    if (opcion === "ENTREGA EN DIRECCION") {
      return "DIRECCION";
    } else if (opcion === "RECLAME EN OFICINA") {
      return "OFICINA";
    } else {
      return "OFICINA";
    }
  };

  const allDataFuntion = async () => {
    const array: any = [];
    firebaseData.map((data) => {
      array.push(data.packageNumber);
    });
    const numerosOrdenados = array.map(Number).sort((a: any, b: any) => a - b);
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
  const filterDataByUid = (filterArray: any[]) => {
    if (filterArray?.length > 0) {
      const filterUids = new Set(
        filterArray.map((item: { uid: any }) => item.uid)
      );
      return firebaseData.filter((item) => filterUids.has(item.uid));
    }
  };

  React.useEffect(() => {
    allDataFuntion();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseData]);

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
      <Paper elevation={3}>
        <BottomNavigation
          sx={{ borderRadius: "20px 20px 0 0" }}
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
        >
          <BottomNavigationAction
            label='Domiciliario'
            icon={<DeliveryDiningIcon />}
          />
          <BottomNavigationAction label='Oficina' icon={<ApartmentIcon />} />
        </BottomNavigation>
      </Paper>
      <TableContainer
        id='container'
        sx={{ overflowY: "scroll", maxHeight: "50vh" }}
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
              <StyledTableCell align='right'>Entregar en:</StyledTableCell>
              <StyledTableCell align='right'>Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {firebaseData?.map((row: any, i) => (
              <StyledTableRow
                sx={{
                  display:
                    value === 0 && deliveryTo(row?.deliverTo) === "DIRECCION"
                      ? ""
                      : value === 1 && deliveryTo(row?.deliverTo) === "OFICINA"
                      ? ""
                      : "none",
                }}
                key={row.uid}
              >
                <StyledTableCell>
                  <>
                    {console.log(
                      "selectedRows?.uid === row.uid:::>",
                      selectedRows?.uid === row.uid
                    )}
                  </>
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
                <StyledTableCell align='right'>
                  <Chip
                    sx={{
                      display: "flex",
                      m: 1,
                      borderRadius: "3rem",
                      background:
                        deliveryTo(row?.deliverTo) === "DIRECCION"
                          ? "#6D1010"
                          : "#106d14",
                      color: "#fff",
                    }}
                    variant='outlined'
                    label={deliveryTo(row?.deliverTo) ?? ""}
                  />
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
                        allData[
                          value === 0 ? "domiciliario" : "oficina"
                        ].findIndex(
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
                            allData[
                              value === 0 ? "domiciliario" : "oficina"
                            ].findIndex(
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
        <ModalComponent
          numPackages={"20"}
          totalPackages={"2.900.000"}
          base={"50.000"}
          isDomicilary={value === 0}
          data={filterDataByUid(allData["domiciliario"]) ?? []}
        />
      </Box>
    </Box>
  );
}