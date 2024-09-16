import * as React from "react";
import {
  Box,
  Checkbox,
  Chip,
  IconButton,
  InputBase,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import { styled, useTheme } from "@mui/material/styles";
import { tableCellClasses } from "@mui/material/TableCell";
import { useState, useEffect } from "react";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import "@wojtekmaj/react-daterange-picker/dist/DateRangePicker.css";
import "react-calendar/dist/Calendar.css";
import DeleteIcon from "@mui/icons-material/Delete";
import DeliveryModal from "@/components/confirmTable/detailGuide";
import useMediaQuery from "@mui/material/useMediaQuery";
import DeliveryDiningIcon from "@mui/icons-material/DeliveryDining";
import MapsHomeWorkIcon from "@mui/icons-material/MapsHomeWork";

interface TableItem {
  guide: string;
  addressee: string;
  deliverTo: string;
  box: string;
  packageNumber: string;
  shippingCost: string;
  intakeDate: string; // Asegúrate de tener este campo en el objeto
  [key: string]: any; // Esta es la firma de índice para permitir claves dinámicas
}

export default function BasicTable({ tableData }: { tableData: any }) {
  const [filters, setFilters] = useState<Partial<TableItem>>({
    guide: "",
    addressee: "",
    deliverTo: "",
    box: "",
    packageNumber: "",
    shippingCost: "",
  });
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateRange, setDateRange] = useState<any>(["", ""]);
  const themee = useTheme();
  const matches = useMediaQuery(themee.breakpoints.down("sm"));

  useEffect(() => {
    setFilteredData(tableData);
  }, [tableData]);

  useEffect(() => {
    const filtered = tableData.filter((item: any) => {
      if (dateRange) {
        const itemDate = new Date(item.intakeDate); // Asegúrate de que tus datos tienen un campo de fecha llamado 'date'
        const [startDate, endDate] = dateRange;

        if (startDate && endDate) {
          if (itemDate < startDate || itemDate > endDate) {
            return false;
          }
        }
      }

      return Object.keys(filters).every((key) =>
        item[key]
          ? item[key]
              .toString()
              .toLowerCase()
              .includes(filters[key].toLowerCase())
          : true
      );
    });
    setFilteredData(filtered);
    setPage(0);
  }, [filters, tableData, dateRange]);

  const handleFilterChange =
    (field: string) => (event: { target: { value: any } }) => {
      setFilters((prevFilters) => ({
        ...prevFilters,
        [field]: event.target.value,
      }));
    };

  const resetFilters = () => {
    setFilters({
      guide: "",
      addressee: "",
      deliverTo: "",
      box: "",
      packageNumber: "",
      shippingCost: "",
    });
    setDateRange([null, null]); // Resetear el rango de fechas
  };

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: "#000041",
      position: "sticky",
      top: 0,
      color: "#fff",
    },
    [`&.${tableCellClasses.body}`]: {
      [theme.breakpoints.up("sm")]: {
        fontSize: 14,
      },
      [theme.breakpoints.down("xs")]: {
        fontSize: 9,
      },
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

  const getStatusStyle = (status: any) => {
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
          color: "#000",
        };
      default:
        return {
          background: "#9e9e9e",
          border: "solid #757575 1px",
          color: "#ffffff",
        };
    }
  };

  const handleChangePage = (
    event: any,
    newPage: React.SetStateAction<number>
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: { target: { value: string } }) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const rowsToDisplay = filteredData.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  const formatDate = (isoString: string | number | Date) => {
    const date = new Date(isoString);
    const options: any = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    return date.toLocaleString("es-ES", options);
  };

  return (
    <Box>
      <Box
        sx={{
          marginBottom: "20px",
          zIndex: 28,
          position: "sticky",
        }}
      >
        <DateRangePicker
          onChange={setDateRange}
          value={dateRange}
          format="y-MM-dd"
        />
      </Box>
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
          <TableHead>
            <TableRow
              style={{
                position: "sticky",
                top: 0,
              }}
            >
              <TableCell>
                <IconButton onClick={resetFilters} sx={{ background: "#fff" }}>
                  <DeleteIcon sx={{ color: "red" }} />
                </IconButton>
              </TableCell>
              {[
                "guide",
                "addressee",
                "deliverTo",
                "box",
                "packageNumber",
                "shippingCost",
                "status",
              ].map((field) => (
                <TableCell key={field}>
                  <InputBase
                    key={field}
                    sx={{
                      ml: 1,
                      flex: 1,
                      background: "#dddddd",
                      borderRadius: "14px",
                      padding: "8px 10px",
                      marginLeft: "10px",
                      fontSize: { xs: "10px", sm: "14px" },
                      width: "100%",
                    }}
                    placeholder={`Buscar `}
                    value={filters[field as keyof typeof filters]}
                    onChange={handleFilterChange(field)}
                    inputProps={{ "aria-label": `Buscar ${field}` }}
                  />
                </TableCell>
              ))}
            </TableRow>
            <TableRow>
              <StyledTableCell  align="center">
               
              </StyledTableCell>
              <StyledTableCell
                style={{
                  fontSize: matches ? "12px" : "14px",
                }}
                align="center"
              >
                Nº Guía
              </StyledTableCell>
              <StyledTableCell
                style={{
                  fontSize: matches ? "12px" : "14px",
                }}
                align="center"
              >
                Destinatario
              </StyledTableCell>
              <StyledTableCell
                style={{
                  fontSize: matches ? "12px" : "14px",
                }}
                align="center"
              >
                Entregar en
              </StyledTableCell>
              <StyledTableCell
                style={{
                  fontSize: matches ? "12px" : "14px",
                }}
                align="center"
              >
                Caja
              </StyledTableCell>
              <StyledTableCell
                style={{
                  fontSize: matches ? "12px" : "14px",
                }}
                align="center"
              >
                Paquete
              </StyledTableCell>
              <StyledTableCell
                style={{
                  fontSize: matches ? "12px" : "14px",
                }}
                align="center"
              >
                Valor
              </StyledTableCell>
              <StyledTableCell
                style={{
                  fontSize: matches ? "12px" : "14px",
                }}
                align="center"
              >
                Estado
              </StyledTableCell>
              <StyledTableCell
                style={{
                  fontSize: matches ? "12px" : "14px",
                }}
                align="center"
              >
                Fecha
              </StyledTableCell>
              <StyledTableCell
                style={{
                  fontSize: matches ? "12px" : "14px",
                }}
                align="center"
              >
                Detalles
              </StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rowsToDisplay.map((row, i) => (
              <StyledTableRow key={row.uid}>
                <StyledTableCell
                  style={{
                    width: "10px" ,
                  }}
                  align="center"
                >
                  {/* <Checkbox color="primary" /> */}
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontSize: matches ? "10px" : "14px" }}
                  align="center"
                >
                  {row.guide}
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontSize: matches ? "10px" : "14px" }}
                  align="center"
                >
                  {row.addressee}
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontSize: matches ? "10px" : "14px" }}
                  align="center"
                >
                  <Chip
                    icon={
                      row.deliverTo === "RECLAME EN OFICINA" ? (
                        <MapsHomeWorkIcon />
                      ) : (
                        <DeliveryDiningIcon />
                      )
                    }
                    label={row.deliverTo}
                    variant="outlined"
                    sx={{
                      ...getStatusStyle(
                        row.deliverTo === "RECLAME EN OFICINA"
                          ? "oficina"
                          : "mensajero"
                      ),
                      fontSize: "10px",
                      marginLeft: "10px",
                      width: "85%",
                      fontWeight: 700,
                    }}
                  />
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontSize: matches ? "10px" : "14px" }}
                  align="center"
                >
                  {row.box}
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontSize: matches ? "10px" : "14px" }}
                  align="center"
                >
                  {row.packageNumber}
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontSize: matches ? "10px" : "14px" }}
                  align="center"
                >
                  {row.shippingCost}
                </StyledTableCell>
                <StyledTableCell
                  style={{ fontSize: matches ? "10px" : "14px" }}
                  align="center"
                >
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
                <StyledTableCell align="center">
                  {formatDate(row.intakeDate)}
                </StyledTableCell>
                <StyledTableCell align="center">
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
        count={filteredData.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Box>
  );
}
