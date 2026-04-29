import z from "zod";

export const TaskObjectSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable().optional().default(null),
  status: z.string(),
  is_completed: z.boolean().default(false),
  due_date: z.string().nullable().optional().default(null),
  user_id: z.string().optional().default(""),
  createdAt: z.string().optional().default(new Date().toISOString()),
  updatedAt: z.string().optional().default(new Date().toISOString()),
});

export type Task = z.infer<typeof TaskObjectSchema>;

export const GetTasksSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.array(TaskObjectSchema),
  errors: z.array(z.string()).nullable().optional(),
});

export const AddNewTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  due_date: z.string().min(1, "Due date is required"),
  is_completed: z.boolean().optional().default(false),
  status: z.enum(["High", "Medium", "Low"]),
});

export const addTaskResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  data: TaskObjectSchema,
  errors: z.array(z.string()).nullable().optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1, "Title is required").optional(),
  description: z.string().optional(),
  due_date: z.string().optional(),
  status: z.enum(["High", "Medium", "Low"]).optional(),
  is_completed: z.boolean().optional(),
});
