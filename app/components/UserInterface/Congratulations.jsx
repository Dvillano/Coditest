import React from "react";

const Congratulations = () => {
    return (
        <>
            <div className="flex flex-col items-center justify-center h-screen">
                <div className="max-w-md p-4 mx-auto bg-white rounded-lg shadow-lg">
                    <img
                        className="object-contain h-48 w-full"
                        src="../../check-icon.png"
                    />
                    <h2 className="text-2xl font-semibold text-center text-gray-800">
                        ¡Todas las pruebas completadas!
                    </h2>
                    <p className="mt-4 text-gray-600 text-center">
                        ¡Felicidades por completar todas las pruebas! Tu
                        dedicación y esfuerzo son admirables. El equipo de
                        Recursos Humanos se pondrá en contacto contigo pronto
                        para seguir adelante en el proceso. Mantente atento a tu
                        correo o teléfono para recibir más información.
                    </p>
                </div>
            </div>
        </>
    );
};

export default Congratulations;
