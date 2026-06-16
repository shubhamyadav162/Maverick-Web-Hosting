import { motion } from 'motion/react';
import { ArrowUpRight, Code, Terminal, Sparkles } from 'lucide-react';

interface HeroProps {
  onContactClick: () => void;
  onExploreClick: () => void;
}

export default function Hero({ onContactClick, onExploreClick }: HeroProps) {
  const customTransition = { type: 'spring', damping: 30, stiffness: 80 };

  return (
    <section
      id="hero-section"
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black pt-32 pb-20 mesh-grid"
    >
      {/* Hero Stock Photography Background Underlay with Senior Dev Craftsmanship */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none">
        <img
          src="https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1920&q=80"
          alt="Technical development workstation background"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover opacity-70 brightness-[0.6] contrast-[1.15]"
        />
        {/* Soft, professional dark ambient gradient overlays to merge human workspace and tech graphics */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/65 to-[#0A0A0A]" />
        <div className="absolute inset-0 bg-radial-at-c from-transparent via-black/45 to-black/90" />
      </div>

      {/* Mesh and Radial Gradients pulsing */}
      <div className="absolute inset-0 bg-radial-at-c from-transparent via-black to-black opacity-55 z-0" />
      
      {/* Primary Violet-Indigo Glowing Orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.15, 0.25, 0.15],
          x: [0, 20, 0],
          y: [0, -30, 0],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute top-1/4 left-1/4 h-96 w-96 rounded-full bg-indigo-600/25 blur-3xl"
      />
      
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.1, 0.2, 0.1],
          x: [0, -20, 0],
          y: [0, 30, 0],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-violet-600/15 blur-3xl"
      />

      {/* Decorative Top Line of code block style */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#0A0A0A] to-transparent pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        
        {/* Glow Pill Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ...customTransition }}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-medium text-indigo-300 md:text-sm backdrop-blur-sm"
        >
          <span className="flex h-1.5 w-1.5 rounded-full bg-indigo-400 animate-ping" />
          <span>Now Accepting Global Partners for Q3/Q4</span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ...customTransition }}
          className="mt-8 font-display text-4xl font-extrabold tracking-tighter text-white sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05]"
        >
          We build custom websites,<br />
          <span className="bg-gradient-to-r from-gray-100 via-gray-300 to-indigo-300 bg-clip-text text-transparent">
            mobile apps,
          </span>{' '}
          and tailor-made workflows.
        </motion.h1>

        {/* Sub-headline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ...customTransition }}
          className="mx-auto mt-6 max-w-3xl text-base text-gray-400 sm:text-lg md:text-xl leading-relaxed"
        >
          Engineered for performance, designed for conversion, and built entirely to order.
          We transform complex, manual business logic into seamless, high-performance digital infrastructure.
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45, ...customTransition }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <button
            id="hero-cta-initiate"
            onClick={onContactClick}
            className="group flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-black transition-all hover:bg-gray-200 active:scale-95 sm:w-auto"
          >
            Initiate Consultation
            <ArrowUpRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          
          <button
            id="hero-cta-explore"
            onClick={onExploreClick}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-sm font-semibold text-white transition-all hover:border-white/20 hover:bg-white/10 active:scale-95 sm:w-auto backdrop-blur-sm"
          >
            Explore Our Architecture
          </button>
        </motion.div>

        {/* Senior Developer Grade Browser Mockup Container */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 1, delay: 0.6, type: 'spring', stiffness: 60, damping: 20 }}
          className="mt-16 relative mx-auto max-w-4xl"
        >
          {/* Decorative Back Gradients forming ambient light behind the frame */}
          <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-indigo-500/20 opacity-30 blur-2xl pointer-events-none" />
          
          <div className="relative rounded-2xl border border-white/10 bg-[#0c0c0c]/90 overflow-hidden shadow-2xl p-1 pb-0 backdrop-blur-md group hover:border-white/20 transition-all duration-300">
            {/* Browser Control Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-[#0a0a0a] border-b border-white/5">
              {/* Dots */}
              <div className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-full bg-rose-500/80" />
                <span className="h-3 w-3 rounded-full bg-amber-500/80" />
                <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              </div>
              {/* Address bar */}
              <div className="flex-1 max-w-sm mx-auto flex items-center justify-center rounded bg-white/5 border border-white/5 px-3 py-1 font-mono text-[10px] text-gray-500">
                <span className="text-indigo-400 select-none mr-1">https://</span>
                <span className="text-gray-300 select-all">app.mavrick.io/analytics-workspace</span>
              </div>
              {/* Actions placeholder */}
              <div className="flex items-center gap-1.5 opacity-0 sm:opacity-100">
                <span className="h-1.5 w-1.5 rounded-full bg-gray-600" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-600" />
                <span className="h-1.5 w-1.5 rounded-full bg-gray-600" />
              </div>
            </div>

            {/* Immersive high resolution stock asset visualization */}
            <div className="relative w-full overflow-hidden aspect-[16/9] md:aspect-[16/8] bg-black">
              <img
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=80"
                alt="Mavrick Customized Operational Control Analytics Interface representation"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-80 brightness-90 group-hover:opacity-90 group-hover:scale-[1.01] transition-all duration-700"
              />
              {/* Grid Overlays representing active data pipelines */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
              
              {/* Live floating stats on top of the mockup for tactile feel */}
              <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-3 justify-between items-center bg-[#070707]/80 backdrop-blur border border-white/10 rounded-xl p-3 md:p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs font-bold animate-pulse">
                    Live
                  </div>
                  <div>
                    <h4 className="text-xs font-bold font-display text-white">Operations Cluster Node: Gamma-6</h4>
                    <p className="text-[10px] text-gray-400 font-sans mt-0.5">Custom Telemetry Engine fully sync\'d.</p>
                  </div>
                </div>
                <div className="flex gap-4 text-left font-mono">
                  <div className="hidden xs:block">
                    <p className="text-[8px] text-gray-500 uppercase">Load Balance</p>
                    <p className="text-xs font-semibold text-white mt-0.5">0.14 Peak</p>
                  </div>
                  <div>
                    <p className="text-[8px] text-gray-500 uppercase">API Ingest</p>
                    <p className="text-xs font-semibold text-emerald-400 mt-0.5">99.998% OK</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Digital Blueprint Floating Stats banner */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className="mt-20 grid grid-cols-2 gap-4 border-t border-white/5 pt-12 md:grid-cols-4 max-w-4xl mx-auto"
        >
          <div className="text-left md:text-center p-2">
            <p className="font-display text-2xl font-bold text-white md:text-3xl">100%</p>
            <p className="mt-1 text-xs font-mono text-gray-500 uppercase tracking-wider">Tailor-Made Build</p>
          </div>
          <div className="text-left md:text-center p-2">
            <p className="font-display text-2xl font-bold text-white md:text-3xl">&lt; 100ms</p>
            <p className="mt-1 text-xs font-mono text-gray-500 uppercase tracking-wider">Server Response Time</p>
          </div>
          <div className="text-left md:text-center p-2">
            <p className="font-display text-2xl font-bold text-white md:text-3xl">iOS / Android</p>
            <p className="mt-1 text-xs font-mono text-gray-500 uppercase tracking-wider">Unified Device Performance</p>
          </div>
          <div className="text-left md:text-center p-2">
            <p className="font-display text-2xl font-bold text-white md:text-3xl">SECURE</p>
            <p className="mt-1 text-xs font-mono text-gray-500 uppercase tracking-wider">Cryptographic Handshakes</p>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
