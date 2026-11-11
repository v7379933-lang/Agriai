import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import { Beaker, CheckCircle2, AlertTriangle, ShieldCheck, Printer, ArrowRight } from 'lucide-react';

export function FertilizerAdvisoryPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    cropName: 'Rice (Paddy)',
    cropVariety: 'BPT 5204',
    growthStage: 'vegetative',
    landArea: Number(profile?.land_area) || 2.5,
    landUnit: profile?.land_unit || 'acre',
    soilType: profile?.soil_type || 'black_cotton',
    soilPh: 6.8,
    nitrogenLevel: 'medium',
    phosphorusLevel: 'medium',
    potassiumLevel: 'medium',
    observedSymptoms: [],
    previousFertilizers: '40 kg DAP applied basally',
    irrigationMethod: profile?.irrigation_type || 'borewell'
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await api.getFertilizerAdvisory(form);
      if (res?.data?.result) {
        setResult(res.data.result);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate fertilizer advisory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Beaker className="w-6 h-6 text-blue-600" />
          Fertilizer & Balanced Nutrient Calculator
        </h1>
        <p className="text-xs text-slate-500">
          Formulate crop-removal based split fertilizer dosages (Urea, DAP, MOP) aligned with ICAR and state agricultural university standards.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Column */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
            <span>Crop & Field Nutrients</span>
            <span className="text-[10px] text-blue-700 bg-blue-50 px-2 py-0.5 rounded font-bold">Input</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Target Crop</label>
                <select
                  value={form.cropName}
                  onChange={(e) => setForm({ ...form, cropName: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium bg-white"
                >
                  <option value="Rice (Paddy)">Rice (Paddy)</option>
                  <option value="Cotton">Cotton</option>
                  <option value="Chilli (Mirchi)">Chilli (Mirchi)</option>
                  <option value="Groundnut (Peanut)">Groundnut</option>
                  <option value="Tomato">Tomato</option>
                  <option value="Maize">Maize (Corn)</option>
                  <option value="Bengal Gram">Bengal Gram</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Growth Stage</label>
                <select
                  value={form.growthStage}
                  onChange={(e) => setForm({ ...form, growthStage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium capitalize bg-white"
                >
                  <option value="land_preparation">Land Preparation (Basal)</option>
                  <option value="seedling">Seedling / Nursery</option>
                  <option value="vegetative">Vegetative / Tillering</option>
                  <option value="flowering">Flowering / Heading</option>
                  <option value="grain_filling">Grain / Boll Filling</option>
                  <option value="maturity">Maturity</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Field Area</label>
                <div className="flex gap-1.5">
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={form.landArea}
                    onChange={(e) => setForm({ ...form, landArea: parseFloat(e.target.value) || 0 })}
                    className="flex-1 px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                  <select
                    value={form.landUnit}
                    onChange={(e) => setForm({ ...form, landUnit: e.target.value })}
                    className="px-2 py-2 rounded-xl border border-slate-200 bg-white font-bold"
                  >
                    <option value="acre">Acre</option>
                    <option value="hectare">Ha</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Soil Type</label>
                <select
                  value={form.soilType}
                  onChange={(e) => setForm({ ...form, soilType: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium capitalize bg-white"
                >
                  <option value="black_cotton">Black Cotton</option>
                  <option value="red_soil">Red Soil</option>
                  <option value="sandy_loam">Sandy Loam</option>
                  <option value="clay_loam">Clay Loam</option>
                  <option value="alluvial">Alluvial</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block font-bold text-slate-600 mb-1">Nitrogen (N)</label>
                <select
                  value={form.nitrogenLevel}
                  onChange={(e) => setForm({ ...form, nitrogenLevel: e.target.value })}
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 capitalize bg-white"
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
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 capitalize bg-white"
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
                  className="w-full px-2 py-1.5 rounded-lg border border-slate-200 capitalize bg-white"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Previous Fertilizer Applied This Season</label>
              <input
                type="text"
                value={form.previousFertilizers}
                onChange={(e) => setForm({ ...form, previousFertilizers: e.target.value })}
                placeholder="e.g. 1 bag DAP applied at sowing"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-blue-700 text-white font-bold hover:bg-blue-800 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Beaker className="w-4 h-4" />
              <span>{loading ? 'Calculating Nutrient Stoichiometry...' : 'Compute Fertilizer Schedule'}</span>
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
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-400 mx-auto flex items-center justify-center">
                <Beaker className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Fertilizer Calculation Run Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Select your crop, current growth stage, and field size on the left to compute commercial fertilizer dosages.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto" />
              <p className="text-xs font-bold text-slate-700">Calculating balanced N-P-K nutrient removal requirements...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="bg-blue-50/80 border border-blue-200 p-5 rounded-3xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                    Nutrient Budget Summary
                  </span>
                  <button
                    onClick={() => window.print()}
                    className="p-1.5 rounded-lg bg-white border border-blue-200 text-blue-800 text-[11px] font-bold flex items-center gap-1 hover:bg-blue-100 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Print Dosage</span>
                  </button>
                </div>
                <p className="text-xs text-blue-900 leading-relaxed">{result.summary}</p>
              </div>

              {/* Fertilizer Dosage Table */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900">Recommended Product Dosages</h3>

                <div className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-2 py-0.5 rounded">
                            {rec.nutrient}
                          </span>
                          <h4 className="text-sm font-black text-slate-900 mt-1">{rec.fertilizer_name}</h4>
                        </div>
                        <div className="text-right">
                          <span className="text-lg font-black text-slate-900">{rec.quantity}</span>
                          <span className="text-xs text-slate-500 ml-1 font-semibold">{rec.unit}</span>
                        </div>
                      </div>

                      <div className="text-xs text-slate-600 space-y-1">
                        <p><strong>Timing:</strong> {rec.application_timing}</p>
                        <p><strong>Method:</strong> {rec.application_method}</p>
                        <p className="text-slate-500 text-[11px] italic">Reason: {rec.reason}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Precautions */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-xs text-amber-900 space-y-1.5">
                <p className="font-bold flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Agronomic Precautions:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-amber-800">
                  {result.precautions.map((prec, pIdx) => (
                    <li key={pIdx}>{prec}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

