"use client";

import { Task } from "@/schemas/task.schema";
import { formatDate } from "@/utils/formateDate";
import { useUpdateTaskStatus } from "@/hooks/task/useUpdateTaskStatus";
import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "../ui/checkbox";
import Toggle from "../Toggle";

const STATUS_STYLES: Record<string, string> = {
  High: "bg-red-500/10 text-red-500",
  Medium: "bg-yellow-500/10 text-yellow-600",
  Low: "bg-blue-500/10 text-blue-500",
};

function TaskToggle({ task }: { task: Task }) {
  const { mutate, status } = useUpdateTaskStatus();

  return (
    <Toggle
      checked={task.is_completed ?? false}
      onChange={(value) => mutate({ id: task.id, is_completed: value })}
      disabled={status === "pending"}
    />
  );
}

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
      const { title, description, is_completed } = row.original;
      return (
        <div className={is_completed ? "line-through" : ""}>
          <p className="text-secondary text-lg font-medium">{title}</p>
          <p className="text-sm text-black">{description}</p>
        </div>
      );
    },
  },
  {
    accessorKey: "due_date",
    header: "Due Date",
    cell: ({ row }) => <p>{formatDate(row.original.due_date ?? "")}</p>,
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const { status } = row.original;
      const style = STATUS_STYLES[status] ?? "bg-gray-500/10 text-gray-500";
      return (
        <span
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${style}`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "is_completed",
    header: "Completed",
    cell: ({ row }) => <TaskToggle task={row.original} />,
  },
];
