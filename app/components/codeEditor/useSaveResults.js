import { db } from "../../firebase/firebaseConfig";
import { addDoc, collection, doc, documentId } from "firebase/firestore";

const useSaveResults = async (userId, problemaId, resultado) => {
    try {
        // Agrega un nuevo documento a la colección "resultados"
        await addDoc(collection(db, "resultados"), {
            usuario_id: userId,
            problema_id: problemaId,
            resultado: resultado,
            fecha: new Date().toLocaleString(),
        });
    } catch (error) {
        console.error("Error al guardar el resultado:", error);
    }
};

export default useSaveResults;
