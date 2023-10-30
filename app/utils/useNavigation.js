// Este módulo se encarga de la navegación en la aplicación Next.js, permitiendo redirigir a diferentes rutas de manera programática.
import { useRouter } from "next/navigation";

export const useNavigation = () => {
    const router = useRouter();

    const handleNavigate = (url) => {
        router.push(`/${url}`);
    };

    return { handleNavigate };
};
