"use client";

import React, { useState, useEffect } from "react";
import { useRegister } from "./useRegister";
import { useAuth } from "../../firebase/firebaseAuth";
import Loading from "../loader/Loading";

const Registration = () => {
    const { handleSubmit, navigate } = useRegister();
    const { authUser, isLoading } = useAuth();

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [nivel, setNivel] = useState("principiante");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    useEffect(() => {
        if (!isLoading && authUser) {
            navigate("admin");
        }
    }, [isLoading, authUser]);

    return !isLoading && authUser ? (
        <Loading />
    ) : (
        <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
            <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-bold text-center text-gray-700">
                    Registro
                </h1>
                <form className="mt-6">
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                            htmlFor="nombre"
                        >
                            Nombre
                        </label>
                        <input
                            id="nombre"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                            htmlFor="apellido"
                        >
                            Apellido
                        </label>
                        <input
                            id="apellido"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            type="text"
                            value={apellido}
                            onChange={(e) => setApellido(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                            htmlFor="nivel"
                        >
                            Nivel de Experiencia
                        </label>
                        <select
                            id="nivel"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            value={nivel}
                            onChange={(e) => setNivel(e.target.value)}
                        >
                            <option value="principiante">Principiante</option>
                            <option value="intermedio">Intermedio</option>
                            <option value="avanzado">Avanzado</option>
                        </select>
                    </div>
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
                        onClick={(e) =>
                            handleSubmit(
                                e,
                                nombre,
                                apellido,
                                nivel,
                                email,
                                password
                            )
                        }
                    >
                        Registrarse
                    </button>
                    <p className="mt-6 ml-1">
                        Ya tienes una cuenta ?{" "}
                        <span
                            className="underline hover:text-blue-400 cursor-pointer"
                            onClick={() => {
                                navigate("login");
                            }}
                        >
                            Ingresa
                        </span>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default Registration;
