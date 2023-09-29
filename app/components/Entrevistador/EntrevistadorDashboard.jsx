"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth";
import { useFirestore } from "../../firebase/useFirestore";
import { useNavigation } from "@/app/utils/useNavigation";

import Loading from "../UserInterface/Loading";
import toast from "react-hot-toast";

function EntrevistadorDashboard() {
    const { authUser, isLoading } = useFirebaseAuth();
    const { handleNavigate } = useNavigation();

    const { fetchUser } = useFirestore();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (authUser) {
                try {
                    const user = await fetchUser(authUser.uid);
                    if (user) {
                        setUser(user);
                    }

                    if (user.rol === "entrevistador") {
                        const usuarios = await fetchUsers();

                        // Guarda solo usuarios con el rol de candidatos
                        setListaUsuarios(
                            usuarios.filter((el) => el.rol === "candidato")
                        );
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
    return <h1>Dashboard</h1>;
}

export default EntrevistadorDashboard;
