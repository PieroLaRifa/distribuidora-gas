// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext(null);
const CART_KEY = "distribuidora_gas_cart";

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CART_KEY)) || [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  // product: objeto completo del producto
  const addToCart = (product, cantidad = 1) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        return prev.map((i) =>
          i.productId === product.id
            ? { ...i, cantidad: Math.min(i.cantidad + cantidad, product.stock) }
            : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          nombre: product.nombre,
          precio: product.precio,
          imagen: product.imagen,
          stock: product.stock,
          cantidad: Math.min(cantidad, product.stock),
        },
      ];
    });
  };

  const updateQuantity = (productId, cantidad) => {
    setItems((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, cantidad: Math.max(1, Math.min(cantidad, i.stock)) }
          : i
      )
    );
  };

  const removeFromCart = (productId) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((acc, i) => acc + i.cantidad, 0);
  const subtotal = items.reduce((acc, i) => acc + i.precio * i.cantidad, 0);

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQuantity, removeFromCart, clearCart, totalItems, subtotal }}
    >
      {children}
    </CartContext.Provider>
  );
}
// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart debe usarse dentro de CartProvider");
  return context;
}