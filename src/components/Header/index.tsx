"use client";

import { LogOut, Search } from "lucide-react";
import { useAuthStore } from "@/store/auth-store";

interface HeaderProps {
  onSearch: (value: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const { user, logout } = useAuthStore();

  return (
    <header className="w-full flex justify-between bg-white p-4 px-12 border-b border-gray-200/70 sticky top-0 z-10 items-center gap-8">
      <h1 className="text-xl font-bold text-twitter shrink-0">Mini Twitter</h1>

      <div className="relative group flex-1 max-w-[200px] sm:max-w-md md:max-w-xl md:ml-14 ">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-twitter transition-colors"
          size={18}
        />
        <input
          type="text"
          placeholder="Buscar por post..."
          className="w-full p-2 pl-10 border border-gray-200 rounded-lg bg-white focus:bg-white focus:ring-2 focus:ring-twitter focus:border-transparent outline-none text-black transition-all text-sm"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-4 shrink-0">
        {user ? (
          <>
            <span className="font-medium text-gray-700 hidden lg:inline">
              Olá, {user.name}
            </span>
            <button
              onClick={() => {
                if (confirm("Deseja sair?")) logout();
              }}
              className="flex items-center gap-2 text-sm font-semibold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Sair</span>
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
