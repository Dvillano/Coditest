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
            <Card className="mt-6 w-100">
                <CardBody>
                    <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mb-2 text-center"
                    >
                        {problem.titulo}
                    </Typography>
                    <Typography>{problem.descripcion}</Typography>
                </CardBody>
                <CardFooter className="pt-0 flex justify-between">
                    <ProblemDetailsModal problem={problem} />
                    <ProblemDeleteModal
                        idProblem={problem.id}
                        isDeleteComplete={isDeleteComplete}
                    />
                </CardFooter>
            </Card>
        </>
    );
}

export default ProblemCard;
