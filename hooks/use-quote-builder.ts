"use client";

import { create } from "zustand";
import { calcLineTotal, calcTotals } from "@/lib/utils/calculations";
import type { BuilderItem, BuilderState } from "@/types";

interface QuoteBuilderStore extends BuilderState {
  step: number;
  setStep: (step: number) => void;
  setCustomer: (id: string) => void;
  setTemplate: (id: string) => void;
  addItem: (item: Omit<BuilderItem, "id" | "line_total" | "sort_order">) => void;
  updateItem: (id: string, changes: Partial<BuilderItem>) => void;
  removeItem: (id: string) => void;
  moveItem: (id: string, direction: "up" | "down") => void;
  setDiscount: (amount: number) => void;
  setNotes: (notes: string) => void;
  setMessage: (msg: string) => void;
  setExpiryDate: (date: string) => void;
  reset: () => void;
  totals: { subtotal: number; vat_amount: number; discount_amount: number; total: number };
}

function defaultExpiryDate(): string {
  const d = new Date();
  d.setMonth(d.getMonth() + 1);
  return d.toISOString().split("T")[0];
}

const initialState: BuilderState = {
  customer_id: "",
  template_id: "",
  items: [],
  discount_amount: 0,
  internal_notes: "",
  customer_message: "",
  expiry_date: defaultExpiryDate(),
};

function recalcItem(item: BuilderItem): BuilderItem {
  return { ...item, line_total: calcLineTotal(item) };
}

export const useQuoteBuilder = create<QuoteBuilderStore>((set, get) => ({
  ...initialState,
  step: 1,
  totals: { subtotal: 0, vat_amount: 0, discount_amount: 0, total: 0 },

  setStep: (step) => set({ step }),
  setCustomer: (id) => set({ customer_id: id }),
  setTemplate: (id) => set({ template_id: id }),

  addItem: (item) => {
    const newItem: BuilderItem = {
      ...item,
      id: crypto.randomUUID(),
      line_total: calcLineTotal(item),
      sort_order: get().items.length,
    };
    const items = [...get().items, newItem];
    const totals = calcTotals(items, get().discount_amount);
    set({ items, totals });
  },

  updateItem: (id, changes) => {
    const items = get().items.map((item) =>
      item.id === id ? recalcItem({ ...item, ...changes }) : item
    );
    const totals = calcTotals(items, get().discount_amount);
    set({ items, totals });
  },

  removeItem: (id) => {
    const items = get().items.filter((item) => item.id !== id);
    const totals = calcTotals(items, get().discount_amount);
    set({ items, totals });
  },

  moveItem: (id, direction) => {
    const items = [...get().items];
    const idx = items.findIndex((i) => i.id === id);
    if (direction === "up" && idx > 0) {
      [items[idx - 1], items[idx]] = [items[idx], items[idx - 1]];
    } else if (direction === "down" && idx < items.length - 1) {
      [items[idx], items[idx + 1]] = [items[idx + 1], items[idx]];
    }
    set({ items: items.map((item, i) => ({ ...item, sort_order: i })) });
  },

  setDiscount: (amount) => {
    const totals = calcTotals(get().items, amount);
    set({ discount_amount: amount, totals });
  },

  setNotes: (notes) => set({ internal_notes: notes }),
  setMessage: (msg) => set({ customer_message: msg }),
  setExpiryDate: (date) => set({ expiry_date: date }),

  reset: () => set({ ...initialState, expiry_date: defaultExpiryDate(), step: 1, totals: { subtotal: 0, vat_amount: 0, discount_amount: 0, total: 0 } }),
}));
