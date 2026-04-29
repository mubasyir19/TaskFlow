import { useAddTask } from "@/hooks/task/useAddTask";
import { AddNewTaskSchema } from "@/schemas/task.schema";
import React, { useState } from "react";
import { toast } from "sonner";

const statusUnit = [
  { label: "High", value: "High" },
  { label: "Medium", value: "Medium" },
  { label: "Low", value: "Low" },
];

interface FormAddTaskProps {
  onSuccess?: () => void;
}

export default function FormAddTask({ onSuccess }: FormAddTaskProps) {
  const { mutate, isPending } = useAddTask();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    due_date: "",
    status: "Medium",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("isi form data = ", formData);

    const result = AddNewTaskSchema.safeParse(formData);
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
    console.log("Validation passed, calling mutate with:", result.data);

    mutate(result.data, {
      onSuccess: (data) => {
        toast.success(data.message);
        if (onSuccess) {
          onSuccess();
        } else {
          window.location.reload();
        }
      },
    });
  };

  return (
    <form onSubmit={handleSubmitAddTask} className="space-y-6">
      <div className="group-input">
        <label htmlFor="title" className="text-neutral block text-sm uppercase">
          Task Title
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Write project proposal"
          className="border-border w-full rounded-sm border px-4 py-3.5 text-base placeholder:text-gray-300"
        />
        {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
      </div>
      <div className="group-input">
        <label
          htmlFor="description"
          className="text-neutral block text-sm uppercase"
        >
          Description
        </label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Outline the key variables and timeline..."
          className="border-border w-full rounded-sm border px-4 py-3.5 text-base placeholder:text-gray-300"
        ></textarea>
        {errors.description && (
          <p className="text-sm text-red-500">{errors.description}</p>
        )}
      </div>
      <div className="group-input">
        <label
          htmlFor="due_date"
          className="text-neutral block text-sm uppercase"
        >
          Due Date
        </label>
        <input
          type="date"
          name="due_date"
          value={formData.due_date}
          onChange={handleChange}
          placeholder="Write project proposal"
          className="border-border w-full rounded-sm border px-4 py-3.5 text-base placeholder:text-gray-300"
        />
        {errors.due_date && (
          <p className="text-sm text-red-500">{errors.due_date}</p>
        )}
      </div>
      <div className="group-input">
        <label
          htmlFor="status"
          className="text-neutral block text-sm uppercase"
        >
          Priority
        </label>
        <div className="grid grid-cols-3 gap-1 rounded-md bg-[#F5F5F4] p-1.5">
          {statusUnit.map((item) => {
            const isActive = item.value === formData.status;
            return (
              <label key={item.value} className="cursor-pointer">
                <input
                  type="radio"
                  name="status"
                  value={item.value}
                  onChange={handleChange}
                  checked={isActive}
                  className="hidden"
                />
                <div
                  className={`rounded-md border-2 py-2.5 text-center text-xs font-semibold uppercase transition-all duration-200 ${
                    isActive
                      ? "text-secondary border-border bg-white"
                      : "hover:text-secondary text-neutral border-transparent hover:bg-white"
                  }`}
                >
                  {item.label}
                </div>
              </label>
            );
          })}
        </div>
        {errors.status && (
          <p className="text-sm text-red-500">{errors.status}</p>
        )}
      </div>
      <div className="flex items-center justify-end py-4">
        <button className="text-neutral cursor-pointer rounded-md px-6 py-2.5 text-base">
          Cancel
        </button>
        <button
          type="submit"
          disabled={isPending}
          className="bg-secondary/95 hover:bg-secondary cursor-pointer rounded-md px-6 py-2.5 text-base text-white transition-all duration-200"
        >
          {isPending ? "Loading..." : "Save Task"}
        </button>
      </div>
    </form>
  );
}
