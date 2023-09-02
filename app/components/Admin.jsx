"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../firebase/useFirebaseAuth";
import { useFirestore } from "../firebase/useFirestore";
import Loading from "./Loading";

export default function Admin() {
    const { authUser, isLoading } = useFirebaseAuth();
    const { fetchUser } = useFirestore();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            if (authUser) {
                try {
                    const user = await fetchUser(authUser.uid);
                    setUser(user);
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            }
        };

        fetchUsers();
    }, [authUser]);

    if (isLoading || !user) {
        return <Loading />;
    }

    return (
        <>
            {user && user.rol != "admin" ? (
                <h1>No tiene permisos</h1>
            ) : (
                <h1>Pagina de admin</h1>
            )}
        </>
    );
}
