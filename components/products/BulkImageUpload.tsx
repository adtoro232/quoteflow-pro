"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, X, ImageIcon, Check } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { Product } from "@/types";

export function BulkImageUpload({ products }: { products: Product[] }) {
  const supabase = createClient();
  const { toast } = useToast();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function toggleProduct(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function selectAll() {
    setSelected(new Set(products.map((p) => p.id)));
  }

  function clearSelection() {
    setSelected(new Set());
  }

  function handleClose() {
    setOpen(false);
    setImageFile(null);
    setImagePreview(null);
    setSelected(new Set());
  }

  async function handleSave() {
    if (!imageFile || selected.size === 0) return;
    setSaving(true);

    try {
      // Upload the image once using the first selected product id as folder
      const firstId = [...selected][0];
      const ext = imageFile.name.split(".").pop();
      const path = `${firstId}/bulk-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("product-image")
        .upload(path, imageFile, { upsert: true });

      if (uploadError) {
        toast({ title: "Upload mislukt", description: uploadError.message, variant: "destructive" });
        return;
      }

      const { data } = supabase.storage.from("product-image").getPublicUrl(path);
      const image_url = data.publicUrl;

      // Update all selected products
      const { error: updateError } = await supabase
        .from("products")
        .update({ image_url })
        .in("id", [...selected]);

      if (updateError) {
        toast({ title: "Bijwerken mislukt", description: updateError.message, variant: "destructive" });
        return;
      }

      toast({ title: "Afbeelding gekoppeld", description: `${selected.size} product${selected.size !== 1 ? "en" : ""} bijgewerkt.` });
      handleClose();
      router.refresh();
    } finally {
      setSaving(false);
    }
  }

  if (!open) {
    return (
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <ImageIcon className="w-4 h-4" />
        Afbeelding bulk-koppelen
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="font-semibold text-slate-900">Afbeelding bulk-koppelen</h2>
          <button onClick={handleClose} className="text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Image upload */}
          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">1. Kies een afbeelding</p>
            {imagePreview ? (
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border bg-slate-50 shrink-0">
                  <Image src={imagePreview} alt="Preview" fill className="object-cover" unoptimized />
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-slate-600">{imageFile?.name}</p>
                  <label className="cursor-pointer text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1">
                    <Upload className="w-3.5 h-3.5" />
                    Andere afbeelding
                    <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                  </label>
                </div>
              </div>
            ) : (
              <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
                <ImageIcon className="w-6 h-6 text-slate-300 mb-1" />
                <span className="text-sm text-slate-500">Klik om een afbeelding te uploaden</span>
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            )}
          </div>

          {/* Product selection */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-700">2. Selecteer producten ({selected.size} geselecteerd)</p>
              <div className="flex gap-2">
                <button onClick={selectAll} className="text-xs text-blue-600 hover:text-blue-800">Alles selecteren</button>
                <span className="text-slate-300">|</span>
                <button onClick={clearSelection} className="text-xs text-slate-500 hover:text-slate-700">Deselecteren</button>
              </div>
            </div>
            <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
              {products.map((product) => (
                <label key={product.id} className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50">
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 transition-colors ${selected.has(product.id) ? "bg-blue-600 border-blue-600" : "border-slate-300"}`}>
                    {selected.has(product.id) && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <input type="checkbox" className="hidden" checked={selected.has(product.id)} onChange={() => toggleProduct(product.id)} />
                  {product.image_url ? (
                    <div className="relative w-8 h-8 rounded overflow-hidden border bg-slate-50 shrink-0">
                      <Image src={product.image_url} alt={product.name} fill className="object-cover" unoptimized />
                    </div>
                  ) : (
                    <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center shrink-0">
                      <ImageIcon className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                  )}
                  <span className="text-sm text-slate-800 flex-1">{product.name}</span>
                  {product.image_url && <span className="text-xs text-slate-400">heeft al afbeelding</span>}
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t">
          <Button variant="outline" onClick={handleClose}>Annuleren</Button>
          <Button onClick={handleSave} disabled={!imageFile || selected.size === 0 || saving}>
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" />Bezig...</> : <><Upload className="w-4 h-4" />Koppelen aan {selected.size} product{selected.size !== 1 ? "en" : ""}</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
