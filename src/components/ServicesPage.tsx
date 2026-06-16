import { motion } from 'motion/react';
import {
  ArrowLeft,
  Smartphone,
  Globe,
  Workflow,
  BarChart3,
  Layout,
  Box,
  ShoppingCart,
  Server,
  ArrowUpRight,
} from 'lucide-react';
import type { ElementType } from 'react';
import { View } from '../types';
import { PRODUCTS_DATA } from '../data';

interface ServicesPageProps {
  onNavigate: (view: View) => void;
}

const iconMap: Record<string, ElementType> = {
  Smartphone,
  Globe,
  Workflow,
  BarChart3,
  Layout,
  Box,
  ShoppingCart,
  Server,
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ServicesPage({ onNavigate }: ServicesPageProps) {
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
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
            <div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Product Catalog
              </h1>
              <p className="mt-2 text-sm text-indigo-400 font-mono">
                Premium digital solutions engineered by Maverick Enterprises
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {PRODUCTS_DATA.map((product, idx) => {
            const Icon = iconMap[product.iconName] || Box;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="group relative flex flex-col rounded-2xl border border-white/5 bg-[#0B0B0B] p-6 hover:border-indigo-500/30 hover:bg-[#0E0E0E] transition-all duration-300"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 mb-4 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-all duration-300">
                  <Icon className="h-5 w-5 text-indigo-400" />
                </div>

                <div className="flex-1">
                  <h3 className="font-display text-sm font-bold text-white leading-snug mb-1">
                    {product.title}
                  </h3>
                  <p className="text-[10px] font-mono text-indigo-400/80 uppercase tracking-wider mb-3">
                    {product.tagline}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4">
                    {product.description}
                  </p>

                  {product.deliverables.length > 0 && (
                    <ul className="space-y-1.5 mb-5">
                      {product.deliverables.map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-gray-500">
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="pt-4 border-t border-white/5 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg font-bold text-white font-display">
                      {formatPrice(product.price)}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">+ GST</span>
                  </div>

                  <button
                    onClick={() => {
                      window.history.pushState({}, '', `/checkout?service=${product.id}`);
                      onNavigate('checkout');
                    }}
                    className="group/btn inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white px-4 py-2.5 shadow-lg shadow-indigo-500/10 transition-all duration-200 active:scale-[0.98]"
                  >
                    Proceed to Booking
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 text-center text-xs font-mono text-gray-600 border-t border-white/5 pt-8">
          <p>All prices are in INR (₹). GST @18% will be applied at checkout.</p>
          <p className="mt-1">Mavrick Web Development • Maverick Enterprises</p>
        </div>
      </div>
    </motion.div>
  );
}
