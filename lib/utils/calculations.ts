import type { BuilderItem } from "@/types";

export function calcLineTotal(item: {
  quantity: number;
  unit_price: number;
  discount_percentage: number;
}): number {
  const gross = item.quantity * item.unit_price;
  const discounted = gross * (1 - item.discount_percentage / 100);
  return Math.round(discounted * 100) / 100;
}

export function calcTotals(
  items: BuilderItem[],
  extraDiscount: number = 0
): {
  subtotal: number;
  vat_amount: number;
  discount_amount: number;
  total: number;
} {
  const subtotal = items.reduce((sum, item) => sum + item.line_total, 0);

  const vat_amount = items.reduce((sum, item) => {
    return sum + item.line_total * (item.vat_percentage / 100);
  }, 0);

  const discount_amount = extraDiscount;
  const total = subtotal - discount_amount + vat_amount;

  return {
    subtotal: Math.round(subtotal * 100) / 100,
    vat_amount: Math.round(vat_amount * 100) / 100,
    discount_amount: Math.round(discount_amount * 100) / 100,
    total: Math.round(total * 100) / 100,
  };
}
