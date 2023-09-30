"use client";

import React from "react";

import { useFirestore } from "@/app/firebase/useFirestore";

import { useState } from "react";
import {
    Button,
    Dialog,
    Tooltip,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";

import toast from "react-hot-toast";

function ProblemAssignModal(idUser, isAssignComplete) {
    console.log(idUser);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);
    return (
        <>
            <Button onClick={handleOpen} color="blue">
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
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default ProblemAssignModal;
