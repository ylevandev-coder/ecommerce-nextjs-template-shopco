import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { compareArrays } from "@/lib/utils";
import { Discount } from "@/types/product.types";

const calcAdjustedTotalPrice = (
  data: CartItem,
  quantity?: number
): number => {
  const adjustedPrice =
    data.discount.percentage > 0
      ? Math.round(data.price - (data.price * data.discount.percentage) / 100)
      : data.discount.amount > 0
      ? Math.round(data.price - data.discount.amount)
      : data.price;
  return adjustedPrice * (quantity ? quantity : data.quantity);
};

export type RemoveCartItem = {
  id: number;
  attributes: string[];
};

export type CartItem = {
  id: number;
  name: string;
  srcUrl: string;
  price: number;
  attributes: string[];
  discount: Discount;
  quantity: number;
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
            const newTotalPrice = state.totalPrice + item.price * item.quantity;
            const newAdjustedTotalPrice =
              state.adjustedTotalPrice + calcAdjustedTotalPrice(item);
            return {
              cart: {
                items: [item],
                totalQuantities: item.quantity,
              },
              totalPrice: newTotalPrice,
              adjustedTotalPrice: newAdjustedTotalPrice,
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

            const newTotalPrice = state.totalPrice + item.price * item.quantity;
            const newAdjustedTotalPrice =
              state.adjustedTotalPrice + calcAdjustedTotalPrice(item);

            return {
              cart: {
                ...state.cart,
                items: updatedItems,
                totalQuantities: state.cart.totalQuantities + item.quantity,
              },
              totalPrice: newTotalPrice,
              adjustedTotalPrice: newAdjustedTotalPrice,
            };
          }

          const newTotalPrice = state.totalPrice + item.price * item.quantity;
          const newAdjustedTotalPrice =
            state.adjustedTotalPrice + calcAdjustedTotalPrice(item);

          return {
            cart: {
              ...state.cart,
              items: [...state.cart.items, item],
              totalQuantities: state.cart.totalQuantities + item.quantity,
            },
            totalPrice: newTotalPrice,
            adjustedTotalPrice: newAdjustedTotalPrice,
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

            const newTotalPrice = state.totalPrice - isItemInCart.price * 1;
            const newAdjustedTotalPrice =
              state.adjustedTotalPrice - calcAdjustedTotalPrice(isItemInCart, 1);

            return {
              cart: {
                ...state.cart,
                items: updatedItems,
                totalQuantities: state.cart.totalQuantities - 1,
              },
              totalPrice: newTotalPrice,
              adjustedTotalPrice: newAdjustedTotalPrice,
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

          const newTotalPrice =
            state.totalPrice - isItemInCart.price * isItemInCart.quantity;
          const newAdjustedTotalPrice =
            state.adjustedTotalPrice -
            calcAdjustedTotalPrice(isItemInCart, isItemInCart.quantity);

          return {
            cart: {
              ...state.cart,
              items: filteredItems,
              totalQuantities: state.cart.totalQuantities - isItemInCart.quantity,
            },
            totalPrice: newTotalPrice,
            adjustedTotalPrice: newAdjustedTotalPrice,
          };
        }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

