"use client";

import React, { useEffect, useState } from "react";
import { useFirebaseAuth } from "../../firebase/useFirebaseAuth";
import { useFirestore } from "../../firebase/useFirestore";
import { useNavigation } from "@/app/utils/useNavigation";
import { useRealtimeDb } from "../../firebase/useFirebaseRealtimeDb";

import Loading from "../Loading";
import LogTable from "./TableLogs/LogTable";
import ErrorPage from "../ErrorPage";

import { Card, CardBody, Typography } from "@material-tailwind/react";
import toast from "react-hot-toast";

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

    const { data: userStatus, isLoading: isUserStatusLoading } =
        useRealtimeDb("/userStatus"); // Adjust the path to your user status data

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

    console.log("User Online Status:", userStatus);

    return (
        <>
            {userActivityLogs !== null &&
                totalProblems !== null &&
                totalUsers !== null && (
                    <>
                        {/* User Activity Logs */}
                        <LogTable logs={userActivityLogs} />

                        {/* Total Problems */}
                        <Card>
                            <CardBody>
                                <h3 className="text-lg font-semibold mb-4">
                                    Total Problems
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
                                    Total Users
                                </h3>
                                <p className="text-3xl font-bold">
                                    {totalUsers}
                                </p>
                            </CardBody>
                        </Card>
                    </>
                )}
        </>
    );
}
