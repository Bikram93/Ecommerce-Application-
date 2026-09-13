import React from 'react';
import { Sparkles, AlertCircle, CheckCircle2, Info } from 'lucide-react';

export default function Toast({ toast }) {
  if (!toast) return null;

  const getIcon = () => {
    switch (toast.type) {
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-200" />;
      case 'info':
        return <Info className="w-4 h-4 text-indigo-200" />;
      default:
        return <CheckCircle2 className="w-4 h-4 text-emerald-200" />;
    }
  };

  const getBg = () => {
    switch (toast.type) {
      case 'error':
        return 'bg-rose-600 border-rose-500';
      case 'info':
        return 'bg-slate-800 border-slate-700';
      default:
        return 'bg-emerald-600 border-emerald-500';
    }
  };

  return (
    <div className="fixed top-5 right-5 z-50 animate-bounce">
      <div className={`px-4 py-3 rounded-2xl shadow-xl text-xs font-bold text-white flex items-center gap-2 border ${getBg()}`}>
        {getIcon()}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}
