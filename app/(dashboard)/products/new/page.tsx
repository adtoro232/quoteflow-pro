import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { ProductForm } from "@/components/products/ProductForm";
import type { ProductCategory } from "@/types";

export default async function NewProductPage() {
  const supabase = await createClient();
  const { data: categories = [] } = await supabase
    .from("product_categories")
    .select("*")
    .order("name");

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar />
      <div className="flex-1 overflow-y-auto p-6 max-w-3xl">
        <ProductForm categories={(categories ?? []) as ProductCategory[]} />
      </div>
    </div>
  );
}
