import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useAuth } from "../../firebase/firebaseAuth";

export const useRegister = () => {
    const router = useRouter();
    const { setAuthUser } = useAuth();

    const handleNavigate = (url) => {
        router.push(`/${url}`);
    };

    const handleSubmit = async (
        e,
        nombre,
        apellido,
        nivel,
        email,
        password
    ) => {
        e.preventDefault();

        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("Autenticado correctamente");

            const docRef = await addDoc(collection(db, "usuarios"), {
                id: auth.currentUser.uid,
                nombre: nombre,
                apellido: apellido,
                email: email,
                nivel: nivel,
                rol: "candidato",
            });

            console.log("Document written with ID: ", docRef.id);
        } catch (error) {
            alert(error);
        }
    };

    return {
        handleSubmit,
        navigate: handleNavigate,
    };
};
