"use client";
import { createContext, useContext, useEffect, useState } from "react";

import { onAuthStateChanged, signOut as authSignOut } from "firebase/auth";
import { auth } from "./firebaseConfig";

const AuthUserContext = createContext({
    authUser: null,
    isLoading: true,
});

export default function useFirebaseAuth() {
    const [authUser, setAuthUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const authStateChanged = (user) => {
        setIsLoading(true);
        if (!user) {
            setAuthUser(null);
            setIsLoading(false);
            clear();
            return;
        }
        setAuthUser({
            id: user.uid,
            email: user.email,
        });

        setIsLoading(false);
    };

    const signOut = () => {
        authSignOut(auth).then(() => setAuthUser(null));
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, authStateChanged);
        return unsubscribe;
    }, []);

    return {
        authUser,
        isLoading,
        setAuthUser,
        signOut,
    };
}

export const AuthUserProvider = ({ children }) => {
    const auth = useFirebaseAuth();
    return (
        <AuthUserContext.Provider value={auth}>
            {children}
        </AuthUserContext.Provider>
    );
};

export const useAuth = () => useContext(AuthUserContext);
