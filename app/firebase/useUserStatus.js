// useUserStatus.js
// Modulo para gestionar la autenticación y la base de datos en tiempo real

import { ref, onValue, off } from "firebase/database";
import { useEffect, useState } from "react";
import { realtimeDatabase } from "./firebaseConfig";
import { useFirebaseAuth } from "./useFirebaseAuth";

export const useUserStatus = () => {
    const [userStatuses, setUserStatuses] = useState([]);
    const { authUser } = useFirebaseAuth();

    useEffect(() => {
        if (!authUser) {
            return;
        }

        const userStatusRef = ref(realtimeDatabase, "userStatus");

        // Función para manejar cambios en los estados de usuario
        const handleUserStatusChange = (snapshot) => {
            if (snapshot.exists()) {
                const data = snapshot.val();
                const userStatusArray = Object.values(data);
                setUserStatuses(userStatusArray);
            } else {
                setUserStatuses([]);
            }
        };

        // Suscribirse a cambios en el nodo "userStatus"
        const userStatusListener = onValue(
            userStatusRef,
            handleUserStatusChange
        );

        return () => {
            // Cancelar la suscripción al finalizar el componente
            off(userStatusListener);
        };
    }, [authUser]);

    return userStatuses;
};
