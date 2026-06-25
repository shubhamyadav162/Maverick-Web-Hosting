import { Mail, Shield, Building2, MapPin, Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { View } from '../types';
import { COMPLIANCE_DATA } from '../data';
import Logo from './Logo';

interface FooterProps {
  onNavigate: (view: View) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(COMPLIANCE_DATA.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const navigateToSection = (anchorId: string) => {
    onNavigate('home');
    setTimeout(() => {
      const element = document.getElementById(anchorId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  return (
    <footer id="global-footer" className="relative border-t border-white/5 bg-[#050505] pt-16 pb-12 overflow-hidden text-sm">
      {/* Accent Background Glow */}
      <div className="absolute bottom-0 left-1/2 -px-1/2 h-80 w-full max-w-[800px] rounded-full bg-indigo-500/5 blur-3xl pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-4">
          
          {/* Column 1: Corporate Registration block */}
          <div className="space-y-4">
            <div className="flex flex-col gap-2">
              <Logo type="horizontal" variant="dark" className="h-8 md:h-9" />
              <span className="w-fit rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[9px] font-mono font-semibold text-indigo-400 uppercase tracking-wider">OFFICIAL REGISTERED AGENCY</span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Tailor-made React development, native performance mobile architectures, and automated workflow orchestrations built entirely to order for global business scale.
            </p>
            <div className="border-t border-white/5 pt-4 mt-2 space-y-2">
              <div className="flex items-start gap-1.5 text-xs text-gray-500">
                <Building2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-gray-400" />
                <span>
                  <strong>{COMPLIANCE_DATA.parentCompany}</strong><br />
                  Proprietor: {COMPLIANCE_DATA.proprietor}
                </span>
              </div>
            </div>
          </div>

          {/* Column 2: Software Services Anchors */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Our Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-left font-semibold"
                >
                  Digital Products
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('services');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Services Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToSection('services-section')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Custom Web Apps
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToSection('services-section')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Mobile Frameworks
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToSection('services-section')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Workflow Engineering
                </button>
              </li>
              <li>
                <button
                  onClick={() => navigateToSection('mission-section')}
                  className="text-gray-400 hover:text-white transition-colors text-left"
                >
                  Core Mission
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Legal Routes */}
          <div>
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-white mb-4">
              Legal Compliance
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => {
                    onNavigate('terms');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('privacy');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    onNavigate('refund');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Refund & Cancellation
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Connect */}
          <div className="space-y-4">
            <h4 className="font-display text-xs font-semibold uppercase tracking-wider text-white">
              Contact Connect
            </h4>
            <div className="space-y-3 text-xs">
              <div className="rounded-xl border border-white/5 bg-white/5 p-3">
                <p className="text-[10px] uppercase font-mono tracking-wider text-indigo-400 mb-1">SUPPORT MAIL</p>
                <div className="flex items-center justify-between gap-2">
                  <a
                    href={`mailto:${COMPLIANCE_DATA.email}`}
                    className="text-white hover:underline truncate font-mono text-xs"
                  >
                    {COMPLIANCE_DATA.email}
                  </a>
                  <button
                    onClick={handleCopyEmail}
                    className="p-1 rounded bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    title="Copy Email Address"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-1.5 text-xs text-gray-400">
                <MapPin className="h-4 w-4 shrink-0 text-gray-500 mt-0.5" />
                <span className="leading-relaxed text-[11px]">
                  Bukhara, Near Bakli Fatak,<br />
                  Bijnor, Uttar Pradesh – 246701, India
                </span>
              </div>
            </div>
          </div>

        </div>

        {/* Separator */}
        <div className="my-10 border-t border-white/5 h-px" />

        {/* Corporate Identifications Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div className="space-y-1.5 text-[11px] font-mono text-gray-500">
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span>GSTIN: <strong className="text-gray-400">{COMPLIANCE_DATA.gstin}</strong></span>
              <span>UDYAM: <strong className="text-gray-400">{COMPLIANCE_DATA.udyam}</strong></span>
            </div>
            <p>© {new Date().getFullYear()} Maverick Enterprises. All Rights Reserved.</p>
          </div>
          <div className="flex flex-col sm:flex-row justify-start md:justify-end gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-indigo-500/70" />
              100% Cryptographic Billing & Secure Processing
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <Shield className="h-3.5 w-3.5" />
              Powered by Easebuzz
            </span>
          </div>
        </div>

      </div>
    </footer>
  );
}
