"use client"

import React, { useState, useEffect, createContext, useContext } from 'react';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword ,signOut   } from 'firebase/auth';
import { auth } from './firebaseConfig';
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
      await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('Error signing up:', error);
    }
  };

  const signInFirebase = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Ingreso Correcto");

    } catch (error) {
      toast.error("Error al iniciar sesión");

      console.error('Error signing in:', error);
    }
  };

  const signOutFirebase = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoading(false);

      if (user) {
        // User is signed in
        setAuthUser(user);
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
