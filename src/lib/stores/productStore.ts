import { create } from "zustand";

export type Color = {
  name: string;
  code: string;
};

interface ProductState {
  colorSelection: Color;
  sizeSelection: string;
  setColorSelection: (color: Color) => void;
  setSizeSelection: (size: string) => void;
}

export const useProductStore = create<ProductState>((set) => ({
  colorSelection: {
    name: "Brown",
    code: "bg-[#4F4631]",
  },
  sizeSelection: "Large",
  setColorSelection: (color) => set({ colorSelection: color }),
  setSizeSelection: (size) => set({ sizeSelection: size }),
}));

