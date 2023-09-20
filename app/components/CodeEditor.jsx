"use client";
import React, { useEffect, useState } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";
import toast from "react-hot-toast";
import Loading from "./Loading";
import UserStatusInfo from "./UserStatusInfo";
import { useFirebaseAuth } from "../firebase/useFirebaseAuth";
import { useFirestore } from "../firebase/useFirestore";

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
    const {
        fetchAssignedProblems,
        saveResults,
        updatePassedProblems,
        updateAssignedProblems,
    } = useFirestore();

    const [problemList, setProblemList] = useState([]);
    const [currentProblem, setCurrentProblem] = useState(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [code, setCode] = useState("");
    const [allProblemsPassed, setAllProblemsPassed] = useState(null);

    // Calculate the progress as a percentage
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

    // Ejecuta el código evaluado en la prueba
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

            // // Loop through each test case in codigo_evaluador
            // for (const testCase of currentProblem.codigo_evaluador) {
            //     // Extract input and expected output from the test case
            //     const input = testCase.entrada;
            //     const expectedOutput = testCase.salidaEsperada;

            //     // Evalua el codigo del usuario with the input

            //     const result = evalFn(input);

            //     // Compare the result with the expected output
            //     const testPassed = result === expectedOutput;

            //     // Prepare the result message
            //     const resultMessage = `
            //         Input: ${JSON.stringify(input)}
            //         Result: ${JSON.stringify(result)}
            //         Expected Output: ${JSON.stringify(expectedOutput)}
            //         Test Passed: ${testPassed ? "Yes" : "No"}
            //     `;

            //     // Push the result message to the array
            //     resultsArray.push(resultMessage);

            // Verifica si todos los resultados fueron correctos
            const allTestsPassed = results.every((result) => result);

            // Actualiza la UI y guarda resultados
            handleTestResults(allTestsPassed);
        } catch (error) {
            console.log(error.message);
            toast.error(error.message);
        }
    };

    const handleTestResults = async (allTestsPassed) => {
        const resultStatus = allTestsPassed ? "paso" : "fallo";

        await saveResults(authUser.uid, currentProblem.id, resultStatus);
        await updatePassedProblems(authUser.uid, currentProblem.id);

        if (allTestsPassed) {
            toast.success("Bien hecho! Todos los tests pasaron");
            handleNextProblem();

            //Redirigir a otra pagina en caso de haber pasado todas las preubas
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
        }
    };

    if (isLoading || !currentProblem) {
        return <Loading />;
    }

    return (
        <div>
            {problemList.length == 0 ? (
                <UserStatusInfo></UserStatusInfo>
            ) : (
                <div>
                    <div className="m-2">
                        <Typography
                            variant="h3"
                            className="flex justify-center m-2"
                        >
                            {currentProblem.titulo}
                        </Typography>

                        <Typography variant="h6" className="justify-start m-1">
                            {currentProblem.descripcion}
                        </Typography>

                        <Popover
                            className="m-2"
                            animate={{
                                mount: { scale: 1, y: 0 },
                                unmount: { scale: 0, y: 25 },
                            }}
                        >
                            <PopoverHandler>
                                <Button>Mostrar ayuda</Button>
                            </PopoverHandler>
                            <PopoverContent>
                                {currentProblem.sugerencia}
                            </PopoverContent>
                        </Popover>
                    </div>
                    {/* Progress Bar */}
                    <div className="mb-4">
                        <Progress value={progress} color="green" />
                        <div className="text-center mt-2">
                            {currentIndex} de {problemList.length} problemas
                            completados
                        </div>
                    </div>

                    <div className="flex">
                        <div className="border p-4 rounded bg-gray-100  flex-1">
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

                        <div className="border p-4 rounded bg-gray-100 flex-1  ">
                            <button
                                onClick={executeCode}
                                className="bg-green-500 text-white px-4 py-2 rounded mb-2"
                            >
                                Ejecutar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default CodeEditor;
