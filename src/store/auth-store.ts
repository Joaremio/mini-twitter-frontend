import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  user: any | null;
  setUser: (user: any) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => {
        localStorage.removeItem("b2bit_token");
        localStorage.removeItem("b2bit_user");
        set({ user: null });
        window.location.href = "/auth";
      },
    }),
    {
      name: "b2bit-auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
