import { addNewTasksService } from "@/services/task.service";
import { ErrorResponse } from "@/types/error";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { toast } from "sonner";

export function useAddTask() {
  return useMutation({
    mutationFn: addNewTasksService,
    onError: (error: AxiosError<ErrorResponse>) => {
      const errorMessage = error.response?.data?.message || "Add task failed";
      toast.error(errorMessage);
      console.error("Add task error:", error);
    },
  });
}
