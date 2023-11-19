'use client'
import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { Paper } from '@mui/material';
import BasicTable from './Table';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function CustomTabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `simple-tab-${index}`,
        'aria-controls': `simple-tabpanel-${index}`,
    };
}

export default function BasicTabs() {
    const [value, setValue] = React.useState(0);
    const tables = [
        {
            title: 'Todos los envios'
        },
        {
            title: 'Envios agencia'
        },
        {
            title: 'Devoluciones'
        },
        {
            title: 'Mensajero'
        },
        {
            title: 'Entregas'
        }
    ]

    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ padding: '5%' }}>
            <Paper>
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            {
                                tables.map((table, index) => (
                                    <Tab key={index} label={table.title} {...a11yProps(index)} />
                                ))
                            }
                        </Tabs>
                    </Box>
                    {
                        tables.map((table, index) => (
                            <CustomTabPanel key={index} value={value} index={index}>
                                <Typography sx={{
                                    color: '#0A0F37',
                                    fontFamily: 'Nunito',
                                    fontSize: '30px',
                                    fontStyle: 'normal',
                                    fontWeight: 900,
                                    lineHeight: 'normal',
                                }}>
                                    {table.title}
                                </Typography>
                                <BasicTable />
                            </CustomTabPanel>
                        ))
                    }
                </Box>
            </Paper>
        </Box>
    );
}