"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth";
import { useFirestore } from "../../firebase/useFirestore";

import { Button } from "@material-tailwind/react";
import { CodeBracketSquareIcon } from "@heroicons/react/24/solid";

import { useNavigation } from "../../utils/useNavigation";

const Navbar = () => {
    const { handleNavigate } = useNavigation();
    const { authUser, isLoading, signOutFirebase } = useFirebaseAuth();
    const { fetchUser } = useFirestore();

    const [user, setUser] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [isEntrevistador, setIsEntrevistador] = useState(false);

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

    useEffect(() => {
        if (user) {
            const userRole = user.rol;
            setIsAdmin(userRole === "admin");
            setIsEntrevistador(userRole === "entrevistador");
        }
    }, [user]);

    useEffect(() => {
        if (!isLoading && !authUser) {
            handleNavigate("/");
        }
    }, [isLoading, authUser, handleNavigate]);

    return (
        <div className="bg-gray-900 z-50 py-4 px-6 flex justify-between items-center sticky top-0">
            <h1 className="text-2xl font-semibold text-white">
                <a
                    onClick={() => handleNavigate("/")}
                    className="text-white cursor-pointer flex"
                >
                    CodiTest
                    <CodeBracketSquareIcon className="h-8 w-8" />
                </a>
            </h1>
            {authUser && (
                <div className="flex items-center gap-4">
                    <p className="text-white">{authUser.email}</p>
                    {isAdmin && (
                        <>
                            <a
                                onClick={() => handleNavigate("admin/users")}
                                className="text-white cursor-pointer"
                            >
                                Usuarios
                            </a>
                            <a
                                onClick={() => handleNavigate("admin/problems")}
                                className="text-white cursor-pointer"
                            >
                                Problemas
                            </a>
                        </>
                    )}
                    {isEntrevistador && (
                        <>
                            <a
                                onClick={() =>
                                    handleNavigate("entrevistador/candidatos")
                                }
                                className="text-white cursor-pointer"
                            >
                                Asignar problemas
                            </a>
                        </>
                    )}
                    <Button
                        color="white"
                        onClick={() => {
                            signOutFirebase();
                        }}
                    >
                        Logout
                    </Button>
                </div>
            )}
        </div>
    );
};

export default Navbar;
