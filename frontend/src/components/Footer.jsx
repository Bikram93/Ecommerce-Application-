import React from 'react';
import { Code2, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
              LS
            </div>
            <span className="text-sm font-bold text-slate-900">
              LuminaStore • Portfolio &amp; Interview Showcase
            </span>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium text-slate-500">
            <span className="flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-indigo-600" />
              React + Tailwind + Django REST Framework
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              JWT Authenticated
            </span>
          </div>

          <p className="text-xs text-slate-400">
            © 2026 Full-Stack E-Commerce Demo. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
