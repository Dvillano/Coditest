"use client";
import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import toast from "react-hot-toast";
import useSaveResults from "./useSaveResults";
import evaluateUserCode from "./codeEvaluator"; // Importa la función
import { useAuth } from "../../firebase/firebaseAuth";
import Loading from "../loader/Loading";
import useFetchAssignedProblems from "./useFetchAssignedProblems";

function CodeEditor() {
    const { authUser, isLoading } = useAuth();

    const [problemList, setProblemList] = useState(null);
    const [currentProblem, setCurrentProblem] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [allProblemsCompleted, setAllProblemsCompleted] = useState(false);
    const [code, setCode] = useState("");

    useEffect(() => {
        const fetchProblems = async () => {
            if (authUser) {
                try {
                    const problems = await useFetchAssignedProblems(authUser);
                    setProblemList(problems);
                    setCurrentProblem(problems[0]);
                } catch (error) {
                    console.error("Error fetching problems:", error);
                }
            }
        };

        fetchProblems();
    }, [authUser]);

    // Ejecuta el código evaluado en la prueba
    const executeCode = async () => {
        try {
            const resultado = evaluateUserCode(
                code,
                currentProblem.codigo_evaluador
            );

            if (resultado) {
                toast.success("Bien hecho! Todos los tests pasaron");
                setCurrentIndex(currentIndex + 1);

                // Siguiente problema
                if (currentIndex + 1 < problemList.length) {
                    setCurrentProblem(problemList[currentIndex + 1]);
                } else {
                    setAllProblemsCompleted(true);
                }
            } else {
                toast.error("Oops! Algunos tests fallaron");
            }

            useSaveResults(
                authUser.id,
                currentProblem.id,
                resultado ? "paso" : "fallo"
            );
        } catch (error) {
            console.log(error.message);
        }
    };

    if (isLoading || !currentProblem) {
        return <Loading />;
    }

    return (
        <div>
            {allProblemsCompleted ? (
                <h1>Todos los problemas completados</h1>
            ) : (
                <div>
                    <h2>{currentProblem.titulo}</h2>
                    <p>{currentProblem.descripcion}</p>
                    <p>{currentProblem.sugerencia}</p>

                    <div className="flex">
                        <div className="border p-4 rounded bg-gray-100 mr-2 flex-1">
                            <CodeMirror
                                value={currentProblem.plantilla_codigo.replaceAll(
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
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CodeEditor;
