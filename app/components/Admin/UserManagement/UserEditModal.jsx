"use client";
import React from "react";

import { useFirestore } from "@/app/firebase/useFirestore";

import { useState } from "react";
import { Button, Dialog, Tooltip, IconButton } from "@material-tailwind/react";
import { PencilIcon } from "@heroicons/react/24/solid";

import toast from "react-hot-toast";

function UserEditModal({ idUser, isEditComplete }) {
    const initialFormData = {
        rol: "candidato",
        nivel: "principiante",
    };

    const { editDocument } = useFirestore();

    const [formData, setFormData] = useState(initialFormData);
    const [open, setOpen] = useState(false);

    const handleOpen = () => setOpen(!open);

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleEditUser = async (e) => {
        e.preventDefault();
        try {
            if (formData.rol && formData.nivel) {
                formData.rol == "admin" || formData.rol == "entrevistador"
                    ? (formData.nivel = null)
                    : formData.nivel;

                await editDocument("usuarios", idUser, formData);
                setOpen(false);
                toast.success("Cambios guardados!");
                isEditComplete(true);
            }
        } catch (error) {
            toast.error("No se pudo guardar cambios");
            console.error("Error al guardar cambios:", error);
        }
    };
    return (
        <>
            <Tooltip content="Editar usuario">
                <IconButton variant="text" onClick={handleOpen}>
                    <PencilIcon className="h-4 w-4" />
                </IconButton>
            </Tooltip>
            <Dialog
                size="md"
                open={open}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <div className="relative flex flex-col items-center justify-center  overflow-hidden">
                    <div className="w-full p-6 bg-white rounded-md shadow-md lg:max-w-xl">
                        <form className="mt-6">
                            <div className="mb-4">
                                <label
                                    className="block text-sm font-semibold text-gray-800"
                                    htmlFor="rol"
                                >
                                    Rol
                                </label>
                                <select
                                    id="rol"
                                    name="rol"
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    value={formData.rol}
                                    onChange={handleInputChange}
                                >
                                    <option value="candidato">Candidato</option>
                                    <option value="entrevistador">
                                        Entrevistador
                                    </option>
                                    <option value="admin">Admin</option>
                                </select>
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-sm font-semibold text-gray-800"
                                    htmlFor="nivel"
                                >
                                    Nivel de Experiencia
                                </label>
                                <select
                                    id="nivel"
                                    name="nivel"
                                    className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border rounded-md focus:border-gray-400 focus:ring-gray-300 focus:outline-none focus:ring focus:ring-opacity-40"
                                    value={formData.nivel}
                                    onChange={handleInputChange}
                                >
                                    {formData.rol == "candidato" ? (
                                        <>
                                            <option value="principiante">
                                                Principiante
                                            </option>
                                            <option value="intermedio">
                                                Intermedio
                                            </option>
                                            <option value="avanzado">
                                                Avanzado
                                            </option>
                                        </>
                                    ) : (
                                        <option value="null">N/A</option>
                                    )}
                                </select>
                            </div>

                            <Button
                                type="submit"
                                fullWidth
                                onClick={(e) => handleEditUser(e)}
                            >
                                Guardar cambios
                            </Button>
                        </form>
                    </div>
                </div>
            </Dialog>
        </>
    );
}

export default UserEditModal;
