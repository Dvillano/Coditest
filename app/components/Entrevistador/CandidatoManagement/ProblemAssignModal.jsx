"use client";

import React from "react";

import { useFirestore } from "@/app/firebase/useFirestore";

import { useState, useEffect } from "react";
import {
    Button,
    Dialog,
    IconButton,
    Typography,
    List,
    ListItem,
    Card,
} from "@material-tailwind/react";

import toast from "react-hot-toast";

function ProblemAssignModal({ selectedRow, isAssignComplete }) {
    const { fetchUnassignedProblems } = useFirestore();

    const [listaProblemasSinAsignar, setListaProblemasSinAsignar] = useState(
        []
    );

    const userId = selectedRow;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    // Buscar los problemas que no esten asignados al usuario.
    const handleFetch = async (userId) => {
        let lista = await fetchUnassignedProblems(userId);
        setListaProblemasSinAsignar(lista);
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                onClickCapture={() => handleFetch(userId)}
                color="blue"
            >
                Asignar
            </Button>

            <Dialog
                size="md"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
                    <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
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
                                            <ListItem key={problema.id}>
                                                {problema.titulo}
                                            </ListItem>
                                        )
                                    )}
                                </List>
                            ) : (
                                <Typography
                                    variant="body"
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
