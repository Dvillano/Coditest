import React from "react";
import {
    Card,
    CardBody,
    CardFooter,
    Typography,
    Button,
} from "@material-tailwind/react";

function ProblemCard({ problem }) {
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
                <CardFooter className="pt-0">
                    <Button>Detalle</Button>
                </CardFooter>
            </Card>
        </>
    );
}

export default ProblemCard;
