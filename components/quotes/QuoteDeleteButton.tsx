"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter,
  DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Trash2, Loader2 } from "lucide-react";

interface QuoteDeleteButtonProps {
  quoteId: string;
  quoteNumber: string;
}

export function QuoteDeleteButton({ quoteId, quoteNumber }: QuoteDeleteButtonProps) {
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await supabase.from("quotes").delete().eq("id", quoteId);
    toast({ title: "Offerte verwijderd" });
    setOpen(false);
    setLoading(false);
    router.refresh();
  }

  return (
    <>
      <button
        onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(true); }}
        className="p-1.5 rounded-md text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors"
        title="Verwijderen"
      >
        <Trash2 className="w-4 h-4" />
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Offerte verwijderen</DialogTitle>
            <DialogDescription>
              Weet u zeker dat u <strong>{quoteNumber}</strong> wilt verwijderen? Dit kan niet ongedaan worden gemaakt.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Annuleren</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
              Verwijderen
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
