import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../firebase/firebaseConfig";
import { useAuth } from "../../firebase/firebaseAuth";

export const useRegister = () => {
    const router = useRouter();
    const { setAuthUser } = useAuth();

    const handleNavigate = (url) => {
        router.push(`/${url}`);
    };

    const handleSubmit = async (e, email, password) => {
        e.preventDefault();
        try {
            await createUserWithEmailAndPassword(auth, email, password);
            alert("registrado correctamente");

        } catch (error) {
            alert(error);
        }
    };

    return {
        handleSubmit,
        navigate: handleNavigate,
    };
};
