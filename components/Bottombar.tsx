"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Tag, Megaphone } from "lucide-react";
import { TbNotes } from "react-icons/tb";
import { HiOutlineCash } from "react-icons/hi";

const bottomBarContent = [
  { label: "Dashboard", href: "/dashboard", icon: <LayoutDashboard size={20} /> },
  { label: "Applications", href: "/applications", icon: <TbNotes size={20} /> },
  { label: "Billing", href: "/billing", icon: <HiOutlineCash size={20} /> },
  { label: "Rate Card", href: "/rate-card", icon: <Tag size={20} /> },
  { label: "Notices", href: "/notices", icon: <Megaphone size={20} /> },
];

export default function BottomBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-black border-t border-gray-200 dark:border-zinc-800 shadow-md flex justify-around md:hidden">
      {bottomBarContent.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center py-2 text-xs ${
              isActive
                ? "text-blue-500"
                : "text-gray-700 dark:text-gray-300"
            }`}
          >
            {item.icon}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
