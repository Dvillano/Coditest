"use client";

import React from "react";

import { useFirestore } from "@/app/firebase/useFirestore";

import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    Typography,
    List,
    ListItem,
    Card,
    Checkbox,
} from "@material-tailwind/react";
import { PlusIcon } from "@heroicons/react/24/solid";

import toast from "react-hot-toast";
import { update } from "firebase/database";

function ProblemAssignModal({ selectedRow, isAssignComplete }) {
    const { fetchUnassignedProblems, updateAssignedProblem } = useFirestore();

    const [listaProblemasSinAsignar, setListaProblemasSinAsignar] = useState(
        []
    );
    const [selectedProblems, setSelectedProblems] = useState([]);

    const userId = selectedRow;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    // Buscar los problemas que no esten asignados al usuario.
    const handleFetch = async (userId) => {
        let lista = await fetchUnassignedProblems(userId);
        setListaProblemasSinAsignar(lista);
    };

    const handleProblemSelection = (problema) => {
        const problemId = problema.id;
        setSelectedProblems((prevSelectedProblems) => {
            if (prevSelectedProblems.includes(problemId)) {
                // Remove the problem ID if it's already selected
                return prevSelectedProblems.filter((id) => id !== problemId);
            } else {
                // Add the problem ID if it's not selected
                return [...prevSelectedProblems, problemId];
            }
        });
    };

    const handleSave = async () => {
        try {
            const problemasAsignados = selectedProblems.map((problemId) => ({
                completionTimestamp: "",
                problemId: problemId,
                status: "asignado",
            }));

            await updateAssignedProblem("progresoUsuario", userId, problemasAsignados);

            isAssignComplete(true);
            setOpen(false);

            if (selectedProblems.length > 0) {
                toast.success("Problemas asignados con éxito.");
            }
        } catch (error) {
            toast.error("No se pudieron asignar los problemas.");
            console.error("Error al asignar problemas:", error);
        }
    };

    return (
        <>
            <Button
                variant="gradient"
                className="w-full"
                onClick={handleOpen}
                onClickCapture={() => handleFetch(userId)}
                color="blue"
            >
                Asignar problemas
            </Button>

            <Dialog
                size="md"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <div className="flex  items-center justify-center ">
                    <div className=" p-6 bg-white rounded-md shadow-md lg:max-w-xl">
                        <Typography
                            variant="h2"
                            color="blue-gray"
                            className="text-center mb-5"
                        >
                            Asignar Problemas
                        </Typography>
                        <Card className="w-full">
                            {listaProblemasSinAsignar.length > 0 ? (
                                <List>
                                    {listaProblemasSinAsignar.map(
                                        (problema) => (
                                            <ListItem
                                                key={problema.id}
                                                className="flex justify-between items-center"
                                            >
                                                <label className="flex items-center">
                                                    <Checkbox
                                                        onChange={() =>
                                                            handleProblemSelection(
                                                                problema
                                                            )
                                                        }
                                                        checked={selectedProblems.includes(
                                                            problema.id
                                                        )}
                                                    />
                                                    {problema.titulo}
                                                </label>
                                            </ListItem>
                                        )
                                    )}
                                    <Button
                                        onClick={handleSave}
                                        variant="gradient"
                                    >
                                        Asignar
                                    </Button>
                                </List>
                            ) : (
                                <Typography
                                    variant="paragraph"
                                    color="red"
                                    className="text-center mt-5"
                                >
                                    No tiene problemas disponibles para asignar.
                                </Typography>
                            )}
                        </Card>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default ProblemAssignModal;
