import { Task } from "@/schemas/task.schema";
import { updateStatusCompleteTask } from "@/services/task.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, is_completed }: { id: string; is_completed: boolean }) =>
      updateStatusCompleteTask(id, is_completed),

    onMutate: async ({ id, is_completed }) => {
      // Cancel semua queries yang dimulai dengan ["tasks"]
      await queryClient.cancelQueries({ queryKey: ["tasks"] });

      const previousTasks = queryClient.getQueryData<{ data: Task[] }>([
        "tasks",
      ]);

      queryClient.setQueryData<{ data: Task[] }>(["tasks"], (old) => {
        if (!old) return old;
        return {
          ...old,
          data: old.data.map((task) =>
            task.id === id ? { ...task, is_completed } : task,
          ),
        };
      });

      return { previousTasks };
    },

    onError: (_err, _variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(["tasks"], context.previousTasks);
      }
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}
