import { createContext, useContext, useReducer } from "react";
import type { ReactNode } from "react";

export interface CartItem {
  id: string;
  name: string;
  qty: number;
}

interface CartState {
  items: CartItem[];
  note: string;
}

type CartAction =
  | { type: "ADD"; item: Omit<CartItem, "qty"> }
  | { type: "REMOVE"; id: string }
  | { type: "SET_NOTE"; note: string }
  | { type: "CLEAR" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.item.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.item.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.item, qty: 1 }] };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "SET_NOTE":
      return { ...state, note: action.note };
    case "CLEAR":
      return { items: [], note: "" };
    default:
      return state;
  }
}

interface CartContextValue extends CartState {
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  setNote: (note: string) => void;
  clear: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], note: "" });

  // `value` her render'da yeni bir obje: context'i tüketen tüm component'ler,
  // state'in hangi alanına ihtiyaç duyduğuna bakılmaksızın re-render olur.
  const value: CartContextValue = {
    ...state,
    addItem: (item) => dispatch({ type: "ADD", item }),
    removeItem: (id) => dispatch({ type: "REMOVE", id }),
    setNote: (note) => dispatch({ type: "SET_NOTE", note }),
    clear: () => dispatch({ type: "CLEAR" }),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart, CartProvider içinde kullanılmalı");
  return ctx;
}
