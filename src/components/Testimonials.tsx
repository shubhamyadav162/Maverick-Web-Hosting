import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Quote, ChevronLeft, ChevronRight, Star, MessageSquare } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  avatarInitials: string;
  quote: string;
  rating: number;
  projectScope: string;
  tags: string[];
}

const TESTIMONIALS_DATA: Testimonial[] = [
  {
    id: 1,
    name: "Amit Sharma",
    role: "Chief Technology Officer",
    company: "DevFlow Solutions",
    avatarInitials: "AS",
    quote: "Mavrick Web Development designed and deployed our entire custom React Admin dashboard in record time. Our team's performance metrics increased, and the final interface achieved 100% on Lighthouse optimization tests. Exceptional design, flawless API integration.",
    rating: 5,
    projectScope: "Enterprise React Frontend",
    tags: ["React Core", "API Bridge", "SEO 100"]
  },
  {
    id: 2,
    name: "Priya Patel",
    role: "VP of Product",
    company: "CoreShip Logistics",
    avatarInitials: "PP",
    quote: "Shubham and his team built our cross-platform mobile delivery app. The offline-first local caching engine is incredibly fast, and the 60FPS UI interactive transitions feel super premium. Absolute professionals with unmatched engineering quality.",
    rating: 5,
    projectScope: "Mobile App Development",
    tags: ["React Native", "Offline Engine", "UX/UI"]
  },
  {
    id: 3,
    name: "Rajesh Kumar",
    role: "Managing Director",
    company: "Bijnor Agro Industries",
    avatarInitials: "RK",
    quote: "The team built custom workflow automation modules that scaled our operations throughput by 300%. Zero bloatware, just exceptionally robust backend pipelines coupled with clean, lightning-fast UI analytics.",
    rating: 5,
    projectScope: "Backend Automation Pipeline",
    tags: ["Node.js API", "Job Queues", "Database Tuning"]
  },
  {
    id: 4,
    name: "Linda Sterling",
    role: "Managing Partner",
    company: "Sterling Capital",
    avatarInitials: "LS",
    quote: "An elite development agency that actually understands high-performance client architectures. Their custom-built workflows feel like desktop-native software. Pure visual craftsmanship, and super communicative team.",
    rating: 5,
    projectScope: "High-Frequency Portfolio Deck",
    tags: ["Vite Core", "Secured Handshaking", "Tailwind"]
  }
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState<'left' | 'right'>('right');
  const { ref: sectionRef, isInView } = useAnimateOnScroll({ threshold: 0.1 });

  const handleNext = () => {
    setDirection('right');
    setActiveIndex((prev) => (prev + 1) % TESTIMONIALS_DATA.length);
  };

  const handlePrev = () => {
    setDirection('left');
    setActiveIndex((prev) => (prev - 1 + TESTIMONIALS_DATA.length) % TESTIMONIALS_DATA.length);
  };

  const current = TESTIMONIALS_DATA[activeIndex];

  // Sliding animation states
  const slideVariants = {
    enter: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? 80 : -80,
      opacity: 0,
      scale: 0.97
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1]
      }
    },
    exit: (dir: 'left' | 'right') => ({
      x: dir === 'right' ? -80 : 80,
      opacity: 0,
      scale: 0.97,
      transition: {
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1]
      }
    })
  };

  return (
    <section 
      ref={sectionRef as any}
      id="testimonials-section" 
      className="scroll-mt-20 py-24 bg-black border-t border-white/5 relative overflow-hidden"
    >
      {/* Decorative ambient gradients */}
      <div className="absolute right-[-10%] top-[20%] h-80 w-80 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />
      <div className="absolute left-[-10%] bottom-[10%] h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Header Block */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="text-center md:max-w-3xl md:mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-xs font-mono font-semibold tracking-wider text-indigo-400 uppercase mb-4">
            <MessageSquare className="h-3 w-3" />
            Client Validation
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Success Stories From Our Partners
          </h2>
          <p className="mt-4 text-sm text-gray-400 leading-relaxed md:text-base">
            Read direct feedback and verified reviews detailing how our high-performance technical engineering drives growth and modern UI excellence for corporate stakeholders.
          </p>
        </motion.div>

        {/* Carousel Outer Shield */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.8, delay: 0.15 }}
          className="mx-auto max-w-4xl"
        >
          {/* Main Card */}
          <div className="rounded-3xl border border-white/10 bg-[#070708] p-8 md:p-14 relative shadow-2xl backdrop-blur-md">
            {/* Massive background quote mark */}
            <Quote className="absolute top-10 right-10 h-28 w-28 text-white/[0.02] pointer-events-none stroke-[1]" />

            {/* Carousel Inner content with AnimatePresence */}
            <div className="min-h-[280px] md:min-h-[220px] flex flex-col justify-between">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  className="space-y-6"
                >
                  {/* Scope Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="rounded-full bg-indigo-500/10 border border-indigo-500/20 px-3.5 py-0.5 text-xs font-mono font-medium text-indigo-400">
                      {current.projectScope}
                    </div>
                    <div className="flex items-center gap-1 text-amber-500">
                      {Array.from({ length: current.rating }).map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current stroke-none" />
                      ))}
                    </div>
                  </div>

                  {/* Testimonial Quote */}
                  <blockquote className="text-base md:text-[1.25rem] text-gray-200 font-sans tracking-wide leading-relaxed font-normal italic">
                    "{current.quote}"
                  </blockquote>

                  {/* Technical Tags */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {current.tags.map((tag) => (
                      <span key={tag} className="text-[10px] font-mono tracking-wider font-semibold text-gray-400 bg-white/[0.04] border border-white/5 py-1 px-2 rounded-md">
                        #{tag.toUpperCase()}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Separator / Profile & Slider Controllers bar */}
              <div className="border-t border-white/5 mt-8 pt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                
                {/* User Bio Detail */}
                <div className="flex items-center gap-4">
                  {/* Monogram circle with Maverick layout gradient */}
                  <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-[#0B4A94] to-[#00A896] p-[2px] shadow-lg flex-shrink-0">
                    <div className="h-full w-full rounded-full bg-[#070708] flex items-center justify-center">
                      <span className="text-sm font-mono font-bold tracking-wider text-white">
                        {current.avatarInitials}
                      </span>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-white leading-none">
                      {current.name}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {current.role} &mdash; <span className="text-indigo-400 font-mono text-[11px]">{current.company}</span>
                    </p>
                  </div>
                </div>

                {/* Left/Right Controllers & Jump Dots */}
                <div className="flex items-center justify-between sm:justify-end gap-6">
                  {/* Stepper Dots */}
                  <div className="flex items-center gap-2.5">
                    {TESTIMONIALS_DATA.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setDirection(idx > activeIndex ? 'right' : 'left');
                          setActiveIndex(idx);
                        }}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          idx === activeIndex 
                            ? 'w-7 bg-gradient-to-r from-[#0B4A94] to-[#00A896]' 
                            : 'w-2 bg-white/20 hover:bg-white/40'
                        }`}
                        aria-label={`Jump to slide ${idx + 1}`}
                      />
                    ))}
                  </div>

                  {/* Previous / Next Chevron actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrev}
                      className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20 active:scale-95 p-3 text-gray-300 transition-all duration-150"
                      aria-label="Previous partner testimonial"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/5 hover:border-white/20 active:scale-95 p-3 text-gray-300 transition-all duration-150"
                      aria-label="Next partner testimonial"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>

                </div>

              </div>

            </div>

          </div>
        </motion.div>

      </div>
    </section>
  );
}
