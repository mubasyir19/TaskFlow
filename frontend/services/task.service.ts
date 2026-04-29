import { api } from "@/lib/axios";
import { addTaskResponseSchema, GetTasksSchema } from "@/schemas/task.schema";
import { AddTaskForm } from "@/types/task";

export const getTasksService = async (completed?: boolean, search?: string) => {
  let url = "/tasks";
  const params = new URLSearchParams();

  if (completed !== undefined) {
    params.append("completed", completed.toString());
  }

  if (search && search.trim() !== "") {
    params.append("search", search);
  }
  const queryString = params.toString();
  if (queryString) {
    url += `?${queryString}`;
  }

  // const res = await api.get(`/tasks?completed=${completed}&search=${search}`);
  const res = await api.get(url);
  // console.log("res = ", res.data);
  const validatedRes = GetTasksSchema.safeParse(res.data);
  // console.log("validatedRes = ", validatedRes);
  return validatedRes.data;
};

export const addNewTasksService = async (payload: AddTaskForm) => {
  // console.log("payload = ", payload);
  const formattedPayload = {
    title: payload.title,
    description: payload.description,
    status: payload.status,
    due_date:
      payload.due_date instanceof Date
        ? payload.due_date.toISOString()
        : new Date(payload.due_date).toISOString(),
  };
  const res = await api.post("/tasks/add", formattedPayload);
  const validatedRes = addTaskResponseSchema.parse(res.data);
  return validatedRes;
};
