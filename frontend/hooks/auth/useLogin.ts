import { loginService } from "@/services/auth.service";
import { ErrorResponse } from "@/types/error";
import { authUtils } from "@/utils/auth";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogin() {
  const queryClient = new QueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: loginService,
    onSuccess: (data) => {
      authUtils.setToken(data.data.token);
      authUtils.setUser(data.data.user);

      toast.success(data.message);

      queryClient.invalidateQueries({ queryKey: ["profile"] });

      router.push("/dashboard");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || "Login failed";
      toast.error(errorMessage);
      console.error("Login error:", error);
    },
  });
}
