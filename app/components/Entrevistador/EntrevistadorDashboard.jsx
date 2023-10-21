"use client";

import React, { useEffect, useState, PureComponent } from "react";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth";
import { useFirestore } from "../../firebase/useFirestore";
import { useNavigation } from "@/app/utils/useNavigation";

import Loading from "../UserInterface/Loading";
import toast from "react-hot-toast";

import { Card } from "@material-tailwind/react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import {
    BarChart,
    Bar,
    Rectangle,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
} from "recharts";

function EntrevistadorDashboard() {
    const { authUser, isLoading } = useFirebaseAuth();
    const { handleNavigate } = useNavigation();

    const {
        fetchUser,
        fetchUsers,
        fetchAllUsersProgress,
        fetchAllResults,
        fetchProblems,
    } = useFirestore();

    const [user, setUser] = useState(null);
    const [assignedProblemsCount, setAssignedProblemsCount] = useState(0);
    const [completedProblemsCount, setCompletedProblemsCount] = useState(0);
    const [totalPrincipiantes, setTotalPrincipiantes] = useState(0);
    const [totalIntermedios, setTotalIntermedios] = useState(0);
    const [totalAvanzados, setTotalAvanzados] = useState(0);
    const [dataResults, setDataResults] = useState([]);

    const dataAssignedProblems = [
        { name: "Problemas Asignados", value: assignedProblemsCount },
        { name: "Problemas Completados", value: completedProblemsCount },
    ];

    const dataUsersByLevel = [
        { name: "Principiante", cantidad: totalPrincipiantes },
        { name: "Intermedio", cantidad: totalIntermedios },
        { name: "Avanzado", cantidad: totalAvanzados },
    ];

    useEffect(() => {
        const fetchData = async () => {
            if (authUser) {
                try {
                    const user = await fetchUser(authUser.uid);
                    if (user) {
                        setUser(user);
                    }

                    if (user.rol === "entrevistador") {
                        // Traer la cuenta de problemas asignados vs completados

                        const userProgress = await fetchAllUsersProgress();
                        const problemsStatus = userProgress.map((problem) =>
                            problem.problemasAsignados.map((el) => el.status)
                        );

                        const problemStatusArray = problemsStatus.flat();
                        let cantidadProblemasAsignados =
                            problemStatusArray.filter(
                                (status) => status == "asignado"
                            );

                        let cantidadProblemasCompletados =
                            problemStatusArray.filter(
                                (status) => status == "completado"
                            );

                        setAssignedProblemsCount(
                            cantidadProblemasAsignados.length
                        );
                        setCompletedProblemsCount(
                            cantidadProblemasCompletados.length
                        );

                        const users = await fetchUsers();
                        let userCandidates = users.filter(
                            (user) => user.nivel != null
                        );

                        let totalPrincipiante = userCandidates.filter(
                            (user) => user.nivel == "principiante"
                        );

                        let totalIntermedio = userCandidates.filter(
                            (user) => user.nivel == "intermedio"
                        );

                        let totalAvanzado = userCandidates.filter(
                            (user) => user.nivel == "avanzado"
                        );

                        setTotalPrincipiantes(totalPrincipiante.length);
                        setTotalIntermedios(totalIntermedio.length);
                        setTotalAvanzados(totalAvanzado.length);

                        let results = await fetchAllResults();
                        let problems = await fetchProblems();

                        // Buscar nombre del problema usando el id en resultados
                        results = results.map((result) => {
                            const problem = problems.find(
                                (problem) => problem.id == result.problema_id
                            );
                            return {
                                ...result,
                                problema_nombre: problem
                                    ? problem.titulo
                                    : null,
                            };
                        });

                        // Filtro solo aquellos problemas que existan
                        results = results.filter(
                            (result) => result.problema_nombre != null
                        );

                        let contador = {};
                        results.forEach((result) => {
                            const problema = result.problema_nombre;
                            const resultado = result.resultado;

                            if (!contador[problema]) {
                                contador[problema] = { pasos: 0, fallas: 0 };
                            }

                            if (resultado == "paso") {
                                contador[problema].pasos++;
                            } else if (resultado == "fallo") {
                                contador[problema].fallas++;
                            }
                        });

                        let dataResults = [];
                        // Recorre las propiedades del objeto original
                        for (const nombreProblema in contador) {
                            const problema = contador[nombreProblema];

                            // Agrega una entrada para "pasos" al array dataResults
                            dataResults.push({
                                nombre: nombreProblema,
                                aprobado: problema.pasos,
                                fallado: problema.fallas,
                            });
                        }

                        setDataResults(dataResults);
                    } else {
                        toast.error("Acceso no autorizado");
                        handleNavigate("/");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [authUser]);

    if (isLoading || !authUser) {
        return <Loading />;
    }
    return (
        <>
            <div className="flex flex-wrap justify-center m-5 gap-5	">
                <Card className="w-6/12">
                    <div className="flex justify-center items-center p-4">
                        <h3 className="text-lg font-semibold">
                            Problemas asignados vs completados
                        </h3>
                    </div>
                    <ResponsiveContainer width="99%" height="100%" aspect={3}>
                        <PieChart>
                            <Pie
                                dataKey={"value"}
                                isAnimationActive={true}
                                data={dataAssignedProblems}
                                outerRadius={100}
                            >
                                {dataAssignedProblems.map((entry, index) => (
                                    <Cell
                                        key={index}
                                        fill={
                                            entry.name ===
                                            "Problemas Completados"
                                                ? "#87bc45"
                                                : "#ea5545"
                                        }
                                    />
                                ))}
                            </Pie>
                            <Legend />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </Card>
                <Card className=" w-5/12">
                    <div className="flex justify-center items-center p-4">
                        <h3 className="text-lg font-semibold">
                            Usuarios por nivel de experiencia
                        </h3>
                    </div>

                    <ResponsiveContainer width="99%" height="100%">
                        <BarChart data={dataUsersByLevel}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="cantidad" fill="#27aeef" />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
            <div className="grid  grid-flow-col grid-cols-1 ">
                <Card className="m-5 h-full w-90">
                    <div className="flex justify-center items-center p-4">
                        <h3 className="text-lg font-semibold">
                            Resultados por problema
                        </h3>
                    </div>

                    <ResponsiveContainer width="100%" height="80%">
                        <BarChart data={dataResults} className="w-full">
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="nombre" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar
                                dataKey="aprobado"
                                fill="#87bc45"
                                activeBar={
                                    <Rectangle fill="pink" stroke="blue" />
                                }
                            />
                            <Bar
                                dataKey="fallado"
                                fill="#ea5545"
                                activeBar={
                                    <Rectangle fill="gold" stroke="purple" />
                                }
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </Card>
            </div>
        </>
    );
}

export default EntrevistadorDashboard;
