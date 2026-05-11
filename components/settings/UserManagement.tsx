"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { UserPlus, Loader2 } from "lucide-react";
import { formatDate } from "@/lib/utils";
import type { Profile } from "@/types";

interface UserManagementProps {
  users: Profile[];
  currentUserId: string;
}

export function UserManagement({ users, currentUserId }: UserManagementProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "employee" as "admin" | "employee",
  });
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();

  async function handleCreateUser(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: {
          full_name: form.full_name,
          role: form.role,
        },
      },
    });

    if (error) {
      toast({ title: "Fout bij aanmaken", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }

    toast({ title: "Gebruiker aangemaakt", description: `${form.full_name} is succesvol aangemaakt` });
    setOpen(false);
    setForm({ email: "", password: "", full_name: "", role: "employee" });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b flex items-center justify-between">
        <h3 className="font-semibold text-slate-900">Gebruikers</h3>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <UserPlus className="w-4 h-4" />
              Nieuwe gebruiker
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nieuwe gebruiker aanmaken</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div>
                <Label>Volledige naam *</Label>
                <Input
                  value={form.full_name}
                  onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label>E-mailadres *</Label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Tijdelijk wachtwoord *</Label>
                <Input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))}
                  required
                  minLength={8}
                  className="mt-1"
                  placeholder="Minimaal 8 tekens"
                />
              </div>
              <div>
                <Label>Rol *</Label>
                <Select value={form.role} onValueChange={(v) => setForm((p) => ({ ...p, role: v as "admin" | "employee" }))}>
                  <SelectTrigger className="mt-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="employee">Medewerker</SelectItem>
                    <SelectItem value="admin">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                Aanmaken
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-slate-50/50">
            <th className="text-left px-6 py-3 text-xs font-medium text-slate-500">Naam</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Rol</th>
            <th className="text-left px-4 py-3 text-xs font-medium text-slate-500">Lid sinds</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-b last:border-0">
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
                    <span className="text-xs font-bold text-white">
                      {user.full_name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">
                      {user.full_name}
                      {user.id === currentUserId && (
                        <span className="ml-2 text-xs text-slate-400">(u)</span>
                      )}
                    </p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-4">
                <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                  {user.role === "admin" ? "Administrator" : "Medewerker"}
                </Badge>
              </td>
              <td className="px-4 py-4 text-slate-500">{formatDate(user.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
