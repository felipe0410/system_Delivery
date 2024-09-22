"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Paper, useMediaQuery, useTheme } from "@mui/material";
import BasicTable from "./Table";
import { collection, onSnapshot, query, where, or } from "firebase/firestore";
import { db } from "@/firebase/firebase";

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
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const tablesData: {
  title: string;
  estado: string;
}[] = [
  {
    title: "Existentes",
    estado: "existentes",
  },
  {
    title: "Todos los envios",
    estado: "todos",
  },
  {
    title: "Envios agencia",
    estado: "oficina",
  },
  {
    title: "Devoluciones",
    estado: "devolucion",
  },
  {
    title: "Mensajero",
    estado: "mensajero",
  },
  {
    title: "Entregas",
    estado: "entregado",
  },
];

export default function BasicTabs() {
  const [value, setValue] = React.useState(0);
  const [tableData, setTableData] = React.useState<{ [x: string]: any }[]>([]);
  const theme = useTheme();
  const SmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const memoizedTablesData = React.useMemo(() => {
    return tablesData;
  }, []);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  React.useEffect(() => {
    const getFirebaseTable = async () => {
      try {
        const tableRef = collection(db, "envios");

        if (value === 1) {
          // Pestaña "Todos los envíos" - Traer todos los envíos sin filtrar
          onSnapshot(tableRef, (snapshot) => {
            const allData = snapshot.docs.map((doc) => ({
              ...doc.data(),
            }));
            setTableData(allData);
          });
        } else if (value === 0) {
          // Pestaña "Existentes" - Filtrar por status, mensajero, y oficina
          const statusQuery = query(
            tableRef,
            or(
              where("status", "==", "mensajero"),
              where("status", "==", "oficina")
            )
          );

          onSnapshot(statusQuery, (snapshot) => {
            const filteredData = snapshot.docs.map((doc) => ({
              ...doc.data(),
            }));
            setTableData(filteredData);
          });
        } else {
          // Otras pestañas - Filtrar según el estado
          const status = memoizedTablesData[value].estado;
          const statusQuery = query(tableRef, where("status", "==", status));

          onSnapshot(statusQuery, (snapshot) => {
            const filteredData = snapshot.docs.map((doc) => ({
              ...doc.data(),
            }));
            setTableData(filteredData);
          });
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getFirebaseTable();
  }, [value, memoizedTablesData]);

  return (
    <Box sx={{ padding: "5%" }}>
      <Paper sx={{ borderRadius: "20px" }}>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
               variant={SmallScreen ? "scrollable" : "standard"}
               scrollButtons={SmallScreen ? "auto" : false} 
              // sx={{
              //   ".MuiTabs-flexContainer": {
              //     justifyContent: SmallScreen ? "start" : "center",
              //   },
              // }}
            >
              {tablesData.map((table: any, index: number) => (
                <Tab
                  key={crypto.randomUUID()}
                  label={table.title}
                  {...a11yProps(index)}
                  sx={{
                    fontSize: { xs: "12px", sm: "14px", md: "16px" }, // Ajuste del tamaño de texto
                    minWidth: { xs: "80px", sm: "100px" }, // Ancho mínimo para que se vean bien los tabs en pantallas pequeñas
                  }}
                />
              ))}
            </Tabs>
          </Box>
          {tablesData.map((table, index) => (
            <CustomTabPanel
              key={crypto.randomUUID()}
              value={value}
              index={index}
            >
              <Typography
                sx={{
                  color: "#0A0F37",
                  fontFamily: "Nunito",
                  fontSize: "30px",
                  fontStyle: "normal",
                  fontWeight: 900,
                  lineHeight: "normal",
                }}
              >
                {table.title}
              </Typography>
              <BasicTable tableData={tableData} />
            </CustomTabPanel>
          ))}
        </Box>
      </Paper>
    </Box>
  );
}
