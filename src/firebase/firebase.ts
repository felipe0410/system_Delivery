import { FirebaseApp, initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  onSnapshot,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_APIKEY ?? "",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTHDOMAIN ?? "",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECTID ?? "",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGEBUCKET ?? "",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGINGSENDERID ?? "",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APPID ?? "",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENTID ?? "",
};
const app: FirebaseApp = initializeApp(firebaseConfig);
export const db: Firestore = getFirestore(app);
const auth = getAuth();

// Función para decodificar Base64
const decodeBase64 = (encodedString: string): string => {
  return Buffer.from(encodedString, "base64").toString("utf-8");
};

// Función para obtener los datos de un usuario a partir de la ruta con un ID codificado en Base64
export const getUserDataByBase64Id = async (base64Id: string) => {
  try {
    // Decodificar el ID en Base64
    const userId = decodeBase64(base64Id);

    // Referencia al documento específico del usuario en Firestore
    const userDocRef = doc(db, "user", userId);

    // Obtener los datos del documento
    const userDoc = await getDoc(userDocRef);

    if (userDoc.exists()) {
      // Retornar los datos del usuario si el documento existe
      const userData = userDoc.data();
      return userData;
    } else {
      console.log("No se encontró el documento del usuario");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener los datos del usuario: ", error);
    return null;
  }
};

//____________________________________________________________________-
const getCurrentDateTime = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
};

export const creteUser = async (email: any, password: any) => {
  try {
    const createUser = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    return createUser.user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const errorData = {
      errorCode,
      errorMessage,
    };
    console.log(errorData);
    return errorData;
  }
};
export const loginUser = async (email: any, password: any) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;
    console.log(user);
    return user;
  } catch (error: any) {
    const errorCode = error.code;
    const errorMessage = error.message;
    const dataError = {
      errorCode,
      errorMessage,
    };
    console.error(dataError);
    return dataError;
  }
};

export const singOut = () => {
  try {
    signOut(auth);
  } catch (error) {
    console.error(error);
  }
};

export const saveDataUser = async (uid: any, userData: any) => {
  try {
    const userCollectionRef = collection(db, "user");
    const userDocRef = doc(userCollectionRef, uid);
    await setDoc(userDocRef, {
      uid: uid,
      ...userData,
    });
    console.log("Documento guardado con ID: ", uid);
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /user: ", error);
    return null;
  }
};

export const getAllUserData = async () => {
  try {
    const shipmentsCollectionRef = collection(db, "user");
    const querySnapshot = await getDocs(shipmentsCollectionRef);
    const shipmentsData: any = [];
    querySnapshot.forEach((doc) => {
      shipmentsData.push(doc.data());
    });
    console.log(shipmentsData);
    return shipmentsData;
  } catch (error) {
    console.error("Error al obtener la información de la colección: ", error);
    return null;
  }
};

export const shipments = async (uid: any, userData: any) => {
  try {
    const userCollectionRef = collection(db, "envios");
    const userDocRef = doc(userCollectionRef, uid);
    await setDoc(userDocRef, {
      uid: uid,
      ...userData,
    });
    console.log("Documento guardado con ID: ", uid);
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /user: ", error);
    return null;
  }
};

export const sidebarCollection = async (uid: any, sidebarData: any) => {
  try {
    console.log(sidebarData);
    const sidebarCollection = collection(db, "resumen");
    const userDocRef = doc(sidebarCollection, uid);
    await setDoc(userDocRef, {
      uid: uid,
      ...sidebarData,
    });
    console.log("Documento guardado con ID: ", uid);
    return uid;
  } catch (error) {
    console.error("Error al guardar información en /user: ", error);
    return null;
  }
};

export const getDocumentFromResumen = async (
  date: string
): Promise<any | null> => {
  try {
    const docRef = doc(db, "resumen", date);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log("Documento encontrado:", docSnap.data());
      return docSnap.data();
    } else {
      console.log("No existe un documento con la fecha proporcionada.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el documento de /resumen:", error);
    return null;
  }
};

export const shipmentsDeliver = async (uid: any, newStatus?: string) => {
  try {
    const userCollectionRef = collection(db, "envios");
    const userDocRef = doc(userCollectionRef, uid);
    await updateDoc(userDocRef, {
      status: newStatus,
      deliveryDate: getCurrentDateTime(),
    });
    console.log(
      `El estado ha sido actualizado a '${newStatus}' para el documento con ID:`,
      uid
    );
    return uid;
  } catch (error) {
    console.error("Error al actualizar el estado en /envios:", error);
    return null;
  }
};

