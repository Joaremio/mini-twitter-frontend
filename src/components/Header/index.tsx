"use client";

import { LogOut, Moon, Search, Sun } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";
import { useTheme } from "@/context/theme-context";
import Link from "next/link";

interface HeaderProps {
  onSearch: (value: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="w-full flex flex-col sm:flex-row sm:items-center bg-background p-3 sm:p-4 px-4 sm:px-12 border-b border-border sticky top-0 z-50 gap-3 transition-colors">
      <div className="flex items-center justify-between w-full">
        <h1 className="text-base sm:text-xl font-bold text-twitter shrink-0 dark:text-white">
          Mini Twitter
        </h1>

        <div className="relative group w-full max-w-[140px] sm:max-w-md mx-2 sm:mx-8">
          <Search
            className="absolute left-2 sm:left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-twitter transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Buscar..."
            className="w-full p-1.5 sm:p-2 pl-8 sm:pl-10 border border-border rounded-lg bg-card focus:ring-2 focus:ring-twitter focus:border-transparent outline-none text-xs sm:text-sm transition-all"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 sm:gap-3 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-1.5 sm:p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors"
          >
            {!mounted ? (
              <Moon size={18} className="text-gray-600" />
            ) : theme === "light" ? (
              <Moon size={18} className="text-gray-600" />
            ) : (
              <Sun size={18} className="text-yellow-400" />
            )}
          </button>

          {user ? (
            <button
              onClick={logout}
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold bg-twitter text-white px-2 sm:px-4 py-1.5 sm:py-2 rounded-full transition-colors hover:bg-twitter-hover"
            >
              <LogOut size={16} />
            </button>
          ) : (
            <>
              <Link
                href="/auth"
                className="text-gray-500 dark:text-white text-xs sm:text-sm border px-2 sm:px-4 py-1.5 sm:py-2 rounded-full font-semibold"
              >
                Registrar
              </Link>

              <Link
                href="/auth"
                className="bg-twitter text-white text-xs sm:text-sm px-3 sm:px-5 py-1.5 sm:py-2 rounded-full font-bold"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
