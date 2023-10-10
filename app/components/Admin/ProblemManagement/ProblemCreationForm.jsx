"use client";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

import { useNavigation } from "@/app/utils/useNavigation";
import { Button } from "@material-tailwind/react";

import Loading from "../../UserInterface/Loading";

import { useFirebaseAuth } from "../../../firebase/useFirebaseAuth";
import { useFirestore } from "@/app/firebase/useFirestore";

function ProblemCreationForm() {
    const { authUser, isLoading } = useFirebaseAuth();
    const { fetchUser, insertProblem } = useFirestore();
    const { handleNavigate } = useNavigation();

    const [user, setUser] = useState(null);

    const initialFormData = {
        titulo: "",
        nivel: "principiante",
        descripcion: "",
        sugerencia: "",
        plantilla_codigo: "",
        codigo_evaluador: [
            {
                entrada: [],
                salidaEsperada: [],
            },
        ],
    };

    const [formData, setFormData] = useState(initialFormData);

    useEffect(() => {
        const fetchData = async () => {
            if (authUser) {
                try {
                    const user = await fetchUser(authUser.uid);
                    if (!user) {
                        toast.error("Acceso no autorizado");
                        handleNavigate("/");
                        return;
                    }
                    setUser(user);

                    if (user.rol !== "admin") {
                        toast.error("Acceso no autorizado");
                        handleNavigate("/");
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            }
        };

        fetchData();
    }, [authUser]);

    if (isLoading || !user) {
        return <Loading />;
    }

    const handleCreateProblem = async (e) => {
        e.preventDefault();

        try {
            if (
                formData.titulo &&
                formData.descripcion &&
                formData.nivel &&
                formData.codigo_evaluador.length > 0 &&
                formData.sugerencia
            ) {
                // Convert entrada and salidaEsperada fields to arrays
                const formattedData = {
                    ...formData,
                };

                // Ensure entrada and salidaEsperada fields are arrays
                formattedData.codigo_evaluador.forEach((item) => {
                    if (!Array.isArray(item.entrada)) {
                        item.entrada = [item.entrada];
                    }
                    if (!Array.isArray(item.salidaEsperada)) {
                        item.salidaEsperada = [item.salidaEsperada];
                    }
                });

                await insertProblem(formattedData);
                toast.success("Problema guardado correctamente!");
                handleNavigate("admin/problems");
            } else {
                toast.error("Complete todos los campos");
            }
        } catch (error) {
            toast.error("No se pudo crear el problema");
            console.error("Error al crear problema:", error);
        }

        setFormData(initialFormData);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith("codigo_evaluador.")) {
            const [index, field] = name.split(".").slice(1);

            setFormData((prevState) => {
                const newCodigoEvaluador = [...prevState.codigo_evaluador];
                if (!newCodigoEvaluador[index]) {
                    newCodigoEvaluador[index] = {
                        entrada: [], // Initialize as an array
                        salidaEsperada: [], // Initialize as an array
                    };
                }
                // Check if the value is an array (between square brackets)
                if (value.startsWith("[") && value.endsWith("]")) {
                    try {
                        // Try to parse the value as JSON
                        const parsedValue = JSON.parse(value);
                        // Check if the parsed value is an array
                        if (Array.isArray(parsedValue)) {
                            newCodigoEvaluador[index][field] = parsedValue;
                        } else {
                            // If it's not an array, store it as a string
                            newCodigoEvaluador[index][field] = value;
                        }
                    } catch (error) {
                        // If parsing as JSON fails, store it as a string
                        newCodigoEvaluador[index][field] = value;
                    }
                } else {
                    // If it's not between square brackets, store it as a string
                    newCodigoEvaluador[index][field] = value;
                }
                return {
                    ...prevState,
                    codigo_evaluador: newCodigoEvaluador,
                };
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const addCodigoEvaluador = () => {
        setFormData((prevState) => ({
            ...prevState,
            codigo_evaluador: [
                ...prevState.codigo_evaluador,
                { entrada: [], salidaEsperada: [] }, // Initialize as arrays
            ],
        }));
    };

    return (
        <div className=" flex flex-col items-center justify-center  min-h-screen overflow-hidden">
            <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
                <form className="mt-6">
                    <a
                        class="!font-medium !text-blue-gray-900 !transition-colors hover:!text-black flex justify-end"
                        href="/admin/problems"
                    >
                        <button
                            class="flex select-none items-center gap-2 rounded-lg py-2 px-4 text-center align-middle font-sans text-xs font-bold uppercase text-black-500 transition-all hover:bg-black/10 active:bg-black-500/30 disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                            type="button"
                            data-ripple-dark="true"
                        >
                            Volver
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke-width="2"
                                stroke="currentColor"
                                aria-hidden="true"
                                class="h-4 w-4"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                ></path>
                            </svg>
                        </button>
                    </a>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                            htmlFor="titulo"
                        >
                            Titulo
                        </label>
                        <input
                            id="titulo"
                            name="titulo"
                            placeholder="Titulo del problema"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            type="text"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                            htmlFor="nivel"
                        >
                            Nivel
                        </label>
                        <select
                            id="nivel"
                            name="nivel"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            onChange={handleInputChange}
                        >
                            <option value="principiante">Principiante</option>
                            <option value="intermedio">Intermedio</option>
                            <option value="avanzado">Avanzado</option>
                        </select>
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                            htmlFor="descripcion"
                        >
                            Descripcion
                        </label>
                        <textarea
                            id="descripcion"
                            name="descripcion"
                            maxLength="400"
                            placeholder="Descripcion de la consigna del problema"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                            htmlFor="sugerencia"
                        >
                            Sugerencia
                        </label>
                        <textarea
                            id="sugerencia"
                            name="sugerencia"
                            maxLength="200"
                            placeholder="Sugerencia para resolver el problema"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            onChange={handleInputChange}
                        />
                    </div>
                    <div className="mb-4">
                        <label
                            className="block text-sm font-semibold text-gray-800"
                            htmlFor="plantilla_codigo"
                        >
                            Plantilla de codigo
                        </label>
                        <textarea
                            id="plantilla_codigo"
                            name="plantilla_codigo"
                            maxLength="200"
                            placeholder="Funcion sobre la cual el usuario resolvera el problema, Ejemplo: function contarVocales(texto) { \n // Escribe tu código aquí \n}"
                            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            onChange={handleInputChange}
                        />
                    </div>
                    <Button
                        className="mb-4"
                        onClick={() => addCodigoEvaluador()}
                    >
                        Agregar codigo evaluador
                    </Button>
                    {formData.codigo_evaluador.map((codigo, index) => (
                        <div key={index} className="mb-4">
                            <label
                                className="block text-sm font-semibold text-gray-800"
                                htmlFor={`codigo_evaluador[${index}].entrada`}
                            >
                                Entrada {index + 1}
                            </label>
                            <input
                                id={`codigo_evaluador[${index}].entrada`}
                                name={`codigo_evaluador.${index}.entrada`}
                                placeholder={`Codigo del evaluador (entrada) [${
                                    index + 1
                                }]`}
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                type="text"
                                onChange={handleInputChange}
                            />
                            <label
                                className="block text-sm font-semibold text-gray-800"
                                htmlFor={`codigo_evaluador[${index}].salidaEsperada`}
                            >
                                Salida esperada {index + 1}
                            </label>
                            <input
                                id={`codigo_evaluador[${index}].salidaEsperada`}
                                name={`codigo_evaluador.${index}.salidaEsperada`}
                                placeholder={`Codigo del evaluador (salidaEsperada) [${
                                    index + 1
                                }]`}
                                className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                type="text"
                                onChange={handleInputChange}
                            />
                        </div>
                    ))}
                    <Button
                        type="submit"
                        fullWidth
                        onClick={(e) => handleCreateProblem(e)}
                    >
                        Agregar problema
                    </Button>
                </form>
            </div>
        </div>
    );
}

export default ProblemCreationForm;
