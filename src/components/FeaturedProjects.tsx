import { motion } from 'motion/react';
import { ArrowUpRight, Cpu, Laptop, Smartphone } from 'lucide-react';
import { useAnimateOnScroll } from '../hooks/useAnimateOnScroll';

interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  outcome: string;
  metric: string;
  metricLabel: string;
  techStack: string[];
  type: 'web' | 'mobile' | 'automation';
  imageUrl: string;
}

const PROJECTS_DATA: Project[] = [
  {
    id: 'project-aethera',
    title: 'Precision Logistics Engine',
    client: 'Aethera Global',
    category: 'Custom Web Apps',
    outcome: 'Architected an automated multi-threaded routing grid backend paired with an advanced React viewport to orchestrate multi-carrier sync systems.',
    metric: '40% Reduction',
    metricLabel: 'Sync Latency',
    techStack: ['Next.js Core', 'Node.js', 'Tailwind CSS', 'Redis State Cache'],
    type: 'web',
    imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'project-nova',
    title: 'Nova Biometrics Platform',
    client: 'Nova Healthcare Systems',
    category: 'Mobile Apps',
    outcome: 'Built a multi-device native iOS and Android health tracking terminal supporting real-time local encryption and 60FPS physical activity logs.',
    metric: '99.98%',
    metricLabel: 'Offline Sync Reliability',
    techStack: ['React Native', 'SQLite Local Encryption', 'TypeScript', 'Secure Biometrics API'],
    type: 'mobile',
    imageUrl: 'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'project-zenith',
    title: 'Admin Workspaces Pipeline',
    client: 'Zenith Global Enterprise',
    category: 'Workflow Automation',
    outcome: 'Designed custom pipeline microservices to sync scattered third-party APIs into clean interactive internal administrator workspaces.',
    metric: '32 Hours',
    metricLabel: 'Weekly Engineering Saved',
    techStack: ['Express API Gateway', 'PostgreSQL', 'Docker Clustering', 'Auth0 Middleware'],
    type: 'automation',
    imageUrl: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  }
];

// Animation Variants
const headerVariants = {
  hidden: { opacity: 0, y: -25 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
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
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 18,
      stiffness: 85,
    }
  }
};

export default function FeaturedProjects() {
  const { ref: headerObserverRef, isInView: headerInView } = useAnimateOnScroll({ threshold: 0.1 });
  const { ref: gridObserverRef, isInView: gridInView } = useAnimateOnScroll({ threshold: 0.05 });

  const getIcon = (type: 'web' | 'mobile' | 'automation') => {
    switch (type) {
      case 'web':
        return <Laptop className="h-5 w-5 text-indigo-400" />;
      case 'mobile':
        return <Smartphone className="h-5 w-5 text-indigo-400" />;
      case 'automation':
        return <Cpu className="h-5 w-5 text-indigo-400" />;
    }
  };

  return (
    <section id="projects-section" className="relative scroll-mt-20 py-24 bg-black border-t border-white/5">
      {/* Decorative pulse glow */}
      <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        {/* Section Header with Intersection Observer Ref */}
        <motion.div 
          ref={headerObserverRef as any}
          variants={headerVariants}
          initial="hidden"
          animate={headerInView ? 'visible' : 'hidden'}
          className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6"
        >
          <div className="max-w-2xl">
            <p className="font-mono text-xs font-semibold tracking-widest text-[#6366F1] uppercase">
              Proven Architecture
            </p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl">
              Featured Case Studies
            </h2>
            <p className="mt-4 text-sm text-gray-400 leading-relaxed font-sans">
              Take a look at snapshots of custom software ecosystems built entirely to order. These platforms combine ultra-fast response indices, clean responsive state layers, and flawless functional durability under load.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
            <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            <span>Updated: June 2026 Production Releases</span>
          </div>
        </motion.div>

        {/* Scroll-Triggered Cards Grid with Staggered Intersection Observer Ref */}
        <motion.div 
          ref={gridObserverRef as any}
          variants={gridVariants}
          initial="hidden"
          animate={gridInView ? 'visible' : 'hidden'}
          className="grid grid-cols-1 gap-8 lg:grid-cols-3"
        >
          {PROJECTS_DATA.map((project) => (
            <motion.div
              id={`project-card-${project.id}`}
              key={project.id}
              variants={cardVariants}
              whileHover={{
                y: -6,
                borderColor: 'rgba(255, 255, 255, 0.15)',
                boxShadow: '0 20px 45px -12px rgba(99, 102, 241, 0.08)'
              }}
              className="group relative rounded-2xl border border-white/5 bg-[#121212]/30 p-8 transition-colors duration-300 backdrop-blur-sm flex flex-col justify-between overflow-hidden"
            >
              <div>
                {/* Accent glow on hover */}
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/0 to-transparent group-hover:via-indigo-500/30 transition-all duration-500" />
                
                {/* Widescreen Interactive Cover Image */}
                <div className="relative mb-5 w-full overflow-hidden rounded-xl border border-white/5 bg-black/40 aspect-[16/10]">
                  <img
                    src={project.imageUrl}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover grayscale brightness-[0.75] contrast-[1.1] group-hover:grayscale-0 group-hover:brightness-90 group-hover:scale-[1.03] transition-all duration-500 ease-out"
                  />
                  {/* Subtle glass dark gradient overlay inside the image */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/8 w-full h-full pointer-events-none" />
                </div>

                {/* Category & Icon Header */}
                <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 border border-white/10 text-indigo-400 group-hover:bg-white/10 transition-colors">
                      {getIcon(project.type)}
                    </div>
                    <div>
                      <p className="text-[10px] font-mono font-medium text-indigo-400 uppercase tracking-widest leading-none">
                        {project.category}
                      </p>
                      <h4 className="text-xs text-gray-500 mt-1 font-sans">
                        Client: {project.client}
                      </h4>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-gray-600 transition-all group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>

                {/* Case Study Title */}
                <h3 className="font-display text-lg font-bold text-white tracking-tight group-hover:text-indigo-300 transition-colors">
                  {project.title}
                </h3>
                
                {/* Specific outcome statement */}
                <p className="mt-3 text-xs text-gray-400 leading-relaxed font-sans min-h-[72px]">
                  {project.outcome}
                </p>

                {/* Performance metric container */}
                <div className="mt-6 rounded-xl bg-white/5 border border-white/5 p-4 flex items-center justify-between">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-wider text-gray-500">System Metric Outcome</p>
                    <p className="font-display text-sm font-bold text-white mt-0.5 tracking-tight">{project.metricLabel}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-base font-bold text-white bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-2.5 py-1">
                      {project.metric}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tech stack badge block */}
              <div className="mt-8 border-t border-white/5 pt-6">
                <div className="flex flex-wrap gap-1.5">
                  {project.techStack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded bg-white/5 px-2 py-0.5 font-mono text-[9px] text-gray-400 border border-white/5"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
