import { motion } from 'motion/react';
import { ArrowLeft, Layout, Box, Globe, ShoppingCart, ShieldCheck } from 'lucide-react';
import type { ElementType } from 'react';
import { View } from '../types';
import { DIGITAL_PRODUCTS_DATA } from '../data';

interface ProductsPageProps {
  onNavigate: (view: View) => void;
}

const iconMap: Record<string, ElementType> = {
  Layout, Box, Globe,
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ProductsPage({ onNavigate }: ProductsPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-black pt-32 pb-24 overflow-hidden min-h-screen"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors mb-10 py-1"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Return to home</span>
        </button>

        <div className="relative rounded-2xl border border-white/5 bg-[#0B0B0B] p-8 md:p-12 mb-16 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Digital Products
              </h1>
              <p className="mt-2 text-sm text-emerald-400 font-mono">
                Ready-to-use source code packages at affordable prices
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DIGITAL_PRODUCTS_DATA.map((product) => {
            const Icon = iconMap[product.iconName] || Box;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="group relative rounded-2xl border border-white/5 bg-[#0B0B0B] p-6 transition-all duration-300 hover:border-emerald-500/20 hover:shadow-lg hover:shadow-emerald-500/5 overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500/0 to-transparent group-hover:via-emerald-500/40 transition-all duration-500" />
                
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/5 bg-[#1A1A1A] group-hover:bg-emerald-500/10 transition-colors duration-300">
                  <Icon className="h-6 w-6 text-emerald-400" />
                </div>

                <h3 className="mt-5 font-display text-lg font-bold text-white">
                  {product.title}
                </h3>
                <p className="mt-1 text-xs text-indigo-400 font-mono">
                  {product.tagline}
                </p>
                <p className="mt-3 text-xs text-gray-400 leading-relaxed min-h-[60px]">
                  {product.description}
                </p>

                <ul className="mt-4 space-y-1.5 text-xs">
                  {product.deliverables.map((item, i) => (
                    <li key={i} className="flex items-start gap-2 text-gray-500">
                      <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-emerald-400" />
                      {item}
                    </li>
                  ))}
                </ul>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                  <span className="font-display text-2xl font-bold text-white">
                    {formatPrice(product.price)}
                  </span>
                  <button
                    onClick={() => {
                      const path = `/checkout?service=${product.id}`;
                      window.history.pushState({ view: 'checkout' }, '', path);
                      onNavigate('checkout');
                    }}
                    className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 px-4 py-2.5 text-xs font-semibold text-white shadow-lg shadow-emerald-500/10 transition-all duration-200 active:scale-[0.98]"
                  >
                    <ShoppingCart className="h-3.5 w-3.5" />
                    Buy Now
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 rounded-2xl border border-white/5 bg-[#0B0B0B] p-8 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mb-4">
            <ShieldCheck className="h-4 w-4 text-emerald-400" />
            <span className="text-[11px] font-mono text-emerald-400 font-semibold">SECURE PAYMENT</span>
          </div>
          <p className="text-sm text-gray-400 max-w-xl mx-auto leading-relaxed">
            All payments are securely processed via <strong className="text-white">Easebuzz</strong> — 
            a RBI-approved payment gateway. Your transaction data is encrypted with 256-bit SSL. 
            We never store your card or UPI credentials.
          </p>
          <div className="mt-4 flex items-center justify-center gap-4 text-[10px] font-mono text-gray-600">
            <span>256-bit SSL</span>
            <span className="h-3 w-px bg-white/10" />
            <span>RBI Compliant</span>
            <span className="h-3 w-px bg-white/10" />
            <span>UPI & Cards</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
