import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { ProductForm } from "@/components/products/ProductForm";
import { notFound } from "next/navigation";
import type { Product, ProductCategory } from "@/types";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: product }, { data: categories = [] }] = await Promise.all([
    supabase.from("products").select("*, category:product_categories(name)").eq("id", id).single(),
    supabase.from("product_categories").select("*").order("name"),
  ]);

  if (!product) notFound();

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar />
      <div className="flex-1 overflow-y-auto p-6 max-w-3xl">
        <ProductForm
          product={product as Product}
          categories={(categories ?? []) as ProductCategory[]}
        />
      </div>
    </div>
  );
}
