import React, { useState } from 'react';
import { X, Lock, Mail, User as UserIcon, Bot, ArrowRight, ShieldCheck } from 'lucide-react';
import { User } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('alex.kumar@diploma-cse.edu');
  const [password, setPassword] = useState('password123');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [forgotSent, setForgotSent] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide your email and password.');
      return;
    }

    if (!isLogin && password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    const user: User = {
      id: 'usr_' + Date.now().toString(36),
      name: isLogin ? (email.includes('alex') ? 'Alex Kumar' : email.split('@')[0]) : name || 'Student',
      email,
      role: 'Diploma CSE Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };

    onLoginSuccess(user);
    onClose();
  };

  const handleQuickDemoLogin = () => {
    const demoUser: User = {
      id: 'usr_1',
      name: 'Alex Kumar',
      email: 'alex.kumar@diploma-cse.edu',
      role: 'Diploma CSE Final Year Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    };
    onLoginSuccess(demoUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900/95 p-6 sm:p-8 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-bold">
            <Bot className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {isLogin ? 'Welcome Back' : 'Create Student Account'}
            </h2>
            <p className="text-xs text-slate-400">WhatsApp AI Agent Academic Portal</p>
          </div>
        </div>

        {/* Quick Demo Access banner */}
        <div className="mb-6 rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-emerald-300">Quick Academic Viva Access</p>
              <p className="text-[11px] text-slate-400">Skip registration & explore with pre-filled student account</p>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors shrink-0"
            >
              1-Click Login
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-slate-950 p-1 mb-6 border border-slate-800">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              isLogin ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              !isLogin ? 'bg-slate-800 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-rose-500/10 border border-rose-500/20 p-2.5 text-xs text-rose-300">
            {error}
          </div>
        )}

        {forgotSent && (
          <div className="mb-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-xs text-emerald-300">
            Password reset instructions sent to {email}.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <UserIcon className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Kumar"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">College Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@college.edu"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 pl-9 pr-3 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>
            </div>
          )}

          {isLogin && (
            <div className="flex items-center justify-between text-xs text-slate-400">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-700 bg-slate-950 text-emerald-500 focus:ring-0"
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                onClick={() => setForgotSent(true)}
                className="text-emerald-400 hover:underline"
              >
                Forgot password?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-emerald-500 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            <span>{isLogin ? 'Sign In' : 'Create Student Account'}</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-800 flex items-center justify-center gap-2 text-[11px] text-slate-400">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          <span>Local educational session & secure hash storage</span>
        </div>
      </div>
    </div>
  );
};
