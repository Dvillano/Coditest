"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth";
import { useFirestore } from "../../firebase/useFirestore";
import { useNavigation } from "@/app/utils/useNavigation";
import { useUserStatus } from "@/app/firebase/useUserStatus";

import Loading from "../Loading";
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
            {userActivityLogs !== null &&
                totalProblems !== null &&
                totalUsers !== null && (
                    <>
                        {/* User Activity Logs */}
                        <LogTable logs={userActivityLogs} />

                        {/* User Status Logs */}
                        <UserStatusTable userStatusLogs={userStatuses} />

                        {/* Total Problems */}
                        <div className="flex">
                            <Card>
                                <CardBody>
                                    <h3 className="text-lg font-semibold mb-4">
                                        Cantidad de problemas
                                    </h3>
                                    <p className="text-3xl font-bold">
                                        {totalProblems}
                                    </p>
                                </CardBody>
                            </Card>
                            {/* Total Users */}
                            <Card>
                                <CardBody>
                                    <h3 className="text-lg font-semibold mb-4">
                                        Cantidad de usuarios
                                    </h3>
                                    <p className="text-3xl font-bold">
                                        {totalUsers}
                                    </p>
                                </CardBody>
                            </Card>
                        </div>
                    </>
                )}
        </>
    );
}
