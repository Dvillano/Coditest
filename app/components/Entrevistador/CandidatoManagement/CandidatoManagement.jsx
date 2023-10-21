"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../../firebase/useFirebaseAuth";
import { useFirestore } from "../../../firebase/useFirestore";
import { useNavigation } from "@/app/utils/useNavigation";

import Loading from "../../UserInterface/Loading";
import toast from "react-hot-toast";
import ProblemAssignModal from "./ProblemAssignModal";

import {
    Card,
    CardHeader,
    Typography,
    CardBody,
    Input,
} from "@material-tailwind/react";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

function CandidatoManagement() {
    const TABLE_HEAD = [
        "ID",
        "Nombre",
        "Apellido",
        "Email",
        "Nivel",
        "Problemas Asignados",
        "",
    ];

    const { authUser, isLoading } = useFirebaseAuth();
    const { handleNavigate } = useNavigation();

    const { fetchUser, fetchUsers, fetchUserProgress, fetchAssignedProblems } =
        useFirestore();

    const [user, setUser] = useState(null);
    const [listaCandidatos, setListaCandidatos] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isAssignComplete, setIsAssignComplete] = useState(false);

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
    };

    const filterUsersBySearch = (query) => {
        return listaCandidatos.filter(
            (user) =>
                user.nombre.toLowerCase().includes(query) ||
                user.apellido.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
    };

    // Filter users based on search query
    const filteredUsersBySearch = filterUsersBySearch(searchQuery);

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
                        const candidatos = usuarios.filter(
                            (el) => el.rol === "candidato"
                        );

                        // Fetch assigned problems for each candidate
                        const updatedCandidatos = await Promise.all(
                            candidatos.map(async (candidato) => {
                                const problemasAsignados =
                                    await fetchAssignedProblems(candidato.id);
                                return {
                                    ...candidato,
                                    problemasAsignados,
                                };
                            })
                        );
                        setIsAssignComplete(false);
                        setListaCandidatos(updatedCandidatos);
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
    }, [authUser, isAssignComplete]);

    if (isLoading || !authUser) {
        return <Loading />;
    }
    return (
        <>
            {listaCandidatos !== null && (
                <>
                    <Card className="m-5">
                        <CardHeader
                            floated={false}
                            shadow={false}
                            className="rounded-none"
                        >
                            <div className="mb-8 flex items-center justify-between ">
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
                            <div className="w-full md:w-72">
                                <Input
                                    label="Buscar"
                                    icon={
                                        <MagnifyingGlassIcon className="h-5 w-5" />
                                    }
                                    value={searchQuery}
                                    onChange={handleSearch}
                                />
                            </div>
                        </CardHeader>
                        <CardBody className="px-0">
                            <table className="w-full table-auto text-center">
                                <thead>
                                    <tr>
                                        {TABLE_HEAD.map((head) => (
                                            <th
                                                key={head}
                                                className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-2 text-center"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-bold leading-none opacity-70"
                                                >
                                                    {head}
                                                </Typography>
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsersBySearch.map(
                                        (
                                            {
                                                id,
                                                nombre,
                                                apellido,
                                                email,
                                                nivel,
                                                problemasAsignados,
                                            },

                                            index
                                        ) => {
                                            const isLast =
                                                index ===
                                                filteredUsersBySearch.length -
                                                    1;
                                            const classes = isLast
                                                ? "p-2"
                                                : "p-2 border-b border-blue-gray-50";

                                            return (
                                                <tr key={id}>
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
                                                    <td className={classes}>
                                                        {/* Problemas Asignados */}
                                                        <div className="flex flex-col">
                                                            {problemasAsignados.length >
                                                            0 ? (
                                                                problemasAsignados.map(
                                                                    (
                                                                        problem
                                                                    ) => (
                                                                        <Typography
                                                                            key={
                                                                                problem.id
                                                                            }
                                                                            variant="small"
                                                                            color="blue"
                                                                            className="font-normal"
                                                                        >
                                                                            {
                                                                                problem.titulo
                                                                            }
                                                                        </Typography>
                                                                    )
                                                                )
                                                            ) : (
                                                                <Typography
                                                                    variant="small"
                                                                    color="red"
                                                                    className="font-normal"
                                                                >
                                                                    El candidato
                                                                    no tiene
                                                                    problemas
                                                                    asignados
                                                                </Typography>
                                                            )}
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        {/* Botones de Asignar y Remover Problemas */}
                                                        <div className="flex items-center space-x-2">
                                                            <ProblemAssignModal
                                                                selectedRow={id}
                                                                isAssignComplete={
                                                                    setIsAssignComplete
                                                                }
                                                            />
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
