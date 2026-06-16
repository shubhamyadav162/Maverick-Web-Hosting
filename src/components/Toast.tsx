import { useEffect } from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  message: string;
  type?: 'success' | 'error' | 'info';
  duration?: number;
}

interface ToastProps {
  key?: string;
  toast: ToastMessage;
  onClose: (id: string) => void;
}

export default function Toast({ toast, onClose }: ToastProps) {
  const { id, message, type = 'success', duration = 4000 } = toast;

  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);
    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-rose-500 shrink-0" />;
      case 'info':
      default:
        return <Info className="h-5 w-5 text-indigo-400 shrink-0" />;
    }
  };

  const getStyles = () => {
    switch (type) {
      case 'success':
        return 'border-emerald-500/20 bg-emerald-950/20 shadow-emerald-500/5';
      case 'error':
        return 'border-rose-500/20 bg-rose-950/20 shadow-rose-500/5';
      case 'info':
      default:
        return 'border-indigo-500/20 bg-indigo-950/20 shadow-indigo-500/5';
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 350, damping: 25 }}
      className={`flex items-start gap-3.5 rounded-2xl border p-4 shadow-xl backdrop-blur-xl max-w-sm w-full relative group transition-all duration-300 ${getStyles()}`}
    >
      {/* Absolute progress indicator bar at the bottom */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-[2px] overflow-hidden rounded-b-2xl"
      >
        <motion.div
          initial={{ width: '100%' }}
          animate={{ width: '0%' }}
          transition={{ duration: duration / 1000, ease: 'linear' }}
          className={`h-full ${
            type === 'success' ? 'bg-emerald-400' : type === 'error' ? 'bg-rose-500' : 'bg-indigo-400'
          }`}
        />
      </div>

      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/5">
        {getIcon()}
      </div>

      <div className="flex-1 pt-0.5 pr-4">
        <p className="text-xs font-semibold font-display text-white tracking-tight">
          {type === 'success' ? 'System Notification' : type === 'error' ? 'Operational Alert' : 'Operational Update'}
        </p>
        <p className="text-[11px] text-gray-300 leading-relaxed font-sans mt-0.5">
          {message}
        </p>
      </div>

      <button
        type="button"
        onClick={() => onClose(id)}
        className="text-gray-500 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/5"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
