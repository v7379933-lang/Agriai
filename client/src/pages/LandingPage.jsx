import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  Sparkles,
  CloudSun,
  ScanLine,
  Beaker,
  Droplets,
  ArrowRight,
  CheckCircle2,
  Users
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export function LandingPage() {
  const { loginAsDemoFarmer, loginAsDemoAdmin } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Navbar */}
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-agri-700 text-white flex items-center justify-center shadow-md shadow-agri-700/20">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <span className="font-black text-xl tracking-tight text-slate-900">AgriSmart AI</span>
              <span className="ml-1.5 px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-agri-100 text-agri-800">
                India
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="text-xs font-bold text-slate-700 hover:text-agri-700 px-3 py-2 rounded-lg transition"
            >
              Sign In
            </Link>
            <Link
              to="/dashboard"
              onClick={loginAsDemoFarmer}
              className="inline-flex items-center gap-1.5 text-xs font-bold bg-agri-700 text-white px-4 py-2.5 rounded-xl hover:bg-agri-800 shadow-sm shadow-agri-700/25 transition"
            >
              <span>Farmer Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-b from-white to-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-agri-50 border border-agri-200 text-xs font-bold text-agri-800">
            <Sparkles className="w-4 h-4 text-agri-600" />
            <span>AI-Powered Decision Support for Indian Agriculture</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Smart Farming Decisions. <br className="hidden sm:inline" />
            <span className="text-agri-700">Better Crops. Better Future.</span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Translating complex agronomy, soil health science, and real-time agrometeorology into practical, location-specific guidance for farmers across Andhra Pradesh, Telangana, and all India.
          </p>

          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              onClick={loginAsDemoFarmer}
              className="px-6 py-3.5 rounded-xl bg-agri-700 text-white text-sm font-bold shadow-lg shadow-agri-700/30 hover:bg-agri-800 transition flex items-center gap-2"
            >
              <span>Explore as Farmer (Demo)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/admin"
              onClick={loginAsDemoAdmin}
              className="px-6 py-3.5 rounded-xl bg-slate-900 text-white text-sm font-bold shadow-md hover:bg-slate-800 transition flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4 text-agri-400" />
              <span>Admin Portal</span>
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap justify-center items-center gap-6 text-xs text-slate-500 font-semibold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-agri-600" /> Grounded in ICAR, ANGRAU & PJTSAU
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-agri-600" /> Multilingual: English, Telugu, Hindi
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-agri-600" /> Official Google Gemini GenAI SDK
            </span>
          </div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center space-y-2 mb-12">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Complete Agricultural Intelligence Suite</h2>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">Structured decision support covering the full crop lifecycle from seed selection to harvest.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-agri-300 transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Crop Suitability Matcher</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyzes soil texture, pH, water availability, and agro-climatic season to score top crops with duration and risk factors.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-agri-300 transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center font-bold">
              <ScanLine className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Multimodal Disease Diagnosis</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upload leaf images or select observed symptoms for preliminary diagnosis and structured Integrated Pest Management (IPM).
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-agri-300 transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
              <Beaker className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Nutrient & Fertilizer Calculator</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Calculates stage-specific basal and top-dressing dosages (Urea, DAP, MOP) based on crop removal rates.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-agri-300 transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center font-bold">
              <Droplets className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Weather-Adaptive Irrigation</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Computes daily crop evapotranspiration (ETc) against forecast precipitation to optimize water and electricity usage.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-agri-300 transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold">
              <CloudSun className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">Agrometeorological Alerts</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Live Open-Meteo forecasts coupled with automated alerts for heatwaves, rain damage, and disease-conducive humidity.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs hover:border-agri-300 transition space-y-3">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base">AI Farming Chatbot</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Conversational assistant ready to answer agronomic queries in English, Telugu, or Hindi with localized context.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
        <p>© 2026 AgriSmart AI — Open, scientifically grounded agricultural decision support.</p>
        <p className="mt-1">Developed for Indian farmers in compliance with ICAR, ANGRAU & PJTSAU package of practices.</p>
      </footer>
    </div>
  );
}

