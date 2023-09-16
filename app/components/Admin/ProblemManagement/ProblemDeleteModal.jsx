"use client";
import React from "react";

import { useFirestore } from "@/app/firebase/useFirestore";
import toast from "react-hot-toast";

import { useState } from "react";
import {
    Button,
    Dialog,
    DialogBody,
    DialogHeader,
    DialogFooter,
    IconButton,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";

function ProblemDeleteModal({ idProblem, isDeleteComplete }) {
    const { deleteDocument } = useFirestore();

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const handleDeleteProblem = async (e) => {
        try {
            await deleteDocument("problemas", idProblem);

            setOpen(false);
            toast.success("Se elimino el problema correctamente");
            isDeleteComplete(true);
        } catch (error) {
            toast.error("No se pudo borrar el problema");
            console.error("Error al eliminar problema:", error);
        }
    };

    return (
        <>
            <Button
                className="flex items-center gap-3"
                variant="gradient"
                size="sm"
                color="red"
                onClick={handleOpen}
            >
                Eliminar
            </Button>

            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Confirmacion</DialogHeader>
                <DialogBody divider>
                    ¿Seguro que desea eliminar los datos del problema?
                </DialogBody>
                <DialogFooter>
                    <Button
                        variant="text"
                        color="red"
                        onClick={handleOpen}
                        className="mr-1"
                    >
                        <span>Cancelar</span>
                    </Button>
                    <Button
                        variant="gradient"
                        color="green"
                        onClick={(e) => handleDeleteProblem(e)}
                    >
                        <span>Confirmar</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default ProblemDeleteModal;
