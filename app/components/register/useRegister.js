import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { toast } from "react-hot-toast";

export const useRegister = () => {
    const router = useRouter();

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
            const { user } = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            toast.success("Registrado correctamente");

            const userData = {
                id: user.uid,
                nombre,
                apellido,
                email,
                nivel,
                rol: "candidato",
            };

            await addDoc(collection(db, "usuarios"), userData);

            console.log("Document written with ID: ", user.uid);
        } catch (error) {
            toast.error("Error al registrarse");
            console.error("Error al registrarse:", error);
        }
    };

    return {
        handleSubmit,
        navigate: handleNavigate,
    };
};
