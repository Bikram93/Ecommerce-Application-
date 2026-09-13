import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { Sparkles, Shield, User, Lock, Mail, ArrowRight } from 'lucide-react';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const { login, register, quickDemoLogin, user } = useApp();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Form State
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already logged in, redirect
  if (user) {
    navigate(from, { replace: true });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (isLogin) {
      const res = await login(email, password);
      if (res.success) navigate(from, { replace: true });
    } else {
      const res = await register({
        email,
        username: username || email.split('@')[0],
        first_name: firstName,
        last_name: lastName,
        password,
        password2,
      });
      if (res.success) navigate(from, { replace: true });
    }
    setIsSubmitting(false);
  };

  const handleDemoClick = async (role) => {
    setIsSubmitting(true);
    const res = await quickDemoLogin(role);
    setIsSubmitting(false);
    if (res.success) navigate(from, { replace: true });
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Quick Demo Showcase Callout (Highlight for Interviews) */}
        <div className="bg-gradient-to-r from-indigo-900 to-slate-900 text-white p-5 rounded-3xl shadow-xl mb-6 border border-indigo-500/20 text-center">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3 text-indigo-300" />
            Recruiter &amp; Portfolio Quick Demo
          </div>
          <p className="text-xs text-slate-300 mb-4">
            Test the application instantly without filling forms or creating accounts:
          </p>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              type="button"
              onClick={() => handleDemoClick('customer')}
              className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 shadow-sm"
            >
              <User className="w-3.5 h-3.5" /> Demo Customer
            </button>
            <button
              type="button"
              onClick={() => handleDemoClick('admin')}
              className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-indigo-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5 border border-slate-700 shadow-sm"
            >
              <Shield className="w-3.5 h-3.5 text-indigo-400" /> Demo Admin
            </button>
          </div>
        </div>

        {/* Main Auth Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-sm">
          {/* Tab Switcher */}
          <div className="flex rounded-2xl bg-slate-100 p-1 mb-8">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-xl transition ${
                !isLogin ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Create Account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">First Name</label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Alex"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">Last Name</label>
                  <input
                    type="text"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="Smith"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {!isLogin && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password2}
                    onChange={(e) => setPassword2(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl shadow-md hover:shadow-indigo-500/30 transition flex items-center justify-center gap-2 text-sm"
            >
              {isSubmitting ? (
                'Processing...'
              ) : isLogin ? (
                <>
                  Sign In <ArrowRight className="w-4 h-4" />
                </>
              ) : (
                <>
                  Create Account <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
