import { Dialog, DialogContent, DialogTitle, TextField } from "@mui/material";
import React, { useState } from "react";
import TableModal from "./TableModal";

const SearchResultsModal = ({
  open,
  onClose,
  data,
  searchTerm,
}: {
  open: boolean;
  onClose: any;
  data: any;
  searchTerm: string;
}) => {
  const [statusFilter, setStatusFilter] = useState("all");

  const handleStatusFilterChange = (event: any) => {
    setStatusFilter(event.target.value);
  };

  const filterDataByStatus = (data: any) => {
    if (statusFilter === "all") {
      return data;
    }
    return data.filter((item: any) => item.status === statusFilter);
  };

  const filterData = () => {
    return data.filter((item: any) => {
      const guideMatches = item.guide.includes(searchTerm);
      const statusMatches = item.status.includes(searchTerm);
      const addresseeMatches = item.addressee
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return guideMatches || statusMatches || addresseeMatches;
    });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth='xl'>
      <DialogTitle>
        Resultados de la búsqueda
        <TextField
          select
          label='Filtrar por Estado'
          value={statusFilter}
          onChange={handleStatusFilterChange}
          SelectProps={{
            native: true,
          }}
          style={{ marginLeft: "20px" }}
        >
          <option value='all'>Todos</option>
          <option value='entregado'>Entregado</option>
          <option value='devolucion'>Devolución</option>
          <option value='oficina'>Oficina</option>
        </TextField>
      </DialogTitle>
      <DialogContent>
        <TableModal data={filterDataByStatus(filterData())} />
      </DialogContent>
    </Dialog>
  );
};

export default SearchResultsModal;
