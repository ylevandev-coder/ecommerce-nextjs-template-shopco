import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Cart } from "@/service/cart";

interface StrapiCartState {
  cart: Cart | null;
  isLoading: boolean;
  error: string | null;
  setCart: (cart: Cart | null) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStrapiCartStore = create<StrapiCartState>()(
  persist(
    (set) => ({
      cart: null,
      isLoading: false,
      error: null,
      setCart: (cart) => set({ cart, error: null }),
      setLoading: (isLoading) => set({ isLoading }),
      setError: (error) => set({ error }),
    }),
    {
      name: "strapi-cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

