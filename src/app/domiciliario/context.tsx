import { getAllUserData, getDocumentFromResumen } from "@/firebase/firebase";
import { createContext, useState, useContext, useEffect } from "react";
import { getCurrentDateTime } from "./hooks";

interface GlobalContextType {
  step: any;
  setStep: React.Dispatch<React.SetStateAction<any>>;
  entregados: any;
  setEntregados: React.Dispatch<React.SetStateAction<any>>;
  devolucion: any;
  setDevolucion: React.Dispatch<React.SetStateAction<any>>;
  total: any;
  setTotal: React.Dispatch<React.SetStateAction<any>>;
  firebaseUserData: any;
  setFirebaseUserData: React.Dispatch<React.SetStateAction<any>>;
  dataResumen: any;
  setDataResument: React.Dispatch<React.SetStateAction<any>>;
}

const defaultValue: GlobalContextType = {
  step: 0,
  setStep: () => {},
  entregados: 0,
  setEntregados: () => {},
  devolucion: 0,
  setDevolucion: () => {},
  total: 0,
  setTotal: () => {},
  firebaseUserData: [],
  setFirebaseUserData: () => {},
  dataResumen: {},
  setDataResument: () => {},
};

const GlobalContext = createContext<GlobalContextType>(defaultValue);

export const GlobalProvider = ({ children }: any) => {
  const [step, setStep] = useState<any>(0);
  const [entregados, setEntregados] = useState<number>(0);
  const [devolucion, setDevolucion] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [firebaseUserData, setFirebaseUserData] = useState<any[]>([]);
  const [dataResumen, setDataResument] = useState({});

  useEffect(() => {
    const getFirebaseData = async () => {
      try {
        const dataResumen: any = await getDocumentFromResumen(
          getCurrentDateTime()
        );

        if (dataResumen) {
          setEntregados(dataResumen?.entregados ?? 0);
          setDevolucion(dataResumen?.devolucion ?? 0);
          setTotal(dataResumen?.dineroRecaudado ?? 0);
          setDataResument(dataResumen);
        }
        const dataRef = await getAllUserData();
        const filteredData = dataRef.filter(
          (item: { rol: string }) => item?.rol === "Mensajero"
        );
        setFirebaseUserData(filteredData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    getFirebaseData();
  }, []);

  return (
    <GlobalContext.Provider
      value={{
        step,
        setStep,
        entregados,
        setEntregados,
        devolucion,
        setDevolucion,
        total,
        setTotal,
        firebaseUserData,
        setFirebaseUserData,
        dataResumen,
        setDataResument,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useGlobalContext = () => {
  return useContext(GlobalContext);
};
