import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sprout, Globe, User, LogOut, ShieldCheck, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Navbar() {
  const { user, profile, language, setLanguage, logout, isAdmin } = useAuth();

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/dashboard" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-agri-600 text-white flex items-center justify-center shadow-md shadow-agri-600/20 group-hover:bg-agri-700 transition">
            <Sprout className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight text-slate-900">AgriSmart</span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-agri-100 text-agri-800">
                AI
              </span>
            </div>
            <p className="text-[10px] text-slate-500 font-medium hidden sm:block">Intelligent Crop Advisory Assistant</p>
          </div>
        </Link>

        {/* Center: Location Indicator */}
        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100/80 border border-slate-200 text-xs font-semibold text-slate-700">
          <MapPin className="w-3.5 h-3.5 text-agri-600" />
          <span>{profile?.district || 'Guntur'}, {profile?.state || 'Andhra Pradesh'}</span>
          <span className="text-slate-300">|</span>
          <span className="text-slate-500 text-[11px] capitalize">{profile?.soil_type?.replace('_', ' ') || 'Black Cotton'}</span>
        </div>

        {/* Right Action Controls */}
        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200 text-xs font-bold">
            <Globe className="w-3.5 h-3.5 text-slate-500 ml-1" />
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 rounded transition ${language === 'en' ? 'bg-white shadow-xs text-agri-800' : 'text-slate-600 hover:text-slate-900'}`}
            >
              EN
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`px-2 py-0.5 rounded transition ${language === 'te' ? 'bg-white shadow-xs text-agri-800' : 'text-slate-600 hover:text-slate-900'}`}
              title="Telugu"
            >
              తెలుగు
            </button>
            <button
              onClick={() => setLanguage('hi')}
              className={`px-2 py-0.5 rounded transition ${language === 'hi' ? 'bg-white shadow-xs text-agri-800' : 'text-slate-600 hover:text-slate-900'}`}
              title="Hindi"
            >
              हिन्दी
            </button>
          </div>

          {/* User profile & status */}
          <Link
            to="/profile"
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition"
          >
            <div className="w-8 h-8 rounded-full bg-agri-100 text-agri-800 font-bold flex items-center justify-center text-xs border border-agri-200">
              {isAdmin ? <ShieldCheck className="w-4 h-4 text-purple-700" /> : <User className="w-4 h-4 text-agri-700" />}
            </div>
            <div className="hidden lg:block text-left">
              <p className="text-xs font-bold leading-none text-slate-800">{user?.fullName || 'Farmer'}</p>
              <p className="text-[10px] text-slate-500 capitalize">{user?.role || 'Farmer'}</p>
            </div>
          </Link>

          {/* Logout */}
          <button
            onClick={logout}
            className="p-2 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition"
            title="Log Out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}

