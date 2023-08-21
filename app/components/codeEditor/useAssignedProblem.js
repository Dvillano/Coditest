import { useEffect, useState } from "react";
import { db, auth } from "../../firebase/firebaseConfig";
import { collection, getDoc, getDocs, query, where } from "firebase/firestore";

const useAssignedProblem = (userId) => {
    const [problemInfo, setProblemInfo] = useState(null);

    useEffect(() => {
        const fetchAssignedProblem = async () => {
            try {
                // Realiza la consulta a Firestore para obtener la información de la prueba asignada al usuario
                const usuariosRef = collection(db, "usuarios");
                const userRef = query(usuariosRef, where("id", "==", userId));
                const userSnapshot = (await getDocs(userRef)).docs[0].data();
                const assignedProblemId = userSnapshot.pruebas_asignadas;
                if (assignedProblemId) {
                    const bateriaPruebasRef = collection(db, "bateria_pruebas");

                    const pruebaRef = query(
                        bateriaPruebasRef,
                        where("id", "==", assignedProblemId)
                    );
                    const listaPruebas = (
                        await getDocs(pruebaRef)
                    ).docs[0].data();

                    if (listaPruebas.problemas) {
                        const problemasRef = collection(db, "problemas");
                        const problemas = query(
                            problemasRef,
                            where("id", "in", listaPruebas.problemas)
                        );
                        const listaProblemas = (
                            await getDocs(problemas)
                        ).docs[0].data();

                        setProblemInfo(listaProblemas);
                    }
                } else {
                    setProblemInfo(null); // No hay prueba asignada
                }
            } catch (error) {
                console.error("Error fetching assigned problem:", error);
            }
        };

        // Llama a la función para obtener la información de la prueba asignada
        fetchAssignedProblem();
    }, [userId, db]);

    return problemInfo;
};

export default useAssignedProblem;
