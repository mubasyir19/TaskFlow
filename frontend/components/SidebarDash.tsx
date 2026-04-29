"use client";

import { FileChartColumn, FileCheck, Settings, UsersRound } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

export default function SidebarDash() {
  const pathname = usePathname();
  console.log("path = ", pathname);

  return (
    <aside className="border-border hidden h-screen overflow-y-auto border-r-2 py-4 md:block">
      <div className="px-4">
        <h3 className="text-xl font-bold text-black">Editorial Focus</h3>
        <p className="text-neutral text-xs uppercase">
          Organization Management
        </p>
      </div>
      <div className="mt-8">
        <Link href={`#`}>
          <li
            className={`group hover:border-secondary hover:bg-secondary/5 flex items-center gap-3 border-l-4 border-transparent px-6 py-4 transition-all duration-200`}
          >
            <FileCheck className="text-neutral group-hover:text-secondary" />
            <p
              className={`text-neutral group-hover:text-secondary text-sm uppercase group-hover:font-semibold`}
            >
              Tasks
            </p>
          </li>
        </Link>
        <Link href={`#`}>
          <li
            className={`group hover:border-secondary hover:bg-secondary/5 flex items-center gap-3 border-l-4 border-transparent px-6 py-4 transition-all duration-200`}
          >
            <FileChartColumn className="text-neutral group-hover:text-secondary transition-all duration-200" />
            <p
              className={`text-neutral group-hover:text-secondary text-sm uppercase transition-all duration-200 group-hover:font-semibold`}
            >
              Analytics
            </p>
          </li>
        </Link>
        <Link href={`#`}>
          <li
            className={`group hover:border-secondary hover:bg-secondary/5 flex items-center gap-3 border-l-4 border-transparent px-6 py-4 transition-all duration-200`}
          >
            <UsersRound className="text-neutral group-hover:text-secondary transition-all duration-200" />
            <p
              className={`text-neutral group-hover:text-secondary text-sm uppercase transition-all duration-200 group-hover:font-semibold`}
            >
              Team
            </p>
          </li>
        </Link>
        <Link href={`#`}>
          <li
            className={`group hover:border-secondary hover:bg-secondary/5 flex items-center gap-3 border-l-4 border-transparent px-6 py-4 transition-all duration-200`}
          >
            <Settings className="text-neutral group-hover:text-secondary transition-all duration-200" />
            <p
              className={`text-neutral group-hover:text-secondary text-sm uppercase transition-all duration-200 group-hover:font-semibold`}
            >
              Setting
            </p>
          </li>
        </Link>
      </div>
    </aside>
  );
}
