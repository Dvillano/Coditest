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

function ProblemAssignModal(idUser, isAssignComplete) {
    const { fetchUser, fetchUserProgress } = useFirestore();

    const userId = idUser.idUser;
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    // Buscar los problemas que no esten asignados al usuario.

    const fetchUnassignedProblems = async () => {
        try {
            // Buscar al usuario por ID
            const user = await fetchUser(userId);
            const userLevel = user.nivel;

            //TODO traer problemas no asignados al usuario segunsu nivel
        } catch (error) {
            console.error("Error fetching non-assigned problems:", error);
            return [];
        }
    };

    return (
        <>
            <Button
                onClick={handleOpen}
                onClickCapture={fetchUnassignedProblems}
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
                            variant="h5"
                            color="blue-gray"
                            className="text-center"
                        >
                            Asignar Problemas
                        </Typography>
                        <Card className="w-full">
                            <List>
                                <ListItem>Inbox</ListItem>
                                <ListItem>Trash</ListItem>
                                <ListItem>Settings</ListItem>
                            </List>
                        </Card>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default ProblemAssignModal;
