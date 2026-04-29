import { registerService } from "@/services/auth.service";
import { ErrorResponse } from "@/types/error";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useRegister() {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: registerService,
    // onSuccess: (data) => {
    //   toast.success(data.message);
    //   router.push("/auth");
    // },
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || "Register failed";
      toast.error(errorMessage);
      console.error("Register error:", error);
    },
  });
}
