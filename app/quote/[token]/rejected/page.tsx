import { XCircle } from "lucide-react";

export default function RejectedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
          <XCircle className="w-10 h-10 text-slate-500" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Offerte afgewezen</h1>
        <p className="text-slate-600">
          Wij hebben uw reactie ontvangen. Mocht u vragen hebben, neem dan gerust contact met ons op.
        </p>
      </div>
    </div>
  );
}
