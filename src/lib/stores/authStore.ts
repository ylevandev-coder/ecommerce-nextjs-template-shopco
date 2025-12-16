import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthState {
  user: User | null;
  jwt: string | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  setJwt: (jwt: string | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      jwt: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setJwt: (jwt) => set({ jwt }),
      logout: () => set({ user: null, jwt: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

