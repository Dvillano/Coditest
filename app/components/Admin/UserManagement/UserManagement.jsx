// Componente de IU que permite a los administradores de la aplicación ver y gestionar usuarios de diferentes roles. Proporciona opciones de filtrado y búsqueda, así como acciones de edición y eliminación.
"use client";

import React, { useEffect, useState } from "react";
import { useFirestore } from "../../../firebase/useFirestore";
import { useFirebaseAuth } from "../../../firebase/useFirebaseAuth";
import { useNavigation } from "@/app/utils/useNavigation";
import Loading from "../../UserInterface/Loading";
import toast from "react-hot-toast";
import UserEditModal from "./UserEditModal";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import {
    Card,
    CardHeader,
    Input,
    Typography,
    CardBody,
    Chip,
    Tabs,
    TabsHeader,
    Tab,
} from "@material-tailwind/react";

function UserManagement() {
    const TABLE_HEAD = [
        "ID",
        "Nombre",
        "Apellido",
        "Email",
        "Rol",
        "Nivel",
        "",
    ];

    const TABS = [
        {
            label: "Todos",
            value: "todos",
        },
        {
            label: "Candidatos",
            value: "candidato",
        },
        {
            label: "Entrevistadores",
            value: "entrevistador",
        },
        {
            label: "Admins",
            value: "admin",
        },
    ];

    const { authUser, isLoading } = useFirebaseAuth();
    const { handleNavigate } = useNavigation();
    const { fetchUser, fetchUsers } = useFirestore();

    const [user, setUser] = useState(null);
    const [listaUsuarios, setListaUsuarios] = useState([]);
    const [selectedTab, setSelectedTab] = useState("todos");
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [isEditComplete, setIsEditComplete] = useState(false);

    const handleRowClick = (userId) => {
        setSelectedUserId(userId);
    };

    const handleSearch = (event) => {
        const query = event.target.value.toLowerCase();
        setSearchQuery(query);
    };

    const handleTabChange = (tabValue) => {
        setSelectedTab(tabValue);
    };

    const filterUsersByTab = (users, tabValue) => {
        if (tabValue === "todos") {
            return users;
        }
        return users.filter((user) => user.rol === tabValue);
    };

    const filterUsersBySearch = (users, query) => {
        return users.filter(
            (user) =>
                user.nombre.toLowerCase().includes(query) ||
                user.apellido.toLowerCase().includes(query) ||
                user.email.toLowerCase().includes(query)
        );
    };

    useEffect(() => {
        const fetchData = async () => {
            if (authUser) {
                try {
                    const user = await fetchUser(authUser.uid);
                    if (!user) {
                        toast.error("Acceso no autorizado");
                        handleNavigate("/");
                        return;
                    }
                    setUser(user);

                    if (user.rol === "admin") {
                        const usuarios = await fetchUsers();
                        setListaUsuarios(usuarios);
                        setIsEditComplete(false);
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
    }, [authUser, isEditComplete]);

    if (isLoading || !authUser) {
        return <Loading />;
    }

    // Filter users based on selected tab and search query
    const filteredUsersByTab = filterUsersByTab(listaUsuarios, selectedTab);
    const filteredUsersBySearch = filterUsersBySearch(
        filteredUsersByTab,
        searchQuery
    );

    return (
        <>
            {listaUsuarios !== null && (
                <>
                    <Card className="m-5">
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
                            </div>
                            <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                                <Tabs
                                    value={selectedTab}
                                    className="w-full md:w-max "
                                >
                                    <TabsHeader>
                                        {TABS.map(({ label, value }) => (
                                            <Tab
                                                key={label}
                                                value={value}
                                                onClick={() =>
                                                    handleTabChange(value)
                                                }
                                            >
                                                &nbsp;&nbsp;{label}&nbsp;&nbsp;
                                            </Tab>
                                        ))}
                                    </TabsHeader>
                                </Tabs>
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
                            </div>
                        </CardHeader>
                        <CardBody className="px-0">
                            <table className="mt-4 w-full  table-auto text-left">
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
                                                rol,
                                                nivel,
                                            },
                                            index
                                        ) => {
                                            const isLast =
                                                index ===
                                                filteredUsersBySearch.length -
                                                    1;
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
                                                            <UserEditModal
                                                                idUser={
                                                                    selectedUserId
                                                                }
                                                                isEditComplete={
                                                                    setIsEditComplete
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
            ;
        </>
    );
}

export default UserManagement;
