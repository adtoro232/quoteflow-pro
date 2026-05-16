"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const supabase = createClient();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      toast({
        title: "Inloggen mislukt",
        description: error.message,
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Card met logo erin verwerkt */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">

          {/* Logo sectie */}
          <div className="px-8 pt-10 pb-6 flex items-center justify-center border-b border-slate-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/offerteflow-logo.png"
              alt="OfferteFlow"
              className="w-full max-w-[280px] object-contain"
            />
          </div>

          {/* Form sectie */}
          <div className="p-8">
            <h1 className="text-xl font-bold text-slate-900 mb-1">Welkom terug</h1>
            <p className="text-slate-500 text-sm mb-6">Log in op uw account</p>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email" className="text-slate-700">E-mailadres</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="naam@bedrijf.nl"
                  required
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-slate-700">Wachtwoord</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="mt-1"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white h-11"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Inloggen...
                  </>
                ) : (
                  "Inloggen"
                )}
              </Button>
            </form>
          </div>
        </div>

        <p className="text-center text-slate-400 text-xs mt-6">
          © {new Date().getFullYear()} OfferteFlow
        </p>
      </div>
    </div>
  );
}
