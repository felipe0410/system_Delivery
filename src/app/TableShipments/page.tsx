"use client";
import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Paper } from "@mui/material";
import BasicTable from "./Table";
import { collection, onSnapshot, query, where } from "firebase/firestore";
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
      role='tabpanel'
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
        if (value === 0) {
          const allDocsQuery = query(tableRef);
          onSnapshot(allDocsQuery, (snapshot) => {
            const todaLaData = snapshot.docs.map((doc) => ({
              ...doc.data(),
            }));
            setTableData(todaLaData);
          });
        } else {
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
      <Paper>
        <Box sx={{ width: "100%" }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label='basic tabs example'
            >
              {tablesData.map((table, index) => (
                <Tab key={index} label={table.title} {...a11yProps(index)} />
              ))}
            </Tabs>
          </Box>
          {tablesData.map((table, index) => (
            <CustomTabPanel key={index} value={value} index={index}>
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
