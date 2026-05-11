import { createClient } from "@/lib/supabase/server";
import { Topbar } from "@/components/layout/topbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Plus, Package, ChevronRight } from "lucide-react";
import Image from "next/image";
import { formatCurrency } from "@/lib/utils";
import type { Product } from "@/types";

export default async function ProductsPage() {
  const supabase = await createClient();

  const { data: products = [] } = await supabase
    .from("products")
    .select("*, category:product_categories(name)")
    .order("name", { ascending: true });

  const safeProducts = (products ?? []) as Product[];

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <Topbar>
        <Button asChild size="sm">
          <Link href="/products/new">
            <Plus className="w-4 h-4" />
            Nieuw product
          </Link>
        </Button>
      </Topbar>

      <div className="flex-1 overflow-y-auto p-6">
        {safeProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Package className="w-12 h-12 text-slate-300 mb-4" />
            <p className="text-slate-500 font-medium">Nog geen producten</p>
            <p className="text-slate-400 text-sm mb-4">Voeg producten en diensten toe aan uw catalogus</p>
            <Button asChild size="sm">
              <Link href="/products/new">
                <Plus className="w-4 h-4" />
                Nieuw product
              </Link>
            </Button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b bg-slate-50/50">
              <p className="text-sm text-slate-500">{safeProducts.length} product{safeProducts.length !== 1 ? "en" : ""}</p>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="w-12"></th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Naam</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Categorie</th>
                  <th className="text-left px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Eenheid</th>
                  <th className="text-right px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Verkoopprijs</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">BTW</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-slate-500 uppercase tracking-wide">Status</th>
                  <th className="w-12"></th>
                </tr>
              </thead>
              <tbody>
                {safeProducts.map((product) => (
                  <tr key={product.id} className="border-b last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="pl-4 pr-2 py-3 w-12">
                      <Link href={`/products/${product.id}`}>
                        {product.image_url ? (
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden border bg-slate-50 shrink-0">
                            <Image src={product.image_url} alt={product.name} fill className="object-cover" unoptimized />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                            <Package className="w-4 h-4 text-slate-400" />
                          </div>
                        )}
                      </Link>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/products/${product.id}`} className="font-medium text-slate-900 hover:text-blue-700">
                        {product.name}
                      </Link>
                      {product.description && (
                        <p className="text-xs text-slate-400 mt-0.5 truncate max-w-xs">{product.description}</p>
                      )}
                    </td>
                    <td className="px-4 py-4 text-slate-600">{product.category?.name ?? "—"}</td>
                    <td className="px-4 py-4 text-slate-600">{product.unit}</td>
                    <td className="px-4 py-4 text-right font-medium">{formatCurrency(product.sale_price)}</td>
                    <td className="px-4 py-4 text-center text-slate-600">{product.vat_percentage}%</td>
                    <td className="px-4 py-4 text-center">
                      <Badge variant={product.is_active ? "success" : "secondary"}>
                        {product.is_active ? "Actief" : "Inactief"}
                      </Badge>
                    </td>
                    <td className="px-4 py-4">
                      <Link href={`/products/${product.id}`} className="text-slate-400 hover:text-slate-600">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
