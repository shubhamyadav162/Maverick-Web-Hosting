import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Mail, Inbox, Layers, Activity, Calendar, FileText, CheckCircle, Clock, Send, 
  ExternalLink, RotateCw, Plus, Cpu, ChevronRight, Check, X, Code2, AlertTriangle 
} from 'lucide-react';
import { User, ScopingFormData } from '../types';
import { useToast } from '../context/ToastContext';

interface DashboardProps {
  user: User;
  onNavigate: (view: any) => void;
}

interface WebmailMessage {
  id: string;
  sender: string;
  subject: string;
  date: string;
  body: string;
  isRead: boolean;
  category: 'system' | 'proposal' | 'engineering';
}

export default function Dashboard({ user, onNavigate }: DashboardProps) {
  const { showToast } = useToast();
  
  // Gmail integration mockup data
  const [emails, setEmails] = useState<WebmailMessage[]>([
    {
      id: 'msg-1',
      sender: 'Lead Architect, Mavrick Support',
      subject: 'Re: Initial System Scoping & Google Mail Association',
      date: 'Just now',
      body: `Hi ${user.name},\n\nWe have successfully established a secure Google Authentication bridge for your account. This dashboard enables you to review interactive scoping models and coordinate resources. Your corporate email (${user.email}) has been authorized with high-level developer access.\n\nCould you please review the Interactive Architecture Stack Constructor below and toggle your preferred caching strategies?\n\nBest regards,\nAaron Finch\nPrincipal Architect`,
      isRead: false,
      category: 'engineering',
    },
    {
      id: 'msg-2',
      sender: 'Mavrick Enterprise Compliance',
      subject: 'Security Briefing: API Grounding Key Protocols',
      date: '2 hours ago',
      body: `Dear Partner,\n\nWe have generated security credentials for your upcoming development environment. Since you have verified via Google Mail, your environment complies with Enterprise ISO/IEC 27001 standards. Let us know if you need to schedule an executive architectural walkthrough.\n\nSincerely,\nEnterprise Security Guild`,
      isRead: true,
      category: 'system',
    },
    {
      id: 'msg-3',
      sender: 'Mavrick Partner Success',
      subject: 'Draft Proposal: Hybrid Tech-Stack Scope of Work',
      date: '1 day ago',
      body: `Hello,\n\nWe have initialized a digital draft of your engineering proposal. It is now editable right inside your client dashboard. Please use the interactive dials to draft budgets and toggle offline caching options. The live quote is available immediately.\n\nWarm regards,\nMavrick Onboarding Team`,
      isRead: true,
      category: 'proposal',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'overview' | 'mail' | 'roadmap'>('overview');
  const [selectedEmail, setSelectedEmail] = useState<WebmailMessage | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);
  const [localTime, setLocalTime] = useState(new Date().toLocaleTimeString());

  // Technical Playground Options (Architectural dials)
  const [infraScale, setInfraScale] = useState<'mvp' | 'scale' | 'enterprise'>('scale');
  const [targetPlatform, setTargetPlatform] = useState<'web' | 'mobile' | 'automation'>('web');
  const [optCache, setOptCache] = useState(true);
  const [optAI, setOptAI] = useState(false);
  const [optCDN, setOptCDN] = useState(true);

  // Active Milestones
  const [projectPhase, setProjectPhase] = useState<'scoping' | 'design' | 'development' | 'live'>('scoping');
  const [customBriefs, setCustomBriefs] = useState<string[]>([]);
  const [newBriefText, setNewBriefText] = useState('');

  // Local Action logs
  const [logs, setLogs] = useState<string[]>([
    `[${new Date().toLocaleTimeString()}] Authenticated via secure Google Account: ${user.email}`,
    `[${new Date().toLocaleTimeString()}] Dynamic digital credentials decrypted standard profile`,
    `[${new Date().toLocaleTimeString()}] Synchronized 3 high-priority Google Mail threads`,
  ]);

  const addLog = (message: string) => {
    setLogs((prev) => [`[${new Date().toLocaleTimeString()}] ${message}`, ...prev.slice(0, 50)]);
  };

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => {
      setLocalTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleReadEmail = (msg: WebmailMessage) => {
    setSelectedEmail(msg);
    setEmails(prev => prev.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
    addLog(`Opened email: "${msg.subject}"`);
  };

  const handleSendReply = (e: FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    setIsSendingReply(true);
    addLog(`Transmitting reply to Lead Architect: "${replyText.substring(0, 25)}..."`);

    setTimeout(() => {
      setIsSendingReply(false);
      setReplyText('');
      setSelectedEmail(null);
      showToast('Your message has been dispatched to Mavrick Lead Architects via secure channel!', 'success', 4000);
      addLog('Dispatched electronic mail thread through encrypted SMTP secure route.');
    }, 1500);
  };

  const handleAddBrief = (e: FormEvent) => {
    e.preventDefault();
    if (!newBriefText.trim()) return;

    setCustomBriefs(prev => [...prev, newBriefText]);
    addLog(`Registered custom scoping instruction: "${newBriefText.substring(0, 30)}..."`);
    setNewBriefText('');
    showToast('Incorporated your structural requirement into the design compiler. Price and roadmap updated.', 'info', 3000);
  };

  const getPriceEstimate = () => {
    let base = 7500;
    if (infraScale === 'scale') base = 18000;
    if (infraScale === 'enterprise') base = 42000;

    if (targetPlatform === 'mobile') base += 6000;
    if (targetPlatform === 'automation') base += 3500;

    if (optCache) base += 1200;
    if (optAI) base += 4500;
    if (optCDN) base += 1900;

    base += customBriefs.length * 850;

    return base.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });
  };

  const syncGmailInbox = () => {
    addLog('Querying Google Account endpoint for updated email headers...');
    showToast('Checking secure mailbox credentials...', 'info', 1500);
    setTimeout(() => {
      addLog('Mailbox matches latest local database state. 0 unread additions.');
      showToast('Google Mail is fully synchronized.', 'success', 2500);
    }, 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#060608] text-gray-300 pt-28 pb-20 selection:bg-indigo-500/30 selection:text-white">
      
      {/* Decorative dark grid background */}
      <div className="absolute inset-x-0 top-0 h-96 bg-gradient-to-b from-indigo-500/5 to-transparent pointer-events-none" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f2e12_1px,transparent_1px),linear-gradient(to_bottom,#1f1f2e12_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* TOP WELCOME BOARD */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-[#0D0E12] border border-white/5 rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex items-center gap-4.5 text-left">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-600 text-white font-mono text-xl font-bold uppercase shadow-lg shadow-indigo-600/10">
                {user.initials}
              </div>
              <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-[#0D0E12] flex items-center justify-center">
                <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-white">
                  Welcome, {user.name}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-0.5 rounded-full">
                  Google SSO Verified
                </span>
              </div>
              <p className="text-xs text-gray-400 font-mono leading-none">
                Gmail: <span className="text-indigo-400 select-all">{user.email}</span>
              </p>
            </div>
          </div>

          <div className="flex flex-row items-center gap-4 border-t md:border-t-0 border-white/5 pt-4 md:pt-0 self-stretch md:self-auto justify-between md:justify-end">
            <div className="text-left md:text-right font-mono text-xs">
              <span className="text-gray-500">Local System Time</span>
              <p id="dashboard-clock" className="text-sm font-semibold text-white tracking-widest mt-0.5">
                {localTime}
              </p>
            </div>
            <button
              id="sync-gmail-btn"
              type="button"
              onClick={syncGmailInbox}
              className="flex items-center gap-1.5 rounded-xl border border-white/5 bg-white/5 hover:border-white/15 px-4 py-2 text-xs font-semibold text-white transition-all active:scale-[0.98]"
            >
              <RotateCw className="h-3.5 w-3.5" /> Sync Gmail
            </button>
          </div>
        </div>

        {/* TAB CONTROLLERS */}
        <div className="flex border-b border-white/5 overflow-x-auto pb-px gap-2">
          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-2 py-3 px-4 font-display text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'overview'
                ? 'border-indigo-500 text-white bg-indigo-500/5'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Layers className="h-4 w-4" /> Workspace Overview
          </button>
          <button
            onClick={() => setActiveTab('mail')}
            className={`flex items-center gap-2 py-3 px-4 font-display text-sm font-semibold border-b-2 transition-all relative shrink-0 ${
              activeTab === 'mail'
                ? 'border-indigo-500 text-white bg-indigo-500/5'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Mail className="h-4 w-4" /> Gmail Interactions
            {emails.some(e => !e.isRead) && (
              <span className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse absolute top-2 right-2.5" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('roadmap')}
            className={`flex items-center gap-2 py-3 px-4 font-display text-sm font-semibold border-b-2 transition-all shrink-0 ${
              activeTab === 'roadmap'
                ? 'border-indigo-500 text-white bg-indigo-500/5'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Calendar className="h-4 w-4" /> Interactive Milestone Roadmap
          </button>
        </div>

        {/* VIEW CONDITIONAL RENDERS */}
        <AnimatePresence mode="wait">
          
          {/* TAB 1: WORKSPACE OVERVIEW */}
          {activeTab === 'overview' && (
            <motion.div
              key="view-overview"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-8 lg:grid-cols-12"
            >
              {/* Left Column - Core Playground/Control Dial & Pricing Simulator */}
              <div className="lg:col-span-8 space-y-8 text-left">
                
                {/* INTERACTIVE STACK CONFIGURATOR */}
                <div className="bg-[#0A0B0E] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-6">
                  <div>
                    <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                      Architectural Draft Tool
                    </span>
                    <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                      Interactive Engineering Stack Constructor
                    </h2>
                    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                      Draft software architecture variables in real-time. This updates your live project proposal metrics and generates customized system summaries directly in your linked Gmail threads.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                    {/* Scale Option */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider pl-0.5">
                        Enterprise Infrastructure Target
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-white/5 p-1 border border-white/5">
                        {(['mvp', 'scale', 'enterprise'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setInfraScale(opt);
                              addLog(`Modified infrastructure scope to: "${opt.toUpperCase()}"`);
                            }}
                            className={`py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                              infraScale === opt
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Target Platform Option */}
                    <div className="space-y-2">
                      <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider pl-0.5">
                        Target System Bridge
                      </label>
                      <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-white/5 p-1 border border-white/5">
                        {(['web', 'mobile', 'automation'] as const).map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              setTargetPlatform(opt);
                              addLog(`Switched target system focus to: "${opt.toUpperCase()}"`);
                            }}
                            className={`py-1.5 text-[10px] font-bold uppercase rounded-lg transition-all ${
                              targetPlatform === opt
                                ? 'bg-indigo-600 text-white'
                                : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Toggle switches */}
                  <div className="space-y-4 pt-2 border-t border-white/5">
                    <p className="text-[11px] font-mono text-gray-450 uppercase tracking-wider font-semibold pl-0.5">
                      Toggle Tech Integrations
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* SQLite Encryption Cache */}
                      <button
                        type="button"
                        onClick={() => {
                          setOptCache(!optCache);
                          addLog(`${optCache ? 'Deactivated' : 'Activated'} Offline Sync SQLite support.`);
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                          optCache 
                            ? 'bg-indigo-600/10 border-indigo-500/30 text-white' 
                            : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-semibold">SQLite Local Caching</p>
                          <p className="text-[10px] text-gray-500 font-mono">Offline-first support</p>
                        </div>
                        <div className={`h-4.5 w-4.5 rounded flex items-center justify-center border ${optCache ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'}`}>
                          {optCache && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </button>

                      {/* Gemini Model Grounding */}
                      <button
                        type="button"
                        onClick={() => {
                          setOptAI(!optAI);
                          addLog(`${optAI ? 'Disabled' : 'Enabled'} Gemini API Grounding capability.`);
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                          optAI 
                            ? 'bg-indigo-600/10 border-indigo-500/30 text-white' 
                            : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-semibold">Gemini Grounding API</p>
                          <p className="text-[10px] text-gray-500 font-mono">Dynamic AI assistance</p>
                        </div>
                        <div className={`h-4.5 w-4.5 rounded flex items-center justify-center border ${optAI ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'}`}>
                          {optAI && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </button>

                      {/* Global CDN Network */}
                      <button
                        type="button"
                        onClick={() => {
                          setOptCDN(!optCDN);
                          addLog(`${optCDN ? 'Decommissioned' : 'Initiated'} Global Static CDN deployment.`);
                        }}
                        className={`flex items-center justify-between p-3.5 rounded-xl border transition-all text-left ${
                          optCDN 
                            ? 'bg-indigo-600/10 border-indigo-500/30 text-white' 
                            : 'bg-white/5 border-white/5 text-gray-400 hover:border-white/10'
                        }`}
                      >
                        <div className="space-y-1">
                          <p className="text-xs font-semibold">Static Assets CDN</p>
                          <p className="text-[10px] text-gray-500 font-mono">Low latency edge</p>
                        </div>
                        <div className={`h-4.5 w-4.5 rounded flex items-center justify-center border ${optCDN ? 'bg-indigo-500 border-indigo-500' : 'border-white/20'}`}>
                          {optCDN && <Check className="h-3 w-3 text-white" />}
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* CUSTOM SCOPING BRIEFS */}
                  <div className="space-y-3 pt-4 border-t border-white/5">
                    <label className="block text-[11px] font-mono text-gray-400 uppercase tracking-wider pl-0.5">
                      Tailor Custom System Directives
                    </label>

                    <form onSubmit={handleAddBrief} className="flex gap-2">
                      <input
                        type="text"
                        required
                        value={newBriefText}
                        onChange={(e) => setNewBriefText(e.target.value)}
                        placeholder="e.g., Support dual-region high availability PostgreSQL failover"
                        className="flex-grow rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none transition-colors"
                      />
                      <button
                        type="submit"
                        className="flex items-center justify-center gap-1.5 rounded-xl bg-white text-black px-4 py-2.5 text-xs font-bold transition-transform active:scale-95"
                      >
                        <Plus className="h-4.5 w-4.5" /> Append Directive
                      </button>
                    </form>

                    {customBriefs.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-1">
                        {customBriefs.map((brief, idx) => (
                          <span
                            key={idx}
                            onClick={() => {
                              setCustomBriefs(prev => prev.filter((_, i) => i !== idx));
                              addLog(`De-allocated custom directive: "${brief.substring(0, 20)}..."`);
                            }}
                            className="inline-flex items-center gap-1.5 text-[10px] font-semibold bg-indigo-500/10 hover:bg-red-500/10 text-indigo-400 hover:text-red-400 border border-indigo-500/10 hover:border-red-500/15 px-3 py-1.5 rounded-full cursor-pointer transition-colors"
                            title="Click to remove"
                          >
                            <Cpu className="h-3 w-3" /> {brief}
                            <X className="h-3 w-3 shrink-0" />
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* ARCHITECTURE PROPOSAL SUMMARY VIEW CARD */}
                <div className="bg-gradient-to-r from-indigo-950/20 to-[#0A0B0E] border border-indigo-500/10 rounded-2xl p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative overflow-hidden">
                  <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                  
                  <div className="lg:col-span-8 space-y-4">
                    <span className="font-mono text-[9px] font-bold text-sky-400 uppercase tracking-widest">
                      Live Compilation Engine Output
                    </span>
                    <h3 className="text-xl font-bold text-white tracking-tight">
                      Dynamically Compiled Proposal Scope
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-gray-550 block font-mono">Deployment scale</span>
                        <span className="text-white font-medium capitalize">{infraScale} Tier</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-gray-550 block font-mono">Platform target</span>
                        <span className="text-white font-medium capitalize">{targetPlatform} Layer</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-gray-550 block font-mono">Offline Strategy</span>
                        <span className="text-white font-medium">{optCache ? 'Active (SQLite Local Encrypted)' : 'None'}</span>
                      </div>
                      <div className="space-y-0.5">
                        <span className="text-gray-550 block font-mono">Compliance Audit</span>
                        <span className="text-white font-medium">Enterprise SOC2 Certified</span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-white/5 pt-6 lg:pt-0 lg:pl-6 text-center lg:text-right space-y-2 lg:self-stretch flex flex-col justify-center">
                    <span className="text-gray-500 text-[10px] font-mono block uppercase tracking-wider">
                      Target architecture estimate
                    </span>
                    <p className="text-3xl font-extrabold text-white font-display tracking-tight hover:scale-102 transition-transform duration-200">
                      {getPriceEstimate()}
                    </p>
                    <span className="text-[10px] text-gray-400 font-mono block">
                      Includes 1-yr security patching
                    </span>
                  </div>
                </div>
              </div>

              {/* Right Column - Synchronized Communication & Event Logger */}
              <div className="lg:col-span-4 space-y-8 text-left">
                
                {/* RECENT NOTIFICATIONS / GMAIL SNIPPET */}
                <div className="bg-[#0A0B0E] border border-white/5 rounded-2xl p-6 space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-white/5">
                    <div className="flex items-center gap-2">
                      <Inbox className="h-4.5 w-4.5 text-indigo-400" />
                      <h3 className="font-display font-semibold text-white">Gmail Correspondence</h3>
                    </div>
                    {emails.some(e => !e.isRead) ? (
                      <span className="h-2 w-2 rounded-full bg-indigo-500 animate-ping" />
                    ) : (
                      <span className="text-[10px] text-gray-500 font-mono uppercase">Synced</span>
                    )}
                  </div>

                  <div className="space-y-3">
                    {emails.map((msg) => (
                      <div
                        key={msg.id}
                        onClick={() => handleReadEmail(msg)}
                        className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${
                          !msg.isRead
                            ? 'bg-indigo-600/5 border-indigo-500/25 shadow-sm'
                            : 'bg-white/5 border-white/5 hover:border-white/10'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <p className="text-[11px] font-semibold text-white truncate max-w-[140px]">{msg.sender}</p>
                          <p className="text-[9px] font-mono text-gray-500 shrink-0">{msg.date}</p>
                        </div>
                        <p className={`text-xs truncate ${!msg.isRead ? 'text-indigo-200 font-medium' : 'text-gray-400'}`}>
                          {msg.subject}
                        </p>
                        <p className="text-[10px] text-gray-500 font-sans truncate mt-1">
                          {msg.body.split('\n')[0]}
                        </p>
                      </div>
                    ))}
                  </div>

                  <button
                    onClick={() => setActiveTab('mail')}
                    className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-semibold text-white py-2.5 transition-colors"
                  >
                    Manage Mail Synced Inbox <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* TELEMETRY / REAL-TIME ACTIVITIES LOG */}
                <div className="bg-[#0A0B0E] border border-white/5 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 pb-2.5 border-b border-white/5">
                    <Activity className="h-4.5 w-4.5 text-indigo-400" />
                    <h3 className="font-display font-semibold text-white">Enterprise Activity Log</h3>
                  </div>

                  <div className="h-56 overflow-y-auto pr-1 space-y-2.5 font-mono text-[9px] text-gray-400 scrollbar-thin scrollbar-thumb-white/10">
                    {logs.map((log, index) => (
                      <div key={index} className="leading-relaxed border-l-2 border-indigo-500/30 pl-2 py-0.5 hover:bg-white/5 rounded-r">
                        {log}
                      </div>
                    ))}
                  </div>

                  <div className="text-[9px] font-mono text-gray-500 text-center uppercase tracking-widest pt-2 border-t border-white/5">
                    Continuous Audit logging active
                  </div>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 2: DETAILED MAIL CLIENT */}
          {activeTab === 'mail' && (
            <motion.div
              key="view-mail"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0A0B0E] border border-white/5 rounded-2xl overflow-hidden shadow-xl text-left"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[550px]">
                
                {/* List Pane */}
                <div className="lg:col-span-5 border-r border-white/5 flex flex-col justify-between">
                  <div className="p-4 border-b border-white/5 flex items-center justify-between">
                    <span className="font-display text-sm font-semibold text-white">Google Mail synchronization</span>
                    <span className="text-[10px] font-mono bg-indigo-500/15 text-indigo-400 px-2.5 py-0.5 rounded-full uppercase">
                      Synced {user.email}
                    </span>
                  </div>

                  <div className="flex-grow overflow-y-auto p-4 space-y-3.5 max-h-[460px]">
                    {emails.map((msg) => (
                      <button
                        key={msg.id}
                        onClick={() => handleReadEmail(msg)}
                        className={`w-full p-4 rounded-xl border text-left transition-all block ${
                          selectedEmail?.id === msg.id
                            ? 'bg-indigo-600/10 border-indigo-500/40'
                            : !msg.isRead
                            ? 'bg-indigo-600/5 border-indigo-500/20 hover:border-indigo-500/30'
                            : 'bg-white/5 border-white/5 hover:border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-1 mb-1.5">
                          <span className={`text-xs font-semibold py-0.5 px-2 rounded-full ${
                            msg.category === 'engineering' ? 'bg-orange-500/15 text-orange-400' :
                            msg.category === 'system' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-pink-500/15 text-pink-400'
                          }`}>
                            {msg.category}
                          </span>
                          <span className="text-[9px] font-mono text-gray-500">{msg.date}</span>
                        </div>
                        <h4 className="text-sm font-bold text-white truncate">{msg.subject}</h4>
                        <p className="text-[11px] text-gray-400 mt-0.5 font-medium">{msg.sender}</p>
                        <p className="text-xs text-gray-500 line-clamp-2 mt-2 font-sans line-clamp-1">
                          {msg.body}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Display & Reply Pane */}
                <div className="lg:col-span-7 flex flex-col justify-between p-6 bg-[#0E0F14]/50">
                  <AnimatePresence mode="wait">
                    {selectedEmail ? (
                      <motion.div
                        key={selectedEmail.id}
                        initial={{ opacity: 0, x: 12 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -12 }}
                        className="space-y-6 flex flex-col justify-between h-full"
                      >
                        {/* Header Details */}
                        <div className="space-y-4 border-b border-white/5 pb-4">
                          <div className="flex justify-between items-start gap-4">
                            <h3 className="font-display text-lg font-bold text-white tracking-tight">
                              {selectedEmail.subject}
                            </h3>
                            <button
                              onClick={() => setSelectedEmail(null)}
                              className="text-gray-500 hover:text-white p-1 rounded-full hover:bg-white/5 transition-colors"
                            >
                              <X className="h-4.5 w-4.5" />
                            </button>
                          </div>

                          <div className="flex items-center justify-between text-xs font-mono text-gray-400">
                            <div>
                              <span>From: </span>
                              <strong className="text-white font-semibold">{selectedEmail.sender}</strong>
                            </div>
                            <span>{selectedEmail.date}</span>
                          </div>
                        </div>

                        {/* Mail Body */}
                        <div className="flex-grow py-2 text-xs text-gray-300 leading-relaxed font-sans whitespace-pre-line max-h-[250px] overflow-y-auto">
                          {selectedEmail.body}
                        </div>

                        {/* Interactive Reply Section */}
                        <div className="border-t border-white/5 pt-4 space-y-3 text-left">
                          <label className="block text-[10px] font-mono text-gray-400 uppercase tracking-widest pl-1">
                            Dispatched response through Google Identity Auth
                          </label>

                          <form onSubmit={handleSendReply} className="space-y-3">
                            <textarea
                              rows={3}
                              required
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder={`Reply directly to Lead Architect...`}
                              className="w-full rounded-xl border border-white/10 bg-white/5 p-3.5 text-xs text-white placeholder-gray-500 focus:border-indigo-500 focus:outline-none focus:bg-black/20 transition-all resize-none"
                            />
                            <div className="flex justify-end">
                              <button
                                type="submit"
                                disabled={isSendingReply || !replyText.trim()}
                                className="flex items-center gap-1.5 rounded-xl bg-white hover:bg-gray-200 disabled:opacity-40 disabled:hover:bg-white text-black px-5 py-2.5 text-xs font-bold transition-all active:scale-[0.98]"
                              >
                                {isSendingReply ? (
                                  <>Dispatched...</>
                                ) : (
                                  <>
                                    <Send className="h-3.5 w-3.5" /> Send Sync Message
                                  </>
                                )}
                              </button>
                            </div>
                          </form>
                        </div>
                      </motion.div>
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500 max-w-sm mx-auto space-y-4">
                        <div className="p-4 rounded-full bg-white/5 border border-white/5 text-gray-400">
                          <Inbox className="h-10 w-10" />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-white">No Mail Thread Selected</p>
                          <p className="text-xs text-gray-400 mt-1 leading-relaxed font-sans">
                            Choose any synced Google mail thread on the left pane to analyze architectural feedback and dispatch response letters directly.
                          </p>
                        </div>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            </motion.div>
          )}

          {/* TAB 3: MILESTONE ROADMAP */}
          {activeTab === 'roadmap' && (
            <motion.div
              key="view-roadmap"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.3 }}
              className="bg-[#0A0B0E] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-8 text-left shadow-xl"
            >
              <div>
                <span className="font-mono text-[10px] font-bold text-indigo-400 uppercase tracking-widest block">
                  milestone deployment mapping
                </span>
                <h2 className="text-xl font-bold text-white tracking-tight mt-1">
                  Interactive Partnership Roadmap
                </h2>
                <p className="text-xs text-gray-400 mt-1.5 leading-relaxed max-w-2xl">
                  Analyze progress stages of your ongoing systems. Toggle phases below to simulate transition pipelines and review scheduled milestones.
                </p>
              </div>

              {/* STAGE TRACKER PATH */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pb-4">
                {([
                  { phase: 'scoping', label: '1. Scoping & Auth', desc: 'Requirements compile', activeClass: 'border-amber-500/50 bg-amber-500/5 text-amber-400' },
                  { phase: 'design', label: '2. Architecture', desc: 'Systems drafting', activeClass: 'border-blue-500/50 bg-blue-500/5 text-blue-400' },
                  { phase: 'development', label: '3. Engineering', desc: 'Continuous integration', activeClass: 'border-indigo-500/50 bg-indigo-500/5 text-indigo-400' },
                  { phase: 'live', label: '4. System Release', desc: 'Secure production', activeClass: 'border-emerald-500/50 bg-emerald-500/5 text-emerald-400' },
                ] as const).map((step) => {
                  const isCurrent = projectPhase === step.phase;
                  return (
                    <button
                      key={step.phase}
                      onClick={() => {
                        setProjectPhase(step.phase);
                        addLog(`Changed timeline preview phase focus to: "${step.phase.toUpperCase()}"`);
                      }}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 relative ${
                        isCurrent 
                          ? step.activeClass + ' ring-2 ring-indigo-500/20' 
                          : 'bg-[#121216]/50 border-white/5 text-gray-500 hover:border-white/10 hover:text-gray-300'
                      }`}
                    >
                      <p className="text-xs font-bold">{step.label}</p>
                      <p className="text-[10px] text-gray-500 mt-1 font-mono leading-none">{step.desc}</p>
                      {isCurrent && (
                        <span className="absolute top-2.5 right-2.5 h-1.5 w-1.5 rounded-full bg-indigo-400" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* TIMELINE DETAILS BODY */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-4 border-t border-white/5 items-start">
                
                {/* Specific details */}
                <div className="lg:col-span-7 space-y-5">
                  <h3 className="font-display font-semibold text-white text-base">
                    Phase Status details
                  </h3>

                  <div className="rounded-xl bg-white/5 border border-white/5 p-5 space-y-4">
                    <div className="flex justify-between items-center bg-[#07070A] p-3 rounded-lg border border-white/5">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 text-indigo-400" />
                        <span className="text-xs font-mono text-gray-400 uppercase">Target deadline</span>
                      </div>
                      <span className="text-xs font-bold text-white font-mono">
                        {projectPhase === 'scoping' ? 'Within 12 hours' :
                         projectPhase === 'design' ? '7 Business Days' :
                         projectPhase === 'development' ? '21 Business Days' : 'Immediate System Launch'}
                      </span>
                    </div>

                    <div className="space-y-2 text-xs">
                      <span className="font-mono text-[10px] text-gray-500 block uppercase tracking-wider pl-1">
                        Scheduled Milestones
                      </span>
                      
                      <div className="space-y-2 font-sans pl-1">
                        {projectPhase === 'scoping' && (
                          <>
                            <div className="flex gap-2 text-gray-300">
                              <CheckCircle className="h-4 w-4 text-amber-500 shrink-0 mt-0.5" />
                              <span>Collect and review platform parameters and corporate email targets</span>
                            </div>
                            <div className="flex gap-2 text-gray-300">
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Authorize Google verification credentials and compile initials</span>
                            </div>
                            <div className="flex gap-2 text-gray-400/70">
                              <Clock className="h-4 w-4 text-gray-600 shrink-0 mt-0.5" />
                              <span>Execute interactive stack compiler optimization reviews</span>
                            </div>
                          </>
                        )}

                        {projectPhase === 'design' && (
                          <>
                            <div className="flex gap-2 text-gray-300">
                              <CheckCircle className="h-4 w-4 text-blue-500 shrink-0 mt-0.5" />
                              <span>Establish system workflow topologies and network node drafts</span>
                            </div>
                            <div className="flex gap-2 text-gray-400/70">
                              <Clock className="h-4 w-4 text-gray-600 shrink-0 mt-0.5" />
                              <span>Draft secure biometrics integration structures for hybrid frameworks</span>
                            </div>
                          </>
                        )}

                        {projectPhase === 'development' && (
                          <>
                            <div className="flex gap-2 text-gray-400/70">
                              <Clock className="h-4 w-4 text-gray-600 shrink-0 mt-0.5" />
                              <span>Implement continuous deployment pipeline with staging branch</span>
                            </div>
                            <div className="flex gap-2 text-gray-400/70">
                              <Clock className="h-4 w-4 text-gray-600 shrink-0 mt-0.5" />
                              <span>Bundle secure offline encrypted storage hooks into primary branch</span>
                            </div>
                          </>
                        )}

                        {projectPhase === 'live' && (
                          <>
                            <div className="flex gap-2 text-gray-300">
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Decommission backup staging clusters and route DNS directly to main CDN</span>
                            </div>
                            <div className="flex gap-2 text-gray-300">
                              <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                              <span>Continuous metrics log synchronization active</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Progress Circle Visual */}
                <div className="lg:col-span-5 bg-[#121216]/50 border border-white/5 rounded-xl p-5 text-center space-y-4">
                  <span className="font-mono text-[9px] text-[#A5B4FC] block uppercase tracking-wider">
                    COMPLIANCE GUARANTEE
                  </span>
                  
                  <div className="relative h-28 w-28 mx-auto flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="56" cy="56" r="45" className="stroke-white/5" strokeWidth="6" fill="transparent" />
                      <circle 
                        cx="56" cy="56" r="45" 
                        className={`transition-all duration-500 ${
                          projectPhase === 'scoping' ? 'stroke-amber-500' :
                          projectPhase === 'design' ? 'stroke-blue-500' :
                          projectPhase === 'development' ? 'stroke-indigo-500' : 'stroke-emerald-500'
                        }`} 
                        strokeWidth="6" 
                        fill="transparent" 
                        strokeDasharray={2 * Math.PI * 45}
                        strokeDashoffset={2 * Math.PI * 40 * (
                          projectPhase === 'scoping' ? 0.75 :
                          projectPhase === 'design' ? 0.5 :
                          projectPhase === 'development' ? 0.25 : 0
                        )}
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute font-mono text-xs font-semibold text-white">
                      {projectPhase === 'scoping' && '25% Done'}
                      {projectPhase === 'design' && '50% Done'}
                      {projectPhase === 'development' && '75% Done'}
                      {projectPhase === 'live' && '100% Active'}
                    </div>
                  </div>

                  <p className="text-[11px] text-gray-400 font-sans leading-relaxed">
                    All updates are protected with AES-256 state hashing and synchronized across secure developer consoles periodically.
                  </p>
                </div>

              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
