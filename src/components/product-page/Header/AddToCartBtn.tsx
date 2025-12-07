"use client";

import { useCartStore } from "@/lib/stores/cartStore";
import { useProductStore } from "@/lib/stores/productStore";
import { Product } from "@/types/product.types";
import React from "react";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const sizeSelection = useProductStore((state) => state.sizeSelection);
  const colorSelection = useProductStore((state) => state.colorSelection);

  return (
    <button
      type="button"
      className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all"
      onClick={() =>
        addToCart({
          id: data.id,
          name: data.title,
          srcUrl: data.srcUrl,
          price: data.price,
          attributes: [sizeSelection, colorSelection.name],
          discount: data.discount,
          quantity: data.quantity,
        })
      }
    >
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
