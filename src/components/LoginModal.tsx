import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldCheck, Loader2, Mail, Check, ArrowRight } from 'lucide-react';
import { User } from '../types';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, rememberMe: boolean) => void;
}

export default function LoginModal({ isOpen, onClose, onLoginSuccess }: LoginModalProps) {
  const { signInWithGoogle } = useAuth();
  const [loginMethod, setLoginMethod] = useState<'google' | 'magic'>('google');
  const [email, setEmail] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [magicSent, setMagicSent] = useState(false);

  // Reset internal states on open
  useEffect(() => {
    if (isOpen) {
      setLoginMethod('google');
      setEmail('');
      setRememberMe(true);
      setIsLoading(false);
      setMagicSent(false);
    }
  }, [isOpen]);

  // Dynamic email domain & prefix parsing engine to generate realistic usernames
  const parseEmailToUser = (emailAddress: string): User => {
    const cleanEmail = emailAddress.trim();
    if (cleanEmail.toLowerCase() === 'shubham.1614@gmail.com') {
      return {
        name: 'Shubham Yadav',
        email: cleanEmail,
        initials: 'SY'
      };
    }

    const prefix = cleanEmail.split('@')[0] || 'partner';
    const parts = prefix.split(/[._-]/).filter(Boolean);
    const capitalizedParts = parts.map(p => p.charAt(0).toUpperCase() + p.slice(1));
    const name = capitalizedParts.join(' ') || 'Partner User';

    // Calculate initials
    let initials = 'P';
    if (parts.length >= 2) {
      initials = (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    } else if (parts.length === 1) {
      initials = parts[0].substring(0, 2).toUpperCase();
    }

    return {
      name,
      email: cleanEmail,
      initials
    };
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await signInWithGoogle();
    } catch {
      setIsLoading(false);
    }
  };

  const handleSendMagicLink = (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) return;

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setMagicSent(true);
    }, 1500);
  };

  const handleMagicLinkComplete = () => {
    const customUser = parseEmailToUser(email);
    onLoginSuccess(customUser, rememberMe);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div id="login-modal-overlay" className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            id="login-modal-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isLoading ? onClose : undefined}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            id="login-modal-container"
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', duration: 0.5, bounce: 0.15 }}
            className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] p-8 text-center shadow-2xl"
          >
            {/* Ambient Background Glow */}
            <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute -bottom-40 -right-40 h-80 w-80 rounded-full bg-indigo-500/5 blur-3xl" />

            {/* Close Button unless loading */}
            {!isLoading && (
              <button
                id="login-modal-close"
                onClick={onClose}
                className="absolute top-4 right-4 rounded-full p-1.5 text-gray-500 transition-colors hover:bg-white/5 hover:text-white"
                aria-label="Close modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}

            {/* Brand Header */}
            <div className="relative z-10 flex flex-col items-center">
              <Logo type="full" variant="color" className="mb-4 transform scale-90" />
              <p className="-mt-2 mb-4 rounded-full bg-indigo-500/10 px-2.5 py-0.5 text-[9px] font-mono font-semibold uppercase tracking-widest text-indigo-400">
                Partner Secure Portal
              </p>
              
              <h3 className="mt-2 font-display text-lg font-semibold tracking-tight text-white">
                Authenticate Secure Session
              </h3>
              <p className="mt-2 text-xs text-gray-400 leading-relaxed max-w-xs">
                Access interactive progress tracking, scope configurations, and milestone authorizations.
              </p>

              {/* Authentication Flow Body */}
              <div className="mt-6 w-full text-left">
                {isLoading ? (
                  /* Universal Loading Simulation */
                  <div id="login-modal-loading-state" className="flex flex-col items-center justify-center py-10 text-center">
                    <Loader2 className="h-8 w-8 animate-spin text-indigo-400" />
                    <p className="mt-4 font-mono text-[11px] text-indigo-300">
                      {loginMethod === 'google' 
                        ? 'Connecting with Secure Google Auth...' 
                        : `Sending single-use access token...`}
                    </p>
                  </div>
                ) : magicSent ? (
                  /* MAGIC LINK SUCCESS SENT SCREEN */
                  <div id="magic-sent-screen" className="py-4 space-y-4 text-center">
                    <motion.div
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: 'spring', damping: 15 }}
                      className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shadow-md shadow-emerald-500/5"
                    >
                      <Check className="h-5 w-5" />
                    </motion.div>
                    
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-white">Security Link Sent Successfully</p>
                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans px-2">
                        We have dispatched a single-use access link to <span className="font-mono text-indigo-400 block break-all font-semibold select-all mt-1">{email}</span>
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/5 mt-4">
                      <p className="text-[9px] font-mono text-gray-500 uppercase tracking-wider mb-2">
                        AI Studio Simulated Environment
                      </p>
                      <button
                        id="magic-link-simulator-btn"
                        type="button"
                        onClick={handleMagicLinkComplete}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white px-4 py-3 shadow-lg shadow-indigo-500/10 transition-all duration-200 active:scale-[0.98]"
                      >
                        Bypass & Authenticate Instantly <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* SELECT METHOD VIEWS */
                  <div>
                    {/* Method Selector Tabs */}
                    <div className="flex rounded-xl bg-white/5 p-1 border border-white/5 mb-5">
                      <button
                        id="toggle-sso"
                        type="button"
                        onClick={() => setLoginMethod('google')}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          loginMethod === 'google'
                            ? 'bg-white/10 text-white shadow-sm'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Google SSO
                      </button>
                      <button
                        id="toggle-magic"
                        type="button"
                        onClick={() => setLoginMethod('magic')}
                        className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                          loginMethod === 'magic'
                            ? 'bg-white/10 text-white shadow-sm'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        Magic Link
                      </button>
                    </div>

                    <AnimatePresence mode="wait">
                      {loginMethod === 'google' ? (
                        /* GOOGLE LOGIN VIEW */
                        <motion.div
                          key="google-pane"
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-4 py-1"
                        >
                          <button
                            id="login-modal-google-button"
                            type="button"
                            onClick={handleGoogleLogin}
                            className="group relative flex w-full items-center justify-center gap-2.5 rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-xs font-semibold text-white transition-all duration-300 hover:border-white/20 hover:bg-white/10 active:scale-[0.98]"
                          >
                            <svg className="h-4.5 w-4.5" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                            </svg>
                            Continue via Google Account
                          </button>
                        </motion.div>
                      ) : (
                        /* PASSWORDLESS MAGIC LINK VIEW */
                        <motion.form
                          key="magic-pane"
                          onSubmit={handleSendMagicLink}
                          initial={{ opacity: 0, y: 5 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -5 }}
                          className="space-y-4"
                        >
                          <div className="space-y-1.5 text-left">
                            <label htmlFor="magic-email" className="text-[10px] font-mono uppercase tracking-widest text-gray-500 block pl-1">
                              Partner Email Inbox
                            </label>
                            <div className="relative">
                              <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 text-gray-500">
                                <Mail className="h-4 w-4" />
                              </span>
                              <input
                                id="magic-email"
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="partner@domain.com"
                                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#6366F1] focus:bg-black/30 transition-all font-sans"
                              />
                            </div>
                          </div>

                          <button
                            id="magic-submit-btn"
                            type="submit"
                            disabled={!email.trim() || !email.includes('@')}
                            className="w-full rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] disabled:opacity-40 disabled:hover:bg-[#6366F1] px-4 py-3 text-xs font-semibold text-white shadow-md shadow-indigo-500/10 transition-colors cursor-pointer"
                          >
                            Request Access Link
                          </button>
                        </motion.form>
                      )}
                    </AnimatePresence>

                    {/* Unified Remember Me Checkbox Selector */}
                    <div className="flex items-center text-left mt-5 pt-1">
                      <label className="relative flex items-center cursor-pointer select-none">
                        <input
                          id="remember-me-checkbox"
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="h-4.5 w-4.5 rounded bg-white/5 border border-white/10 peer-checked:bg-[#6366F1] peer-checked:border-[#6366F1] flex items-center justify-center transition-all">
                          <Check className={`h-3 w-3 text-white transition-opacity ${rememberMe ? 'opacity-100' : 'opacity-0'}`} />
                        </div>
                        <span className="ml-2.5 text-[11px] text-gray-400 font-sans tracking-wide">
                          Keep me device-authorized for 30 days
                        </span>
                      </label>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 border-t border-white/5 pt-5 text-[10px] font-mono text-gray-500">
              Secured under Maverick Enterprises. Terms and token policy apply.
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
