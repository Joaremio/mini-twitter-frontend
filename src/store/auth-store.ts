import { api } from "@/services/api";
import { create } from "zustand";

interface User {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Erro ao deslogar no servidor", error);
    } finally {
      localStorage.removeItem("b2bit_token");
      set({ user: null });
      window.location.href = "/login";
    }
  },
}));
