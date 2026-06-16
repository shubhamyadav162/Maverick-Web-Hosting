import { useState, useEffect, FormEvent } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShieldCheck, Loader2, Check, LogIn } from 'lucide-react';
import { User, View } from '../types';
import { PRODUCTS_DATA } from '../data';

interface CheckoutPageProps {
  user: User | null;
  onNavigate: (view: View) => void;
  onOpenLogin: () => void;
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function CheckoutPage({ user, onNavigate, onOpenLogin }: CheckoutPageProps) {
  const [serviceId, setServiceId] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const product = PRODUCTS_DATA.find((p) => p.id === serviceId);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('service');
    setServiceId(id);
  }, []);

  const basePrice = product?.price || 0;
  const gstAmount = Math.round(basePrice * 0.18);
  const totalPayable = basePrice + gstAmount;

  const handleProceedToPayment = async (e: FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate gateway redirect handshake
    await new Promise((r) => setTimeout(r, 2000));

    setIsProcessing(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 4000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-black pt-32 pb-24 overflow-hidden min-h-screen"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => {
            window.history.pushState({}, '', '/services');
            onNavigate('services');
          }}
          className="group inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors mb-10 py-1"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Back to catalog</span>
        </button>

        {!user ? (
          <div className="rounded-2xl border border-white/5 bg-[#0B0B0B] p-12 text-center max-w-lg mx-auto">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 mb-4">
              <LogIn className="h-6 w-6 text-indigo-400" />
            </div>
            <h2 className="font-display text-lg font-bold text-white mb-2">Sign in to Continue</h2>
            <p className="text-xs text-gray-400 mb-6 max-w-xs mx-auto leading-relaxed">
              Please authenticate your partner account to proceed with booking and secure checkout.
            </p>
            <button
              onClick={onOpenLogin}
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 px-6 py-3 text-xs font-semibold text-white shadow-lg shadow-indigo-500/10 transition-all duration-200 active:scale-[0.98]"
            >
              <LogIn className="h-4 w-4" />
              Sign In to Checkout
            </button>
            <div className="mt-4">
              <button
                onClick={() => {
                  window.history.pushState({}, '', '/services');
                  onNavigate('services');
                }}
                className="text-xs text-gray-500 hover:text-white transition-colors font-mono"
              >
                Return to catalog
              </button>
            </div>
          </div>
        ) : !product ? (
          <div className="rounded-2xl border border-white/5 bg-[#0B0B0B] p-12 text-center">
            <p className="font-mono text-sm text-gray-400">This service is currently unavailable. Please return to the catalog.</p>
            <button
              onClick={() => {
                window.history.pushState({}, '', '/services');
                onNavigate('services');
              }}
              className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Browse Services
            </button>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Billing Form */}
            <div className="lg:col-span-3">
              <div className="rounded-2xl border border-white/5 bg-[#0B0B0B] p-6 sm:p-8 shadow-xl">
                <h2 className="font-display text-lg font-bold text-white mb-6">Billing Details</h2>

                <form onSubmit={handleProceedToPayment} className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 pl-1">
                      Full Name <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      defaultValue={user?.name || ''}
                      placeholder="Shubham Yadav"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-black/30 focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 pl-1">
                      Business Email ID <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="email"
                      required
                      defaultValue={user?.email || ''}
                      placeholder="partner@company.com"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-black/30 focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 pl-1">
                      Mobile Number <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="tel"
                      required
                      pattern="[0-9]{10}"
                      maxLength={10}
                      placeholder="9027579170"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-black/30 focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 pl-1">
                      Company Name <span className="text-gray-600">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Maverick Enterprises"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-black/30 focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-1.5 pl-1">
                      GSTIN <span className="text-gray-600">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="09ARGPY8862M1ZL"
                      className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:bg-black/30 focus:outline-none transition-all font-sans"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="group/btn relative w-full overflow-hidden rounded-xl bg-indigo-600 px-6 py-3.5 text-xs font-semibold text-white shadow-lg shadow-indigo-500/10 transition-all duration-200 hover:bg-indigo-500 disabled:opacity-70 active:scale-[0.98]"
                  >
                    {isProcessing ? (
                      <span className="inline-flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Connecting to secure gateway...
                      </span>
                    ) : isSuccess ? (
                      <span className="inline-flex items-center gap-2">
                        <Check className="h-4 w-4 text-emerald-300" />
                        Redirecting to secure gateway...
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-2">
                        <ShieldCheck className="h-4 w-4" />
                        Proceed to Secure Payment
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-white/5 bg-[#0B0B0B] p-6 sm:p-8 shadow-xl sticky top-28">
                <h2 className="font-display text-lg font-bold text-white mb-6">Order Summary</h2>

                <div className="space-y-4">
                  <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                    <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400 mb-1">
                      Selected Service
                    </p>
                    <p className="text-sm font-semibold text-white leading-snug">{product.title}</p>
                    <p className="text-[11px] text-gray-500 mt-1">{product.tagline}</p>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between text-gray-400">
                      <span>Base Price</span>
                      <span className="text-white font-medium">{formatPrice(basePrice)}</span>
                    </div>
                    <div className="flex items-center justify-between text-gray-400">
                      <span>GST @18%</span>
                      <span className="text-white font-medium">{formatPrice(gstAmount)}</span>
                    </div>
                    <div className="border-t border-white/5 pt-2 flex items-center justify-between">
                      <span className="font-semibold text-white">Total Payable</span>
                      <span className="font-bold text-white text-base font-display">
                        {formatPrice(totalPayable)}
                      </span>
                    </div>
                  </div>

                  <div className="pt-2">
                    {product.deliverables.length > 0 && (
                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-wider text-gray-500 mb-2">
                          Deliverables
                        </p>
                        <ul className="space-y-1.5">
                          {product.deliverables.map((item, i) => (
                            <li key={i} className="flex items-start gap-2 text-[11px] text-gray-500">
                              <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                              {item}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[10px] font-mono text-gray-600">
                  <ShieldCheck className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Secured via 256-bit SSL encryption</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
