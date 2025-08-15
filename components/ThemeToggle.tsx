"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      aria-label="Toggle dark mode"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center justify-center w-8 h-8 dark:text-white shadow-sm border-1 border-gray-200 dark:border-zinc-800 rounded-full transition-colors hover:bg-gray-100 dark:hover:bg-zinc-900/40"
    >
      <Sun
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
          isDark ? "opacity-100 scale-100" : "opacity-0 scale-0"
        }`}
      />
      <Moon
        className={`absolute h-[1.2rem] w-[1.2rem] transition-all duration-300 ${
          isDark ? "opacity-0 scale-0" : "opacity-100 scale-100"
        }`}
      />
    </button>
  );
}
