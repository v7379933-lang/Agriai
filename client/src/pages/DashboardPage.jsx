import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import {
  Sprout,
  Sparkles,
  ScanLine,
  Beaker,
  Droplets,
  CloudSun,
  AlertTriangle,
  ArrowRight,
  Wheat,
  MapPin,
  Calendar,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export function DashboardPage() {
  const { user, profile } = useAuth();
  const [weather, setWeather] = useState(null);
  const [farmerCrops, setFarmerCrops] = useState([]);
  const [recentAdvisories, setRecentAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [wRes, cRes, aRes] = await Promise.all([
        api.getWeatherForecast(profile?.latitude, profile?.longitude),
        api.getFarmerCrops(),
        api.getAdvisories('?limit=3')
      ]);

      if (wRes?.data) setWeather(wRes.data);
      if (cRes?.data) setFarmerCrops(cRes.data);
      if (aRes?.data) setRecentAdvisories(aRes.data);
    } catch (err) {
      console.warn('Dashboard fetch issue:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [profile]);

  return (
    <div className="space-y-6">
      {/* 1. Welcome & Location Hero Card */}
      <div className="bg-gradient-to-r from-agri-800 to-agri-950 text-white p-6 sm:p-8 rounded-3xl shadow-sm relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-agri-700/60 border border-agri-600/50 text-xs font-semibold text-agri-200">
              <MapPin className="w-3.5 h-3.5 text-agri-300" />
              <span>{profile?.village ? `${profile.village}, ` : ''}{profile?.district || 'Guntur'}, {profile?.state || 'Andhra Pradesh'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
              Namaste, {profile?.full_name || user?.fullName || 'Farmer'}! 🌾
            </h1>
            <p className="text-xs sm:text-sm text-agri-200 max-w-xl">
              Holding: <strong>{profile?.land_area || '3.5'} {profile?.land_unit || 'acres'}</strong> of <strong>{profile?.soil_type?.replace('_', ' ') || 'black cotton'}</strong> soil with <strong>{profile?.irrigation_type || 'borewell'}</strong> irrigation.
            </p>
          </div>

          {/* Quick Weather Snapshot in Hero */}
          {weather?.current && (
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-4 py-3 rounded-2xl border border-white/10">
              <CloudSun className="w-8 h-8 text-amber-300 flex-shrink-0" />
              <div>
                <p className="text-2xl font-black">{weather.current.temperature}°C</p>
                <p className="text-[11px] text-agri-200 capitalize font-medium">{weather.current.condition}</p>
                <p className="text-[10px] text-agri-300">Humidity: {weather.current.humidity}% | Wind: {weather.current.windSpeedKmh} km/h</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. Weather Alert Banner if present */}
      {weather?.alerts && weather.alerts.length > 0 && (
        <div className="p-4 bg-amber-50 border-l-4 border-amber-500 rounded-2xl flex items-start gap-3 shadow-xs">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <p className="font-bold text-amber-900">{weather.alerts[0].title}</p>
            <p className="text-amber-800 mt-0.5">{weather.alerts[0].message}</p>
            <p className="text-amber-900 font-semibold mt-1">Recommended Action: {weather.alerts[0].action}</p>
          </div>
          <Link to="/weather" className="text-xs font-bold text-amber-900 underline whitespace-nowrap">
            View Forecast
          </Link>
        </div>
      )}

      {/* 3. Quick Action Grid */}
      <div>
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
          Advisory Assistants
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
          <Link
            to="/crop-recommendation"
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-agri-500 hover:shadow-md transition group text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-agri-50 text-agri-700 mx-auto flex items-center justify-center group-hover:scale-105 transition">
              <Sparkles className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">Crop Matcher</p>
            <p className="text-[10px] text-slate-500">Soil-based recommendations</p>
          </Link>

          <Link
            to="/disease-detection"
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-rose-500 hover:shadow-md transition group text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 mx-auto flex items-center justify-center group-hover:scale-105 transition">
              <ScanLine className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">Disease Scan</p>
            <p className="text-[10px] text-slate-500">Image upload & diagnosis</p>
          </Link>

          <Link
            to="/fertilizer-advisory"
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-blue-500 hover:shadow-md transition group text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 mx-auto flex items-center justify-center group-hover:scale-105 transition">
              <Beaker className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">Fertilizer Guide</p>
            <p className="text-[10px] text-slate-500">NPK split application</p>
          </Link>

          <Link
            to="/irrigation-advisory"
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-cyan-500 hover:shadow-md transition group text-center space-y-2"
          >
            <div className="w-10 h-10 rounded-xl bg-cyan-50 text-cyan-700 mx-auto flex items-center justify-center group-hover:scale-105 transition">
              <Droplets className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">Smart Irrigation</p>
            <p className="text-[10px] text-slate-500">Weather-adjusted runtime</p>
          </Link>

          <Link
            to="/chatbot"
            className="p-4 bg-white rounded-2xl border border-slate-200 hover:border-purple-500 hover:shadow-md transition group text-center space-y-2 col-span-2 sm:col-span-1"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-700 mx-auto flex items-center justify-center group-hover:scale-105 transition">
              <Sprout className="w-5 h-5" />
            </div>
            <p className="text-xs font-bold text-slate-800">Farm AI Chat</p>
            <p className="text-[10px] text-slate-500">Telugu, Hindi & English</p>
          </Link>
        </div>
      </div>

      {/* 4. Active Cultivated Crops */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Wheat className="w-5 h-5 text-agri-600" />
            <h2 className="text-base font-bold text-slate-900">Active Field Crops</h2>
          </div>
          <Link to="/my-crops" className="text-xs font-bold text-agri-700 hover:underline flex items-center gap-1">
            <span>Manage All Crops</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {farmerCrops.map((crop) => (
            <div key={crop.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">{crop.crop_name}</h3>
                  <p className="text-xs text-slate-500">{crop.variety_name || 'Standard Variety'}</p>
                </div>
                <StatusBadge status={crop.current_growth_stage?.replace('_', ' ')} />
              </div>

              <div className="text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Planted Area:</span>
                  <span className="font-semibold">{crop.area} acres</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Sown Date:</span>
                  <span className="font-semibold">{crop.sowing_date}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-200/80 flex gap-2">
                <Link
                  to={`/fertilizer-advisory?crop=${encodeURIComponent(crop.crop_name)}`}
                  className="flex-1 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 text-center hover:bg-slate-100 transition"
                >
                  Fertilizer
                </Link>
                <Link
                  to={`/disease-detection?crop=${encodeURIComponent(crop.crop_name)}`}
                  className="flex-1 py-1.5 rounded-lg bg-white border border-slate-200 text-[11px] font-bold text-slate-700 text-center hover:bg-slate-100 transition"
                >
                  Disease Scan
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Recent Advisories Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-agri-600" />
            <h2 className="text-base font-bold text-slate-900">Recent Advisories</h2>
          </div>
          <Link to="/advisory-history" className="text-xs font-bold text-agri-700 hover:underline flex items-center gap-1">
            <span>View History</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {recentAdvisories.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400 space-y-2">
            <p>No past advisories generated yet.</p>
            <Link
              to="/crop-recommendation"
              className="inline-block px-4 py-2 rounded-xl bg-agri-700 text-white font-bold"
            >
              Generate First Crop Advisory
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentAdvisories.map((adv) => (
              <div key={adv.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-agri-800 bg-agri-100 px-2 py-0.5 rounded">
                      {adv.category}
                    </span>
                    <span className="text-xs text-slate-400">{new Date(adv.created_at).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-bold text-slate-800 text-sm">{adv.title}</h4>
                </div>
                <Link
                  to={`/advisories/${adv.id}`}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition whitespace-nowrap"
                >
                  View Full Advisory
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

