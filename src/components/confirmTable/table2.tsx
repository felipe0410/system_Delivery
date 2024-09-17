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
import {
  getEnvios,
  getFilteredShipmentsData,
  shipments,
} from "@/firebase/firebase";
import {
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Checkbox,
  Chip,
  IconButton,
  Input,
  InputAdornment,
  InputBase,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import DoneAllIcon from "@mui/icons-material/DoneAll";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import ModalComponent from "./modal";
import DeliveryModal from "./detailGuide";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import ApartmentIcon from "@mui/icons-material/Apartment";
import InventoryIcon from "@mui/icons-material/Inventory";

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
    domiciliario: [{}],
    oficina: [{}],
  });
  const [separateData, setSeparateData] = useState<any>({
    domiciliario: [],
    oficina: [],
  });
  const [mensajeroSummary, setMensajeroSummary] = useState({
    totalCount: 0,
    totalValue: 0,
    alCobroCount: 0,
    formattedTotalValue: "$0",
  });

  const [oficinaSummary, setOficinaSummary] = useState({
    totalCount: 0,
    totalValue: 0,
    alCobroCount: 0,
    formattedTotalValue: "$0",
  });

  const [check, setCheck] = useState(false);
  const [sucessFull, setsucessFull] = useState<any>({});
  const [num, setNumm] = useState(0);
  const [value, setValue] = React.useState(1);
  const [save, setSave] = useState(0);
  const [arrayUniqueValue, setArrayUniqueValue] = useState<any>([]);
  const [inputGuideNumber, setInputGuideNumber] = useState("");
  const [allDataFirebase, setAllDataFirebase] = useState<
    { [x: string]: any }[]
  >([]);

  const calculateSummary: any = (shipments: any[]) => {
    if (shipments.length === 0) {
      return {
        totalCount: 0,
        totalValue: 0,
        alCobroCount: 0,
        formattedTotalValue: "$0",
      };
    }

    const summary = shipments.reduce(
      (
        acc: { totalCount: number; totalValue: any; alCobroCount: number },
        shipment: { pago: string; valor: string }
      ) => {
        if (shipment.pago === "Al Cobro") {
          acc.totalCount++;
          const valorNumerico =
            typeof shipment.valor === "string"
              ? parseFloat(shipment.valor.replace(/[^0-9.-]+/g, ""))
              : shipment.valor;

          acc.totalValue += valorNumerico;
          acc.alCobroCount++;
        } else {
          acc.totalCount++;
        }
        return acc;
      },
      { totalCount: 0, totalValue: 0, alCobroCount: 0 }
    );

    const formatter = new Intl.NumberFormat("es-CO", {
      style: "currency",
      currency: "COP",
      minimumFractionDigits: 0,
    });
    summary.formattedTotalValue = formatter.format(summary.totalValue);

    return summary;
  };
  useEffect(() => {
    const mensajeroShipments = firebaseData.filter(
      (shipment) => shipment.status === "mensajero"
    );
    const oficinaShipments = firebaseData.filter(
      (shipment) => shipment.status === "oficina"
    );
    setSeparateData({
      domiciliario: [...mensajeroShipments],
      oficina: [...oficinaShipments],
    });
    const mensajeroSummary = calculateSummary(mensajeroShipments);
    const oficinaSummary = calculateSummary(oficinaShipments);
    setMensajeroSummary(mensajeroSummary);
    setOficinaSummary(oficinaSummary);
  }, [firebaseData]);

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

  const amountInput = (row: any, field: any, i: any) => (
    <NumericFormat
      onValueChange={(e) => {
        if (selectedRows.uid === row.uid && check) {
          setSelectedRows({
            ...selectedRows,
            [field]: e.formattedValue,
            valor: e.floatValue,
          });
          const updatedFirebaseData = [...firebaseData];
          updatedFirebaseData[i] = {
            ...updatedFirebaseData[i],
            [field]: e.formattedValue,
            valor: e.floatValue,
          };
          setFirebaseData(updatedFirebaseData);
        }
      }}
      value={
        selectedRows.uid === row.uid && check
          ? selectedRows["valor"]
          : row["valor"] ?? 0
      }
      prefix="$ "
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

  const inputSelect = (row: any, index: any) => (
    <Box>
      <Select
        onChange={(e) => {
          if (selectedRows.uid === row.uid) {
            setSelectedRows({
              ...selectedRows,
              pago: e.target.value,
            });
            const updatedFirebaseData = [...firebaseData];
            updatedFirebaseData[index] = {
              ...updatedFirebaseData[index],
              ["pago"]: e.target.value,
            };
            setFirebaseData(updatedFirebaseData);
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
      let updatedData: any;
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
        const dataRef = await getFilteredShipmentsData();
        setAllDataFirebase(dataRef);
        const filteredData = dataRef.filter(
          (item: { revision: boolean }) => item?.revision === false
        );
        setFirebaseData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getFirebaseData();
  }, [sucessFull, save]);

  const deliveryTo = (opcion: string) => {
    if (opcion === "mensajero") {
      return "MENSAJERO";
    } else if (opcion === "oficina") {
      return "OFICINA";
    } else {
      return "OFICINA";
    }
  };

  const allDataFunction = async () => {
    const getArrayEnvios = await getEnvios();
    const arrayEnvios = (getArrayEnvios ?? [0])
      .map(Number)
      .filter(Number.isFinite);
    const array = firebaseData
      .map((data) => Number(data.packageNumber))
      .filter(Number.isFinite);

    const numerosFusionados = [...arrayEnvios, ...array].sort((a, b) => a - b);
    setArrayUniqueValue(numerosFusionados);

    let numeroFaltante = 1;
    for (const numero of numerosFusionados) {
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
    allDataFunction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firebaseData]);

  const saveshipment = (i: any) => {
    return sucessFull[i] ?? false;
  };

  const handleGuideNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setInputGuideNumber(event.target.value);
  };

  const updateGuideRevision = async () => {
    try {
      const foundShipment = allDataFirebase?.find(
        (shipment) => shipment.guide === inputGuideNumber
      );
      const updatedFirebaseData = [...firebaseData];
      if (foundShipment) {
        const updatedShipment = { ...foundShipment, revision: false };
        const existingIndex = updatedFirebaseData.findIndex(
          (shipment) => shipment.guide === inputGuideNumber
        );

        if (existingIndex !== -1) {
          updatedFirebaseData[existingIndex] = updatedShipment;
        } else {
          updatedFirebaseData.push(updatedShipment);
        }
        setFirebaseData(updatedFirebaseData);
        enqueueSnackbar("Guía agregada exitosamente", { variant: "success" });
        setInputGuideNumber("");
      } else {
        enqueueSnackbar("No se encontró la guía en allDataFirebase", {
          variant: "error",
        });
      }
    } catch (error) {
      console.error("Error actualizando la guía: ", error);
      enqueueSnackbar("Error al actualizar la guía", { variant: "error" });
    }
  };

  return (
    <Box>
      <Box
        sx={{
          width: "70%",
          background: "#FFFFFF",
          boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
          borderRadius: "53px",
          padding: "10px",
          margin: "0 auto",
        }}
      >
        <Typography
          sx={{
            fontSize: "30px",
            textAlign: "center",
            fontweight: 700,
          }}
        >
          RESUMEN
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-evenly",
            margin: "0 auto",
            marginBottom: "15px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexWrap: "wrap",
              width: "60%",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: "21px",
                  lineHeight: "24px",
                  color: "#7E7E7E",
                }}
              >
                recaudo al cobros:
              </Typography>
              <Chip
                label={
                  value > 0
                    ? oficinaSummary.formattedTotalValue
                    : mensajeroSummary.formattedTotalValue
                }
                sx={{
                  background: "#85d39680",
                  color: "#03781D",
                  borderRadius: "solid #85d39680 1px",
                  fontSize: "16px",
                  marginLeft: "10px",
                }}
                variant="outlined"
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                marginY: "10px",
              }}
            >
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: "21px",
                  lineHeight: "24px",
                  color: "#7E7E7E",
                }}
              >
                # paq con cobro:
              </Typography>
              <Chip
                label={
                  value > 0
                    ? oficinaSummary.alCobroCount
                    : mensajeroSummary.alCobroCount
                }
                sx={{
                  background: "#DFA87433",
                  color: "#D58D49",
                  borderRadius: "solid #D58D49 1px",
                  fontSize: "16px",
                  marginLeft: "10px",
                }}
                variant="outlined"
              />
            </Box>
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography
                sx={{
                  fontFamily: "Inter",
                  fontStyle: "normal",
                  fontWeight: 500,
                  fontSize: "21px",
                  lineHeight: "24px",
                  color: "#7E7E7E",
                }}
              >
                Total paquetes:
              </Typography>
              <Chip
                label={
                  value > 0
                    ? oficinaSummary.totalCount
                    : mensajeroSummary.totalCount
                }
                sx={{
                  background: "#ECECEC",
                  color: "#000",
                  borderRadius: "solid #9E9E9E 1px",
                  fontSize: "16px",
                  marginLeft: "10px",
                }}
                variant="outlined"
              />
            </Box>
          </Box>
          <Box
            sx={{ display: "flex", justifyContent: "right", height: "40px" }}
          >
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
            EDITAR DATOS
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
          <Box sx={{ marginY: "10px", width: "auto" }}>
            <Input
              startAdornment={
                <InputAdornment position="start">
                  <InventoryIcon />
                </InputAdornment>
              }
              id="filled-basic"
              placeholder="Nª Guia"
              value={inputGuideNumber}
              onChange={handleGuideNumberChange}
              onKeyPress={(event) => {
                if (event.key === "Enter") {
                  updateGuideRevision();
                }
              }}
            />
          </Box>
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
            label="Domiciliario"
            icon={<DeliveryDiningIcon />}
          />
          <BottomNavigationAction label="Oficina" icon={<ApartmentIcon />} />
        </BottomNavigation>
      </Paper>
      <TableContainer
        id="container"
        sx={{ overflowY: "scroll", maxHeight: "50vh" }}
        component={Paper}
      >
        <SnackbarProvider />
        <Table sx={{ minWidth: 700 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <StyledTableCell>select</StyledTableCell>
              <StyledTableCell># Guía </StyledTableCell>
              <StyledTableCell align="left">Nombre</StyledTableCell>
              <StyledTableCell align="right">#Paquete</StyledTableCell>
              <StyledTableCell align="right">Caja </StyledTableCell>
              <StyledTableCell align="right">Pago</StyledTableCell>
              <StyledTableCell align="right">Valor</StyledTableCell>
              <StyledTableCell align="right">Celular</StyledTableCell>
              <StyledTableCell align="right">Entregar en:</StyledTableCell>
              <StyledTableCell align="right">Acciones</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {firebaseData.map((row: any, i) => (
              <StyledTableRow
                style={{
                  display:
                    value > 0 && row.status === "oficina"
                      ? ""
                      : value === 0 && row.status === "mensajero"
                      ? ""
                      : "none",
                  background: saveshipment(i) ? "#8edb8e" : "none",
                }}
                key={row.uid}
              >
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
                <StyledTableCell component="th" scope="row">
                  {row.uid}
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                  {row.addressee}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {inputBasePersonal(row, "packageNumber", i)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {inputBasePersonal(row, "box", i)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {selectedRows.uid === row.uid && check ? (
                    inputSelect(row, i)
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
                      variant="outlined"
                      label={row?.pago ?? "no definido"}
                    />
                  )}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {amountInput(row, "shippingCost", i)}
                </StyledTableCell>
                <StyledTableCell align="right">
                  {row?.destinatario?.celular ?? ""}
                </StyledTableCell>
                <StyledTableCell align="right">
                  <Chip
                    sx={{
                      display: "flex",
                      m: 1,
                      borderRadius: "3rem",
                      background:
                        deliveryTo(row?.status) === "MENSAJERO"
                          ? "#6D1010"
                          : "#106d14",
                      color: "#fff",
                    }}
                    variant="outlined"
                    label={deliveryTo(row?.status) ?? ""}
                  />
                </StyledTableCell>
                <StyledTableCell
                  align="right"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    flexDirection: "row",
                  }}
                >
                  <Box
                    sx={
                      saveshipment(i)
                        ? {
                            background: "#fff",
                            borderRadius: "10px",
                            display: "flex",
                            alignItems: "center",
                          }
                        : {}
                    }
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
                              setCheck(false);
                              enqueueSnackbar("Envio Actualizado con exito", {
                                variant: "success",
                                anchorOrigin: {
                                  vertical: "bottom",
                                  horizontal: "right",
                                },
                              });
                            }
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
                        type="button"
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
                    <Box display={saveshipment(i) ? "block" : "none"}>
                      <DoneAllIcon sx={{ color: "#00A907" }} />
                    </Box>
                    <DeliveryModal data={row} />
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
        <ModalComponent
          arrayEnvios={arrayUniqueValue}
          totalPackages={
            value > 0
              ? oficinaSummary.formattedTotalValue
              : mensajeroSummary.formattedTotalValue
          }
          base={"50.000"}
          isDomicilary={value === 0}
          data={
            filterDataByUid(
              value === 0
                ? separateData["domiciliario"]
                : separateData["oficina"]
            ) ?? []
          }
          setSave={setSave}
        />
      </Box>
    </Box>
  );
}
