import { useRouter } from "next/navigation";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../../firebase/firebaseConfig";
import { toast } from "react-hot-toast";

export const useLogin = () => {
    const router = useRouter();

    const handleNavigate = (url) => {
        router.push(`/${url}`);
    };

    const handleSubmit = async (e, email, password) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);

            toast.success("Ingreso Correcto");
        } catch (error) {
            alert(error);
        }
    };

    return {
        navigate: handleNavigate,
        handleSubmit,
    };
};
