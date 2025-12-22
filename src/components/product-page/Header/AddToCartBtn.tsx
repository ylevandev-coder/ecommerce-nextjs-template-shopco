"use client";

import { useCartStore } from "@/lib/stores/cartStore";
import { Product } from "@/types/product.types";
import React from "react";

const AddToCartBtn = ({ data }: { data: Product & { quantity: number } }) => {
  const addToCart = useCartStore((state) => state.addToCart);

  return (
    <button
      type="button"
      className="bg-black w-full ml-3 sm:ml-5 rounded-full h-11 md:h-[52px] text-sm sm:text-base text-white hover:bg-black/80 transition-all"
      onClick={() =>
        addToCart({
          id: data.id,
          name: data.name,
          srcUrl: data.images?.[0]?.url ?? "",
          salePrice: data.salePrice,
          regularPrice: data.regularPrice,
          quantity: data.quantity,
          slug: data.slug,
          attributes: [],
        })
      }
    >
      Add to Cart
    </button>
  );
};

export default AddToCartBtn;
