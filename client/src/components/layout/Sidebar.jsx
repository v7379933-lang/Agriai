import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  ScanLine,
  Beaker,
  Droplets,
  CloudSun,
  MessageSquare,
  Wheat,
  BookOpen,
  History,
  ShieldAlert,
  UserCheck
} from 'lucide-react';

export function Sidebar() {
  const { isAdmin, user } = useAuth();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/crop-recommendation', label: 'AI Crop Matcher', icon: Sparkles },
    { to: '/disease-detection', label: 'Pest & Disease Scan', icon: ScanLine },
    { to: '/fertilizer-advisory', label: 'Fertilizer Calculator', icon: Beaker },
    { to: '/irrigation-advisory', label: 'Smart Irrigation', icon: Droplets },
    { to: '/weather', label: 'Weather & Alerts', icon: CloudSun },
    { to: '/chatbot', label: 'AI Farm Chatbot', icon: MessageSquare },
    { to: '/my-crops', label: 'My Cultivated Crops', icon: Wheat },
    { to: '/cultivation-guides', label: 'Cultivation Guides', icon: BookOpen },
    { to: '/advisory-history', label: 'Advisory Archive', icon: History }
  ];

  if (isAdmin) {
    navItems.push({ to: '/admin', label: 'Admin Dashboard', icon: ShieldAlert });
  }

  return (
    <aside className="w-64 bg-white border-r border-slate-200 hidden md:flex flex-col flex-shrink-0 min-h-[calc(100vh-4rem)]">
      <div className="p-4 space-y-1">
        <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Advisory Modules
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                  isActive
                    ? 'bg-agri-700 text-white shadow-sm shadow-agri-700/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`
              }
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Role Switcher Pill for Testing / Demonstration */}
      <div className="mt-auto p-4 border-t border-slate-200 bg-slate-50/50">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-white border border-slate-200 text-xs">
          <UserCheck className="w-4 h-4 text-agri-600" />
          <div className="flex-1 truncate">
            <p className="font-bold text-slate-800 leading-none truncate">{user?.fullName}</p>
            <p className="text-[10px] text-slate-500 capitalize">{user?.role} Session</p>
          </div>
        </div>
      </div>
    </aside>
  );
}

