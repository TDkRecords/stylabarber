// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDgIS2_ut0ECBz5rnNlym3j2ZQ8Y5N88bA",
    authDomain: "prueba-c5bf0.firebaseapp.com",
    projectId: "prueba-c5bf0",
    storageBucket: "prueba-c5bf0.firebasestorage.app",
    messagingSenderId: "909015842646",
    appId: "1:909015842646:web:d10a6dc7a78d9359e760f7"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Configurar persistencia para mantener la sesión
setPersistence(auth, browserLocalPersistence).catch((error) => {
    console.error("Error setting persistence:", error);
});