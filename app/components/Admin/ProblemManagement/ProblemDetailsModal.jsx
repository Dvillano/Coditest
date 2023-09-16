import React, { useState } from "react";
import { Button, Dialog, Typography } from "@material-tailwind/react";

function ProblemDetailsModal({ problem }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    return (
        <>
            <Button
                data-ripple-light="true"
                className="flex"
                onClick={handleOpen}
            >
                Detalle
            </Button>
            <Dialog size="md" open={open} handler={handleOpen}>
                <div className="p-6">
                    <Typography
                        variant="h5"
                        color="blue-gray"
                        className="mb-4 text-center"
                    >
                        {problem.titulo}
                    </Typography>
                    <Typography>
                        <span className="font-bold">Nivel: </span>
                        {problem.nivel}
                    </Typography>
                    <Typography>
                        <span className="font-bold">Descripcion: </span>
                        {problem.descripcion}
                    </Typography>
                    <Typography>
                        <span className="font-bold">Sugerencia: </span>
                        {problem.sugerencia}
                    </Typography>
                    <Typography>
                        <span className="font-bold">Plantilla de Codigo: </span>
                        {problem.plantilla_codigo}
                    </Typography>
                    {problem.codigo_evaluador.map((evaluador, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 p-4 rounded-md mb-4"
                        >
                            <Typography>
                                <span className="font-bold">Input:</span>{" "}
                                {evaluador.entrada}
                            </Typography>
                            <Typography>
                                <span className="font-bold">
                                    Output Esperado:
                                </span>{" "}
                                {evaluador.salidaEsperada}
                            </Typography>
                        </div>
                    ))}
                </div>
            </Dialog>
        </>
    );
}

export default ProblemDetailsModal;
