import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  Box,
  Typography,
  Button,
  Chip,
  MenuItem,
  Select,
  OutlinedInput,
  IconButton,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import React, { useState } from "react";
import { styled } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { NumericFormat } from "react-number-format";
import SaveIcon from "@mui/icons-material/Save";

const ConfirmTable = ({ data }: { [x: string]: any }) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [editedData, setEditedData] = useState<{ [key: string]: any }>({});

  const inputOnChange = (field: string, value: string) => {
    setEditedData({ ...editedData, [field]: value });
  };

  const handleRowSelection = (rowUid: string) => {
    if (selectedRows.includes(rowUid)) {
      setSelectedRows([]);
      setEditedData({});
    } else {
      setSelectedRows([rowUid]);
      const selectedRowData = data.find((row: any) => row.uid === rowUid);
      setEditedData(selectedRowData);
    }
  };

  console.log(editedData);

  const StyledChip = styled(Chip)(
    ({ theme }) => `
					.MuiChip-label {
						color: #FFF;
						font-family: Nunito;
						font-size: 0.875rem;
						font-style: normal;
						font-weight: 500;
						line-height: normal;
					}
			`
  );

  const inputSelect = (
    <Box>
      <Select
        onChange={(e: any) => inputOnChange("pago", e.target.value)}
        value={editedData["pago"]}
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
        <MenuItem value={"Al cobro"}>Al Cobro</MenuItem>
      </Select>
    </Box>
  );

  const amountInput = (
    <NumericFormat
      onChange={(e: any) => inputOnChange("shippingCost", e.target.value)}
      value={editedData["shippingCost"]}
      prefix='$ '
      thousandSeparator
      customInput={OutlinedInput}
      sx={{
        borderRadius: "40px",
        background: "rgba(255, 255, 255, 0.77)",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        height: "3rem",
      }}
    />
  );

  const outlinedBox = (
    <OutlinedInput
      value={editedData["box"]}
      onChange={(e) => inputOnChange("box", e.target.value)}
      type='text'
      sx={{
        borderRadius: "40px",
        background: "rgba(255, 255, 255, 0.77)",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        height: "3rem",
      }}
    />
  );

  const outlinedPackage = (
    <OutlinedInput
      value={editedData["packageNumber"]}
      onChange={(e) => inputOnChange("packageNumber", e.target.value)}
      type='text'
      sx={{
        borderRadius: "40px",
        background: "rgba(255, 255, 255, 0.77)",
        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        height: "3rem",
      }}
    />
  );

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "red",
      color: "red",
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      paddingTop: "5px",
      paddingBottom: "5px",
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

  return (
    <Box
      id='container table'
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-around",
        height: "100%",
      }}
    >
      <SnackbarProvider />
      {data?.length === 0 ? (
        <Typography variant='h6' align='center' mt={3}>
          No se encontraron datos.
        </Typography>
      ) : (
        <TableContainer
          component={Paper}
          sx={{ maxHeight: "400px", overflowY: "auto", borderRadius: "20px" }}
        >
          <Table sx={{ minWidth: 650 }} aria-label='simple table'>
            <TableHead sx={{ background: "#3C47A3" }}>
              <TableRow>
                <TableCell sx={{ color: "#fff" }}></TableCell>
                <TableCell sx={{ color: "#fff" }}># Guía</TableCell>
                <TableCell sx={{ color: "#fff" }} align='left'>
                  Nombre
                </TableCell>
                <TableCell sx={{ color: "#fff" }} align='center'>
                  Estado
                </TableCell>
                <TableCell sx={{ color: "#fff" }} align='center'>
                  Paquete
                </TableCell>
                <TableCell sx={{ color: "#fff" }} align='center'>
                  Caja
                </TableCell>
                <TableCell sx={{ color: "#fff" }} align='center'>
                  Pago
                </TableCell>
                <TableCell sx={{ color: "#fff" }} align='center'>
                  Valor
                </TableCell>
                <TableCell sx={{ color: "#fff" }} align='center'>
                  Celular
                </TableCell>
                {selectedRows.length > 0 ? (
                  <TableCell align='right'></TableCell>
                ) : null}
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.map((row: any) => {
                const isSelected = selectedRows.includes(row.uid);
                const destinatario = row.destinatario;
                return (
                  <StyledTableRow
                    key={row.uid}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <StyledTableCell>
                      <Checkbox
                        checked={selectedRows.includes(row.uid)}
                        onChange={() => handleRowSelection(row.uid)}
                      />
                    </StyledTableCell>
                    <StyledTableCell component='th' scope='row'>
                      {row.guide}
                    </StyledTableCell>
                    <StyledTableCell align='left'>
                      {row.addressee}
                    </StyledTableCell>
                    <StyledTableCell align='right'>
                      {row.status}
                    </StyledTableCell>
                    <StyledTableCell align='right'>
                      {isSelected
                        ? outlinedPackage
                        : row.packageNumber === null
                        ? "0"
                        : row.packageNumber}
                    </StyledTableCell>
                    <StyledTableCell align='right'>
                      {isSelected
                        ? outlinedBox
                        : row.box === null
                        ? "0"
                        : row.box}
                    </StyledTableCell>
                    <StyledTableCell align='right'>
                      {isSelected ? (
                        inputSelect
                      ) : (
                        <StyledChip
                          sx={{
                            display: row.pago === undefined ? "none" : "block",
                            m: 1,
                            borderRadius: "3rem",
                            background:
                              row.pago === "Crédito"
                                ? "#150E63"
                                : row.pago === "Contado"
                                ? "#545B58"
                                : "#106D14",
                          }}
                          variant='outlined'
                          label={row.pago}
                        />
                      )}
                    </StyledTableCell>
                    <StyledTableCell align='right'>
                      {isSelected
                        ? amountInput
                        : row.shippingCost === null
                        ? "0"
                        : row.shippingCost}
                    </StyledTableCell>
                    <StyledTableCell align='right'>
                      {destinatario ? destinatario.celular : ""}
                    </StyledTableCell>
                    {isSelected ? (
                      <StyledTableCell align='right'>
                        <IconButton
                          type='button'
                          sx={{ p: "10px" }}
                          // onClick={}
                        >
                          <SaveIcon sx={{ color: "#00A907" }} />
                        </IconButton>
                      </StyledTableCell>
                    ) : null}
                  </StyledTableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}
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
          sx={{
            padding: "10px",
            width: "23%",
            borderRadius: "40px",
            background: "#5C68D4",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            textAlign: "center",
            "&:hover": { backgroundColor: "#3943a1" },
          }}
        >
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
};

export default ConfirmTable;
