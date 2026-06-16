import { motion } from 'motion/react';
import { ArrowLeft, BookOpen, ShieldCheck, HelpCircle } from 'lucide-react';
import { View } from '../types';
import { TERMS_VERBATIM, PRIVACY_VERBATIM, REFUND_VERBATIM } from '../data';

interface LegalPageProps {
  type: 'terms' | 'privacy' | 'refund';
  onNavigate: (view: View) => void;
}

export default function LegalPage({ type, onNavigate }: LegalPageProps) {
  const getDocumentContent = () => {
    switch (type) {
      case 'terms':
        return {
          title: 'Terms & Conditions',
          subtitle: 'Governing agreements of custom Maverick Enterprises solutions',
          text: TERMS_VERBATIM,
          icon: <BookOpen className="h-6 w-6 text-indigo-400" />
        };
      case 'privacy':
        return {
          title: 'Privacy Policy',
          subtitle: 'Client identity and workspace data protection statements',
          text: PRIVACY_VERBATIM,
          icon: <ShieldCheck className="h-6 w-6 text-indigo-400" />
        };
      case 'refund':
        return {
          title: 'Refund & Cancellation Policy',
          subtitle: 'Specific guidelines regarding milestone-based developments',
          text: REFUND_VERBATIM,
          icon: <HelpCircle className="h-6 w-6 text-indigo-400" />
        };
      default:
        return {
          title: 'Legal Agreement',
          subtitle: 'Terms of service',
          text: '',
          icon: <BookOpen className="h-6 w-6 text-indigo-400" />
        };
    }
  };

  const doc = getDocumentContent();

  // Helper to format the verbatim text with spacing and headers
  const renderParagraphs = (rawText: string) => {
    return rawText.split('\n\n').map((para, idx) => {
      // Check if it's a section title (e.g. "1. Scope of Services" or starts with "Terms and Conditions")
      const isHeader = 
        para.startsWith('Terms and Conditions') || 
        para.startsWith('Privacy Policy') ||
        para.startsWith('Refund and Cancellation Policy') ||
        /^[1-9]\.\s/.test(para);

      if (isHeader) {
        return (
          <h3 
            key={idx} 
            className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight mt-10 mb-4 first:mt-0 pt-4 border-t border-white/5 first:border-0"
          >
            {para}
          </h3>
        );
      }

      // Check if it's list-like (starts with "- ")
      if (para.includes('\n- ')) {
        const lines = para.split('\n');
        const listHeader = lines[0];
        const items = lines.slice(1);
        return (
          <div key={idx} className="space-y-3 my-6">
            <p className="text-sm text-gray-300 font-medium leading-relaxed">{listHeader}</p>
            <ul className="list-none pl-4 space-y-2 border-l-2 border-indigo-500/20">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-xs text-gray-400 leading-relaxed pl-2 relative">
                  <span className="absolute left-0 top-2.5 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  {item.replace('- ', '')}
                </li>
              ))}
            </ul>
          </div>
        );
      }

      return (
        <p key={idx} className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans my-4">
          {para}
        </p>
      );
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="bg-black pt-32 pb-24 overflow-hidden"
    >
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Back navigation action */}
        <button
          onClick={() => {
            onNavigate('home');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="group inline-flex items-center gap-2 text-xs font-mono text-gray-500 hover:text-white transition-colors mb-10 py-1"
        >
          <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-1" />
          <span>Return back to architecture</span>
        </button>

        {/* Page Header */}
        <div className="relative rounded-2xl border border-white/5 bg-[#0B0B0B] p-8 md:p-12 mb-12 shadow-xl overflow-hidden">
          {/* Accent glow corner */}
          <div className="absolute top-0 right-0 h-40 w-40 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5">
              {doc.icon}
            </div>
            <div>
              <h1 className="font-display text-2xl sm:text-3.5xl font-extrabold tracking-tight text-white leading-tight">
                {doc.title}
              </h1>
              <p className="mt-1.5 text-xs sm:text-sm text-indigo-400 font-mono">
                {doc.subtitle}
              </p>
            </div>
          </div>
        </div>

        {/* Document Body Material */}
        <div className="prose prose-invert max-w-none bg-[#050505] border border-white/5 rounded-2xl p-6 sm:p-10 shadow-lg">
          <div id={`verbatim-${type}-content`} className="text-left font-sans">
            {renderParagraphs(doc.text)}
          </div>
        </div>

        {/* Bottom validation seal */}
        <div className="mt-12 text-center text-xs font-mono text-gray-600 border-t border-white/5 pt-8">
          <p>Mavrick Web Development • Authorized Maverick Enterprises Compliance</p>
          <p className="mt-1">Cryptographic Release Hash: MD5-LEGAL-SECURE-2026</p>
        </div>

      </div>
    </motion.div>
  );
}
