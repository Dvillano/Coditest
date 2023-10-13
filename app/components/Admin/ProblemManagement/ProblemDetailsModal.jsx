import React, { useState } from "react";
import { Button, Dialog, Typography } from "@material-tailwind/react";

import CodeMirror from "@uiw/react-codemirror";
import { javascript } from "@codemirror/lang-javascript";

function ProblemDetailsModal({ problem }) {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(!open);

    console.log(problem);
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
                <div className="p-10 m-5">
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
                        <CodeMirror
                            className="mb-3"
                            value={problem.plantilla_codigo}
                            height="100px"
                            theme={"dark"}
                            readOnly={true}
                            extensions={[javascript({ jsx: true })]}
                        />
                    </Typography>
                    {problem.codigo_evaluador.map((evaluador, index) => (
                        <div
                            key={index}
                            className="border border-green-400 p-4 rounded-md mb-4"
                        >
                            <Typography>
                                <span className="font-bold">Input:</span>
                                {JSON.stringify(evaluador.entrada)}
                            </Typography>
                            <Typography>
                                <span className="font-bold">
                                    Output Esperado:
                                </span>{" "}
                                {JSON.stringify(evaluador.salidaEsperada)}
                            </Typography>
                        </div>
                    ))}
                </div>
            </Dialog>
        </>
    );
}

export default ProblemDetailsModal;
