import React, { useState } from "react";
import { Card, Typography } from "@material-tailwind/react";
import { ArrowRightIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";
import { Button, IconButton } from "@material-tailwind/react";

const LogTable = ({ logs }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 5; // Number of logs to display per page

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = logs.slice(indexOfFirstLog, indexOfLastLog);

    const next = () => {
        if (currentPage < Math.ceil(logs.length / logsPerPage)) {
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
        for (let i = 1; i <= Math.ceil(logs.length / logsPerPage); i++) {
            pageNumbers.push(i);
        }
        return pageNumbers;
    };

    return (
        <div>
            <Card>
                <div className="flex justify-center items-center p-4">
                    <h3 className="text-lg font-semibold">
                        Logs de autenticacion
                    </h3>
                </div>
                <table className="w-full min-w-max table-auto text-left">
                    <thead>
                        <tr>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal leading-none opacity-70"
                                >
                                    ID Usuario
                                </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal leading-none opacity-70"
                                >
                                    Email
                                </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal leading-none opacity-70"
                                >
                                    Evento
                                </Typography>
                            </th>
                            <th className="border-b border-blue-gray-100 bg-blue-gray-50 p-4">
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="font-normal leading-none opacity-70"
                                >
                                    Timestamp
                                </Typography>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentLogs.map((log, index) => {
                            const isLast = index === currentLogs.length - 1;
                            const classes = isLast
                                ? "p-4"
                                : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={log.id}>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {log.userUid}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {log.userEmail}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {log.event}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {log.timestamp}
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
                        currentPage === Math.ceil(logs.length / logsPerPage)
                    }
                >
                    Next <ArrowRightIcon strokeWidth={2} className="h-4 w-4" />
                </Button>
            </div>
        </div>
    );
};

export default LogTable;
