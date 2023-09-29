"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../../firebase/useFirebaseAuth";
import { useFirestore } from "../../../firebase/useFirestore";
import { useNavigation } from "@/app/utils/useNavigation";

import Loading from "../../UserInterface/Loading";
import toast from "react-hot-toast";

import {
    Card,
    CardHeader,
    Typography,
    CardBody,
} from "@material-tailwind/react";

function CandidatoManagement() {
    const TABLE_HEAD = ["ID", "Nombre", "Apellido", "Email", "Nivel"];

    const { authUser, isLoading } = useFirebaseAuth();
    const { handleNavigate } = useNavigation();

    const { fetchUser, fetchUsers } = useFirestore();

    const [user, setUser] = useState(null);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (authUser) {
                try {
                    const user = await fetchUser(authUser.uid);
                    if (user) {
                        setUser(user);
                    }

                    if (user.rol === "entrevistador") {
                        const usuarios = await fetchUsers();

                        // Guarda solo usuarios con el rol de candidatos
                        setListaUsuarios(
                            usuarios.filter((el) => el.rol === "candidato")
                        );
                    } else {
                        toast.error("Acceso no autorizado");
                        handleNavigate("/");
                    }
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        };

        fetchData();
    }, [authUser]);

    const handleRowClick = (userId) => {
        setSelectedUserId(userId); //TODO Se actualiza el state por cada .map renderizado
    };

    if (isLoading || !authUser) {
        return <Loading />;
    }
    return (
        <>
            {listaUsuarios !== null && (
                <>
                    <Card className="h-full w-full">
                        <CardHeader
                            floated={false}
                            shadow={false}
                            className="rounded-none"
                        >
                            <div className="mb-8 flex items-center justify-between gap-8">
                                <div>
                                    <Typography variant="h5" color="blue-gray">
                                        Lista de Candidatos
                                    </Typography>
                                    <Typography
                                        color="gray"
                                        className="mt-1 font-normal"
                                    >
                                        Informacion acerca de todos los
                                        candidatos
                                    </Typography>
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="px-0">
                            <table className="mt-4 w-full min-w-max table-auto text-left">
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th
                                                key={head}
                                                className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {listaUsuarios.map(
                                        (
                                            {
                                                id,
                                                nombre,
                                                apellido,
                                                email,
                                                nivel,
                                            },
                                            index
                                        ) => {
                                            const isLast =
                                                index ===
                                                listaUsuarios.length - 1;
                                            const classes = isLast
                                                ? "p-4"
                                                : "p-4 border-b border-blue-gray-50";

                                            return (
                                                <tr
                                                    key={id}
                                                    onClick={() =>
                                                        handleRowClick(id)
                                                    }
                                                >
                                                    <td className={classes}>
                                                        <div className="flex items-center gap-3">
                                                            <div className="flex flex-col">
                                                                <Typography
                                                                    variant="small"
                                                                    color="blue-gray"
                                                                    className="font-normal"
                                                                >
                                                                    {id}
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {nombre}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {apellido}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {email}
                                                            </Typography>
                                                        </div>
                                                    </td>

                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {nivel == null
                                                                    ? "N/A"
                                                                    : nivel}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </CardBody>
                    </Card>
                </>
            )}
        </>
    );
}

export default CandidatoManagement;
