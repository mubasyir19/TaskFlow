import { getTasksService } from "@/services/task.service";
import { useQuery } from "@tanstack/react-query";

export function useGetTasks(completed?: boolean, search?: string) {
  return useQuery({
    queryKey: ["tasks", { completed, search }],
    queryFn: () => getTasksService(completed, search),
    enabled: true,
  });
}
