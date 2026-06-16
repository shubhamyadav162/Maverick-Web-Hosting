import { motion } from 'motion/react';
import { LayoutGrid, Smartphone, Cpu, Check, ArrowRight } from 'lucide-react';
import { SERVICES_DATA } from '../data';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

interface ServicesProps {
  onStartProject: () => void;
}

// Framer Motion Animation Variants
const headerVariants = {
  hidden: { opacity: 0, y: -25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1], // Premium cubic-bezier out ease
    }
  }
};

const gridVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.12,
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 18,
      stiffness: 90,
    }
  }
};

const missionVariants = {
  hidden: { opacity: 0, y: 30, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    }
  }
};

export default function Services({ onStartProject }: ServicesProps) {
  // Setup separate intersection observers for each scrolling milestone
  const { ref: headerObserverRef, isInView: headerInView } = useAnimateOnScroll({ threshold: 0.1 });
  const { ref: gridObserverRef, isInView: gridInView } = useAnimateOnScroll({ threshold: 0.05 });
  const { ref: missionObserverRef, isInView: missionInView } = useAnimateOnScroll({ threshold: 0.1 });

  const getIcon = (id: string) => {
    switch (id) {
      case 'web':
        return <LayoutGrid className="h-6 w-6 text-indigo-400" />;
      case 'mobile':
        return <Smartphone className="h-6 w-6 text-indigo-400" />;
      case 'automation':
        return <Cpu className="h-6 w-6 text-indigo-400" />;
      default:
        return <LayoutGrid className="h-6 w-6 text-indigo-400" />;
    }
  };

  return (
    <section id="services-section" className="relative scroll-mt-20 bg-[#0A0A0A] py-24">
      {/* Decorative background grids */}
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#000000] to-transparent pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#000000] to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Intersection Observer Ref */}
        <motion.div 
          ref={headerObserverRef as any}
          variants={headerVariants}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          className="text-center md:max-w-3xl md:mx-auto"
        >
          <p className="font-mono text-xs font-semibold tracking-widest text-[#6366F1] uppercase">
            Architectural Focus
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
            Software Engineered to Order.
          </h2>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed md:text-base">
            We avoid mass-market templates, bulky frameworks, and generic middleware. Every block of code is developed modularly with structural validation, performance benchmarking, and premium aesthetics.
          </p>
        </motion.div>

        {/* 3 Columns Cards Grid with Intersection Observer Ref & Staggered Animations */}
        <motion.div 
          ref={gridObserverRef as any}
          variants={gridVariants}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-3"
        >
          {SERVICES_DATA.map((service) => (
            <motion.div
              id={`service-card-${service.id}`}
              key={service.id}
              variants={cardVariants}
              whileHover={{
                y: -6,
                borderColor: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 20px 40px -15px rgba(99, 102, 241, 0.08)',
              }}
              className="group relative rounded-2xl border border-white/5 bg-[#121212]/80 p-8 transition-colors duration-300 backdrop-blur-sm overflow-hidden"
            >
              {/* Card Ambient Glow Line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/40 transition-all duration-500" />
              
              {/* Icon Frame */}
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/5 bg-[#1A1A1A] group-hover:bg-[#202020] transition-colors duration-300">
                {getIcon(service.id)}
              </div>

              {/* Title & Description */}
              <h3 className="mt-6 font-display text-xl font-bold tracking-tight text-white">
                {service.title}
              </h3>
              <p className="mt-3 text-xs text-gray-400 leading-relaxed min-h-[72px]">
                {service.description}
              </p>

              {/* Sub-features list */}
              <ul className="mt-6 space-y-2.5 border-t border-white/5 pt-6 text-xs">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2 text-gray-300 font-sans">
                    <Check className="h-4 w-4 shrink-0 text-indigo-400 mt-0.5" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>

              {/* Interactive bottom row */}
              <div className="mt-8 flex justify-end">
                <button
                  onClick={onStartProject}
                  className="flex items-center gap-1 text-[11px] font-semibold text-indigo-400 group-hover:text-white transition-colors duration-300 uppercase tracking-wider"
                >
                  Initiate Build Scope
                  <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </div>

            </motion.div>
          ))}
        </motion.div>

        {/* Interactive Highlight Bar below Pillars with custom trigger */}
        <motion.div 
          ref={missionObserverRef as any}
          variants={missionVariants}
          initial="hidden"
          animate={missionInView ? 'visible' : 'hidden'}
          id="mission-section" 
          className="scroll-mt-20 mt-16 rounded-2xl border border-white/5 bg-gradient-to-r from-[#0a0a0a] via-[#101010] to-[#0a0a0a] p-8 md:p-12 overflow-hidden relative"
        >
          {/* Subtle light leak */}
          <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 flex flex-col justify-center space-y-5">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="font-mono text-[10px] tracking-widest text-[#6366F1] uppercase">OUR CORE MISSION</span>
              </div>
              
              <h3 className="font-display text-2xl font-bold text-white tracking-tight sm:text-3xl lg:text-4xl">
                We design with extreme intent.
              </h3>
              
              <p className="text-xs text-gray-400 leading-relaxed font-sans max-w-xl">
                Our design standard is heavily inspired by classical Swiss minimalism and performance hardware aesthetics. We optimize layouts for speed, reduce DOM elements for rendering efficiency, and emphasize crisp visual typography and spacing over random decoration.
              </p>
              
              <div className="pt-3 flex flex-wrap gap-3">
                <button
                  id="services-scoping-cta"
                  onClick={onStartProject}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 px-5.5 py-3 text-xs font-semibold text-white transition-all active:scale-95"
                >
                  Assemble Scoping Specs
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Right Architectural Image Frame Column */}
            <div className="lg:col-span-5 relative mt-6 lg:mt-0">
              <div className="group relative rounded-xl border border-white/10 bg-black/40 overflow-hidden aspect-[4/3] shadow-lg">
                <img
                  src="https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80"
                  alt="High quality creative design room with architectural mockups and devices"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale brightness-[0.7] group-hover:scale-[1.02] group-hover:grayscale-0 transition-all duration-700"
                />
                
                {/* Visual Glass Tag overlaying statistics */}
                <div className="absolute top-3 left-3 bg-[#0c0c0c]/90 border border-white/10 rounded-lg p-2.5 backdrop-blur-sm pointer-events-none">
                  <p className="font-mono text-[8px] uppercase tracking-wider text-indigo-400">Layout System</p>
                  <p className="font-display text-xs font-bold text-white mt-0.5">Swiss Grid Spec V4</p>
                </div>

                <div className="absolute bottom-3 right-3 bg-black/80 border border-white/5 rounded-lg px-2.5 py-1.5 font-mono text-[9px] text-gray-400 pointer-events-none">
                  <p className="flex items-center gap-1">
                    <span className="h-1 w-1 rounded-full bg-indigo-500" />
                    <span>ratio: 1.618 (golden)</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
