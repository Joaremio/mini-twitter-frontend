"use client";

import { LogOut, Moon, Search, Sun } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

import { useTheme } from "@/context/theme-context";

interface HeaderProps {
  onSearch: (value: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { user, logout } = useAuthStore();
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <header className="w-full flex justify-between bg-background p-4 px-6 sm:px-12 border-b border-border sticky top-0 z-50 items-center gap-8 transition-colors">
      <h1 className="text-xl font-bold text-twitter shrink-0 dark:text-white">
        Mini Twitter
      </h1>

      <div className="relative group flex-1 max-w-[200px] sm:max-w-md md:max-w-xl ">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-twitter transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar por post..."
          className="w-full p-2 pl-10 border border-border rounded-lg bg-card focus:ring-2 focus:ring-twitter focus:border-transparent outline-none text-foreground transition-all text-sm"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-white/10 transition-colors cursor-pointer"
        >
          {!mounted ? (
            <Moon size={20} className="text-gray-600" />
          ) : theme === "light" ? (
            <Moon size={20} className="text-gray-600" />
          ) : (
            <Sun size={20} className="text-yellow-400" />
          )}
        </button>

        {user ? (
          <>
            <button
              onClick={() => {
                logout();
              }}
              className="flex items-center gap-2 text-sm font-semibold bg-twitter text-white  hover:bg-twitter-hover dark:hover:bg-red-500/10 px-3 py-2 rounded-full transition-colors cursor-pointer"
            >
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <a
            href="/auth"
            className="bg-twitter text-white px-6 py-2 rounded-full font-bold hover:bg-twitter-hover transition-colors"
          >
            Entrar
          </a>
        )}
      </div>
    </header>
  );
}
