"use client";

import React, { useState } from "react";

import { Typography, Chip, Card } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button, IconButton } from "@material-tailwind/react";

function UserStatusTable({ userStatusLogs }) {
    const TABLE_HEAD = ["Email", "Status", "Ultima vez Online"];

    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 5;

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = userStatusLogs.slice(indexOfFirstLog, indexOfLastLog);

    const next = () => {
        if (currentPage < Math.ceil(userStatusLogs.length / logsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prev = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const getPageNumbers = () => {
        const pageNumbers = [];
        for (
            let i = 1;
            i <= Math.ceil(userStatusLogs.length / logsPerPage);
            i++
        ) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div>
            <Card>
                <div className="flex justify-center items-center p-4">
                    <h3 className="text-lg font-semibold">Usuarios online</h3>
                </div>
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            {TABLE_HEAD.map((head) => (
                                <th
                                    key={head}
                                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70 flex items-center"
                                    >
                                        {head}
                                    </Typography>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {currentLogs.map((userStatusLog, index) => {
                            const isLast = index === currentLogs.length - 1;
                            const classes = isLast
                                ? "p-4"
                                : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={index}>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {userStatusLog.email}
                                        </Typography>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal opacity-70"
                                        >
                                            {userStatusLog.email}
                                        </Typography>
                                    </td>

                                    <td className={classes}>
                                        <div className="w-max">
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value={userStatusLog.status}
                                                color={
                                                    userStatusLog.status ==
                                                    "online"
                                                        ? "green"
                                                        : "blue-gray"
                                                }
                                            />
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {userStatusLog.lastOnline}
                                        </Typography>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </Card>
            <div className="flex items-center justify-center gap-4">
                <Button
                    variant="text"
                    className="flex items-center gap-2"
                    onClick={prev}
                    disabled={currentPage === 1}
                >
                    <ArrowLeftIcon strokeWidth={2} className="h-4 w-4" />{" "}
                    Previous
                </Button>
                <div className="flex justify-center items-center p-4">
                    {getPageNumbers().map((pageNumber) => (
                        <IconButton
                            key={pageNumber}
                            onClick={() => setCurrentPage(pageNumber)}
                            color={
                                currentPage === pageNumber ? "black" : "white"
                            }
                        >
                            {pageNumber}
                        </IconButton>
                    ))}
                </div>
                <Button
                    variant="text"
                    className="flex items-center gap-2"
                    onClick={next}
                    disabled={
                        currentPage ===
                        Math.ceil(userStatusLogs.length / logsPerPage)
                    }
                >
                    Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
}

export default UserStatusTable;
