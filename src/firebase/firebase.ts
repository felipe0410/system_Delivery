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
  setDoc,
  updateDoc,
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

export const getAllShipmentsDataRealTime = (callback: (arg0: any[]) => void) => {
  try {
    const shipmentsCollectionRef = collection(db, "envios");
    const shipmentsData: any[] = [];
    onSnapshot(shipmentsCollectionRef, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        shipmentsData.push(doc.data());
      });
      callback(shipmentsData);
    });
    return shipmentsData
  } catch (error) {
    console.error("Error al obtener la información de la colección: ", error);
    return null;
  }
};
