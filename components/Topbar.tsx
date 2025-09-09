/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";
import { Search, BellDot, ChevronDown } from "lucide-react";
import { redirect, usePathname } from "next/navigation";
import { ThemeToggle } from "./ThemeToggle";
import { useState } from "react";
import { Button } from "./ui/button";
import { useUserContext } from "@/context/UserContext";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/applications": "Applications",
  "/billing": "Billing",
  "/rate-card": "Rate Card",
  "/agreement-copy": "Agreement Copy",
  "/notices": "Notices",
};

export default function r() {
  const pathname = usePathname();
  const activePage = pageTitles[pathname] || "Dashboard";
  const [open, setOpen] = useState(false);
  const {name} = useUserContext()

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-black dark:text-white border-b border-gray-200 dark:border-zinc-800 shadow-sm">
      <div className="flex items-center justify-between px-3 sm:px-4 py-3 min-w-0">
        <h1 className="text-lg font-semibold truncate min-w-0 flex-shrink">
          {activePage}
        </h1>
        
      
        <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">

          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 h-4 w-4" />
            <input
              placeholder="Search intermediaries"
              className="pl-10 pr-4 py-1.5 w-48 lg:w-64 rounded-full border-2 border-gray-400 focus:outline-none dark:border-gray-600 dark:placeholder:text-gray-500 bg-transparent text-sm"
            />
          </div>

          <button className="md:hidden p-2 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <Search className="h-5 w-5" />
          </button>
          
          <button className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-zinc-800">
            <BellDot className="h-5 w-5 sm:h-6 sm:w-6 dark:text-gray-200" />
          </button>
          
          <div className="relative">
            <button
              onClick={() => setOpen(prev => !prev)}
              className="flex items-center gap-2 focus:outline-none min-w-0"
            >
              <img
                src="profile.png"
                className="rounded-full h-8 w-8 sm:h-9 sm:w-9 flex-shrink-0"
                alt="Profile"
              />
              <div className="hidden lg:flex flex-col text-left min-w-0">
                <p className="flex gap-2 items-center text-sm">
                  <span className="truncate" id="name" >{name}</span>
                  <ChevronDown className="h-4 w-4 flex-shrink-0" />
                </p>
                <span className="font-extralight text-xs text-neutral-800 dark:text-neutral-200 truncate">
                  May 19, 2024
                </span>
              </div>
              <ChevronDown className="h-4 w-4 lg:hidden flex-shrink-0" />
            </button>
            
            {open && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-zinc-900 border border-gray-200 dark:border-gray-700 z-50">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-800">
                  Profile
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-zinc-800">
                  Settings
                </button>
                <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700">
                  <ThemeToggle />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}