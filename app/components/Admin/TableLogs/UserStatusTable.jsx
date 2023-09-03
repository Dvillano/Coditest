"use client";

import React from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { UserPlusIcon } from "@heroicons/react/24/solid";
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

function UserStatusTable({ userStatusLogs }) {
    const TABLE_HEAD = ["Email", "Status", "Ultima vez Online"];
    console.log(userStatusLogs);

    return (
        <div>
            <h2>User Status List</h2>
            <ul>
                {userStatusLogs.map((userStatus) => (
                    <li key={userStatus.email}>
                        <p>User Email: {userStatus.email}</p>
                        <p>Status: {userStatus.status}</p>
                        <p>Last Online: {userStatus.lastOnline}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default UserStatusTable;
