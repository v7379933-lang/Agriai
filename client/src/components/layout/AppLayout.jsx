import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Sidebar } from './Sidebar';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Sparkles,
  ScanLine,
  Beaker,
  CloudSun,
  MessageSquare
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

export function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const mobileNav = [
    { to: '/dashboard', label: 'Home', icon: LayoutDashboard },
    { to: '/crop-recommendation', label: 'Crops', icon: Sparkles },
    { to: '/disease-detection', label: 'Scan', icon: ScanLine },
    { to: '/fertilizer-advisory', label: 'Nutrients', icon: Beaker },
    { to: '/weather', label: 'Weather', icon: CloudSun },
    { to: '/chatbot', label: 'AI Chat', icon: MessageSquare }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-20 md:pb-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-40 py-2 px-3 flex justify-around items-center">
        {mobileNav.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[10px] font-bold transition ${
                  isActive ? 'text-agri-700' : 'text-slate-400 hover:text-slate-700'
                }`
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </div>
  );
}

