import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface CartItem {
  id: string;
  name: string;
  qty: number;
}

interface CartStore {
  items: CartItem[];
  note: string;
  addItem: (item: Omit<CartItem, "qty">) => void;
  removeItem: (id: string) => void;
  setNote: (note: string) => void;
  clear: () => void;
}

export const useCartStore = create<CartStore>()(
  devtools(
    (set) => ({
      items: [],
      note: "",
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, qty: i.qty + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, qty: 1 }] };
        }, false, "addItem"),
      removeItem: (id) =>
        set(
          (state) => ({ items: state.items.filter((i) => i.id !== id) }),
          false,
          "removeItem"
        ),
      setNote: (note) => set({ note }, false, "setNote"),
      clear: () => set({ items: [], note: "" }, false, "clear"),
    }),
    { name: "CartStore" }
  )
);
