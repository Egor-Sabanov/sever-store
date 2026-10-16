"use client";

import type { ReactNode } from "react";
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import { getProduct } from "@/lib/products";

export type CartLine = { slug: string; size: string; quantity: number };
type CartContextValue = {
  lines: CartLine[];
  count: number;
  total: number;
  ready: boolean;
  addItem: (product: Product, size: string) => void;
  setQuantity: (slug: string, size: string, quantity: number) => void;
  removeItem: (slug: string, size: string) => void;
  clear: () => void;
};

const STORAGE_KEY = "sever-cart";
const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setLines(
            parsed.filter(
              (line): line is CartLine =>
                typeof line?.slug === "string" &&
                typeof line?.size === "string" &&
                Number.isInteger(line?.quantity) &&
                line.quantity > 0 &&
                line.quantity <= 10 &&
                Boolean(getProduct(line.slug)),
            ),
          );
        }
      }
    } catch {
      window.localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const addItem = useCallback((product: Product, size: string) => {
    setLines((current) => {
      const exists = current.find((line) => line.slug === product.slug && line.size === size);
      if (exists) {
        return current.map((line) =>
          line === exists ? { ...line, quantity: Math.min(10, line.quantity + 1) } : line,
        );
      }
      return [...current, { slug: product.slug, size, quantity: 1 }];
    });
  }, []);

  const setQuantity = useCallback((slug: string, size: string, quantity: number) => {
    if (quantity < 1) {
      setLines((current) => current.filter((line) => line.slug !== slug || line.size !== size));
      return;
    }
    setLines((current) =>
      current.map((line) =>
        line.slug === slug && line.size === size
          ? { ...line, quantity: Math.min(10, quantity) }
          : line,
      ),
    );
  }, []);

  const removeItem = useCallback(
    (slug: string, size: string) => {
      setQuantity(slug, size, 0);
    },
    [setQuantity],
  );
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      total: lines.reduce(
        (sum, line) => sum + (getProduct(line.slug)?.price ?? 0) * line.quantity,
        0,
      ),
      ready,
      addItem,
      setQuantity,
      removeItem,
      clear,
    }),
    [lines, ready, addItem, setQuantity, removeItem, clear],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
