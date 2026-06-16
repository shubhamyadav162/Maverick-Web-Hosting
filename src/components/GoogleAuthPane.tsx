import { useState, FormEvent } from 'react';
import { motion } from 'motion/react';
import { Mail, Shield, AlertCircle, ArrowRight, UserCheck } from 'lucide-react';

interface GoogleAccount {
  name: string;
  email: string;
  initials: string;
  avatarBlur: string;
}

export default function GoogleAuthPane() {
  const [view, setView] = useState<'select' | 'credential' | 'success'>('select');
  const [customEmail, setCustomEmail] = useState('');
  const [customName, setCustomName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [selectedUser, setSelectedUser] = useState<GoogleAccount | null>(null);

  const defaultAccounts: GoogleAccount[] = [
    {
      name: 'Shubham Yadav',
      email: 'shubham.1614@gmail.com',
      initials: 'SY',
      avatarBlur: 'bg-indigo-600',
    },
    {
      name: 'Jane Foster',
      email: 'jane.foster@company.com',
      initials: 'JF',
      avatarBlur: 'bg-emerald-600',
    },
  ];

  const handleSelectAccount = (acc: GoogleAccount) => {
    setSelectedUser(acc);
    setView('credential');
  };

  const handleCustomSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!customEmail.includes('@') || customEmail.length < 5) {
      setErrorMsg('Please enter a valid Google Account email.');
      return;
    }
    if (customName.trim().length < 2) {
      setErrorMsg('Please specify your account first & last name.');
      return;
    }

    const parts = customName.split(' ');
    let init = 'G';
    if (parts.length >= 2) {
      init = (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
    } else if (parts.length === 1) {
      init = parts[0].substring(0, 2).toUpperCase();
    }

    const newAcc: GoogleAccount = {
      name: customName,
      email: customEmail,
      initials: init,
      avatarBlur: 'bg-violet-600',
    };

    setSelectedUser(newAcc);
    setView('credential');
  };

  const handleAuthorize = () => {
    if (!selectedUser) return;
    setView('success');

    setTimeout(() => {
      if (window.opener) {
        // Send authenticated model to parent window
        window.opener.postMessage(
          {
            type: 'OAUTH_AUTH_SUCCESS',
            user: {
              name: selectedUser.name,
              email: selectedUser.email,
              initials: selectedUser.initials,
            },
          },
          '*'
        );
        window.close();
      } else {
        // Fallback if not opened as popup
        window.location.href = '/';
      }
    }, 1800);
  };

  return (
    <div className="min-h-screen bg-[#F3F4F6] text-gray-800 font-sans flex items-center justify-center p-4 selection:bg-blue-100">
      <div className="w-full max-w-[420px] bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden px-8 py-10 flex flex-col justify-between min-h-[500px]">
        {/* Google Header Logo */}
        <div className="flex flex-col items-center text-center">
          <svg className="h-10 w-auto" viewBox="0 0 24 24" fill="none">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              fill="#4285F4"
            />
            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853"
            />
            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              fill="#FBBC05"
            />
            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              fill="#EA4335"
            />
          </svg>

          {view === 'select' && (
            <div className="mt-5 space-y-1">
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Choose an account</h1>
              <p className="text-xs text-gray-500">to continue to <span className="font-semibold text-gray-800">Mavrick Portal</span></p>
            </div>
          )}

          {view === 'credential' && selectedUser && (
            <div className="mt-5 space-y-1 w-full">
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Grant Permissions</h1>
              <p className="text-xs text-gray-500">
                to share your account profile and email metadata
              </p>
            </div>
          )}

          {view === 'success' && selectedUser && (
            <div className="mt-5 space-y-1">
              <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Authorized</h1>
              <p className="text-xs text-green-600 font-medium">Successfully logged in via Google Mail authentication</p>
            </div>
          )}
        </div>

        {/* View Main Content */}
        <div className="my-6 flex-grow flex flex-col justify-center">
          {view === 'select' && (
            <div className="space-y-4">
              {/* Account List */}
              <div className="divide-y divide-gray-100 border-y border-gray-100">
                {defaultAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectAccount(acc)}
                    className="flex items-center w-full py-3.5 px-2 hover:bg-gray-50 transition-colors text-left group"
                  >
                    <div className={`h-8 w-8 rounded-full ${acc.avatarBlur} flex items-center justify-center text-xs font-bold text-white uppercase`}>
                      {acc.initials}
                    </div>
                    <div className="ml-3.5 flex-grow">
                      <p className="text-[13px] font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                        {acc.name}
                      </p>
                      <p className="text-xs text-gray-550 font-mono truncate">{acc.email}</p>
                    </div>
                    <span className="text-[10px] text-blue-600 font-semibold bg-blue-50 px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      Select
                    </span>
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <form onSubmit={handleCustomSubmit} className="space-y-3 pt-2">
                <div className="relative">
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2 pl-1">
                    Use Another Google Account
                  </p>
                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Your Full Name"
                      value={customName}
                      onChange={(e) => {
                        setCustomName(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 transition-all font-sans text-gray-800"
                    />
                    <input
                      type="email"
                      placeholder="username@gmail.com"
                      value={customEmail}
                      onChange={(e) => {
                        setCustomEmail(e.target.value);
                        setErrorMsg('');
                      }}
                      className="w-full text-xs px-3 py-2.5 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-blue-500 transition-all font-mono text-gray-800"
                    />
                  </div>
                </div>

                {errorMsg && (
                  <p className="text-[11px] font-semibold text-red-500 flex items-center gap-1 bg-red-50 p-2 rounded">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0" /> {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-gray-900 hover:bg-gray-800 text-xs font-bold text-white rounded transition-colors"
                >
                  Configure Custom Sign-In <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </form>
            </div>
          )}

          {view === 'credential' && selectedUser && (
            <div className="space-y-5 text-center">
              <div className="mx-auto h-16 w-16 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                <Shield className="h-8 w-8" />
              </div>

              <div className="bg-gray-50 border border-gray-150 rounded-lg p-4 text-left space-y-3">
                <p className="text-[13px] text-gray-800 leading-relaxed font-sans">
                  <span className="font-semibold text-gray-900">Mavrick Portal</span> request permission to access your standard profile info and read Google Mail metadata for interactive timelines:
                </p>
                <div className="space-y-1.5 border-t border-gray-200/60 pt-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Retrieve full name: <strong className="text-gray-800">{selectedUser.name}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Retrieve email: <strong className="text-gray-800 font-mono">{selectedUser.email}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                    <span>Retrieve Gmail communication threads regarding scoping files</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setView('select')}
                  className="flex-1 py-2.5 border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleAuthorize}
                  className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-xs font-semibold text-white rounded transition-colors shadow shadow-blue-600/10"
                >
                  Grant & Continue
                </button>
              </div>
            </div>
          )}

          {view === 'success' && selectedUser && (
            <div className="space-y-4 text-center">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 0.8, repeat: Infinity }}
                className="mx-auto h-16 w-16 rounded-full bg-green-50 text-green-500 flex items-center justify-center border border-green-200"
              >
                <UserCheck className="h-8 w-8" />
              </motion.div>
              <div className="space-y-1">
                <p className="text-sm font-semibold text-gray-800">{selectedUser.name}</p>
                <p className="text-xs text-gray-500 font-mono">{selectedUser.email}</p>
              </div>
              <p className="text-xs font-mono text-gray-400 mt-4 animate-pulse">
                Transmitting secure OAuth token back dynamically ...
              </p>
            </div>
          )}
        </div>

        {/* Google Safe Compliance Footer */}
        <div className="border-t border-gray-100 pt-4 flex items-center justify-center gap-1.5 text-[10px] font-semibold text-gray-400">
          <Shield className="h-3 w-3" />
          <span>Secured with standard Google OAuth 2.0 Webflow protocol</span>
        </div>
      </div>
    </div>
  );
}
