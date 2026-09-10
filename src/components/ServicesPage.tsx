import { useState, useMemo } from 'react';
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
  Cpu,
  Search,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import type { ElementType } from 'react';
import { View } from '../types';
import { PRODUCTS_DATA, DIGITAL_PRODUCTS_DATA } from '../data';

interface ServicesPageProps {
  onNavigate: (view: View) => void;
  onNavigateToCheckout: (serviceId: string) => void;
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
  Cpu,
  ShieldCheck,
  Zap,
};

function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ServicesPage({ onNavigate, onNavigateToCheckout }: ServicesPageProps) {
  const [filter, setFilter] = useState<'all' | 'micro' | 'standard' | 'enterprise'>('all');
  const [search, setSearch] = useState('');

  const allProducts = useMemo(() => {
    return [...DIGITAL_PRODUCTS_DATA, ...PRODUCTS_DATA];
  }, []);

  const filteredProducts = useMemo(() => {
    return allProducts.filter((product) => {
      // Category filter
      if (filter === 'micro' && product.price >= 1000) return false;
      if (filter === 'standard' && (product.price < 1000 || product.price >= 10000)) return false;
      if (filter === 'enterprise' && product.price < 10000) return false;

      // Search filter
      if (search.trim()) {
        const q = search.toLowerCase().trim();
        const matchesTitle = product.title.toLowerCase().includes(q);
        const matchesDesc = product.description.toLowerCase().includes(q);
        const matchesPrice = product.price.toString().includes(q);
        const matchesTag = product.tagline.toLowerCase().includes(q);
        return matchesTitle || matchesDesc || matchesPrice || matchesTag;
      }
      return true;
    });
  }, [allProducts, filter, search]);

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

        {/* HERO BANNER */}
        <div className="relative rounded-2xl border border-white/5 bg-[#0B0B0B] p-8 md:p-12 mb-12 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 text-xs font-mono text-indigo-400 mb-3">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Verified Business Solutions & SLA Guarantees</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl font-extrabold tracking-tight text-white leading-tight">
                Services & Product Catalog
              </h1>
              <p className="mt-2 text-sm text-gray-400 max-w-2xl leading-relaxed">
                Enterprise cloud infrastructure, custom web & mobile software architectures, bespoke API modules, and on-demand IT diagnostics engineered by Maverick Enterprises.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => onNavigate('contact')}
                className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-semibold text-white transition-all"
              >
                <FileText className="h-3.5 w-3.5 text-indigo-400" />
                <span>Request Custom SOW</span>
              </button>
            </div>
          </div>
        </div>

        {/* CUSTOM SCOPING & MILESTONE INVOICING CARD */}
        <div className="rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-[#0C0F1D] via-[#0B0B0B] to-[#0B0B0B] p-6 md:p-8 mb-12 relative overflow-hidden">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="max-w-3xl">
              <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 uppercase tracking-wider mb-2">
                <Zap className="h-3.5 w-3.5 text-emerald-400" />
                <span>Flexible Invoicing Architecture</span>
              </div>
              <h2 className="text-xl font-bold text-white font-display">
                Custom Scoped Milestones & Sprint Billing (₹10 – ₹50,000+)
              </h2>
              <p className="mt-2 text-xs md:text-sm text-gray-400 leading-relaxed">
                For custom web applications, SaaS backends, and dedicated cloud deployments, clients are billed flexibly based on agreed 
                Statement of Work (SOW) deliverables, hourly engineering blocks, and sprint milestones. All payments are processed with instant automated GST reconciliation.
              </p>
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-mono">
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-gray-300">
                  Micro-Tasks: ₹10 – ₹999
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/5 text-gray-300">
                  Core Development: ₹1,000 – ₹9,999
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 font-bold">
                  Enterprise & FinTech Clusters: ₹10,000 – ₹1,00,000+
                </span>
              </div>
            </div>
            <div className="shrink-0 flex items-center gap-3">
              <button
                onClick={() => onNavigate('contact')}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white px-5 py-3 shadow-lg shadow-indigo-500/20 transition-all"
              >
                <span>Discuss Project Scope</span>
                <ArrowUpRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* FILTERS & SEARCH BAR */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: 'all', label: `All Solutions (${allProducts.length})` },
              { id: 'micro', label: 'Micro Tasks (₹10 – ₹999)' },
              { id: 'standard', label: 'Core Packages (₹1k – ₹9.9k)' },
              { id: 'enterprise', label: 'Enterprise & FinTech (₹10k – ₹100k)' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`text-xs font-mono px-4 py-2 rounded-xl border transition-all ${
                  filter === tab.id
                    ? 'bg-indigo-600 border-indigo-500 text-white font-bold shadow-sm shadow-indigo-500/30'
                    : 'bg-[#0B0B0B] border-white/5 text-gray-400 hover:text-white hover:border-white/10'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, spec or ₹ amount..."
              className="w-full pl-10 pr-4 py-2 bg-[#0B0B0B] border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>
        </div>

        {/* PRODUCTS GRID */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product, idx) => {
            const Icon = iconMap[product.iconName] || Box;
            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: Math.min(idx * 0.03, 0.3) }}
                className="group relative flex flex-col rounded-2xl border border-white/5 bg-[#0B0B0B] p-6 hover:border-indigo-500/30 hover:bg-[#0E0E0E] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 group-hover:border-indigo-500/30 group-hover:bg-indigo-500/10 transition-all duration-300">
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </div>
                  {product.price >= 50000 ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold">
                      FinTech Infrastructure
                    </span>
                  ) : product.price >= 20000 ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 font-bold">
                      Enterprise Tier
                    </span>
                  ) : product.price === 10 ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold">
                      Instant Ping
                    </span>
                  ) : null}
                </div>

                <div className="flex-1">
                  <h3 className="font-display text-sm font-bold text-white leading-snug mb-1">
                    {product.title}
                  </h3>
                  <p className="text-[10px] font-mono text-indigo-400/80 uppercase tracking-wider mb-3">
                    {product.tagline}
                  </p>
                  <p className="text-xs text-gray-400 leading-relaxed mb-4 line-clamp-3">
                    {product.description}
                  </p>

                  {product.deliverables.length > 0 && (
                    <ul className="space-y-1.5 mb-5">
                      {product.deliverables.slice(0, 4).map((item, i) => (
                        <li key={i} className="flex items-start gap-2 text-[11px] text-gray-500">
                          <span className="mt-1 h-1 w-1 shrink-0 rounded-full bg-indigo-400" />
                          <span className="line-clamp-1">{item}</span>
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
                    <span className="text-[10px] text-emerald-400 font-mono">GST Included</span>
                  </div>

                  <button
                    onClick={() => onNavigateToCheckout(product.id)}
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

        {filteredProducts.length === 0 && (
          <div className="text-center py-16 text-gray-500 font-mono text-xs">
            No products matched your filter. Try adjusting your search query.
          </div>
        )}

        {/* BOTTOM COMPLIANCE FOOTER */}
        <div className="mt-16 text-center text-xs font-mono text-gray-600 border-t border-white/5 pt-8">
          <p>All prices are inclusive of GST. Detailed Statement of Work (SOW) provided for every deployment.</p>
          <p className="mt-1">Maverick Web Development • Maverick Enterprises (GSTIN: 09ARGPY8862M1ZL)</p>
        </div>
      </div>
    </motion.div>
  );
}
