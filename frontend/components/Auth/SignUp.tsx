import { useRegister } from "@/hooks/auth/useRegister";
import { RegisterSchema } from "@/schemas/auth.schema";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { toast } from "sonner";

interface SignUpProps {
  onSuccess?: () => void;
}

export default function SignUp({ onSuccess }: SignUpProps) {
  const { mutate, isPending } = useRegister();
  const [formData, setFormData] = useState({
    fullname: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };
  const handleSubmitRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const result = RegisterSchema.safeParse(formData);
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
    // mutate(result.data);
    mutate(result.data, {
      onSuccess: (data) => {
        toast.success(data.message);
        // Panggil callback atau refresh
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      },
    });
  };
  return (
    <>
      <div className="mt-12 w-full">
        <h1 className="text-secondary text-center text-2xl font-semibold">
          Create Your Account
        </h1>
        <p className="mt-2 text-center text-base text-black">
          Join a community of focused professionals.
        </p>
      </div>
      <form onSubmit={handleSubmitRegister} className="mt-8 w-full space-y-6">
        <div className="group-input space-y-2.5">
          <label htmlFor="fullname" className="text-base text-[#40494]">
            Full Name
          </label>
          <input
            type="text"
            name="fullname"
            value={formData.fullname}
            onChange={handleChange}
            className="focus:border-secondary focus:ring-secondary w-full border border-[#6B7280] px-4 py-3.5 text-base transition-all duration-200 outline-none placeholder:text-[#D8DBD7] focus:ring-1"
            placeholder="E.g. Julians Barnes"
          />
          {errors.fullname && (
            <p className="text-sm text-red-500">{errors.fullname}</p>
          )}
        </div>
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
            <p className="text-sm text-red-500">{errors.email}</p>
          )}
        </div>
        <div className="grid grid-cols-2 gap-4">
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
              <p className="text-sm text-red-500">{errors.password}</p>
            )}
          </div>
          <div className="group-input space-y-2.5">
            <label
              htmlFor="confirmPassword"
              className="text-base text-[#40494]"
            >
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="focus:border-secondary focus:ring-secondary w-full border border-[#6B7280] px-4 py-3.5 text-base transition-all duration-200 outline-none placeholder:text-[#D8DBD7] focus:ring-1"
              placeholder="••••••"
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
        </div>
        <div className="">
          <div className="flex items-center gap-2">
            <input type="checkbox" name="agreement" />
            <label
              htmlFor="agreement"
              className="text-secondary text-base font-medium"
            >
              I agree to the{" "}
              <Link href={`#`} className="underline underline-offset-2">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href={`#`} className="underline underline-offset-2">
                Privacy Policy
              </Link>
            </label>
          </div>
        </div>
        <div className="">
          <button
            type="submit"
            disabled={isPending}
            className="bg-secondary/95 hover:bg-secondary flex w-full cursor-pointer items-center justify-between px-6 py-4 transition-all duration-200"
          >
            <p className="font-medium text-white">Create Account</p>
            <ArrowRight className="size-5 text-white" />
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
          <Link
            href={`#`}
            onClick={() => {
              toast.error("Under maintenance");
            }}
          >
            <button className="hover:border-secondary flex w-full cursor-pointer items-center justify-center border border-[#BFC9C1] py-3.5 transition-all duration-200">
              <p className="font-medium text-black">Apple</p>
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
