import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import {
  Sparkles,
  ArrowRight,
  ShieldAlert,
  BookOpen,
  Info,
  CheckCircle,
  AlertTriangle,
  RotateCcw,
  Printer
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export function CropRecommendationPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    cropCategory: '',
    state: profile?.state || 'Andhra Pradesh',
    district: profile?.district || 'Guntur',
    mandal: profile?.mandal || 'Tenali',
    village: profile?.village || '',
    season: 'kharif',
    soilType: profile?.soil_type || 'black_cotton',
    soilPh: 6.8,
    nitrogenLevel: 'medium',
    phosphorusLevel: 'medium',
    potassiumLevel: 'medium',
    landArea: Number(profile?.land_area) || 3.0,
    landUnit: profile?.land_unit || 'acre',
    irrigationAvailability: 'assured',
    irrigationType: profile?.irrigation_type || 'borewell',
    previousCrop: '',
    farmingObjective: 'maximum_yield',
    additionalNotes: ''
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await api.recommendCrops(form);
      if (res?.data?.result) {
        setResult(res.data.result);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate crop recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-agri-600" />
          AI-Powered Crop Suitability Matcher
        </h1>
        <p className="text-xs text-slate-500">
          Evaluates soil characteristics, water budget, and regional agro-climatic calendars to recommend high-yielding crops
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
            <span>Farm & Seasonal Parameters</span>
            <span className="text-[10px] text-agri-700 bg-agri-50 px-2 py-0.5 rounded font-bold">Step 1</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Season</label>
                <select
                  value={form.season}
                  onChange={(e) => setForm({ ...form, season: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium capitalize bg-white"
                >
                  <option value="kharif">Kharif (Monsoon)</option>
                  <option value="rabi">Rabi (Winter)</option>
                  <option value="zaid">Zaid (Summer)</option>
                  <option value="perennial">Perennial</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Soil Type</label>
                <select
                  value={form.soilType}
                  onChange={(e) => setForm({ ...form, soilType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium capitalize bg-white"
                >
                  <option value="black_cotton">Black Cotton</option>
                  <option value="red_soil">Red Soil (Chalka)</option>
                  <option value="sandy_loam">Sandy Loam</option>
                  <option value="clay_loam">Clay Loam</option>
                  <option value="alluvial">Alluvial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Water Source</label>
                <select
                  value={form.irrigationAvailability}
                  onChange={(e) => setForm({ ...form, irrigationAvailability: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                >
                  <option value="assured">Assured Irrigation</option>
                  <option value="partial">Partial / Seasonal</option>
                  <option value="rainfed">Strictly Rainfed</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Farming Objective</label>
                <select
                  value={form.farmingObjective}
                  onChange={(e) => setForm({ ...form, farmingObjective: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                >
                  <option value="maximum_yield">Maximum Yield</option>
                  <option value="low_water_cost">Low Water / Input Cost</option>
                  <option value="soil_regeneration">Soil Regeneration / Legume</option>
                  <option value="high_market_value">High Market Value</option>
                </select>
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-bold text-slate-700">Soil pH: {form.soilPh}</label>
                <span className="text-[10px] text-slate-400">Neutral: 6.5 - 7.5</span>
              </div>
              <input
                type="range"
                min="4.5"
                max="9.0"
                step="0.1"
                value={form.soilPh}
                onChange={(e) => setForm({ ...form, soilPh: parseFloat(e.target.value) })}
                className="w-full accent-agri-600"
              />
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Nitrogen (N)</label>
                <select
                  value={form.nitrogenLevel}
                  onChange={(e) => setForm({ ...form, nitrogenLevel: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs capitalize bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Phosphorus (P)</label>
                <select
                  value={form.phosphorusLevel}
                  onChange={(e) => setForm({ ...form, phosphorusLevel: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs capitalize bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-600 mb-1">Potassium (K)</label>
                <select
                  value={form.potassiumLevel}
                  onChange={(e) => setForm({ ...form, potassiumLevel: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 text-xs capitalize bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Previous Crop in this Field</label>
              <input
                type="text"
                value={form.previousCrop}
                onChange={(e) => setForm({ ...form, previousCrop: e.target.value })}
                placeholder="e.g. Cotton or Paddy (Helps plan crop rotation)"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-agri-700 text-white font-bold hover:bg-agri-800 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>{loading ? 'Evaluating Agro-Climatic Suitability...' : 'Generate Crop Recommendations'}</span>
            </button>
          </form>
        </div>

        {/* Results Column */}
        <div className="lg:col-span-7 space-y-4">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {!result && !loading && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Crop Recommendation Generated Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Configure your target season, soil characteristics, and irrigation above to run the scientific suitability analysis.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-4 border-agri-600 border-t-transparent rounded-full mx-auto" />
              <p className="text-xs font-bold text-slate-700">Analyzing soil texture, pH, and ANGRAU/ICAR regional crop calendars...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="bg-agri-50 border border-agri-200 p-5 rounded-3xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-agri-900 flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-agri-600" />
                    Suitability Assessment Summary
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-lg bg-white border border-agri-200 text-agri-800 text-[11px] font-bold flex items-center gap-1 hover:bg-agri-100 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Report</span>
                  </button>
                </div>
                <p className="text-xs text-agri-800 leading-relaxed">{result.analysis_summary}</p>
              </div>

              {/* Crop Cards */}
              <div className="space-y-3">
                {result.recommendations.map((crop, idx) => (
                  <div key={idx} className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-extrabold text-slate-900">{crop.crop_name}</h3>
                          {crop.scientific_name && (
                            <span className="text-xs italic text-slate-400 font-serif">({crop.scientific_name})</span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">Duration: ~{crop.duration_days} days | Water: {crop.water_requirement}</p>
                      </div>

                      {/* Suitability Score Pill */}
                      <div className="text-right">
                        <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-agri-100 text-agri-800 font-black text-xs border border-agri-200">
                          <span>{crop.suitability_score}% Match</span>
                        </div>
                      </div>
                    </div>

                    <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <strong>Agronomic Rationale:</strong> {crop.reason}
                    </p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      <div className="p-3 bg-emerald-50/50 rounded-xl border border-emerald-100 space-y-1">
                        <span className="font-bold text-emerald-900">Key Advantages:</span>
                        <ul className="list-disc pl-4 text-emerald-800 space-y-0.5">
                          {crop.advantages.map((adv, aIdx) => (
                            <li key={aIdx}>{adv}</li>
                          ))}
                        </ul>
                      </div>

                      <div className="p-3 bg-amber-50/50 rounded-xl border border-amber-100 space-y-1">
                        <span className="font-bold text-amber-900">Risks & Vigilance:</span>
                        <ul className="list-disc pl-4 text-amber-800 space-y-0.5">
                          {crop.risks.map((r, rIdx) => (
                            <li key={rIdx}>{r}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Source References */}
              {result.source_references && result.source_references.length > 0 && (
                <div className="p-4 bg-slate-100/70 rounded-2xl text-slate-600 text-xs space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-slate-800">
                    <BookOpen className="w-3.5 h-3.5" />
                    Verified Agronomic References:
                  </p>
                  {result.source_references.map((ref, idx) => (
                    <p key={idx} className="text-[11px]">
                      • {ref.title} — <em>{ref.organization}</em>
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

