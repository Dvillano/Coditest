//  Componente que se encarga de la gestión de problemas de programación

"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../../firebase/useFirebaseAuth";
import { useFirestore } from "../../../firebase/useFirestore";
import { useNavigation } from "@/app/utils/useNavigation";

import Loading from "../../UserInterface/Loading";
import ProblemCard from "./ProblemCard";
import toast from "react-hot-toast";

import {
    Button,
    Tabs,
    TabsHeader,
    Tab,
    Typography,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";

function ProblemManagement() {
    const TABS = [
        {
            label: "Todos",
            value: "todos",
        },
        {
            label: "Principiante",
            value: "principiante",
        },
        {
            label: "Intermedio",
            value: "intermedio",
        },
        {
            label: "Avanzado",
            value: "avanzado",
        },
    ];

    const { authUser, isLoading } = useFirebaseAuth();
    const { handleNavigate } = useNavigation();
    const { fetchUser, fetchProblems } = useFirestore();

    const [user, setUser] = useState(null);
    const [listaProblemas, setListaProblemas] = useState([]);
    const [isDeleteComplete, setIsDeleteComplete] = useState(false);
    const [selectedTab, setSelectedTab] = useState("todos");

    const handleTabChange = (tabValue) => {
        setSelectedTab(tabValue);
    };

    const filterUsersByTab = (problems, tabValue) => {
        if (tabValue === "todos") {
            return problems;
        }
        return problems.filter((problems) => problems.nivel === tabValue);
    };

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

                    if (user.rol === "admin") {
                        const problemas = await fetchProblems();
                        setListaProblemas(problemas);
                        setIsDeleteComplete(false);
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
    }, [authUser, isDeleteComplete]);

    if (isLoading || !authUser) {
        return <Loading />;
    }

    const filteredProblems = filterUsersByTab(listaProblemas, selectedTab);

    return (
        <>
            {filteredProblems !== null && (
                <>
                    <div className="flex flex-col m-14 ">
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Lista de problemas
                                </Typography>
                                <Typography
                                    color="gray"
                                    className="mt-1 font-normal"
                                >
                                    Informacion de todos los problemas de
                                    programacion
                                </Typography>
                            </div>
                        </div>

                        <div className="flex justify-between">
                            <div className="sm:flex-row">
                                <Button
                                    className="flex items-center gap-3 mb-0"
                                    variant="gradient"
                                    size="md"
                                    color="green"
                                    onClick={() =>
                                        handleNavigate("admin/problems/create")
                                    }
                                >
                                    <PlusIcon
                                        strokeWidth={2}
                                        className="h-4 w-4"
                                    />{" "}
                                    Agregar problema
                                </Button>
                            </div>
                            <div className="gap-4 md:flex-row">
                                <Tabs
                                    value={selectedTab}
                                    className="w-full md:w-max "
                                >
                                    <TabsHeader className=" bg-gray-400">
                                        {TABS.map(({ label, value }) => (
                                            <Tab
                                                key={label}
                                                value={value}
                                                onClick={() =>
                                                    handleTabChange(value)
                                                }
                                            >
                                                &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3 m-10">
                        {filteredProblems.map((problem) => (
                            <ProblemCard
                                key={problem.id}
                                problem={problem}
                                isDeleteComplete={setIsDeleteComplete}
                            />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

export default ProblemManagement;
