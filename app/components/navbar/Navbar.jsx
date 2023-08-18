"use client";
import Link from "next/link";
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
        <>
            <div className="bg-slate-600 flex justify-around items-center gap-9 p-5 text-3xl sticky top-0 ">
                <h1 className="text-3xl text-white font-semibold flex justify-center items-center gap-4">
                    Coditest
                </h1>

                {authUser && (
                    <button
                        className="font-Pacifico text-xl rounded-lg hover:text-white w-auto p-2 bg-[#7b9194]"
                        onClick={() => {
                            signOut();
                        }}
                    >
                        Logout
                    </button>
                )}
            </div>
        </>
    );
};

export default Navbar;
