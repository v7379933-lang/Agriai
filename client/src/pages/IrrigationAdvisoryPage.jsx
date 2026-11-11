import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import { Droplets, CloudRain, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';

export function IrrigationAdvisoryPage() {
  const { profile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    cropName: 'Rice (Paddy)',
    growthStage: 'flowering',
    soilType: profile?.soil_type || 'black_cotton',
    irrigationMethod: profile?.irrigation_type || 'borewell',
    waterAvailability: 'adequate',
    lastIrrigationDaysAgo: 4,
    recentRainfallMm: 0,
    temperatureC: 32,
    fieldObservations: 'Top 2 inches of soil drying out'
  });

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const res = await api.getIrrigationAdvisory(form);
      if (res?.data?.result) {
        setResult(res.data.result);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to calculate irrigation schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <Droplets className="w-6 h-6 text-cyan-600" />
          Smart Irrigation & Water Scheduling
        </h1>
        <p className="text-xs text-slate-500">
          Evaluates soil moisture retention, crop growth stage sensitivity, and forecasted precipitation to prevent water stress or waterlogging.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Input Form */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
            <span>Water Budget & Field Moisture</span>
            <span className="text-[10px] text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded font-bold">Input</span>
          </h2>

          <form onSubmit={handleGenerate} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop</label>
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
                  <option value="Maize">Maize</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Growth Stage</label>
                <select
                  value={form.growthStage}
                  onChange={(e) => setForm({ ...form, growthStage: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium capitalize bg-white"
                >
                  <option value="seedling">Seedling</option>
                  <option value="vegetative">Vegetative</option>
                  <option value="flowering">Flowering (Critical)</option>
                  <option value="grain_filling">Grain / Fruit Filling</option>
                  <option value="maturity">Maturity</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Days Since Last Watering</label>
                <input
                  type="number"
                  min="0"
                  max="45"
                  required
                  value={form.lastIrrigationDaysAgo}
                  onChange={(e) => setForm({ ...form, lastIrrigationDaysAgo: parseInt(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Water Availability</label>
                <select
                  value={form.waterAvailability}
                  onChange={(e) => setForm({ ...form, waterAvailability: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium capitalize bg-white"
                >
                  <option value="adequate">Adequate Borewell/Canal</option>
                  <option value="surplus">Surplus Water</option>
                  <option value="scarce">Scarce / Rationed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Recent Rainfall (mm)</label>
                <input
                  type="number"
                  min="0"
                  value={form.recentRainfallMm}
                  onChange={(e) => setForm({ ...form, recentRainfallMm: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Delivery Method</label>
                <select
                  value={form.irrigationMethod}
                  onChange={(e) => setForm({ ...form, irrigationMethod: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium capitalize bg-white"
                >
                  <option value="borewell">Borewell Flood/Furrow</option>
                  <option value="drip">Drip Irrigation</option>
                  <option value="sprinkler">Sprinkler</option>
                  <option value="canal">Canal Gravity</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Field Observations</label>
              <input
                type="text"
                value={form.fieldObservations}
                onChange={(e) => setForm({ ...form, fieldObservations: e.target.value })}
                placeholder="e.g. Mild midday wilting or moist soil"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-cyan-600 focus:outline-hidden"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-700 text-white font-bold hover:bg-cyan-800 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <Droplets className="w-4 h-4" />
              <span>{loading ? 'Evaluating Evapotranspiration...' : 'Compute Smart Watering Schedule'}</span>
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
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 text-cyan-400 mx-auto flex items-center justify-center">
                <Droplets className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Irrigation Calculation Run Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Submit crop growth stage and recent watering interval to calculate optimal watering volume.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-4 border-cyan-600 border-t-transparent rounded-full mx-auto" />
              <p className="text-xs font-bold text-slate-700">Estimating crop water stress index and atmospheric evapotranspiration...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Summary Card */}
              <div className="bg-cyan-50/80 border border-cyan-200 p-5 rounded-3xl space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-cyan-900 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-cyan-600" />
                    Water Management Assessment
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-white text-cyan-800 border border-cyan-200">
                    Stress: {result.irrigation_assessment.water_stress_risk}
                  </span>
                </div>
                <p className="text-xs text-cyan-950 leading-relaxed">{result.summary}</p>
              </div>

              {/* Action Plan */}
              <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900">Irrigation Protocol</h3>

                <div className="space-y-3">
                  {result.recommendations.map((rec, idx) => (
                    <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="flex items-center justify-between">
                        <h4 className="text-sm font-black text-slate-900 flex items-center gap-2">
                          <Clock className="w-4 h-4 text-cyan-600" />
                          {rec.action}
                        </h4>
                        {rec.quantity && (
                          <span className="px-2.5 py-1 rounded-lg bg-cyan-100 text-cyan-900 font-black text-xs">
                            {rec.quantity} {rec.unit}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-slate-600">
                        <strong>Timing:</strong> {rec.timing}
                      </p>
                      <p className="text-xs text-slate-600 italic">
                        <strong>Agronomic Rationale:</strong> {rec.reason}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Weather Considerations */}
              {result.weather_considerations.length > 0 && (
                <div className="p-4 bg-slate-100/80 rounded-2xl text-xs text-slate-700 space-y-1">
                  <p className="font-bold flex items-center gap-1.5 text-slate-900">
                    <CloudRain className="w-4 h-4 text-slate-600" />
                    Meteorological Correlation:
                  </p>
                  <ul className="list-disc pl-5 space-y-0.5">
                    {result.weather_considerations.map((w, wIdx) => (
                      <li key={wIdx}>{w}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

