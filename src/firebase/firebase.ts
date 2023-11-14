// Import the functions you need from the SDKs you need
import { FirebaseApp, initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { Firestore, collection, doc, getFirestore, setDoc } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDEVf0lCXmFD8noHmoeTM6JsYxfK5BrxFg",
    authDomain: "systemdelivery-e610d.firebaseapp.com",
    projectId: "systemdelivery-e610d",
    storageBucket: "systemdelivery-e610d.appspot.com",
    messagingSenderId: "647264272705",
    appId: "1:647264272705:web:a8b571bb46e9093927e1c0",
    measurementId: "G-ZG0J477L07"
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