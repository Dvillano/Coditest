"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth";
import { useFirestore } from "../../firebase/useFirestore";
import { useNavigation } from "@/app/utils/useNavigation";
import { useUserStatus } from "@/app/firebase/useUserStatus";

import Loading from "../UserInterface/Loading";
import LogTable from "./TableLogs/LogTable";

import { Card, CardBody } from "@material-tailwind/react";
import toast from "react-hot-toast";
import UserStatusTable from "./TableLogs/UserStatusTable";

export default function AdminDashboard() {
    const { authUser, isLoading } = useFirebaseAuth();
    const { handleNavigate } = useNavigation();

    const {
        fetchUser,
        fetchUserActivityLogs,
        fetchTotalProblemsCount,
        fetchTotalUsersCount,
    } = useFirestore();

    const [user, setUser] = useState(null);
    const [userActivityLogs, setUserActivityLogs] = useState([]);
    const [totalProblems, setTotalProblems] = useState(null);
    const [totalUsers, setTotalUsers] = useState(null);
    const [totalOnlineUsers, setTotalOnlineUsers] = useState(0);

    const userStatuses = useUserStatus();

    useEffect(() => {
        const fetchData = async () => {
            if (authUser) {
                try {
                    const user = await fetchUser(authUser.uid);
                    if (user) {
                        setUser(user);
                    }

                    if (user.rol === "admin") {
                        // User has the admin role, fetch and display data
                        const logs = await fetchUserActivityLogs();
                        setUserActivityLogs(logs);

                        const problemsCount = await fetchTotalProblemsCount();
                        setTotalProblems(problemsCount);

                        const usersCount = await fetchTotalUsersCount();
                        setTotalUsers(usersCount);

                        console.log(userStatuses);
                        const onlineUsers = userStatuses.filter(
                            (userStatus) => userStatus.status == "online"
                        );
                        setTotalOnlineUsers(onlineUsers.length);
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
    }, [authUser, userStatuses]);

    if (isLoading || !authUser) {
        return <Loading />;
    }

    return (
        <>
            {userActivityLogs !== null &&
                totalProblems !== null &&
                totalUsers !== null && (
                    <>
                        <div className="grid gap-4 m-5 md:grid-cols-2  sm:grid-cols-1">
                            {/* User Activity Logs */}
                            <LogTable logs={userActivityLogs} />

                            {/* User Status Logs */}
                            <UserStatusTable userStatusLogs={userStatuses} />
                        </div>

                        <div class="grid grid-cols-1 gap-4 px-4 mt-8 sm:grid-cols-3 sm:px-8 mb-10">
                            <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow">
                                <div class="p-4 bg-green-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-12 w-12 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                                        ></path>
                                    </svg>
                                </div>
                                <div class="px-4 text-gray-700">
                                    <h3 class="text-sm tracking-wider">
                                        Cantidad total de usuarios
                                    </h3>
                                    <p class="text-3xl">{totalUsers}</p>
                                </div>
                            </div>
                            <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow">
                                <div class="p-4 bg-blue-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-12 w-12 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                                        ></path>
                                    </svg>
                                </div>
                                <div class="px-4 text-gray-700">
                                    <h3 class="text-sm tracking-wider">
                                        Cantidad total de problemas
                                    </h3>
                                    <p class="text-3xl">{totalProblems}</p>
                                </div>
                            </div>
                            <div class="flex items-center bg-white border rounded-sm overflow-hidden shadow">
                                <div class="p-4 bg-indigo-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        class="h-12 w-12 text-white"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            stroke-width="2"
                                            d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                                        ></path>
                                    </svg>
                                </div>
                                <div class="px-4 text-gray-700">
                                    <h3 class="text-sm tracking-wider">
                                        Cantidad de usuarios online
                                    </h3>
                                    <p class="text-3xl">{totalOnlineUsers}</p>
                                </div>
                            </div>
                        </div>
                    </>
                )}
        </>
    );
}
