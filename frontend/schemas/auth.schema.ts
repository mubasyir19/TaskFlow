import z from "zod";

export const userSchema = z.object({
  id: z.string(),
  fullname: z.string(),
  email: z.email(),
});

export const RegisterSchema = z.object({
  fullname: z.string().min(1, "Email is required"),
  email: z.email("Invalid format email"),
  password: z.string().min(6, "min. 6 characters password"),
  confirmPassword: z.string().min(6, "min. 6 characters password"),
});

export const registerResponseSchema = z.object({
  data: z.object({
    user: z.any(),
  }),
  message: z.string(),
  errors: z.array(z.string()).optional(),
});

export const LoginSchema = z.object({
  email: z.email("Invalid format email"),
  password: z.string().min(6, "min. 6 characters password"),
});

export const loginResponseSchema = z.object({
  data: z.object({
    user: userSchema,
    token: z.string(),
  }),
  message: z.string(),
  errors: z.array(z.string()).nullable().optional(),
});
