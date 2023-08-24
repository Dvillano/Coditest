"use client";
import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
// import useAssignedProblem from "./useAssignedProblem";
import toast from "react-hot-toast";
import useSaveResults from "./useSaveResults";
import evaluateUserCode from "./codeEvaluator"; // Importa la función
import { db } from "../../firebase/firebaseConfig";
import { collection, getDocs, query, where } from "firebase/firestore";
import { useAuth } from "../../firebase/firebaseAuth";
import Loading from "../loader/Loading";

function CodeEditor() {
    const { authUser, isLoading } = useAuth();

    const [problemInfo, setProblemInfo] = useState(null);
    const [code, setCode] = useState("");
    const [output, setOutput] = useState("");

    useEffect(() => {
        if (authUser) {
            fetchAssignedProblem();
        }
    }, [authUser]);

    const fetchAssignedProblem = async () => {
        try {
            // Realiza la consulta a Firestore para obtener la información de la prueba asignada al usuario

            const userId = authUser.id;
            const usuariosRef = collection(db, "usuarios");
            const userRef = query(usuariosRef, where("id", "==", userId));
            const userSnapshot = (await getDocs(userRef)).docs[0].data();
            const assignedProblemId = userSnapshot.pruebas_asignadas;
            if (assignedProblemId) {
                const bateriaPruebasRef = collection(db, "bateria_pruebas");

                const pruebaRef = query(
                    bateriaPruebasRef,
                    where("id", "==", assignedProblemId)
                );
                const listaPruebas = (await getDocs(pruebaRef)).docs[0].data();

                if (listaPruebas.problemas) {
                    const problemasRef = collection(db, "problemas");
                    const problemas = query(
                        problemasRef,
                        where("id", "in", listaPruebas.problemas)
                    );
                    const listaProblemas = (
                        await getDocs(problemas)
                    ).docs[0].data();

                    setProblemInfo(listaProblemas);
                }
            } else {
                setProblemInfo(null); // No hay prueba asignada
            }
        } catch (error) {
            console.error("Error fetching assigned problem:", error);
        }
    };

    const executeCode = async () => {
        try {
            const resultado = evaluateUserCode(
                code,
                problemInfo.codigo_evaluador
            );

            if (resultado) {
                toast.success("Bien hecho! Todos los tests pasaron");
            } else {
                toast.error("Oops! Algunos tests fallaron");
            }

            useSaveResults(
                userId,
                problemInfo.id,
                resultado ? "paso" : "fallo"
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    if (isLoading || !problemInfo) {
        return <Loading />;
    }

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
                                value={problemInfo.plantilla_codigo.replaceAll(
                                    "\\n",
                                    "\n"
                                )}
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
