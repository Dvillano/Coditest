// Componente  que permite a los candidatos, resolver problemas de programación asignados

"use client";
import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import toast from "react-hot-toast";
import NoAssignedProblemsComponent from "./NoAssignedProblemsComponent";
import Loading from "./Loading";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth";
import { useFirestore } from "../../firebase/useFirestore";
import { useNavigation } from "@/app/utils/useNavigation";

import {
    Typography,
    Progress,
    Popover,
    PopoverHandler,
    PopoverContent,
    Button,
} from "@material-tailwind/react";

function CodeEditor() {
    const { authUser, isLoading } = useFirebaseAuth();
    const { fetchAssignedProblems, saveResults, updatePassedProblems } =
        useFirestore();
    const { handleNavigate } = useNavigation();

    const [problemList, setProblemList] = useState([]);
    const [currentProblem, setCurrentProblem] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [code, setCode] = useState("");

    // Calcula el progreso como porcentaje
    const progress = (currentIndex / problemList.length) * 100;

    useEffect(() => {
        const fetchProblems = async () => {
            if (authUser) {
                try {
                    const problems = await fetchAssignedProblems(authUser.uid);
                    setProblemList(problems);
                    problems.length > 0
                        ? setCurrentProblem(problems[0])
                        : setCurrentProblem(true);
                } catch (error) {
                    console.error("Error fetching problems:", error);
                }
            }
        };

        fetchProblems();
    }, [authUser]);

    /**
     * Ejecuta el código y lo evalúa en función de los casos de prueba.
     *
     * @return {undefined} No devuelve ningún valor.
     */
    const executeCode = () => {
        try {
            const evalFn = new Function(`return ${code}`)();
            // Verifica que sea una funcion el codigo
            if (typeof evalFn !== "function") {
                toast.error("Oops! El código no es válido");
                return;
            }

            // Evalua el codigo del usuario contra los testsCases
            const results = currentProblem.codigo_evaluador.map(
                (testCase) =>
                    evalFn(testCase.entrada) == testCase.salidaEsperada
            );

            // Verifica si todos los resultados fueron correctos
            const allTestsPassed = results.every((result) => result);

            // Actualiza la UI y guarda resultados
            handleTestResults(allTestsPassed);
        } catch (error) {
            toast.error(error.message);
        }
    };

    /**
     * Maneja los resultados de las pruebas según el estado de que todas las pruebas pasaron.
     *
     * @param {boolean} allTestsPassed - Indica si todas las pruebas pasaron o no.
     * @return {Promise<void>} Una promesa que se resuelve cuando la función completa.
     */
    const handleTestResults = async (allTestsPassed) => {
        const resultStatus = allTestsPassed ? "paso" : "fallo";

        await saveResults(authUser.uid, currentProblem.id, resultStatus);

        // Actualiza en firestore el estado de la prueba en caso de que el usuario pase
        if (resultStatus == "paso") {
            await updatePassedProblems(authUser.uid, currentProblem.id);
        }

        // Si pasa los tests correctamente redirigir a la proxima prueba
        if (allTestsPassed) {
            toast.success("Bien hecho! Todos los tests pasaron");
            handleNextProblem();
        } else {
            toast.error("Oops! Algunos tests fallaron");
        }
    };

    const handleNextProblem = () => {
        setCurrentIndex(currentIndex + 1);

        if (currentIndex + 1 < problemList.length) {
            setCurrentProblem(problemList[currentIndex + 1]);
        } else {
            setProblemList([]);
            const allExercisesCompleted =
                currentIndex === problemList.length - 1;
            if (allExercisesCompleted) {
                // Redirect to the congratulations message component
                handleNavigate("prueba/congratulations");
            }
        }
    };

    if (isLoading || !currentProblem) {
        return <Loading />;
    }

    // Revisa si usuario no tiene problemas asignados
    const noAssignedProblems = problemList.length === 0;

    return (
        <div>
            {noAssignedProblems ? (
                <NoAssignedProblemsComponent></NoAssignedProblemsComponent>
            ) : (
                <div>
                    <div className="m-5">
                        <Typography
                            variant="h2"
                            className="flex justify-center m-2"
                        >
                            Problema: {currentProblem.titulo}
                        </Typography>
                    </div>
                    {/* Progress Bar */}
                    <div className="mb-4">
                        <Progress value={progress} color="green" />
                        <div className="text-center mt-2">
                            {currentIndex} de {problemList.length} problemas
                            completados
                        </div>
                    </div>

                    <div className="grid grid-cols-1 m-5 gap-5">
                        <div className="border p-4 rounded bg-gray-100 border-gray-300">
                            <Typography
                                variant="h6"
                                className="justify-start m-1"
                            >
                                {currentProblem.descripcion}
                            </Typography>

                            <Typography
                                variant="paragraph"
                                className="justify-start m-1"
                            >
                                Ejemplo input:{" "}
                                {currentProblem.codigo_evaluador[0].entrada}
                            </Typography>
                            <Typography
                                variant="paragraph"
                                className="justify-start m-1"
                            >
                                Ejemplo output:{" "}
                                {
                                    currentProblem.codigo_evaluador[0]
                                        .salidaEsperada
                                }
                            </Typography>
                        </div>

                        <div className="border p-4 rounded bg-gray-100 border-black-500">
                            <CodeMirror
                                value={currentProblem.plantilla_codigo.replaceAll(
                                    "\\n",
                                    "\n"
                                )}
                                height="350px"
                                theme={"dark"}
                                extensions={[javascript({ jsx: true })]}
                                onChange={setCode}
                            />
                        </div>
                        <div className="flex ml-5">
                            <Popover
                                className="text-white"
                                animate={{
                                    mount: { scale: 1, y: 0 },
                                    unmount: { scale: 0, y: 25 },
                                }}
                            >
                                <PopoverHandler>
                                    <Button>Ayuda</Button>
                                </PopoverHandler>
                                <PopoverContent>
                                    {currentProblem.sugerencia}
                                </PopoverContent>
                            </Popover>
                            <Button
                                onClick={executeCode}
                                className="bg-green-500 text-white ml-3"
                            >
                                Ejecutar
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CodeEditor;
