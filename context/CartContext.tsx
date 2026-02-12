"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Food } from "@/schemas/food";

export interface CartItem extends Food {
  quantity: number;
}

interface CartState {
  name: string;
  tableNumber: string;
  items: CartItem[];
  displayCode: string;
}

const CART_STORAGE_KEY = "mysagra-cart";

const getStoredCart = (): CartState => {
  if (typeof window === "undefined") {
    return { name: "", tableNumber: "", items: [], displayCode: "" };
  }
  try {
    const stored = sessionStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.error("Error reading cart from sessionStorage:", e);
  }
  return { name: "", tableNumber: "", items: [], displayCode: "" };
};

interface CartContextType {
  name: string;
  tableNumber: string;
  setName: (name: string) => void;
  setTableNumber: (tableNumber: string) => void;
  items: CartItem[];
  addItem: (food: Food) => void;
  removeItem: (foodId: string) => void;
  updateQuantity: (foodId: string, quantity: number) => void;
  clearCart: () => void;
  clearItems: () => void;
  getItemQuantity: (foodId: string) => number;
  totalItems: number;
  totalPrice: number;
  isHydrated: boolean;
  displayCode: string;
  setDisplayCode: (code: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isHydrated, setIsHydrated] = useState(false);
  const [name, setNameState] = useState<string>("");
  const [tableNumber, setTableNumberState] = useState<string>("");
  const [items, setItems] = useState<CartItem[]>([]);
  const [displayCode, setDisplayCodeState] = useState<string>("");

  // Load from sessionStorage on mount
  useEffect(() => {
    const stored = getStoredCart();
    setNameState(stored.name);
    setTableNumberState(stored.tableNumber);
    setItems(stored.items);
    setDisplayCodeState(stored.displayCode || "");
    setIsHydrated(true);
  }, []);

  // Redirect to login if name or tableNumber is missing
  useEffect(() => {
    if (!isHydrated) return;
    
    // Don't redirect if already on login page
    if (pathname === "/" || pathname === "/login") return;
    
    if (!name || !tableNumber) {
      router.push("/");
    }
  }, [isHydrated, name, tableNumber, pathname, router]);

  // Save to sessionStorage whenever state changes
  useEffect(() => {
    if (!isHydrated) return;
    const cartState: CartState = { name, tableNumber, items, displayCode };
    try {
      sessionStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartState));
    } catch (e) {
      console.error("Error saving cart to sessionStorage:", e);
    }
  }, [name, tableNumber, items, displayCode, isHydrated]);

  const setName = (newName: string) => {
    setNameState(newName);
  };

  const setTableNumber = (newTableNumber: string) => {
    setTableNumberState(newTableNumber);
  };

  const setDisplayCode = (code: string) => {
    setDisplayCodeState(code);
  };

  const addItem = (food: Food) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === food.id);
      if (existing) {
        return prev.map((item) =>
          item.id === food.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...food, quantity: 1 }];
    });
  };

  const removeItem = (foodId: string) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.id === foodId);
      if (existing && existing.quantity > 1) {
        return prev.map((item) =>
          item.id === foodId ? { ...item, quantity: item.quantity - 1 } : item
        );
      }
      return prev.filter((item) => item.id !== foodId);
    });
  };

  const updateQuantity = (foodId: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== foodId));
    } else {
      setItems((prev) =>
        prev.map((item) => (item.id === foodId ? { ...item, quantity } : item))
      );
    }
  };

  const clearCart = () => {
    setItems([]);
    setNameState("");
    setTableNumberState("");
    setDisplayCodeState("");
  };

  const clearItems = () => {
    setItems([]);
  };

  const getItemQuantity = (foodId: string) => {
    return items.find((item) => item.id === foodId)?.quantity || 0;
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        name,
        tableNumber,
        setName,
        setTableNumber,
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        clearItems,
        getItemQuantity,
        totalItems,
        totalPrice,
        isHydrated,
        displayCode,
        setDisplayCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};