export const updatedShipments = async (uid: any, updatedData: any) => {
  try {
    const userCollectionRef = collection(db, "envios");
    const userDocRef = doc(userCollectionRef, uid);
    await updateDoc(userDocRef, updatedData);
    console.log("Documento actualizado con ID: ", uid);
    return uid;
  } catch (error) {
    console.error("Error al actualizar información en /envios: ", error);
    return null;
  }
};

export const getShipmentsByDateRange = async (
  startDate: string,
  endDate: string
) => {
  try {
    const startTimestamp = new Date(`${startDate}T00:00:00Z`).getTime();
    const endTimestamp = new Date(`${endDate}T23:59:59Z`).getTime();

    console.log(`Consultando entre: ${startTimestamp} y ${endTimestamp}`);

    const shipmentsRef = collection(db, "envios");
    const q = query(
      shipmentsRef,
      where("fecha_de_admision_timestamp", ">=", startTimestamp),
      where("fecha_de_admision_timestamp", "<=", endTimestamp)
    );

    const querySnapshot = await getDocs(q);

    const shipments: any[] = [];
    querySnapshot.forEach((doc) => {
      shipments.push({ id: doc.id, ...doc.data() });
    });

    console.log("Envíos encontrados:", shipments);
    return shipments;
  } catch (error) {
    console.error("Error al obtener envíos por rango de fechas: ", error);
    return [];
  }
};
export const getShipmentData = async (uid: any) => {
  try {
    const userCollectionRef = collection(db, "envios");
    const userDocRef = doc(userCollectionRef, uid);
    const docSnapshot = await getDoc(userDocRef);

    if (docSnapshot.exists()) {
      return docSnapshot.data();
    } else {
      console.log("El documento no existe.");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener información del documento: ", error);
    return null;
  }
};

export const getAllShipmentsData = async () => {
  try {
    const shipmentsCollectionRef = collection(db, "envios");
    const querySnapshot = await getDocs(shipmentsCollectionRef);
    const shipmentsData: any = [];
    querySnapshot.forEach((doc) => {
      shipmentsData.push(doc.data());
    });
    console.log(shipmentsData);
    return shipmentsData;
  } catch (error) {
    console.error("Error al obtener la información de la colección: ", error);
    return null;
  }
};

export const getAllShipmentsDataRealTime = (
  callback: (arg0: any[]) => void
) => {
  try {
    const shipmentsCollectionRef = collection(db, "envios");
    const shipmentsData: any[] = [];
    onSnapshot(shipmentsCollectionRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        shipmentsData.push(doc.data());
      });
      callback(shipmentsData);
    });
    return shipmentsData;
  } catch (error) {
    console.error("Error al obtener la información de la colección: ", error);
    return null;
  }
};

export const getStatusShipmentsData = (
  status: string,
  callback: (arg0: any[]) => void
) => {
  try {
    const db = getFirestore();
    const shipmentsCollectionRef = collection(db, "envios");

    onSnapshot(shipmentsCollectionRef, (querySnapshot) => {
      const shipmentsData: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        if (data.status === status) {
          shipmentsData.push(data);
        }
      });
      callback(shipmentsData);
    });
  } catch (error) {
    console.error("Error al obtener la información de la colección: ", error);
  }
};

