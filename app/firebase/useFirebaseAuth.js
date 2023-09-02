"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import {
    onAuthStateChanged,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
} from "firebase/auth";
import {
    logSignIn,
    logSignOut,
    logRegistration,
    logError,
} from "./firebaseLogger";
import { setUserOnline, setUserOffline } from "./userPresence";
import { auth } from "./firebaseConfig";
import { toast } from "react-hot-toast";

const AuthUserContext = createContext({
    authUser: null,
    isLoading: true,
});

export const useFirebaseAuth = () => {
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const signUpFirebase = async (email, password) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            // Log the registration event
            logRegistration(userCredential.user);

            toast.success("Registrado correctamente");
            return userCredential;
        } catch (error) {
            // Log the error event
            logError(error);

            toast.error("Error al registrarse");
            console.error("Error signing up:", error);
        }
    };

    const signInFirebase = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);

            // Get the currently signed-in user
            const user = auth.currentUser;

            if (user) {
                // Log the sign-in event
                logSignIn(user);
            }
            toast.success("Ingreso Correcto");
        } catch (error) {
            logError(error);
            toast.error("Error al iniciar sesión");

            console.error("Error signing in:", error);
        }
    };

    const signOutFirebase = async () => {
        try {
            // Get the currently signed-in user

            const user = auth.currentUser;

            if (user) {
                // Log the sign-out event
                logSignOut(user);

                // Set the user offline
                setUserOffline(user.uid);
            }
            await signOut(auth);
        } catch (error) {
            logError(error);

            console.error("Error signing out:", error);
        }
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsLoading(false);

            if (user) {
                // User is signed in
                setAuthUser(user);
                setUserOnline(user.uid);
            } else {
                // User is signed out
                setAuthUser(null);
            }
        });

        return () => unsubscribe();
    }, []);

    return {
        authUser,
        isLoading,
        signUpFirebase,
        signInFirebase,
        signOutFirebase,
    };
};

export const AuthUserProvider = ({ children }) => {
    const auth = useFirebaseAuth();

    return (
        <AuthUserContext.Provider value={auth}>
            {children}
        </AuthUserContext.Provider>
    );
};

export const useAuthUser = () => {
    return useContext(AuthUserContext);
};
