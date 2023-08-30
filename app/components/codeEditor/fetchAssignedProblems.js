import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";

const fetchAssignedProblems = async (authUser) => {
    try {
        const userId = authUser.id;
        const usuariosRef = collection(db, "usuarios");
        const userRef = query(usuariosRef, where("id", "==", userId));
        const userSnapshot = (await getDocs(userRef)).docs[0].data();

        const tienePruebasAsignadas = userSnapshot.tienePruebasAsignadas;
        const nivelCandidato = userSnapshot.nivel;

        // Si el usuario tiene pruebas asignadas, busca en Firestore y devuelve el array.
        if (tienePruebasAsignadas) {
            const listaProblemasRef = collection(db, "problemas");
            const problemasRef = query(
                listaProblemasRef,
                where("nivel", "==", nivelCandidato)
            );
            const problemasSnapshot = await getDocs(problemasRef);

            const listaProblemasAsignados = problemasSnapshot.docs.map((doc) =>
                doc.data()
            );

            listaProblemasAsignados.sort(() => {
                return Math.random() - 0.5;
            });
            return listaProblemasAsignados;
        } else {
            return null; // No hay prueba asignada
        }
    } catch (error) {
        console.error("Error fetching assigned problems:", error);
        return null;
    }
};

export default fetchAssignedProblems;
