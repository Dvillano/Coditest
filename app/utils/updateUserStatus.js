// Este módulo es responsable de actualizar el estado en tiempo real de los usuarios en la base de datos Firebase Realtime Database.

import { ref, set, onDisconnect } from "firebase/database";
import { realtimeDatabase } from "../firebase/firebaseConfig";

// Actualizar status del usuario a "online" al hacer login
export const updateUserStatusOnLogin = (user) => {
    if (user) {
        const userUid = user.uid;
        const userEmail = user.email;
        const userStatusRef = ref(realtimeDatabase, `userStatus/${userUid}`);

        // Cambia status a "online" y  actualiza el timestamp de ultima hora de conexion
        set(userStatusRef, {
            email: userEmail,
            status: "online",
            lastOnline: new Date().toLocaleString(),
        });

        // Handler para actualizar estado al desconectarse.
        onDisconnect(userStatusRef).set({
            email: userEmail,
            status: "offline",
            lastOnline: new Date().toLocaleString(),
        });
    }
};

// Actualizar estado a "offline" al desconectarse
export const updateUserStatusOnLogout = (user) => {
    if (user) {
        const userUid = user.uid;
        const userEmail = user.email;

        const userStatusRef = ref(realtimeDatabase, `userStatus/${userUid}`);

        // Set user status to "offline" and update lastOnline timestamp
        set(userStatusRef, {
            email: userEmail,
            status: "offline",
            lastOnline: new Date().toLocaleString(),
        });
    }
};
