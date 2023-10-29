// firebaseAuth.js - Módulo de autenticación de Firebase

/**
 * Este módulo se encarga de gestionar la autenticación de usuarios en la aplicación.
 * Proporciona funciones y un contexto para el registro, inicio de sesión y cierre de sesión
 * de usuarios utilizando Firebase. Además, controla eventos de autenticación y almacena
 * registros en Firestore para llevar un registro de las acciones de los usuarios.
 *
 */

"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import { logSignIn, logSignOut, logRegistration } from "./firebaseLogger";
import { auth } from "./firebaseConfig";
import { useNavigation } from "../utils/useNavigation";

import { toast } from "react-hot-toast";

import {
    updateUserStatusOnLogin,
    updateUserStatusOnLogout,
} from "../utils/updateUserStatus";

// Contexto para almacenar la informacion de autenticacion.
const AuthUserContext = createContext({
    authUser: null,
    isLoading: true,
});

export const useFirebaseAuth = () => {
    const { handleNavigate } = useNavigation();
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // Registrar un nuevo usuario.
    const signUpFirebase = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Registra el evento de registro de usuario
            logRegistration(userCredential.user);

            toast.success("Registrado correctamente");
            return userCredential;
        } catch (error) {
            handleAuthError("Error al registrarse", error);
            throw error;
        }
    };

    // Iniciar sesion de usuario.
    const signInFirebase = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);

            // Get the currently signed-in user
            const user = auth.currentUser;

            if (user) {
                // Registra el evento de inicio de sesión
                logSignIn(user);
            }
            toast.success("Ingreso Correcto");
        } catch (error) {
            handleAuthError("Error al iniciar sesión", error);
        }
    };

    // Cerrar sesión de usuario
    const signOutFirebase = async () => {
        try {
            const user = auth.currentUser;

            if (user) {
                // Registra el evento de cierre de sesión
                logSignOut(user);
                updateUserStatusOnLogout(user);
            }
            await signOut(auth);
            handleNavigate("/");
        } catch (error) {
            handleAuthError("Error al cerrar sesión", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoading(false);

            if (user) {
                // El usuario ha iniciado sesión
                setAuthUser(user);
                updateUserStatusOnLogin(user);
            } else {
                // El usuario ha cerrado sesión
                setAuthUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    // Manejar errores de autenticación
    const handleAuthError = (message, error) => {
        toast.error(message);
        console.error(`Error: ${message}`, error);
    };

    return {
        authUser,
        isLoading,
        signUpFirebase,
        signInFirebase,
        signOutFirebase,
    };
};

// Proveedor de contexto para la información de autenticación
export const AuthUserProvider = ({ children }) => {
    const auth = useFirebaseAuth();

    return (
        <AuthUserContext.Provider value={auth}>
            {children}
        </AuthUserContext.Provider>
    );
};

// Hook para acceder a la información de autenticación
export const useAuthUser = () => {
    return useContext(AuthUserContext);
};
