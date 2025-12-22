import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { compareArrays } from "@/lib/utils";

export type RemoveCartItem = {
  id: number;
  attributes: string[];
};

export type CartItem = {
  id: number;
  name: string;
  srcUrl: string;
  salePrice: number;
  regularPrice: number;
  attributes: string[];
  quantity: number;
  slug: string;
};

export type Cart = {
  items: CartItem[];
  totalQuantities: number;
};

interface CartState {
  cart: Cart | null;
  totalPrice: number;
  adjustedTotalPrice: number;
  action: "update" | "add" | "delete" | null;
  addToCart: (item: CartItem) => void;
  removeCartItem: (item: RemoveCartItem) => void;
  remove: (item: RemoveCartItem & { quantity: number }) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cart: null,
      totalPrice: 0,
      adjustedTotalPrice: 0,
      action: null,
      addToCart: (item) =>
        set((state) => {
          // if cart is empty then add
          if (state.cart === null) {
            const price = item.salePrice || item.regularPrice;
            const newTotalPrice = state.totalPrice + price * item.quantity;
            return {
              cart: {
                items: [item],
                totalQuantities: item.quantity,
              },
              totalPrice: newTotalPrice,
            };
          }

          // check item in cart
          const isItemInCart = state.cart.items.find(
            (cartItem) =>
              item.id === cartItem.id &&
              compareArrays(item.attributes, cartItem.attributes)
          );

          if (isItemInCart) {
            const updatedItems = state.cart.items.map((eachCartItem) => {
              if (
                eachCartItem.id === item.id
                  ? !compareArrays(
                      eachCartItem.attributes,
                      isItemInCart.attributes
                    )
                  : eachCartItem.id !== item.id
              )
                return eachCartItem;

              return {
                ...isItemInCart,
                quantity: item.quantity + isItemInCart.quantity,
              };
            });

            const price = isItemInCart.salePrice || isItemInCart.regularPrice;
            const newTotalPrice = state.totalPrice + price * item.quantity;

            return {
              cart: {
                ...state.cart,
                items: updatedItems,
                totalQuantities: state.cart.totalQuantities + item.quantity,
              },
              totalPrice: newTotalPrice,
            };
          }

          const price = item.salePrice || item.regularPrice;
          const newTotalPrice = state.totalPrice + price * item.quantity;

          return {
            cart: {
              ...state.cart,
              items: [...state.cart.items, item],
              totalQuantities: state.cart.totalQuantities + item.quantity,
            },
            totalPrice: newTotalPrice,
          };
        }),
      removeCartItem: (item) =>
        set((state) => {
          if (state.cart === null) return state;

          // check item in cart
          const isItemInCart = state.cart.items.find(
            (cartItem) =>
              item.id === cartItem.id &&
              compareArrays(item.attributes, cartItem.attributes)
          );

          if (isItemInCart) {
            const updatedItems = state.cart.items
              .map((eachCartItem) => {
                if (
                  eachCartItem.id === item.id
                    ? !compareArrays(
                        eachCartItem.attributes,
                        isItemInCart.attributes
                      )
                    : eachCartItem.id !== item.id
                )
                  return eachCartItem;

                return {
                  ...isItemInCart,
                  quantity: eachCartItem.quantity - 1,
                };
              })
              .filter((item) => item.quantity > 0);

            const price = isItemInCart.salePrice || isItemInCart.regularPrice;
            const newTotalPrice = state.totalPrice - price * 1;

            return {
              cart: {
                ...state.cart,
                items: updatedItems,
                totalQuantities: state.cart.totalQuantities - 1,
              },
              totalPrice: newTotalPrice,
            };
          }

          return state;
        }),
      remove: (item) =>
        set((state) => {
          if (!state.cart) return state;

          // check item in cart
          const isItemInCart = state.cart.items.find(
            (cartItem) =>
              item.id === cartItem.id &&
              compareArrays(item.attributes, cartItem.attributes)
          );

          if (!isItemInCart) return state;

          const filteredItems = state.cart.items.filter((pItem) => {
            return pItem.id === item.id
              ? !compareArrays(pItem.attributes, isItemInCart.attributes)
              : pItem.id !== item.id;
          });

          const price = isItemInCart.salePrice || isItemInCart.regularPrice;
          const newTotalPrice =
            state.totalPrice - price * isItemInCart.quantity;

          return {
            cart: {
              ...state.cart,
              items: filteredItems,
              totalQuantities:
                state.cart.totalQuantities - isItemInCart.quantity,
            },
            totalPrice: newTotalPrice,
          };
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
