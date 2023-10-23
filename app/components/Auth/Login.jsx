"use client";

import React, { useState, useEffect } from "react";
import { useNavigation } from "../../utils/useNavigation";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth";
import { useFirestore } from "../../firebase/useFirestore";
import { validateEmail, validatePassword } from "../../utils/formValidation";

import Loading from "../UserInterface/Loading";

import { Button } from "@material-tailwind/react";

const Login = () => {
    const { authUser, isLoading, signInFirebase } = useFirebaseAuth();
    const { fetchUser } = useFirestore();
    const { handleNavigate } = useNavigation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [user, setUser] = useState(null);
    const [errors, setErrors] = useState({ email: "", password: "" });

    const handleLogin = async (e) => {
        e.preventDefault();

        // Borro errores anteriores
        setErrors({ email: "", password: "" });

        // Validacion de campos
        let isValid = true;
        const emailError = validateEmail(email);
        if (emailError) {
            setErrors((prevErrors) => ({ ...prevErrors, email: emailError }));
            isValid = false;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setErrors((prevErrors) => ({
                ...prevErrors,
                password: passwordError,
            }));
            isValid = false;
        }

        if (isValid) {
            try {
                await signInFirebase(email, password);
            } catch (error) {
                console.error("Error al iniciar sesión:", error);
            }
        }
    };

    useEffect(() => {
        const fetchUserFromFirestore = async () => {
            if (authUser) {
                try {
                    const user = await fetchUser(authUser.uid);
                    setUser(user);
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            }
        };
        fetchUserFromFirestore();
    }, [authUser]);

    useEffect(() => {
        if (!isLoading && user) {
            if (user.rol === "admin") {
                handleNavigate("admin");
            } else if (user.rol === "candidato") {
                handleNavigate("prueba");
            } else if (user.rol === "entrevistador") {
                handleNavigate("entrevistador");
            }
        }
    }, [isLoading, user]);

    if (isLoading || authUser) {
        return <Loading />;
    }

    return (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-bold text-center text-gray-700">
                    Login
                </h1>
                <form className="mt-6">
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            autocomplete="off"
                            id="email"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.email}
                            </p>
                        )}
                    </div>
                    <div className="mb-2">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                            htmlFor="password"
                        >
                            Contraseña
                        </label>
                        <input
                            id="password"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.password}
                            </p>
                        )}
                    </div>

                    <Button
                        fullWidth
                        type="submit"
                        onClick={(e) => handleLogin(e, email, password)}
                    >
                        Ingresar{" "}
                    </Button>
                    <p className="mt-6 ml-1">
                        No tienes cuenta?{" "}
                        <span
                            className="underline hover:text-blue-400 cursor-pointer"
                            onClick={() => {
                                handleNavigate("register");
                            }}
                        >
                            Registrate
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Login;
