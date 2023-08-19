"use client";

import React, { useState, useEffect } from "react";
import { useLogin } from "./useLogin";
import { useAuth } from "../../firebase/firebaseAuth";
import Loading from "../loader/Loading";

const Login = () => {
    const { handleSubmit, navigate } = useLogin();
    const { authUser, isLoading } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (!isLoading && authUser) {
            navigate("candidato");
        }
    }, [isLoading, authUser]);

    return !isLoading && authUser ? (
        <Loading />
    ) : (
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
                            id="email"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
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
                    </div>
                    <button
                        type="submit"
                        className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-gray-700 rounded-md hover:bg-gray-600 focus:outline-none focus:bg-gray-600"
                        onClick={(e) => handleSubmit(e, email, password)}
                    >
                        Ingresar
                    </button>
                    <p className="mt-6 ml-1">
                        No tienes cuenta ?{" "}
                        <span
                            className="underline hover:text-blue-400 cursor-pointer"
                            onClick={() => {
                                navigate("register");
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
