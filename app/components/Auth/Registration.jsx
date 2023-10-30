// Componente que se encarga del proceso de registro de usuarios
"use client";

import React, { useState, useEffect } from "react";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth";
import { useFirestore } from "../../firebase/useFirestore";
import { useNavigation } from "../../utils/useNavigation";
import {
    validateEmail,
    validatePassword,
    validateName,
    validateLastName,
} from "../../utils/formValidation";

import Loading from "../UserInterface/Loading";

import { Button } from "@material-tailwind/react";

const Registration = () => {
    const { signUpFirebase, authUser } = useFirebaseAuth();
    const { insertUser } = useFirestore();
    const { handleNavigate } = useNavigation();

    const [nombre, setNombre] = useState("");
    const [apellido, setApellido] = useState("");
    const [nivel, setNivel] = useState("principiante");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [errors, setErrors] = useState({ email: "", password: "" });

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validacion de campos
        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);
        const nameError = validateName(nombre);
        const lastNameError = validateLastName(apellido);

        if (!emailError && !passwordError && !nameError && !lastNameError) {
            try {
                setIsLoading(true);

                const { user } = await signUpFirebase(email, password);

                const userData = {
                    nombre,
                    apellido,
                    nivel,
                    email,
                    rol: "candidato",
                };

                await insertUser(user, userData);
            } catch (error) {
                console.error("Error al registrarse:", error);
            } finally {
                setIsLoading(false);
            }
        } else {
            setErrors({
                email: emailError,
                password: passwordError,
                name: nameError,
                lastName: lastNameError,
            });
        }
    };

    useEffect(() => {
        if (!isLoading && authUser) {
            handleNavigate("prueba");
        }
    }, [isLoading, authUser]);

    if (isLoading || authUser) {
        return <Loading />;
    }

    return (
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
                        {errors.name && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.name}
                            </p>
                        )}
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
                        {errors.lastName && (
                            <p className="text-red-500 text-sm mt-2">
                                {errors.lastName}
                            </p>
                        )}
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
                        type="submit"
                        fullWidth
                        onClick={(e) => handleSubmit(e)}
                        disabled={isLoading}
                    >
                        {isLoading ? <Loading /> : "Registrarse"}
                    </Button>
                    <p className="mt-6 ml-1">
                        Ya tienes una cuenta?{" "}
                        <span
                            className="underline hover:text-blue-400 cursor-pointer"
                            onClick={() => {
                                handleNavigate("login");
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
