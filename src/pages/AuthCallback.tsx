import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function AuthCallback() {
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');

  useEffect(() => {
    supabase.auth.getSession().then(({ data, error }) => {
      if (error) {
        setStatus('error');
        return;
      }
      if (data.session) {
        setStatus('success');
        setTimeout(() => {
          window.location.href = '/';
        }, 500);
      } else {
        setStatus('error');
      }
    });
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="text-center">
        {status === 'processing' && (
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-indigo-400 border-t-transparent" />
            <p className="font-mono text-sm text-gray-400">Completing authentication...</p>
          </div>
        )}
        {status === 'success' && (
          <p className="font-mono text-sm text-emerald-400">Authentication successful. Redirecting...</p>
        )}
        {status === 'error' && (
          <div className="flex flex-col items-center gap-3">
            <p className="font-mono text-sm text-red-400">Authentication failed or no session found.</p>
            <a
              href="/"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors"
            >
              Return Home
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
