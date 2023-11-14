// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Firestore, collection, doc, getFirestore, setDoc } from "firebase/firestore";

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
// Initialize Firebase
const app: FirebaseApp = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const db: Firestore = getFirestore(app);
const auth = getAuth();

export const creteUser = async (email: any, password: any) => {
    try {
        const createUser = await createUserWithEmailAndPassword(auth, email, password)
        return createUser.user
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const errorData = {
            errorCode,
            errorMessage
        }
        console.log(errorData)
        return errorData
    }
}
export const loginUser = async (email: any, password: any) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password)
        const user = userCredential.user;
        console.log(user)
        return user
    } catch (error: any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const dataError = {
            errorCode,
            errorMessage
        }
        console.error(dataError)
        return dataError
    }
}


export const saveDataUser = async (uid: any, userData: any) => {
    try {
        const userCollectionRef = collection(db, "user");
        const userDocRef = doc(userCollectionRef, uid);
        await setDoc(userDocRef, {
            uid: uid,
            ...userData
        });
        console.log("Documento guardado con ID: ", uid);
        return uid;
    } catch (error) {
        console.error("Error al guardar información en /user: ", error);
        return null;
    }
};