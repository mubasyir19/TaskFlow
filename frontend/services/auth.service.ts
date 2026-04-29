import { api } from "@/lib/axios";
import {
  loginResponseSchema,
  registerResponseSchema,
} from "@/schemas/auth.schema";
import { LoginPayload, RegisterPayload } from "@/types/auth";

export const loginService = async (payload: LoginPayload) => {
  const res = await api.post("/auth/login", payload);
  const validatedRes = loginResponseSchema.parse(res.data);

  if ("errors" in validatedRes && validatedRes.errors?.length) {
    throw new Error(validatedRes.errors.join(", "));
  }

  return validatedRes;
};

export const registerService = async (payload: RegisterPayload) => {
  console.log("payload =", payload);
  const res = await api.post("/auth/register", payload);
  const validatedRes = registerResponseSchema.parse(res.data);
  console.log("validated =", validatedRes);
  return validatedRes;
};

// verify-auth