export const getEnvios = async () => {
  try {
    const docRef = doc(db, "consecutivo", "consecutivos");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const envios = data.envios;
      return envios;
    } else {
      console.log("No such document!");
      return null;
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
};

export const removePackageNumberFromEnvios = async (uid: string) => {
  try {
    // Obtener el documento del envío con el UID proporcionado
    const shipmentDocRef = doc(db, "envios", uid);
    const shipmentSnap = await getDoc(shipmentDocRef);

    if (shipmentSnap.exists()) {
      const shipmentData = shipmentSnap.data();
      const packageNumber = shipmentData.packageNumber;

      // Verificar si el número de paquete no es nulo
      if (packageNumber) {
        // Obtener los envíos actuales
        const envios = await getEnvios();

        // Filtrar el número de paquete para eliminarlo de la lista
        const updatedEnvios = envios.filter(
          (number: any) => number !== packageNumber
        );

        // Guardar los envíos actualizados
        await saveEnvios(updatedEnvios);

        console.log(`Número de paquete ${packageNumber} eliminado de envios.`);
        return updatedEnvios;
      } else {
        console.log("El número de paquete es nulo.");
        return null;
      }
    } else {
      console.log("El documento no existe.");
      return null;
    }
  } catch (error) {
    console.error("Error al eliminar el número de paquete:", error);
    return null;
  }
};

export const addPackageNumberToEnvios = async (uid: string) => {
  try {
    // Obtener el documento del envío con el UID proporcionado
    const shipmentDocRef = doc(db, "envios", uid);
    const shipmentSnap = await getDoc(shipmentDocRef);

    if (shipmentSnap.exists()) {
      const shipmentData = shipmentSnap.data();
      const packageNumber = shipmentData.packageNumber;

      // Verificar si el número de paquete no es nulo
      if (packageNumber) {
        // Obtener los envíos actuales
        const envios = await getEnvios();

        // Verificar si el número de paquete ya está en la lista de envíos
        if (!envios.includes(packageNumber)) {
          // Agregar el número de paquete a la lista de envíos
          const updatedEnvios = [...envios, packageNumber];
          await saveEnvios(updatedEnvios);
          console.log(`Número de paquete ${packageNumber} agregado a envios.`);
          return updatedEnvios;
        } else {
          console.log(`Número de paquete ${packageNumber} ya está en envios.`);
          return envios;
        }
      } else {
        console.log("El número de paquete es nulo.");
        return null;
      }
    } else {
      console.log("El documento no existe.");
      return null;
    }
  } catch (error) {
    console.error("Error al agregar el número de paquete a envios:", error);
    return null;
  }
};

export const saveEnvios = async (updatedEnvios: any) => {
  try {
    const uniqueEnvios = Array.from(new Set(updatedEnvios));
    const docRef = doc(db, "consecutivo", "consecutivos");

    await setDoc(docRef, { envios: uniqueEnvios }, { merge: true });

    console.log("Envios guardados con éxito!");
  } catch (error) {
    console.error("Error saving document:", error);
  }
};

export const getAndSaveEnvios = async () => {
  try {
    const oficinaQuery = query(
      collection(db, "envios"),
      where("status", "==", "oficina")
    );

    const mensajeroQuery = query(
      collection(db, "envios"),
      where("status", "==", "mensajero")
    );

    // Ejecutamos ambas consultas en paralelo
    const [oficinaSnapshot, mensajeroSnapshot] = await Promise.all([
      getDocs(oficinaQuery),
      getDocs(mensajeroQuery),
    ]);

    // Obtenemos los packageNumber de los envíos con status "oficina" y los convertimos a number
    const oficinaEnvios = oficinaSnapshot.docs.map((doc) =>
      Number(doc.data().packageNumber)
    );

    // Obtenemos los packageNumber de los envíos con status "mensajero" y los convertimos a number
    const mensajeroEnvios = mensajeroSnapshot.docs.map((doc) =>
      Number(doc.data().packageNumber)
    );

    // Unimos ambos arrays
    const updatedEnvios = [...oficinaEnvios, ...mensajeroEnvios];

    console.log("updatedEnvios:::>", updatedEnvios);
    await saveEnvios(updatedEnvios);
  } catch (error) {
    console.error("Error fetching and saving envios:", error);
  }
};

export const getFilteredShipmentsData = async () => {
  try {
    // Crear una consulta que busque envíos con status "entregado" o "oficina"
    const shipmentsCollectionRef = collection(db, "envios");
    const filteredQuery = query(
      shipmentsCollectionRef,
      where("status", "in", ["mensajero", "oficina"]) // Utiliza "in" para múltiples valores
    );

    // Ejecutar la consulta
    const querySnapshot = await getDocs(filteredQuery);
    const shipmentsData: any = [];

    querySnapshot.forEach((doc) => {
      shipmentsData.push(doc.data());
    });

    console.log(shipmentsData); // Opcional: para depuración
    return shipmentsData;
  } catch (error) {
    console.error("Error al obtener los envíos filtrados: ", error);
    return null;
  }
};

export const getFilteredShipmentsDataTimestap = async (dateRange: string[]) => {
  try {
    if (dateRange.length !== 2) {
      throw new Error(
        "El rango de fechas debe contener exactamente dos fechas."
      );
    }

    // Convertir fechas a timestamps
    const startTimestamp = new Date(dateRange[0] + "T00:00:00-05:00").getTime();
    const endTimestamp = new Date(dateRange[1] + "T23:59:59-05:00").getTime();
    console.log(startTimestamp);
    console.log(endTimestamp);
    // Referencia a la colección
    const shipmentsCollectionRef = collection(db, "envios");

    // Crear la consulta con filtros de status y timestamp en el rango de fechas
    const filteredQuery = query(
      shipmentsCollectionRef,
      where("timestamp", ">=", startTimestamp),
      where("timestamp", "<=", endTimestamp)
    );

    // Ejecutar la consulta
    const querySnapshot = await getDocs(filteredQuery);
    const shipmentsData: any = [];

    querySnapshot.forEach((doc) => {
      shipmentsData.push({ id: doc.id, ...doc.data() });
    });

    return shipmentsData;
  } catch (error) {
    console.error("Error al obtener los envíos filtrados: ", error);
    return null;
  }
};
