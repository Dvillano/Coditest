import React from "react";
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";
import ProblemDetailsModal from "./ProblemDetailsModal";
import ProblemDeleteModal from "./ProblemDeleteModal";

function ProblemCard({ problem, isDeleteComplete }) {
    return (
        <>
            <Card className="m-3">
                <CardBody className="flex flex-col h-full">
                    <div className="flex-grow">
                        <Typography
                            variant="h5"
                            color="blue-gray"
                            className="mb-2 text-center"
                        >
                            {problem.titulo}
                        </Typography>
                        <Typography>{problem.descripcion}</Typography>
                    </div>
                    <div className="mt-auto">
                        <CardFooter className="flex justify-between">
                            <ProblemDetailsModal problem={problem} />
                            <ProblemDeleteModal
                                idProblem={problem.id}
                                isDeleteComplete={isDeleteComplete}
                            />
                        </CardFooter>
                    </div>
                </CardBody>
            </Card>
        </>
    );
}

export default ProblemCard;
