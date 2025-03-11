import { TextField, Popover, Box, Button, Typography } from "@mui/material";
import * as React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarCustom.css";

export default function ReactCalendar({
  setSearchTerm,
  setSelectedDate,
}: {
  setSearchTerm: any;
  setSelectedDate: any;
}) {
  const [dateTabs, setDateTabs] = React.useState<any>(null);
  const [selectedDates, setSelectedDates] = React.useState<string[] | null>(
    null
  );
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);

  const handleOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleOk = () => {
    if (dateTabs && dateTabs.length === 2) {
      const formattedDates = formatearFechas(dateTabs);
      setSelectedDates(formattedDates);
    }
  };

  const handleAcceptDate = () => {
    if (selectedDates) {
      setSearchTerm(selectedDates);
    }
  };

  function formatearFechas(dates: any): string[] {
    if (!dates || dates.length !== 2) return [];
    return dates.map((date: any) => {
      const fecha = new Date(date);
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0");
      const day = String(fecha.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    });
  }

  return (
    <div>
      {/* Input para mostrar el rango de fechas seleccionado */}
      <TextField
        label="Seleccionar rango de fechas"
        value={selectedDates || ""}
        onClick={handleOpen}
        fullWidth
        sx={{ cursor: "pointer", marginBottom: 2 }}
        InputProps={{ readOnly: true }}
      />

      {/* Popover para mostrar el calendario al hacer clic en el input */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
      >
        <Box sx={{ p: 2 }}>
          <Calendar
            onChange={setDateTabs}
            value={dateTabs}
            maxDate={new Date()}
            selectRange={true}
          />
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <Button
              onClick={handleOk}
              sx={{
                background: "#69EAE2",
                color: "#1F1D2B",
                fontWeight: 800,
                mx: 1,
              }}
            >
              ACEPTAR
            </Button>
            <Button
              onClick={handleAcceptDate}
              disabled={!selectedDates}
              sx={{
                background: selectedDates ? "#69EAE2" : "gray",
                color: "#1F1D2B",
                fontWeight: 800,
                mx: 1,
              }}
            >
              CONFIRMAR
            </Button>
          </Box>
        </Box>
      </Popover>
    </div>
  );
}
