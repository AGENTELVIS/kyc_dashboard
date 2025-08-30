/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tag, Megaphone } from "lucide-react";
import { TbNotes } from "react-icons/tb";
import { HiOutlineCash } from "react-icons/hi";
import { FaRegCopy } from "react-icons/fa";

const sidebarContent = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={18} /> },
  { label: "Applications", href: "/applications", icon: <TbNotes size={18} /> },
  { label: "Billing", href: "/billing", icon: <HiOutlineCash size={18} /> },
  { label: "Rate Card", href: "/rate-card", icon: <Tag size={18} /> },
  { label: "Agreement Copy", href: "/agreement-copy", icon: <FaRegCopy size={18} /> },
  { label: "Notices", href: "/notices", icon: <Megaphone size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className=" min-h-screen max-h-screen flex-shrink-0 hidden md:flex sticky top-0 h-full w-36 bg-white dark:bg-black border-r border-gray-200 dark:border-zinc-800 shadow-sm flex-col items-center py-4">
      <Link href="/" className="mb-6">
        <img
          src="/KYC_logo.png"
          alt="Logo"
          className="h-10 w-10 object-contain dark:invert"
        />
      </Link>

      <nav className="flex flex-col w-full">
        {sidebarContent.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-3 transition-colors ${
                isActive
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/40"
              }`}
            >
              {item.icon}
              <span className="text-[10px]">{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
