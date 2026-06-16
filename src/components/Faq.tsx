import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface FaqItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
  {
    question: "What is Mavrick's development process?",
    answer: "Our development lifecycle is strictly phase-based and structured into clear milestone blocks. We begin with a collaborative design workshop to map your user experience wireframes. This is followed sequentially by frontend engineering, backend integrations, multi-stage QA cycles, and release handoffs. Each phase is subject to your interactive approval in our client portal."
  },
  {
    question: "How long do typical custom software builds take to deliver?",
    answer: "Timelines depend directly on system complexity, scale depth, and dependency bridges. A typical MVP prototype is staged and compiled within 4 to 6 weeks. Core custom platforms and comprehensive enterprise workflow overhauls average 8 to 14 weeks from initial scoping approval."
  },
  {
    question: "Are your platforms built using typical templates or visual builders?",
    answer: "None of them. We pride ourselves on custom software engineering. Every single component is hand-coded using optimized modern languages, structured frameworks, and customized API layers. This achieves unmatched performance ratings, maximum structural security, and visual fluidity next to generic template platforms."
  },
  {
    question: "How are project milestones scheduled and released?",
    answer: "Projects are divided into logical, payment-synchronized milestones (e.g., UI/UX approval, complete frontend, end-to-end integration). When we stage a milestone on our dev servers, you review it in real-time. Upon your confirmation, the milestone payment clears securely via corporate billing and progress starts immediately on the next phase."
  },
  {
    question: "Who owns the final application deliverables and source code?",
    answer: "You do. Upon complete architectural validation and final clearance of outstanding milestone invoices, we execute a complete, unrestricted intellectual property transfer. You receive full ownership of the source code, design assets, and compiled deployments unless specified otherwise in custom contracts."
  }
];

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleIndex = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq-section" className="relative scroll-mt-20 py-24 bg-black border-t border-white/5">
      {/* Background gradients aligned with hero & configurator styles */}
      <div className="absolute inset-0 bg-[#0A0A0A]/40 pointer-events-none" />
      <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center md:max-w-xl md:mx-auto mb-16">
          <p className="font-mono text-xs font-semibold tracking-widest text-[#6366F1] uppercase">
            Architectural FAQ
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Frequently Asked Queries
          </h2>
          <p className="mt-4 text-sm text-gray-400 font-sans leading-relaxed">
            Have questions about our tailor-made codebase architectures, milestone execution workflows, or support policies? Here's how we execute excellence.
          </p>
        </div>

        {/* Accordion Group */}
        <div className="space-y-4">
          {FAQ_ITEMS.map((item, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                id={`faq-item-${idx}`}
                key={idx}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isOpen 
                    ? 'border-indigo-500/45 bg-[#121212] shadow-lg shadow-indigo-500/5' 
                    : 'border-white/5 bg-[#121212]/30 hover:border-white/15'
                }`}
              >
                <button
                  id={`faq-toggle-btn-${idx}`}
                  onClick={() => toggleIndex(idx)}
                  className="flex w-full items-center justify-between p-6 text-left focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <div className="flex items-center gap-4">
                    <HelpCircle className={`h-5 w-5 shrink-0 transition-colors duration-300 ${isOpen ? 'text-indigo-400' : 'text-gray-500'}`} />
                    <span className="font-display text-sm sm:text-base font-semibold text-white tracking-tight">
                      {item.question}
                    </span>
                  </div>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-gray-400 group-hover:text-white"
                  >
                    <ChevronDown className="h-4 w-4" />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <div className="px-6 pb-6 pt-1 border-t border-white/5">
                        <p className="text-xs sm:text-sm text-gray-400 leading-relaxed font-sans">
                          {item.answer}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
