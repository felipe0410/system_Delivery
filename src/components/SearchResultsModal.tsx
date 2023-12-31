import React, { useState } from "react";
import { Box, Dialog, DialogContent, DialogTitle, Button } from "@mui/material";
import TableModal from "./TableModal";
import TableModalResponsive from "./TableModalResponsive";
import TableSearch from "./tableShearch";

const SearchResultsModal = ({
  open,
  onClose,
  data,
  searchTerm,
  setSearchTerm
}: {
  open: boolean;
  onClose: any;
  data: any;
  searchTerm: string;
  setSearchTerm: any
}) => {
  const [statusFilter, setStatusFilter] = useState("all");

  const handleStatusFilterChange = (filterValue: string) => {
    setStatusFilter(filterValue);
  };

  const filterDataByStatus = (data: any) => {
    if (statusFilter === "all") {
      return data;
    }
    return data?.filter((item: any) => item.status === statusFilter);
  };

  const filterData = () => {
    if (searchTerm) {
      return data.filter((item: any) => {
        const guideMatches = item.guide.includes(searchTerm);
        const statusMatches = item.status.includes(searchTerm);
        const addresseeMatches = item.addressee
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
        return guideMatches || statusMatches || addresseeMatches;
      });
    }
    return data
  };

  const statusOptions = [
    { value: "entregado", label: "Entregado" },
    { value: "devolucion", label: "Devolución" },
    { value: "oficina", label: "Oficina" },
    { value: "all", label: "Todos" },
  ];

  return (
    <Dialog
      id='dialog'
      open={open}
      onClose={onClose}
      maxWidth='xl'
      sx={{ zIndex: "10" }}
      PaperProps={{
        style: {
          borderRadius: "2.5rem",
          width: '80%',
          height: '80%'
        }
      }}
    >
      <DialogTitle sx={{ textAlign: "center" }}>
        <Box>
          {statusOptions.map((option) => (
            <Button
              key={option.value}
              variant='text'
              onClick={() => handleStatusFilterChange(option.value)}
              style={{
                margin: "0 5px",
                borderRadius: "2.5rem",
                background:
                  statusFilter === option.value ? "#0A0F37" : "transparent",
                color: statusFilter === option.value ? "#FFFFFF" : "#0A0F37",
                border: "none",
              }}
            >
              {option.label}
            </Button>
          ))}
        </Box>
      </DialogTitle>
      <TableSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <DialogContent>
        <Box display={{ xs: "none", sm: "block" }} sx={{ height: '100%' }}>
          <TableModal data={filterDataByStatus(filterData())} />
        </Box>
        <Box display={{ sm: "none", xs: "block" }}>
          <TableModalResponsive data={filterDataByStatus(filterData())} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default SearchResultsModal;
