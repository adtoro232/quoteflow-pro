"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Save, Trash2, Upload, X, ImageIcon } from "lucide-react";
import Image from "next/image";
import type { Product, ProductCategory } from "@/types";

interface ProductFormProps {
  product?: Product;
  categories: ProductCategory[];
}

export function ProductForm({ product, categories }: ProductFormProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(product?.image_url ?? null);
  const [imageUploading, setImageUploading] = useState(false);

  const [form, setForm] = useState({
    name: product?.name ?? "",
    category_id: product?.category_id ?? "",
    description: product?.description ?? "",
    unit: product?.unit ?? "stuks",
    purchase_price: product?.purchase_price?.toString() ?? "",
    sale_price: product?.sale_price?.toString() ?? "",
    vat_percentage: product?.vat_percentage?.toString() ?? "21",
    default_margin: product?.default_margin?.toString() ?? "",
    is_active: product?.is_active ?? true,
  });

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  }

  function clearImage() {
    setImageFile(null);
    setImagePreview(null);
  }

  async function uploadImage(productId: string): Promise<string | null> {
    if (!imageFile) return null;
    setImageUploading(true);
    const ext = imageFile.name.split(".").pop();
    const path = `${productId}/${Date.now()}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, imageFile, { upsert: true });
    setImageUploading(false);
    if (error) {
      console.error("[ProductForm] image upload error:", error);
      toast({ title: "Afbeelding upload mislukt", description: error.message, variant: "destructive" });
      return null;
    }
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const basePayload = {
        name: form.name,
        category_id: form.category_id || null,
        description: form.description || null,
        unit: form.unit,
        purchase_price: form.purchase_price ? parseFloat(form.purchase_price) : null,
        sale_price: parseFloat(form.sale_price),
        vat_percentage: parseFloat(form.vat_percentage),
        default_margin: form.default_margin ? parseFloat(form.default_margin) : null,
        is_active: form.is_active,
      };

      if (product) {
        // Existing product: upload image first (we have the ID), then update
        let image_url = product.image_url ?? null;
        if (imageFile) {
          const uploaded = await uploadImage(product.id);
          if (uploaded) {
            image_url = uploaded; // only update if upload succeeded
          }
          // If upload failed, keep the existing image_url and continue saving
        } else if (imagePreview === null) {
          image_url = null; // cleared by user
        }
        const { error } = await supabase
          .from("products")
          .update({ ...basePayload, image_url })
          .eq("id", product.id);
        console.log("[ProductForm] update error:", error);
        if (error) {
          toast({ title: "Fout bij bijwerken", description: error.message, variant: "destructive" });
          return;
        }
      } else {
        // New product: insert first to get ID, then upload image, then update
        const { data: inserted, error: insertError } = await supabase
          .from("products")
          .insert(basePayload)
          .select("id")
          .single();
        console.log("[ProductForm] insert error:", insertError);
        if (insertError || !inserted) {
          toast({ title: "Fout bij aanmaken", description: insertError?.message ?? "Onbekende fout", variant: "destructive" });
          return;
        }
        if (imageFile) {
          const image_url = await uploadImage(inserted.id);
          if (image_url) {
            await supabase.from("products").update({ image_url }).eq("id", inserted.id);
          }
        }
      }

      toast({
        title: product ? "Product bijgewerkt" : "Product aangemaakt",
        description: `${form.name} is succesvol ${product ? "bijgewerkt" : "aangemaakt"}.`,
      });

      router.push("/products");
      router.refresh();
    } catch (err) {
      console.error("[ProductForm] unexpected error:", err);
      toast({ title: "Onverwachte fout", description: String(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      const { error } = await supabase.from("products").delete().eq("id", product!.id);
      console.log("[ProductForm] delete error:", error);
      if (error) {
        toast({ title: "Fout bij verwijderen", description: error.message, variant: "destructive" });
        return;
      }
      toast({ title: "Product verwijderd", description: `${form.name} is verwijderd.` });
      router.push("/products");
      router.refresh();
    } catch (err) {
      console.error("[ProductForm] unexpected delete error:", err);
      toast({ title: "Onverwachte fout", description: String(err), variant: "destructive" });
    } finally {
      setDeleting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Productgegevens */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Productgegevens</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="name">Naam *</Label>
            <Input id="name" name="name" value={form.name} onChange={handleChange} required className="mt-1" />
          </div>
          <div>
            <Label htmlFor="category_id">Categorie</Label>
            <Select value={form.category_id} onValueChange={(v) => setForm((p) => ({ ...p, category_id: v }))}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Selecteer categorie" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="unit">Eenheid</Label>
            <Input id="unit" name="unit" value={form.unit} onChange={handleChange} className="mt-1" placeholder="stuks, uur, dag..." />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="description">Omschrijving</Label>
            <Textarea id="description" name="description" value={form.description} onChange={handleChange} rows={3} className="mt-1" />
          </div>
        </div>
      </div>

      {/* Prijzen */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Prijzen</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="purchase_price">Inkoopprijs (€)</Label>
            <Input id="purchase_price" name="purchase_price" type="number" step="0.01" min="0" value={form.purchase_price} onChange={handleChange} className="mt-1" placeholder="0.00" />
          </div>
          <div>
            <Label htmlFor="sale_price">Verkoopprijs (€) *</Label>
            <Input id="sale_price" name="sale_price" type="number" step="0.01" min="0" required value={form.sale_price} onChange={handleChange} className="mt-1" placeholder="0.00" />
          </div>
          <div>
            <Label htmlFor="vat_percentage">BTW percentage (%)</Label>
            <Select value={form.vat_percentage} onValueChange={(v) => setForm((p) => ({ ...p, vat_percentage: v }))}>
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0% (vrijgesteld)</SelectItem>
                <SelectItem value="9">9% (laag tarief)</SelectItem>
                <SelectItem value="21">21% (hoog tarief)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="default_margin">Standaard marge (%)</Label>
            <Input id="default_margin" name="default_margin" type="number" step="0.1" min="0" max="100" value={form.default_margin} onChange={handleChange} className="mt-1" placeholder="0" />
          </div>
        </div>
      </div>

      {/* Productafbeelding */}
      <div className="bg-white rounded-xl border shadow-sm p-6 space-y-4">
        <h2 className="font-semibold text-slate-900">Productafbeelding</h2>
        {imagePreview ? (
          <div className="flex items-start gap-4">
            <div className="relative w-32 h-32 rounded-lg overflow-hidden border bg-slate-50 shrink-0">
              <Image src={imagePreview} alt="Product preview" fill className="object-cover" unoptimized />
            </div>
            <div className="space-y-2">
              <p className="text-sm text-slate-500">
                {imageFile ? "Nieuwe afbeelding geselecteerd" : "Huidige afbeelding"}
              </p>
              <div className="flex gap-2">
                <label className="cursor-pointer">
                  <span className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-800">
                    <Upload className="w-3.5 h-3.5" />
                    Vervangen
                  </span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
                <button type="button" onClick={clearImage} className="inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-600">
                  <X className="w-3.5 h-3.5" />
                  Verwijderen
                </button>
              </div>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-colors">
            <ImageIcon className="w-8 h-8 text-slate-300 mb-2" />
            <span className="text-sm text-slate-500">Klik om een afbeelding te uploaden</span>
            <span className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP — max 5 MB</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
          </label>
        )}
        {imageUploading && (
          <p className="text-sm text-slate-500 flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Afbeelding uploaden...
          </p>
        )}
      </div>

      {/* Status */}
      <div className="bg-white rounded-xl border shadow-sm p-6">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            name="is_active"
            checked={form.is_active}
            onChange={handleChange}
            className="w-4 h-4 rounded border-gray-300"
          />
          <div>
            <p className="font-medium text-slate-900">Actief</p>
            <p className="text-sm text-slate-500">Inactieve producten zijn niet beschikbaar in de offerte builder</p>
          </div>
        </label>
      </div>

      <div className="flex justify-between gap-3">
        <div>
          {product && (
            <Button type="button" variant="destructive" onClick={() => setShowDeleteDialog(true)}>
              <Trash2 className="w-4 h-4" />
              Verwijderen
            </Button>
          )}
        </div>
        <div className="flex gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>Annuleren</Button>
          <Button type="submit" disabled={loading}>
            {loading ? <><Loader2 className="w-4 h-4 animate-spin" />Opslaan...</> : <><Save className="w-4 h-4" />{product ? "Bijwerken" : "Product aanmaken"}</>}
          </Button>
        </div>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product verwijderen</DialogTitle>
            <DialogDescription>
              Weet u zeker dat u <strong>{form.name}</strong> wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)} disabled={deleting}>Annuleren</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? <><Loader2 className="w-4 h-4 animate-spin" />Verwijderen...</> : <><Trash2 className="w-4 h-4" />Verwijderen</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </form>
  );
}
