"use client";

import { Bell, Calendar, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { authUtils } from "@/utils/auth";

export default function NavbarDash() {
  const router = useRouter();

  const handleLogout = () => {
    authUtils.clearAuth();
    router.push("/auth");
  };
  return (
    <nav className="border-border w-full border-b-2">
      {/* <div className="container mx-auto flex items-center justify-between p-5"> */}
      <div className="flex items-center justify-between p-5">
        <div className="flex items-center gap-4">
          <h3 className="text-secondary text-2xl font-bold italic">TaskFlow</h3>
          <div className="flex items-center gap-5">
            <Link href={`#`}>
              <p
                className={`text-neutral hover:text-secondary text-base font-medium italic hover:underline hover:underline-offset-4`}
              >
                Dashboard
              </p>
            </Link>
            <Link href={`#`}>
              <p
                className={`text-neutral hover:text-secondary text-base font-medium italic hover:underline hover:underline-offset-4`}
              >
                Projects
              </p>
            </Link>
            <Link href={`#`}>
              <p
                className={`text-neutral hover:text-secondary text-base font-medium italic hover:underline hover:underline-offset-4`}
              >
                Calendar
              </p>
            </Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="">
            <p>Today, 27 April 2026</p>
          </div>
          <div className="flex items-center gap-4">
            <button>
              <Bell className="text-neutral size-5" />
            </button>
            <button>
              <Calendar className="text-neutral size-5" />
            </button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="bg-neutral size-9 rounded-lg"></div>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem>My Profile</DropdownMenuItem>
                <DropdownMenuItem>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 bg-red-500/5"
                  >
                    <LogOut className="size-4 text-red-500" />
                    <p className="text-sm text-black">Logout</p>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
}
