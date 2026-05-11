import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function AcceptedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10 text-emerald-600" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Offerte geaccepteerd</h1>
        <p className="text-slate-600">
          Bedankt voor uw akkoord. Wij nemen zo spoedig mogelijk contact met u op.
        </p>
      </div>
    </div>
  );
}
