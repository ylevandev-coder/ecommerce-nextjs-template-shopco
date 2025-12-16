"use client";

import { ReactNode, useEffect } from "react";
import { getOrCreateCart } from "@/service/cart";
import { useStrapiCartStore } from "@/lib/stores/strapiCartStore";

type Props = {
  children: ReactNode;
};

const Providers = ({ children }: Props) => {
  const { setCart, setLoading, setError } = useStrapiCartStore();

  useEffect(() => {
    const initCart = async () => {
      try {
        setLoading(true);
        setError(null);
        const cart = await getOrCreateCart();
        setCart(cart);
      } catch (error) {
        console.error("Failed to initialize cart:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load cart"
        );
      } finally {
        setLoading(false);
      }
    };

    initCart();
  }, [setCart, setLoading, setError]);

  return <>{children}</>;
};

export default Providers;
