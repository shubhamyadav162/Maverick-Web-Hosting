import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Mail } from 'lucide-react';
import { View, User } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Hero from './components/Hero';
import Services from './components/Services';
import FeaturedProjects from './components/FeaturedProjects';
import Configurator from './components/Configurator';
import F_A_Q from './components/Faq';
import Testimonials from './components/Testimonials';
import LegalPage from './components/LegalPage';
import LoginModal from './components/LoginModal';
import Dashboard from './components/Dashboard';
import AuthCallback from './pages/AuthCallback';
import { useToast } from './context/ToastContext';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { showToast } = useToast();
  const { user, isLoading: authLoading, signOut } = useAuth();
  const [currentView, setCurrentView] = useState<View>('home');
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('mavrick_theme') as 'dark' | 'light') || 'dark';
  });

  // Routing for auth callback
  const [isAuthCallbackRoute, setIsAuthCallbackRoute] = useState(false);

  useEffect(() => {
    if (window.location.pathname === '/auth/callback') {
      setIsAuthCallbackRoute(true);
    }
  }, []);

  // Auto-navigate to dashboard when Supabase auth completes
  useEffect(() => {
    if (user && currentView === 'home') {
      setCurrentView('dashboard');
    }
  }, [user]);

  // Apply theme class to document element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
    localStorage.setItem('mavrick_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    showToast(
      `Switched to ${nextTheme === 'light' ? 'High-Contrast Light' : 'Pitch Black'} mode successfully.`,
      'info',
      2500
    );
  };

  const handleLoginSuccess = (user: User, rememberMe = true) => {
    if (rememberMe) {
      localStorage.setItem('mavrick_partner_user', JSON.stringify(user));
    } else {
      sessionStorage.setItem('mavrick_partner_user', JSON.stringify(user));
    }
    showToast(`Access Granted. Welcome back, ${user.name}.`, 'success', 3500);
    setIsLoginModalOpen(false);
    setCurrentView('dashboard');
  };

  const handleLogout = async () => {
    await signOut();
    localStorage.removeItem('mavrick_partner_user');
    sessionStorage.removeItem('mavrick_partner_user');
    setCurrentView('home');
    showToast('Secure partner session cleared successfully.', 'info', 3000);
  };

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  const handleInitiateConsultation = () => {
    setCurrentView('home');
    setTimeout(() => {
      const element = document.getElementById('configurator-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 120);
  };

  if (isAuthCallbackRoute) {
    return <AuthCallback />;
  }

  return (
    <div className="relative min-h-screen bg-black text-gray-300 antialiased selection:bg-indigo-500/30 selection:text-white">
      {/* Permanent Header component */}
      <Header
        currentView={currentView}
        onNavigate={handleNavigate}
        user={user}
        onLogout={handleLogout}
        onOpenLogin={() => setIsLoginModalOpen(true)}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main viewport region */}
      <main id="app-viewport">
        <AnimatePresence mode="wait">
          {currentView === 'home' && (
            <motion.div
              key="home-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Hero
                onContactClick={handleInitiateConsultation}
                onExploreClick={() => {
                  const element = document.getElementById('services-section');
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
              />
              <Services onStartProject={handleInitiateConsultation} />
              <FeaturedProjects />
              <Testimonials />
              <Configurator userEmail={user?.email} />
              <F_A_Q />
            </motion.div>
          )}

          {currentView === 'contact' && (
            <motion.div
              key="contact-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="pt-24 bg-black"
            >
              <Configurator userEmail={user?.email} />
            </motion.div>
          )}

          {currentView === 'dashboard' && user && (
            <motion.div
              key="dashboard-view"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Dashboard user={user} onNavigate={handleNavigate} />
            </motion.div>
          )}

          {currentView === 'terms' && (
            <motion.div key="terms-view">
              <LegalPage
                type="terms"
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {currentView === 'privacy' && (
            <motion.div key="privacy-view">
              <LegalPage
                type="privacy"
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}

          {currentView === 'refund' && (
            <motion.div key="refund-view">
              <LegalPage
                type="refund"
                onNavigate={handleNavigate}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Permanent Footer component */}
      <Footer onNavigate={handleNavigate} />

      {/* Interactive Google Login Modal flow */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Fixed Floating Email Action Button */}
      <motion.div
        id="floating-email-action"
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 group"
      >
        {/* Expanded hover tooltip text */}
        <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg border border-white/10 bg-black/90 px-3 py-1.5 text-xs font-mono font-medium text-gray-200 opacity-0 shadow-xl transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0 translate-x-2 backdrop-blur-sm">
          Quick Work Inquiry
        </span>

        <motion.a
          id="floating-email-anchor"
          href="mailto:himavrickdevloper@gmail.com?subject=Inquiry%20-%20Mavrick%20Web%20Development&body=Hello%20Mavrick%20Team%2C%0A%0AI%20am%20interested%20in%20discussing%20a%20custom%20software%2Fweb%20project%20with%20you.%20Please%20let%20me%20know%20your%20availability%20for%20a%20brief%20consultation.%0A%0ABest%20regards%2C"
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-r from-[#0B4A94] to-[#00A896] text-white shadow-[0_0_20px_rgba(11,74,148,0.4)] transition-shadow duration-300 hover:shadow-[0_0_25px_rgba(0,168,150,0.6)] border border-white/15 relative overflow-hidden"
          title="Send a quick email to Mavrick Support"
        >
          {/* Pulsing ring animation inside button */}
          <span className="absolute inset-0 rounded-full bg-white/10 animate-ping opacity-25 pointer-events-none" />
          <Mail className="h-6 w-6 stroke-[2]" />
        </motion.a>
      </motion.div>
    </div>
  );
}
