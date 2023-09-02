import { collection, addDoc } from "firebase/firestore";
import { db } from "./firebaseConfig";

// Log user sign-in event
export const logSignIn = (user) => {
    const logData = {
        event: "Sign-In",
        userUid: user.uid,
        userEmail: user.email,
        timestamp: new Date().toISOString(),
    };

    // Log to Firestore (replace 'logs' with your Firestore collection name)
    addDoc(collection(db, "logs"), logData);
};

// Log user sign-out event
export const logSignOut = (user) => {
    const logData = {
        event: "Sign-Out",
        userUid: user.uid,
        userEmail: user.email,
        timestamp: new Date().toISOString(),
    };

    // Log to Firestore (replace 'logs' with your Firestore collection name)
    addDoc(collection(db, "logs"), logData);
};

// Log user registration event
export const logRegistration = (user) => {
    const logData = {
        event: "Registration",
        userUid: user.uid,
        userEmail: user.email,
        timestamp: new Date().toISOString(),
    };

    // Log to Firestore (replace 'logs' with your Firestore collection name)
    addDoc(collection(db, "logs"), logData);
};

// Log error event
export const logError = (error) => {
    const logData = {
        event: "Error",
        errorMessage: error.message,
        timestamp: new Date().toISOString(),
    };

    // Log to Firestore (replace 'logs' with your Firestore collection name)
    addDoc(collection(db, "logs"), logData);
};
