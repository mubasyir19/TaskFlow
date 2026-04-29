"use client";

import { Task } from "@/schemas/task.schema";
import { formatDate } from "@/utils/formateDate";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";

const statusTask = [
  {
    label: "High",
    color: "bg-red-500/10 text-red-500",
  },
  {
    label: "Medium",
    color: "bg-yellow-500/10 text-yellow-600",
  },
  {
    label: "Low",
    color: "bg-blue-500/10 text-blue-500",
  },
];

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: "Task Description",
    cell: ({ row }) => {
      const task = row.original as Task;
      return (
        <>
          <p className="text-secondary text-lg font-medium">{task.title}</p>
          <p className="text-sm text-black">{task.description}</p>
        </>
      );
    },
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => {
      const task = row.original as Task;
      return <p>{formatDate(task.due_date || "")}</p>;
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const task = row.original as Task;
      const status = task.status;

      const statusConfig = statusTask.find((s) => s.label === status);
      const defaultConfig = {
        color: "bg-gray-500",
        textColor: "text-white",
      };

      const config = statusConfig || defaultConfig;
      return (
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${config.color} ${config.color}`}
        >
          {task.status}
        </span>
      );
    },
  },
];
