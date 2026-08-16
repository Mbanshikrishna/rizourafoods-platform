import { createContext, useContext, useMemo, useState } from "react";

const CartContext = createContext(null);
export function CartProvider({ children }) {
  const [items, setItems] = useState(() => JSON.parse(localStorage.getItem("rizoura-enquiry-cart") || "[]"));
  const update = (next) => { setItems(next); localStorage.setItem("rizoura-enquiry-cart", JSON.stringify(next)); };
  const value = useMemo(() => ({
    items,
    add(product) {
      const current = items.find((item) => item.id === product.id);
      update(current ? items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item) : [...items, { ...product, quantity: 1, packSize: "To be confirmed" }]);
    },
    updateItem(id, changes) { update(items.map((item) => item.id === id ? { ...item, ...changes } : item)); },
    remove(id) { update(items.filter((item) => item.id !== id)); },
    clear() { update([]); },
  }), [items]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
export const useCart = () => useContext(CartContext);
