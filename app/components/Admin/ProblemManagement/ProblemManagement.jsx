"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../../firebase/useFirebaseAuth";
import { useFirestore } from "../../../firebase/useFirestore";
import { useNavigation } from "@/app/utils/useNavigation";

import Loading from "../../Loading";
import ProblemCard from "./ProblemCard";
import toast from "react-hot-toast";

import { Button } from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/outline";

function ProblemManagement() {
    const { authUser, isLoading } = useFirebaseAuth();
    const { handleNavigate } = useNavigation();
    const { fetchUser, fetchProblems } = useFirestore();

    const [user, setUser] = useState(null);
    const [listaProblemas, setListaProblemas] = useState([]);

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
            {listaProblemas !== null && (
                <>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row m-5">
                        <Button
                            className="flex items-center gap-3"
                            variant="gradient"
                            size="sm"
                        >
                            <PlusIcon strokeWidth={2} className="h-4 w-4" />{" "}
                            Agregar problema
                        </Button>
                    </div>
                    <div className="grid grid-cols-1  md:grid-cols-2 lg:grid-cols-3">
                        {listaProblemas.map((problem) => (
                            <ProblemCard
                                key={problem.problema_id}
                                problem={problem}
                            />
                        ))}
                    </div>
                </>
            )}
        </>
    );
}

export default ProblemManagement;
