"use client";

import React, { useEffect, useState } from "react";

import { useFirestore } from "../../firebase/useFirestore";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth";
import { useNavigation } from "@/app/utils/useNavigation";

import Loading from "../Loading";

import toast from "react-hot-toast";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { PencilIcon, UserPlusIcon } from "@heroicons/react/24/solid";
import {
    Card,
    CardHeader,
    Input,
    Typography,
    Button,
    CardBody,
    Chip,
    CardFooter,
    Tabs,
    TabsHeader,
    Tab,
    Avatar,
    IconButton,
    Tooltip,
} from "@material-tailwind/react";

const TABS = [
    {
        label: "Todos",
        value: "todos",
    },
    {
        label: "Candidatos",
        value: "candidatos",
    },
    {
        label: "Entrevistadores",
        value: "entrevistadores",
    },
];

const TABLE_HEAD = [
    "ID",
    "Nombre",
    "Apellido",
    "Email",
    "Rol",
    "Nivel",
    "Tiene pruebas asignadas",
    "",
];

const TABLE_ROWS = [];

function UserManagement() {
    const { authUser, isLoading } = useFirebaseAuth();
    const { handleNavigate } = useNavigation();
    const { fetchUser, fetchUsers } = useFirestore();

    const [user, setUser] = useState(null);
    const [listaUsuarios, setListaUsuarios] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            if (authUser) {
                try {
                    const user = await fetchUser(authUser.uid);
                    if (user) {
                        setUser(user);
                    }

                    if (user.rol === "admin") {
                        const usuarios = await fetchUsers();
                        setListaUsuarios(usuarios);
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
                                        Lista de Usuarios
                                    </Typography>
                                    <Typography
                                        color="gray"
                                        className="mt-1 font-normal"
                                    >
                                        Informacion acerca de todos los usuarios
                                    </Typography>
                                </div>
                                <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                                    <Button
                                        className="flex items-center gap-3"
                                        size="sm"
                                    >
                                        <UserPlusIcon
                                            strokeWidth={2}
                                            className="h-4 w-4"
                                        />{" "}
                                        Agregar Usuario
                                    </Button>
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                <Tabs value="todos" className="w-full md:w-max">
                                    <TabsHeader>
                                        {TABS.map(({ label, value }) => (
                                            <Tab key={value} value={value}>
                                                &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
                                <div className="w-full md:w-72">
                                    <Input
                                        label="Search"
                                        icon={
                                            <MagnifyingGlassIcon className="h-5 w-5" />
                                        }
                                    />
                                </div>
                            </div>
                        </CardHeader>
                        <CardBody className="overflow-scroll px-0">
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
                                                rol,
                                                nivel,
                                                tienePruebasAsignadas,
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
                                                <tr key={index}>
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
                                                        <div className="flex flex-col w-max">
                                                            <Chip
                                                                variant="ghost"
                                                                size="sm"
                                                                value={rol}
                                                                color={
                                                                    rol ===
                                                                    "admin"
                                                                        ? "blue"
                                                                        : rol ===
                                                                          "entrevistador"
                                                                        ? "green"
                                                                        : "blue-gray"
                                                                }
                                                            />
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
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {rol ==
                                                                "candidato"
                                                                    ? tienePruebasAsignadas ==
                                                                      "true"
                                                                        ? "Si"
                                                                        : "No"
                                                                    : "N/A"}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="flex flex-col">
                                                            <Tooltip content="Edit User">
                                                                <IconButton variant="text">
                                                                    <PencilIcon className="h-4 w-4" />
                                                                </IconButton>
                                                            </Tooltip>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        }
                                    )}
                                </tbody>
                            </table>
                        </CardBody>
                        <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                            <Typography
                                variant="small"
                                color="blue-gray"
                                className="font-normal"
                            >
                                Page 1 of 10
                            </Typography>
                            <div className="flex gap-2">
                                <Button variant="outlined" size="sm">
                                    Previous
                                </Button>
                                <Button variant="outlined" size="sm">
                                    Next
                                </Button>
                            </div>
                        </CardFooter>
                    </Card>
                </>
            )}
            ;
        </>
    );
}

export default UserManagement;
