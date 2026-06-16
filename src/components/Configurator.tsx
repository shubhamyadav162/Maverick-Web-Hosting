import { useState, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ArrowRight, ArrowLeft, Mail, Phone, Calendar, Building2, MapPin } from 'lucide-react';
import { ScopingFormData } from '../types';
import { COMPLIANCE_DATA } from '../data';
import { useToast } from '../context/ToastContext';

interface ConfiguratorProps {
  userEmail?: string;
}

const stepVariants = {
  enter: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? 32 : -32,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: 'forward' | 'backward') => ({
    x: direction === 'forward' ? -32 : 32,
    opacity: 0,
  }),
};

export default function Configurator({ userEmail }: ConfiguratorProps) {
  const { showToast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [direction, setDirection] = useState<'forward' | 'backward'>('forward');
  const [formData, setFormData] = useState<ScopingFormData>({
    platform: null,
    scale: null,
    name: '',
    email: userEmail || '',
    phone: '',
    objectives: '',
  });

  const [validationError, setValidationError] = useState('');

  const goToStep = (nextStep: 1 | 2 | 3) => {
    setDirection(nextStep > step ? 'forward' : 'backward');
    setStep(nextStep);
  };

  const handleSelectPlatform = (platform: 'web' | 'mobile' | 'automation') => {
    setFormData((prev) => ({ ...prev, platform }));
    setValidationError('');
    goToStep(2);
  };

  const handleSelectScale = (scale: 'mvp' | 'scale' | 'enterprise') => {
    setFormData((prev) => ({ ...prev, scale }));
    setValidationError('');
    goToStep(3);
  };

  const handleFieldChange = (field: keyof ScopingFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setValidationError('');
  };

  const validateStep3 = () => {
    if (!formData.name.trim()) {
      setValidationError('Please specify your name or enterprise name.');
      return false;
    }
    if (!formData.email.trim() || !/\S+@\S+\.\S+/.test(formData.email)) {
      setValidationError('Please provide a valid corporate email.');
      return false;
    }
    if (!formData.phone.trim() || formData.phone.length < 8) {
      setValidationError('Please provide a valid contact phone number.');
      return false;
    }
    if (!formData.objectives.trim() || formData.objectives.length < 15) {
      setValidationError('Please describe your objectives in at least 15 characters.');
      return false;
    }
    return true;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateStep3()) return;
    
    showToast(
      `Your project scoping request was successfully received! Our engineering team will contact you at ${formData.email} within 12 working hours to schedule a deep architecture workshop.`,
      'success',
      6000
    );
    
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      platform: null,
      scale: null,
      name: '',
      email: userEmail || '',
      phone: '',
      objectives: '',
    });
    setDirection('backward');
    setStep(1);
    setValidationError('');
  };

  return (
    <section id="configurator-section" className="relative scroll-mt-20 py-24 bg-black">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          
          {/* Sidebar Area with Corporate Verbatim */}
          <div className="lg:col-span-5 space-y-8">
            <div>
              <p className="font-mono text-xs font-semibold tracking-widest text-[#6366F1] uppercase">
                Initiate Architecture
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Let's scope your next ecosystem.
              </h2>
              <p className="mt-4 text-sm text-gray-400 leading-relaxed font-sans">
                Tell us about your structural requirements, deployment target sizes, and communication preferences. Our core engineering guild reviews every scoping spec individually.
              </p>
            </div>

            {/* Premium hardcoded metadata info panel */}
            <div className="rounded-2xl border border-white/5 bg-[#121212]/30 p-6 backdrop-blur-sm space-y-6">
              <h3 className="font-display text-sm font-semibold uppercase tracking-wider text-white border-b border-white/5 pb-3">
                Corporate Headquarters
              </h3>
              
              <div className="space-y-4 text-xs text-gray-300">
                <div className="flex items-start gap-3">
                  <Building2 className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">{COMPLIANCE_DATA.agencyName}</h4>
                    <p className="text-gray-400">A Unit of {COMPLIANCE_DATA.parentCompany}</p>
                    <p className="text-gray-500 font-mono text-[10px] mt-0.5">Proprietor: {COMPLIANCE_DATA.proprietor}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Registered Office</h4>
                    <p className="text-gray-400 leading-relaxed">{COMPLIANCE_DATA.address}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-indigo-400 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-white">Support Network</h4>
                    <a href={`mailto:${COMPLIANCE_DATA.email}`} className="text-indigo-400 font-mono hover:underline">
                      {COMPLIANCE_DATA.email}
                    </a>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/5 pt-4 space-y-1.5 font-mono text-[10px] text-gray-500">
                <p>GSTIN identification: {COMPLIANCE_DATA.gstin}</p>
                <p>Udyam Registration: {COMPLIANCE_DATA.udyam}</p>
              </div>
            </div>

            {/* Quick Consultation highlights */}
            <div className="flex gap-4 items-center">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
                <Calendar className="h-5 w-5" />
              </div>
              <p className="text-xs text-gray-400">
                Average responses compiled within <strong className="text-white">12 working hours</strong> directly to your corporate inbox.
              </p>
            </div>
          </div>

          {/* Form Wizard Area */}
          <div id="scoping-interactive-wizard" className="lg:col-span-7">
            <div className="relative rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 sm:p-10 shadow-2xl overflow-hidden min-h-[460px] flex flex-col justify-between">
              
              {/* Outer Blur Glows around form */}
              <div className="absolute top-0 right-0 h-48 w-48 rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />
              
              {/* Dynamic steps navigation indicator header */}
              {step < 4 && (
                <div className="relative z-10 flex items-center justify-between border-b border-white/5 pb-6 mb-8 text-xs font-mono">
                  <span className="text-indigo-400 font-semibold tracking-wider uppercase">
                    Step {step} of 3
                  </span>
                  <div className="flex gap-1.5">
                    {[1, 2, 3].map((s) => (
                      <div
                        key={s}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          s === step
                            ? 'w-8 bg-indigo-500'
                            : s < step
                            ? 'w-4 bg-[#6366F1]/40'
                            : 'w-2 bg-white/10'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Steps views Container */}
              <div className="relative z-10 flex-grow flex flex-col justify-center">
                <AnimatePresence mode="wait">
                  
                  {/* STEP 1: SELECT PLATFORM */}
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-6"
                    >
                      <div>
                        <h3 className="font-display text-xl font-bold text-white tracking-tight">
                          Select your primary interface platform
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Where does your service layer find its primary execution context?
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <button
                          type="button"
                          id="platform-pill-web"
                          onClick={() => handleSelectPlatform('web')}
                          className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.99] ${
                            formData.platform === 'web'
                              ? 'border-indigo-500 bg-indigo-500/10 text-white'
                              : 'border-white/5 bg-[#121212]/40 text-gray-300 hover:border-white/10 hover:bg-[#121212]/80'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">Custom Web Application</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">High-performance Next.js or React ecosystems optimized for SEO.</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-500 shrink-0" />
                        </button>

                        <button
                          type="button"
                          id="platform-pill-mobile"
                          onClick={() => handleSelectPlatform('mobile')}
                          className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.99] ${
                            formData.platform === 'mobile'
                              ? 'border-indigo-500 bg-indigo-500/10 text-white'
                              : 'border-white/5 bg-[#121212]/40 text-gray-300 hover:border-white/10 hover:bg-[#121212]/80'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">Unified Mobile Framework</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">Frictionless deployment onto Apple App Store and Google Play platforms.</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-500 shrink-0" />
                        </button>

                        <button
                          type="button"
                          id="platform-pill-automation"
                          onClick={() => handleSelectPlatform('automation')}
                          className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.99] ${
                            formData.platform === 'automation'
                              ? 'border-indigo-500 bg-indigo-500/10 text-white'
                              : 'border-white/5 bg-[#121212]/40 text-gray-300 hover:border-white/10 hover:bg-[#121212]/80'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">Workflow API & Internal Automation</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">Automating workflows and establishing backend software pipelines.</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-500 shrink-0" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: PROJECT SCALE */}
                  {step === 2 && (
                    <motion.div
                      key="step2"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-6"
                    >
                      <button
                        type="button"
                        onClick={() => goToStep(1)}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to platform
                      </button>

                      <div>
                        <h3 className="font-display text-xl font-bold text-white tracking-tight">
                          Select the deployment architecture scope
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Which performance level fits your immediate operational objectives?
                        </p>
                      </div>

                      <div className="grid grid-cols-1 gap-4">
                        <button
                          type="button"
                          id="scale-pill-mvp"
                          onClick={() => handleSelectScale('mvp')}
                          className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.99] ${
                            formData.scale === 'mvp'
                              ? 'border-indigo-500 bg-indigo-500/10 text-white'
                              : 'border-white/5 bg-[#121212]/40 text-gray-300 hover:border-white/10 hover:bg-[#121212]/80'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">MVP Prototype Build</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">A fast, scalable initial framework targeting immediate venture scoping reviews.</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-500 shrink-0" />
                        </button>

                        <button
                          type="button"
                          id="scale-pill-scale"
                          onClick={() => handleSelectScale('scale')}
                          className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.99] ${
                            formData.scale === 'scale'
                              ? 'border-indigo-500 bg-indigo-500/10 text-white'
                              : 'border-white/5 bg-[#121212]/40 text-gray-300 hover:border-white/10 hover:bg-[#121212]/80'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">Custom Platform Scaling</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">Intermediate scale, integrating robust backends, and modular microservices.</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-500 shrink-0" />
                        </button>

                        <button
                          type="button"
                          id="scale-pill-enterprise"
                          onClick={() => handleSelectScale('enterprise')}
                          className={`flex items-center justify-between rounded-xl border p-4 text-left transition-all duration-200 active:scale-[0.99] ${
                            formData.scale === 'enterprise'
                              ? 'border-indigo-500 bg-indigo-500/10 text-white'
                              : 'border-white/5 bg-[#121212]/40 text-gray-300 hover:border-white/10 hover:bg-[#121212]/80'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-semibold text-white">Core Enterprise Overhaul</p>
                            <p className="text-[11px] text-gray-500 mt-0.5">High availability clustering architectures, deep refactoring, and workflow networks.</p>
                          </div>
                          <ArrowRight className="h-4 w-4 text-gray-500 shrink-0" />
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: PARTNER IDENTITY DATA */}
                  {step === 3 && (
                    <motion.div
                      key="step3"
                      custom={direction}
                      variants={stepVariants}
                      initial="enter"
                      animate="center"
                      exit="exit"
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                      className="space-y-5"
                    >
                      <button
                        type="button"
                        onClick={() => goToStep(2)}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
                      >
                        <ArrowLeft className="h-3.5 w-3.5" /> Back to scale select
                      </button>

                      <div>
                        <h3 className="font-display text-xl font-bold text-white tracking-tight">
                          Partner authentication and objectives
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          Provide your authentication details and business objectives below.
                        </p>
                      </div>

                      <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                              Your Name / Enterprise
                            </label>
                            <input
                              type="text"
                              required
                              value={formData.name}
                              onChange={(e) => handleFieldChange('name', e.target.value)}
                              placeholder="e.g., Jane Smith"
                              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors"
                            />
                          </div>

                          <div>
                            <label className="block text-[11px] font-mono text-[#D1D5DB] uppercase tracking-wider mb-1">
                              Corporate Email
                            </label>
                            <input
                              type="email"
                              required
                              value={formData.email}
                              onChange={(e) => handleFieldChange('email', e.target.value)}
                              placeholder="e.g., smith@company.com"
                              className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                            Direct Contact Phone
                          </label>
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(e) => handleFieldChange('phone', e.target.value)}
                            placeholder="e.g., +1 555 019 2834"
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider mb-1">
                            Specify Scoping Objectives
                          </label>
                          <textarea
                            rows={3}
                            required
                            value={formData.objectives}
                            onChange={(e) => handleFieldChange('objectives', e.target.value)}
                            placeholder="Explain the functional goals, system bridges, or design blueprints your business is targeting."
                            className="w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-medium text-white placeholder-gray-600 focus:border-indigo-500 focus:outline-none transition-colors resize-none"
                          />
                        </div>

                        {validationError && (
                          <p className="text-xs font-semibold font-mono text-red-400 animate-pulse bg-red-500/10 rounded-lg p-2.5">
                            ⚠️ {validationError}
                          </p>
                        )}

                        <button
                          type="submit"
                          id="wizard-submit-button"
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-xs font-bold text-black transition-all hover:bg-gray-200 active:scale-[0.99]"
                        >
                          Submit Project Request
                          <Check className="h-4 w-4 shrink-0" />
                        </button>
                      </form>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
