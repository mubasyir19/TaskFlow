"use client";

import { columns } from "@/components/Task/columns";
import { DataTable } from "@/components/Task/data-table";
import FormAddTask from "@/components/Task/FormAddTask";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useGetTasks } from "@/hooks/task/useGetTasks";
import { Search } from "lucide-react";
import React, { useState } from "react";
import { useDebounce } from "use-debounce";

type FilterCompleted = "all" | "active" | "completed";

export default function DashboardPage() {
  const [filterCompleted, setFilterCompleted] =
    useState<FilterCompleted>("all");
  const [search, setSearch] = useState<string>("");
  const [debouncedSearch] = useDebounce(search, 500);

  const getCompletedFilter = (filter: FilterCompleted): boolean | undefined => {
    if (filter === "completed") return true;
    if (filter === "active") return false;
    return undefined;
  };

  const completedFilter = getCompletedFilter(filterCompleted);

  const { data, isPending, error, refetch } = useGetTasks(
    completedFilter,
    debouncedSearch,
  );

  return (
    <div>
      <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="border-border border bg-white p-6">
          <div className="space-y-2">
            <p className="text-neutral text-sm uppercase">Total Tasks</p>
            <h2 className="text-4xl text-black">124</h2>
          </div>
          <div className=""></div>
        </div>
        <div className="border-border border bg-white p-6">
          <div className="space-y-2">
            <p className="text-secondary text-sm font-medium uppercase">
              Completed
            </p>
            <h2 className="text-4xl text-black">86</h2>
          </div>
          <div className=""></div>
        </div>
        <div className="border-border border bg-white p-6">
          <div className="space-y-2">
            <p className="text-neutral text-sm uppercase">In Progress</p>
            <h2 className="text-4xl text-black">28</h2>
          </div>
          <div className=""></div>
        </div>
        <div className="border-border border bg-white p-6">
          <div className="space-y-2">
            <p className="text-neutral text-sm uppercase">Pending Review</p>
            <h2 className="text-4xl text-black">10</h2>
          </div>
          <div className=""></div>
        </div>
      </section>
      <section className="mt-12 mb-6">
        <div className="flex w-full flex-col flex-wrap items-center gap-4 md:flex-row md:justify-between">
          <div className="flex flex-1 flex-col gap-5 md:flex-row md:items-center">
            <Dialog>
              <DialogTrigger asChild>
                <button className="bg-secondary/95 hover:bg-secondary cursor-pointer px-6 py-2 text-sm text-white">
                  New Task
                </button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add New Task</DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <div className="">
                  <FormAddTask />
                </div>
              </DialogContent>
            </Dialog>
            <hr className="border-border hidden h-8 w-0.5 border md:block" />
            <div className="flex items-center gap-2">
              <button
                onClick={() => setFilterCompleted("all")}
                className={`cursor-pointer border px-4 py-1.5 text-xs font-medium uppercase transition-all duration-200 ${filterCompleted === "all" ? "hover:border-border bg-[#F5F5F4] text-black" : "text-neutral hover:border-border border-transparent hover:bg-[#F5F5F4] hover:text-black"}`}
              >
                All
              </button>
              <button
                onClick={() => setFilterCompleted("active")}
                className={`cursor-pointer border px-4 py-1.5 text-xs font-medium uppercase transition-all duration-200 ${filterCompleted === "active" ? "hover:border-border bg-[#F5F5F4] text-black" : "text-neutral hover:border-border border-transparent hover:bg-[#F5F5F4] hover:text-black"}`}
              >
                Active
              </button>
              <button
                onClick={() => setFilterCompleted("completed")}
                className={`cursor-pointer border px-4 py-1.5 text-xs font-medium uppercase transition-all duration-200 ${filterCompleted === "completed" ? "hover:border-border bg-[#F5F5F4] text-black" : "text-neutral hover:border-border border-transparent hover:bg-[#F5F5F4] hover:text-black"}`}
              >
                Completed
              </button>
            </div>
          </div>
          <div className="w-full md:w-fit">
            <div className="border-border flex w-full items-center gap-4 border bg-white p-3 md:ml-auto xl:w-96">
              <Search className="text-neutral size-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="placeholder:text-neutral flex-1 text-base outline-none"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="">
        <DataTable columns={columns} data={data?.data || []} />
      </section>
    </div>
  );
}
