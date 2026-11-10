import { createContext, useContext, useEffect, useMemo, useReducer } from "react";

const STORAGE_KEY = "sppg_cart_v1";
const CartContext = createContext(null);

function loadCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    return Array.isArray(stored)
      ? stored.filter((item) => item && item.id && item.qty > 0)
      : [];
  } catch {
    return [];
  }
}

function cartReducer(items, action) {
  switch (action.type) {
    case "add": {
      const { menu, qty } = action;
      const found = items.find((item) => item.id === menu.id);
      if (found) {
        return items.map((item) =>
          item.id === menu.id
            ? { ...item, qty: Math.min(20, item.qty + qty) }
            : item
        );
      }
      return [...items, { ...menu, qty }];
    }
    case "change":
      return items
        .map((item) =>
          item.id === action.id
            ? { ...item, qty: Math.min(20, item.qty + action.delta) }
            : item
        )
        .filter((item) => item.qty > 0);
    case "remove":
      return items.filter((item) => item.id !== action.id);
    case "clear":
      return [];
    default:
      return items;
  }
}

export function CartProvider({ children }) {
  const [items, dispatch] = useReducer(cartReducer, [], loadCart);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage may be unavailable in private browsing contexts.
    }
  }, [items]);

  const value = useMemo(() => {
    const sum = (getValue) =>
      items.reduce((total, item) => total + item.qty * getValue(item), 0);
    return {
      items,
      totalPorsi: sum(() => 1),
      totalKalori: sum((item) => item.kalori),
      totalProtein: sum((item) => item.protein),
      addItem: (menu, qty) =>
        dispatch({
          type: "add",
          qty,
          menu: {
            id: menu.id,
            nama: menu.nama,
            emoji: menu.emoji,
            warna: menu.warna,
            kalori: menu.kalori,
            protein: menu.protein,
          },
        }),
      changeQty: (id, delta) => dispatch({ type: "change", id, delta }),
      removeItem: (id) => dispatch({ type: "remove", id }),
      clear: () => dispatch({ type: "clear" }),
    };
  }, [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// The provider and its consumer hook intentionally share this context module.
// eslint-disable-next-line react-refresh/only-export-components
export const useCart = () => useContext(CartContext);
