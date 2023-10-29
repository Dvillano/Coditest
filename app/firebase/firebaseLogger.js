// firebaseLogger.js
// Este modulo provee functions para que el usuario pueda registrar eventos en Firestore.

import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

const COLLECTION_NAME = "logs";

// Registra un evento de inicio de sesión en Firestore.
export const logSignIn = (user) => {
    const logData = {
        event: "Sign-In",
        userUid: user.uid,
        userEmail: user.email,
        timestamp: new Date().toLocaleString(),
    };

    addDoc(collection(db, COLLECTION_NAME), logData);
};

// Registra un evento de cierre de sesión en Firestore.
export const logSignOut = (user) => {
    const logData = {
        event: "Sign-Out",
        userUid: user.uid,
        userEmail: user.email,
        timestamp: new Date().toLocaleString(),
    };

    addDoc(collection(db, COLLECTION_NAME), logData);
};

// Registra un evento de registro de usuario en Firestore.
export const logRegistration = (user) => {
    const logData = {
        event: "Registration",
        userUid: user.uid,
        userEmail: user.email,
        timestamp: new Date().toLocaleString(),
    };

    addDoc(collection(db, COLLECTION_NAME), logData);
};
