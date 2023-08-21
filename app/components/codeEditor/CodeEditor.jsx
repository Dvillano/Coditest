"use client";
import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import useAssignedProblem from "./useAssignedProblem";
import { auth } from "@/app/firebase/firebaseConfig";
import toast from "react-hot-toast";

function CodeEditor() {
    const userId = auth.currentUser?.uid; // Debes obtener el userId del usuario logueado
    const problemInfo = useAssignedProblem(userId); // Utiliza el hook para obtener la información
    const [output, setOutput] = useState("");
    const [code, setCode] = useState("");

    const executeCode = () => {
        try {
            const result = eval(code);
            setOutput(result !== undefined ? result.toString() : "undefined");

            if (!result) {
                toast.error("Incorrecto");
            } else {
                toast.success("Correcto!");
            }
        } catch (error) {
            toast.error("Incorrecto");
            setOutput(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            {problemInfo ? (
                <div>
                    <h2>{problemInfo.titulo}</h2>
                    <p>{problemInfo.descripcion}</p>
                    <p>{problemInfo.sugerencia}</p>
                    <p>Entrada del problema: {problemInfo.caso_prueba}</p>
                    <p>Salida esperada: {problemInfo.salida_esperada}</p>

                    <div className="flex">
                        <div className="border p-4 rounded bg-gray-100 mr-2 flex-1">
                            <CodeMirror
                                value={problemInfo.plantilla_codigo}
                                height="200px"
                                extensions={[javascript({ jsx: true })]}
                                onChange={setCode}
                            />
                        </div>

                        <div className="border p-4 rounded bg-gray-100 ml-2 flex-1">
                            <button
                                onClick={executeCode}
                                className="bg-green-500 text-white px-4 py-2 rounded mb-2"
                            >
                                Ejecutar
                            </button>

                            <p>Resultado:</p>
                            <pre className="text-gray-800">{output}</pre>
                        </div>
                    </div>
                </div>
            ) : (
                <p>No hay prueba asignada</p>
            )}
        </div>
    );
}

export default CodeEditor;
