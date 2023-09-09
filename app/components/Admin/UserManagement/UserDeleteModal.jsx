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
    Tooltip,
    IconButton,
} from "@material-tailwind/react";
import { TrashIcon } from "@heroicons/react/24/solid";

function UserDeleteModal({ idUser, isDeleteComplete }) {
    const { deleteDocument } = useFirestore();

    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const handleDeleteUser = async (e) => {
        try {
            deleteDocument("usuarios", idUser);

            auth.setOpen(false);
            toast.success("Se eliminaron los datos correctamente");
            isDeleteComplete(true);
        } catch (error) {
            toast.error("No se pudo guardar cambios");
            console.error("Error al eliminar usuario:", error);
        }
    };

    return (
        <>
            <Tooltip content="Borrar usuario">
                <IconButton variant="text">
                    <TrashIcon
                        className="h-4 w-4"
                        color="red"
                        onClick={handleOpen}
                    />
                </IconButton>
            </Tooltip>
            <Dialog open={open} handler={handleOpen}>
                <DialogHeader>Confirmacion</DialogHeader>
                <DialogBody divider>
                    ¿Seguro que desea eliminar los datos del usuario?
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
                        onClick={(e) => handleDeleteUser(e)}
                    >
                        <span>Confirmar</span>
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export default UserDeleteModal;
