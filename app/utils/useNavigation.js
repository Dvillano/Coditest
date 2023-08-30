import { useRouter } from "next/navigation";

export const useNavigation = () => {
  const router = useRouter();

  const handleNavigate = (url) => {
    router.push(`/${url}`);
  };

  return { handleNavigate };
};
