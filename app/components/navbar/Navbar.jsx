"use client";
import React, { useEffect } from "react";
import { useAuth } from "../../firebase/firebaseAuth";
import { useRouter } from "next/navigation";
const Navbar = () => {
    const router = useRouter();
    const { authUser, isLoading, signOut } = useAuth();

    useEffect(() => {
        if (!isLoading && !authUser) {
            router.push("/");
        }
    }, [isLoading, authUser]);

    return (
        <div className="bg-gray-700 py-4 px-6 flex justify-between items-center sticky top-0">
            <h1 className="text-2xl font-semibold text-white">Coditest</h1>
            {authUser && (
                <div className="flex items-center gap-4">
                    <p className="text-white">{authUser.email}</p>
                    <button
                        className="text-xl rounded-lg hover:text-gray-300 px-3 py-1 bg-gray-700 text-white"
                        onClick={() => {
                            signOut();
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};

export default Navbar;
