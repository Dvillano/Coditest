"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../../firebase/useFirebaseAuth";
import { useFirestore } from "../../../firebase/useFirestore";
import { useNavigation } from "@/app/utils/useNavigation";

import Loading from "../../Loading";
import toast from "react-hot-toast";

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
                        console.log(listaProblemas);
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
                    <h1>test</h1>
                </>
            )}
        </>
    );
}

export default ProblemManagement;
