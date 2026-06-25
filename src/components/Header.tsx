import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, LogOut, Code, Layers } from 'lucide-react';
import { View, User } from '../types';
import Logo from './Logo';

interface HeaderProps {
  currentView: View;
  onNavigate: (view: View) => void;
  user: User | null;
  onLogout: () => void;
  onOpenLogin: () => void;
}

export default function Header({ currentView, onNavigate, user, onLogout, onOpenLogin }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (view: View, anchorId?: string) => {
    setIsMobileMenuOpen(false);
    onNavigate(view);
    if (anchorId) {
      setTimeout(() => {
        const element = document.getElementById(anchorId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header
      id="global-header"
      className={`fixed top-0 z-40 w-full transition-all duration-300 ${
        isScrolled
          ? 'border-b border-white/5 bg-black/85 backdrop-blur-md py-4'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Logo */}
          <button
            id="brand-logo"
            onClick={() => handleLinkClick('home')}
            className="flex items-center gap-2.5 text-left group"
          >
            <Logo type="horizontal" variant="dark" className="h-9 transition-transform duration-300 group-hover:scale-[1.03]" />
          </button>

          {/* Center Navigation Links */}
          <nav id="header-nav-desktop" className="hidden md:flex items-center gap-8">
            <button
              onClick={() => handleLinkClick('home')}
              className={`text-sm font-medium transition-colors hover:text-white ${
                currentView === 'home' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleLinkClick('products')}
              className={`text-sm font-semibold transition-colors hover:text-white ${
                currentView === 'products' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Products
            </button>
            <button
              onClick={() => handleLinkClick('home', 'services-section')}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              Services
            </button>
            <button
              onClick={() => handleLinkClick('home', 'mission-section')}
              className="text-sm font-medium text-gray-400 transition-colors hover:text-white"
            >
              About Us
            </button>
            <button
              onClick={() => handleLinkClick('contact')}
              className={`text-sm font-medium transition-colors hover:text-white ${
                currentView === 'contact' ? 'text-white' : 'text-gray-400'
              }`}
            >
              Contact Us
            </button>
            {user && (
              <button
                onClick={() => handleLinkClick('dashboard')}
                className={`text-sm font-semibold transition-colors hover:text-white flex items-center gap-1.5 px-3 py-1 bg-indigo-500/10 border border-indigo-500/25 rounded-xl text-indigo-300`}
              >
                <Layers className="h-4 w-4" />
                Dashboard
              </button>
            )}
          </nav>

          {/* Right Actions */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 transition-all hover:bg-white/10 hover:border-white/20 active:scale-[0.98]"
                >
                  <div className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-500 font-mono text-xs font-bold text-white">
                    {user.initials}
                  </div>
                  <span className="text-xs font-medium text-gray-300">
                    {user.name}
                  </span>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </button>

                <AnimatePresence>
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setIsProfileOpen(false)} />
                      <motion.div
                        id="user-profile-dropdown"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="absolute right-0 mt-2 z-20 w-56 rounded-xl border border-white/10 bg-[#0A0A0A] p-2 shadow-2xl"
                      >
                        <div className="px-3 py-2 text-left border-b border-white/5 mb-1.5">
                          <p className="text-xs text-gray-500">Authenticated Client</p>
                          <p className="text-sm font-semibold text-white truncate">{user.name}</p>
                          <p className="text-xs text-gray-400 truncate">{user.email}</p>
                        </div>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            onNavigate('dashboard');
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-semibold text-gray-300 hover:bg-white/5 transition-colors mb-1"
                        >
                          <Layers className="h-4 w-4" />
                          View Client Dashboard
                        </button>
                        <button
                          onClick={() => {
                            setIsProfileOpen(false);
                            onLogout();
                          }}
                          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-medium text-red-400 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut className="h-4 w-4" />
                          Sign Out Portal
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <button
                id="header-login-button"
                onClick={onOpenLogin}
                className="text-sm font-medium text-gray-300 hover:text-white transition-colors px-3 py-2"
              >
                Login
              </button>
            )}

            <button
              id="header-cta-button"
              onClick={() => handleLinkClick('contact')}
              className="flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-xs font-semibold text-black transition-all hover:bg-gray-200 active:scale-95"
            >
              Start a Project
              <ArrowUpRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-3">
            {user && (
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 font-mono text-xs font-bold text-white">
                {user.initials}
              </div>
            )}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-lg p-1.5 text-gray-400 hover:text-white hover:bg-white/5"
              aria-label="Toggle Menu"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            id="mobile-drawer"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-white/5 bg-black relative"
          >
            <div className="space-y-1.5 px-4 pt-2 pb-6">
              <button
                onClick={() => handleLinkClick('home')}
                className={`block w-full rounded-lg px-3 py-2 text-left text-base font-semibold ${
                  currentView === 'home' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                Home
              </button>
              <button
                onClick={() => handleLinkClick('products')}
                className={`block w-full rounded-lg px-3 py-2 text-left text-base font-semibold ${
                  currentView === 'products' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => handleLinkClick('home', 'services-section')}
                className="block w-full rounded-lg px-3 py-2 text-left text-base font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
              >
                Services
              </button>
              <button
                onClick={() => handleLinkClick('home', 'mission-section')}
                className="block w-full rounded-lg px-3 py-2 text-left text-base font-semibold text-gray-400 hover:bg-white/5 hover:text-white"
              >
                About Us
              </button>
              <button
                onClick={() => handleLinkClick('contact')}
                className={`block w-full rounded-lg px-3 py-2 text-left text-base font-semibold ${
                  currentView === 'contact' ? 'bg-white/10 text-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`}
              >
                Contact Us
              </button>
              {user && (
                <button
                  onClick={() => handleLinkClick('dashboard')}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-base font-semibold ${
                    currentView === 'dashboard' ? 'bg-white/10 text-white' : 'text-indigo-400 hover:bg-white/5'
                  }`}
                >
                  Dashboard
                </button>
              )}
              
              <div className="border-t border-white/5 mt-4 pt-4 space-y-3">
                {user ? (
                  <div className="flex flex-col gap-2 px-3">
                    <p className="text-xs text-indigo-400 font-mono tracking-widest uppercase">Client Signed In</p>
                    <p className="text-sm font-semibold text-white">{user.name}</p>
                    <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                    <button
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        onLogout();
                      }}
                      className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-2.5 text-sm font-semibold text-red-400 w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out Portal
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      onOpenLogin();
                    }}
                    className="flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-semibold text-white w-full"
                  >
                    Login
                  </button>
                )}

                <button
                  onClick={() => handleLinkClick('contact')}
                  className="flex items-center justify-center gap-1.5 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-black w-full"
                >
                  Start a Project
                  <ArrowUpRight className="h-4 h-4" />
                </button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
