import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Building2, ArrowLeft } from 'lucide-react';
import { View } from '../types';
import { COMPLIANCE_DATA } from '../data';

interface ContactPageProps {
  onNavigate: (view: View) => void;
}

export default function ContactPage({ onNavigate }: ContactPageProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-black pt-32 pb-24 overflow-hidden min-h-screen"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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

        <div className="relative rounded-2xl border border-white/5 bg-[#0B0B0B] p-8 md:p-12 mb-12 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

          <div className="relative z-10">
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
                <Building2 className="h-6 w-6 text-indigo-400" />
              </div>
              <div>
                <h1 className="font-display text-2xl sm:text-3.5xl font-extrabold tracking-tight text-white leading-tight">
                  Contact Us
                </h1>
                <p className="mt-1.5 text-xs sm:text-sm text-indigo-400 font-mono">
                  {COMPLIANCE_DATA.parentCompany} — Official Support Channels
                </p>
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="rounded-xl border border-white/5 bg-white/5 p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <Mail className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">Email</p>
                    <a
                      href={`mailto:${COMPLIANCE_DATA.email}`}
                      className="text-sm text-white hover:underline font-mono"
                    >
                      {COMPLIANCE_DATA.email}
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Send us an email for project inquiries, support, or any business-related communication. We aim to respond within 24 hours.
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/5 p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <Phone className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">Phone</p>
                    <a href="tel:+919027579170" className="text-sm text-white hover:underline font-mono">
                      +91 9027579170
                    </a>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed">
                  Call us during business hours (Mon–Sat, 10 AM – 7 PM IST) for urgent queries or direct consultation.
                </p>
              </div>

              <div className="rounded-xl border border-white/5 bg-white/5 p-5 space-y-4 sm:col-span-2">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <MapPin className="h-5 w-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-indigo-400">Registered Office Address</p>
                    <p className="text-sm text-white font-mono">
                      {COMPLIANCE_DATA.address}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#050505] border border-white/5 rounded-2xl p-6 sm:p-10 shadow-lg">
          <h2 className="font-display text-lg font-bold text-white mb-4">Start a Project</h2>
          <p className="text-xs text-gray-400 leading-relaxed mb-6">
            Looking for a custom web application, mobile app, or workflow automation? Fill out our project inquiry form and we will get back to you with a tailored proposal.
          </p>
          <button
            onClick={() => {
              onNavigate('home');
              setTimeout(() => {
                const element = document.getElementById('configurator-section');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }, 120);
            }}
            className="rounded-xl bg-white px-6 py-3 text-xs font-semibold text-black hover:bg-gray-200 transition-colors"
          >
            Open Project Inquiry Form
          </button>
        </div>

        <div className="mt-12 text-center text-xs font-mono text-gray-600 border-t border-white/5 pt-8">
          <p>{COMPLIANCE_DATA.agencyName} • {COMPLIANCE_DATA.parentCompany}</p>
          <p className="mt-1">GSTIN: {COMPLIANCE_DATA.gstin} • UDYAM: {COMPLIANCE_DATA.udyam}</p>
        </div>
      </div>
    </motion.div>
  );
}
