import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import { IconButton } from '@mui/material';
import SearchResultsModal from './SearchResultsModal';
import { getAllShipmentsDataRealTime } from '@/firebase/firebase';
import SearchIcon from "@mui/icons-material/Search";
import { useEffect } from 'react';

export default function SearchAutocomplete() {
  const [value, setValue] = React.useState<any>(null);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [firebaseData, setFirebaseData] = React.useState<
    { [x: string]: any }[]
  >([]);
  const handleCloseModal = () => {
    setModalOpen(false);
  };
  const handleOpenModal = () => {
    setModalOpen(true);
  };

  const handleKeyPress = (e: any) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleOpenModal();
    }
  };

  React.useEffect(() => {
    const getFirebaseData = async () => {
      try {
        const data: any = await getAllShipmentsDataRealTime(setFirebaseData)
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getFirebaseData();

  }, []);

  const validation = () => {
    return isNaN(parseInt(searchTerm))
  }

  const searchResults = (term: string) => {
    const lowerCaseTerm = term.toLowerCase();
    return firebaseData.filter((item) => {
      return (
        item.guide.toLowerCase().includes(lowerCaseTerm) ||
        item.addressee.toLowerCase().includes(lowerCaseTerm)
      );
    });
  };




  return (
    <>
      <IconButton
        type='button'
        sx={{ p: "10px" }}
        aria-label='search'
        onClick={handleOpenModal}
      >
        <SearchIcon />
      </IconButton>
      <Autocomplete
        value={value}
        sx={{
          ml: 1,
          flex: 1,
          color: "#0a0f3700",
        }}
        onChange={(event: any, newValue: any | null) => {
          setValue(newValue);
          if (newValue) {
            setSearchTerm(validation() ? newValue?.addressee : newValue?.guide)
          }
        }}
        filterOptions={(options: any, params) => {
          const { inputValue } = params;
          return searchResults(inputValue);
        }}
        selectOnFocus
        clearOnBlur
        handleHomeEndKeys
        options={firebaseData}
        getOptionLabel={(option) => {
          return validation() ? option.addressee : option.guide
        }}
        renderOption={(props, option) =>
          <li {...props} key={Math.random()}>
            <div>{validation() ? option.addressee : option.guide}</div>
          </li>}
        freeSolo
        renderInput={(params) => (
          <TextField
            variant="standard"
            id-test="input"
            value={value}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              ml: 1,
              flex: 1,
            }}
            placeholder='#guia ó destinatario'
            {...params}
            onKeyDown={handleKeyPress}
          />
        )}
      />
      <SearchResultsModal
        open={modalOpen}
        onClose={handleCloseModal}
        data={firebaseData}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
    </>
  );
}
