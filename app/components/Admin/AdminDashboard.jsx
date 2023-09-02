"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth";
import { useFirestore } from "../../firebase/useFirestore";
import Loading from "../Loading";

export default function AdminDashboard() {
    const { authUser, isLoading } = useFirebaseAuth();
    const { fetchUser } = useFirestore();

    const [user, setUser] = useState(null);

    useEffect(() => {
        const fetchUserFromFirestore = async () => {
            if (authUser) {
                try {
                    const user = await fetchUser(authUser.uid);
                    setUser(user);
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            }
        };

        fetchUserFromFirestore();
    }, [authUser]);

    if (isLoading || !authUser || !user) {
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
