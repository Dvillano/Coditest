"use client";
import React from "react";
import { Button } from "@material-tailwind/react";
import { ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useRouter } from "next/navigation";

function NoAssignedProblemsComponent() {
    const router = useRouter();
    const handleRefresh = () => {
        router.refresh();
    };
    return (
        <div className="flex flex-col items-center justify-center h-screen">
            <div className="max-w-md p-4 mx-auto bg-white rounded-lg shadow-lg">
                <img
                    className="object-contain h-48 w-96"
                    src="https://media.istockphoto.com/id/1178429224/vector/red-cross-on-white-background-isolated-vector-illustration-circle-shape-no-button-negative.jpg?s=612x612&w=0&k=20&c=DOtEZDSLR7wze3xYin-oBjJPSSmLm7JvnvQhS1T7-U8="
                />
                <h2 className="text-2xl font-semibold text-center text-gray-800">
                    No tienes pruebas asignadas en este momento
                </h2>
                <p className="mt-4 text-gray-600">
                    Por favor, espera a que se te asignen pruebas por parte del
                    analista de recursos humanos.
                </p>
                <div className="mt-6 flex justify-center">
                    <Button
                        className="flex"
                        color="green"
                        size="md"
                        onClick={handleRefresh}
                    >
                        <ArrowPathIcon className="h-4 w-4 mr-2" />
                        Actualizar
                    </Button>
                </div>
            </div>
        </div>
    );
}

export default NoAssignedProblemsComponent;
