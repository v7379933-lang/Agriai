import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sprout, Lock, Mail, ArrowRight, UserCheck, ShieldCheck } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { loginAsDemoFarmer, loginAsDemoAdmin } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleStandardLogin = (e) => {
    e.preventDefault();
    loginAsDemoFarmer();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-agri-700 text-white flex items-center justify-center mx-auto shadow-md shadow-agri-700/30">
            <Sprout className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome to AgriSmart AI</h1>
          <p className="text-xs text-slate-500">Sign in to your farmer advisory portal</p>
        </div>

        {/* 1-Click Fast Demonstration Logins */}
        <div className="p-4 rounded-2xl bg-agri-50/70 border border-agri-200 space-y-2.5">
          <p className="text-[11px] font-bold uppercase tracking-wider text-agri-900 text-center">
            Instant Demo Access
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => {
                loginAsDemoFarmer();
                navigate('/dashboard');
              }}
              className="px-3 py-2.5 rounded-xl bg-agri-700 text-white text-xs font-bold hover:bg-agri-800 transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Demo Farmer</span>
            </button>
            <button
              type="button"
              onClick={() => {
                loginAsDemoAdmin();
                navigate('/admin');
              }}
              className="px-3 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-bold hover:bg-slate-800 transition flex items-center justify-center gap-1.5 shadow-xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              <span>Demo Admin</span>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center">
          <hr className="w-full border-slate-200" />
          <span className="absolute bg-white px-3 text-[10px] uppercase font-bold text-slate-400">or email sign in</span>
        </div>

        <form onSubmit={handleStandardLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ramesh.farmer@example.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-agri-700 text-white text-xs font-bold hover:bg-agri-800 transition flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-slate-500">
          New farmer?{' '}
          <Link to="/register" className="font-bold text-agri-700 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

