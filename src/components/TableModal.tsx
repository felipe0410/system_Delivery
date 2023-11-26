import { shipments } from "@/firebase/firebase";
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
} from "@mui/material";
import Paper from "@mui/material/Paper";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import React, { useState } from "react";

const TableModal = ({ data }: { [x: string]: any }) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

  const handleRowSelection = (rowUid: string) => {
    const isSelected = selectedRows.includes(rowUid);
    if (isSelected) {
      setSelectedRows((prevSelectedRows) =>
        prevSelectedRows.filter((uid) => uid !== rowUid)
      );
    } else {
      setSelectedRows((prevSelectedRows) => [...prevSelectedRows, rowUid]);
    }
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
      if (selectedRows.length === 0) {
        enqueueSnackbar("Seleccione al menos una fila", {
          variant: "warning",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        return;
      }

      const updatedRows = data.filter((row: any) =>
        selectedRows.includes(row.uid)
      );

      for (const row of updatedRows) {
        const guideStatus = row.status;

        if (guideStatus === "entregado" || guideStatus === "devolucion") {
          enqueueSnackbar(`El paquete ${row.guide} ya está ${guideStatus}`, {
            variant: "warning",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
        } else {
          await shipments(row.guide, {
            ...row,
            status: status,
            deliveryDate: status === "entregado" ? getCurrentDateTime() : null,
            returnDate: status === "devolucion" ? getCurrentDateTime() : null,
            deliverTo: status === "oficina" ? "oficina" : "direccion",
          });
          enqueueSnackbar(`Guia ${row.guide} guardada con éxito`, {
            variant: "success",
            anchorOrigin: {
              vertical: "bottom",
              horizontal: "right",
            },
          });
        }
      }

      setSelectedRows([]);
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
      name: "ENTREGAR",
      background: "#00A410",
      src: "/images/deliver.svg",
      onclick: () => createOnClickHandler("entregado"),
    },
    {
      name: "DEVOLUCION",
      background: "#5C68D4",
      src: "/images/returnBack.svg",
      onclick: () => createOnClickHandler("devolucion"),
    },
    {
      name: "ELIMINAR DE MENSAJERO",
      background: "#0A0F37",
      src: "/images/delete.svg",
      onclick: () => createOnClickHandler("oficina"),
    },
  ];

  return (
    <>
      <SnackbarProvider />
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label='simple table'>
          <TableHead>
            <TableRow>
              <TableCell>Select</TableCell>
              <TableCell># Guía</TableCell>
              <TableCell align='center'>Nombre</TableCell>
              <TableCell align='center'>Estado del envío</TableCell>
              <TableCell align='center'>Paquete</TableCell>
              <TableCell align='center'>Caja</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row: any) => (
              <TableRow
                key={row.uid}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(row.uid)}
                    onChange={() => handleRowSelection(row.uid)}
                  />
                </TableCell>
                <TableCell component='th' scope='row'>
                  {row.guide}
                </TableCell>
                <TableCell align='right'>{row.addressee}</TableCell>
                <TableCell align='right'>{row.status}</TableCell>
                <TableCell align='right'>{row.packageNumber}</TableCell>
                <TableCell align='right'>{row.box}</TableCell>
              </TableRow>
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
        {buttons.map((button, index) => (
          <Button
            onClick={button.onclick}
            key={index * 4}
            sx={{
              display: "flow",
              width: "25%",
              padding: "10px",
              borderRadius: "40px",
              background: button.background,
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              textAlign: "center",
              justifyContent: "space-around",
            }}
          >
            <Box component={"img"} src={button.src} />
            <Typography
              sx={{
                color: "#FFF",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: "0.8rem",
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
    </>
  );
};

export default TableModal;
