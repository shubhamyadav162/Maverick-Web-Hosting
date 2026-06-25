import { ShieldCheck, Lock, Zap } from 'lucide-react';

export default function PaymentTrustBar() {
  return (
    <section className="relative border-y border-white/5 bg-[#050505] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-center">

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span>Payments powered by <strong className="text-white">Easebuzz</strong></span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Lock className="h-4 w-4 text-indigo-400" />
            <span>256-bit SSL Encrypted</span>
          </div>

          <div className="hidden sm:block h-4 w-px bg-white/10" />

          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Zap className="h-4 w-4 text-amber-400" />
            <span>UPI · Cards · Net Banking</span>
          </div>

        </div>
      </div>
    </section>
  );
}
