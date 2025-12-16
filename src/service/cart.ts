import client from "./core";

const SESSION_ID_KEY = "cart_session_id";

/**
 * Generates a unique session ID (fingerprint) for anonymous users
 * Stores it in localStorage for persistence across sessions
 */
function getOrCreateSessionId(): string {
  if (typeof window === "undefined") {
    // Server-side: return a temporary ID (will be replaced on client)
    return `temp-${Date.now()}`;
  }

  // Check if sessionId already exists in localStorage
  let sessionId = localStorage.getItem(SESSION_ID_KEY);

  if (!sessionId) {
    // Generate a new UUID-like session ID
    sessionId = `fp-${Date.now()}-${Math.random().toString(36).substring(2, 15)}-${Math.random().toString(36).substring(2, 15)}`;
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Gets the current user ID if logged in
 * TODO: Replace with your actual authentication logic
 */
function getUserId(): string | null {
  // TODO: Implement your authentication check
  // Example: return localStorage.getItem('user_id') || null;
  // Or use your auth context/provider
  return null;
}

export interface Cart {
  id: number;
  sessionId: string;
  userId?: string | number | null;
  subtotal: string;
  taxAmount: string;
  discountAmount: string;
  shippingCost: string;
  total: string;
  currency: string;
  items?: CartItem[];
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  id: number;
  name: string;
  sku: string;
  quantity: number;
  price: string;
  subtotal: string;
  total: string;
  product?: any;
}

/**
 * Get or create a cart for the current user
 * Uses sessionId (fingerprint) for anonymous users, userId for logged-in users
 */
export const getOrCreateCart = async (): Promise<Cart> => {
  const sessionId = getOrCreateSessionId();
  const userId = getUserId();

  const params: Record<string, any> = {
    sessionId,
  };

  if (userId) {
    params.userId = userId;
  }

  const response = await client.fetch("/carts", {
    method: "GET",
    params,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get or create cart");
  }

  const data = await response.json();
  return data;
};

/**
 * Get cart by ID
 */
export const getCart = async (cartId: number): Promise<Cart> => {
  const response = await client.fetch(`/carts/${cartId}`, {
    method: "GET",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to get cart");
  }

  const data = await response.json();
  return data;
};

/**
 * Add item to cart
 */
export const addItemToCart = async (
  cartId: number,
  productId: number,
  quantity: number = 1,
  meta?: Record<string, any>
): Promise<{ item: CartItem; cart: Cart }> => {
  const response = await client.fetch(
    `/carts/${cartId}/items`,
    {
      method: "POST",
      body: {
        productId,
        quantity,
        meta,
      },
    }
  );

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to add item to cart");
  }

  const data = await response.json();
  return data;
};

/**
 * Update cart item quantity
 */
export const updateCartItemQuantity = async (
  itemId: number,
  quantity: number
): Promise<CartItem> => {
  const response = await client.fetch(`/carts/items/${itemId}`, {
    method: "PUT",
    body: {
      quantity,
    },
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to update cart item");
  }

  const data = await response.json();
  return data;
};

/**
 * Remove item from cart
 */
export const removeCartItem = async (itemId: number): Promise<void> => {
  const response = await client.fetch(`/carts/items/${itemId}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to remove cart item");
  }
};

/**
 * Clear all items from cart
 */
export const clearCart = async (cartId: number): Promise<void> => {
  const response = await client.fetch(`/carts/${cartId}/clear`, {
    method: "DELETE",
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Failed to clear cart");
  }
};

/**
 * Get the current session ID (fingerprint)
 * Useful for debugging or passing to other services
 */
export const getSessionId = (): string => {
  return getOrCreateSessionId();
};

/**
 * Clear the session ID from localStorage
 * Useful when user logs out or wants to start fresh
 */
export const clearSessionId = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_ID_KEY);
  }
};

