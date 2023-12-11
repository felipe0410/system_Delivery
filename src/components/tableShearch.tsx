import * as React from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Box, IconButton } from '@mui/material';
import { getAllShipmentsDataRealTime } from '@/firebase/firebase';
import SearchIcon from "@mui/icons-material/Search";

export default function TableSearch({ searchTerm, setSearchTerm }: { searchTerm: any, setSearchTerm: any }) {
    const [value, setValue] = React.useState<any>(null);
    // const [searchTerm, setSearchTerm] = React.useState("");
    const [modalOpen, setModalOpen] = React.useState(false);
    const [firebaseData, setFirebaseData] = React.useState<
        { [x: string]: any }[]
    >([]);
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
        <Box sx={{
            display: 'flex',
            width: '70%',
            margin: '0 auto',
            background: '#e7e7e7',
            borderRadius: '10px'
        }}>
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
                    flex: 0.95,
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
        </Box>
    );
}
