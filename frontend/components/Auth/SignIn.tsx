"use client";

import { useLogin } from "@/hooks/auth/useLogin";
import { LoginSchema } from "@/schemas/auth.schema";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

export default function SignIn() {
  const { mutate, isPending } = useLogin();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.SubmitEvent) => {
    e.preventDefault();

    const result = LoginSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    mutate(result.data);
  };

  return (
    <>
      <div className="mt-12 w-full">
        <h1 className="text-secondary text-center text-2xl font-semibold">
          Sign In Your Account
        </h1>
        <p className="mt-2 text-center text-base text-black">
          Please fill out the form below
        </p>
      </div>
      <form onSubmit={handleSubmit} className="mt-8 w-full space-y-6">
        <div className="group-input space-y-2.5">
          <label htmlFor="email" className="text-base text-[#40494]">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="focus:border-secondary focus:ring-secondary w-full border border-[#6B7280] px-4 py-3.5 text-base transition-all duration-200 outline-none placeholder:text-[#D8DBD7] focus:ring-1"
            placeholder="julian@taskflow.io"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>
        <div className="group-input space-y-2.5">
          <label htmlFor="password" className="text-base text-[#40494]">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="focus:border-secondary focus:ring-secondary w-full border border-[#6B7280] px-4 py-3.5 text-base transition-all duration-200 outline-none placeholder:text-[#D8DBD7] focus:ring-1"
            placeholder="••••••"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <input type="checkbox" name="remember" />
            <label
              htmlFor="remember"
              className="text-secondary text-base font-medium"
            >
              Remember Me
            </label>
          </div>
          <Link href={`#`}>
            <p className="text-secondary text-base font-medium underline underline-offset-2">
              Forgot Password?
            </p>
          </Link>
        </div>
        <div className="">
          <button
            type="submit"
            disabled={isPending}
            className="bg-secondary/95 hover:bg-secondary flex w-full cursor-pointer items-center justify-between px-6 py-4 transition-all duration-200"
          >
            {isPending ? (
              <p className="text-center text-base text-white">Loading...</p>
            ) : (
              <>
                <p className="font-medium text-white">Sign In</p>
                <ArrowRight className="size-5 text-white" />
              </>
            )}
          </button>
        </div>
      </form>
      <hr className="my-8 w-full border border-[#BFC9C1]" />
      <div className="w-full">
        <p className="text-center text-black">Or continue with</p>
        <div className="mt-6 grid w-full grid-cols-2 gap-4">
          <Link
            href={`#`}
            onClick={() => {
              toast.error("Under maintenance");
            }}
          >
            <button className="hover:border-secondary flex w-full cursor-pointer items-center justify-center border border-[#BFC9C1] py-3.5 transition-all duration-200">
              <p className="font-medium text-black">Google</p>
            </button>
          </Link>
          <Link href={`#`} onClick={() => toast.error("Under maintenance")}>
            <button className="hover:border-secondary flex w-full cursor-pointer items-center justify-center border border-[#BFC9C1] py-3.5 transition-all duration-200">
              <p className="font-medium text-black">Apple</p>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
