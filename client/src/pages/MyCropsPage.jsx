import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import { Wheat, Plus, Calendar, MapPin, ArrowRight, CheckCircle2, ChevronRight } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';
import { Link } from 'react-router-dom';

export function MyCropsPage() {
  const [crops, setCrops] = useState([]);
  const [masterCrops, setMasterCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  const [form, setForm] = useState({
    cropId: '',
    varietyName: '',
    season: 'kharif',
    sowingDate: new Date().toISOString().split('T')[0],
    expectedHarvestDate: '',
    currentGrowthStage: 'sowing',
    area: 2.0,
    notes: ''
  });

  const loadData = async () => {
    try {
      setLoading(true);
      const [fRes, mRes] = await Promise.all([
        api.getFarmerCrops(),
        api.getCrops()
      ]);
      if (fRes?.data) setCrops(fRes.data);
      if (mRes?.data) {
        setMasterCrops(mRes.data);
        if (mRes.data.length > 0) {
          setForm((prev) => ({ ...prev, cropId: mRes.data[0].id }));
        }
      }
    } catch (err) {
      console.warn('Failed to load crop records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await api.registerFarmerCrop(form);
      setShowAddModal(false);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to register crop');
    }
  };

  const advanceStage = async (cropId, currentStage) => {
    const stages = [
      'land_preparation',
      'sowing',
      'seedling',
      'vegetative',
      'flowering',
      'grain_filling',
      'maturity',
      'harvesting'
    ];
    const currentIndex = stages.indexOf(currentStage);
    const nextStage = stages[Math.min(currentIndex + 1, stages.length - 1)];

    try {
      await api.updateGrowthStage(cropId, nextStage);
      loadData();
    } catch (err) {
      alert(err.message || 'Failed to update growth stage');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <Wheat className="w-6 h-6 text-agri-600" />
            Field Crop Monitoring
          </h1>
          <p className="text-xs text-slate-500">Track growth stages, sowing schedules, and active cultivation records</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-agri-700 text-white text-xs font-bold hover:bg-agri-800 transition flex items-center gap-1.5 shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Crop</span>
        </button>
      </div>

      {/* Crops List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.map((c) => (
          <div key={c.id} className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                  {c.season} Season
                </span>
                <h3 className="text-lg font-black text-slate-900 mt-0.5">{c.crop_name}</h3>
                <p className="text-xs text-slate-500">{c.variety_name || 'Standard Regional Variety'}</p>
              </div>
              <StatusBadge status={c.current_growth_stage?.replace('_', ' ')} />
            </div>

            <div className="text-xs text-slate-600 space-y-2 py-3 border-y border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-400">Planted Area:</span>
                <span className="font-bold text-slate-800">{c.area} Acres</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Sowing Date:</span>
                <span className="font-semibold text-slate-800">{c.sowing_date}</span>
              </div>
              {c.expected_harvest_date && (
                <div className="flex justify-between">
                  <span className="text-slate-400">Harvest Window:</span>
                  <span className="font-semibold text-slate-800">{c.expected_harvest_date}</span>
                </div>
              )}
            </div>

            {/* Advance Stage Control */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px]">
                <span className="font-bold text-slate-700">Stage Progress</span>
                <button
                  onClick={() => advanceStage(c.id, c.current_growth_stage)}
                  className="text-agri-700 font-bold hover:underline flex items-center gap-0.5"
                >
                  <span>Advance Stage</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                <div className="bg-agri-600 h-full rounded-full w-2/3" />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="pt-2 flex gap-2">
              <Link
                to={`/fertilizer-advisory?crop=${encodeURIComponent(c.crop_name)}`}
                className="flex-1 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 text-center hover:bg-slate-100 transition"
              >
                Nutrient Plan
              </Link>
              <Link
                to={`/disease-detection?crop=${encodeURIComponent(c.crop_name)}`}
                className="flex-1 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs font-bold text-slate-700 text-center hover:bg-slate-100 transition"
              >
                Scan Leaf
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal for Registering a New Cultivated Crop */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-lg w-full p-6 space-y-4">
            <h3 className="text-base font-extrabold text-slate-900">Register Cultivated Crop</h3>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Crop</label>
                <select
                  value={form.cropId}
                  onChange={(e) => setForm({ ...form, cropId: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white"
                >
                  {masterCrops.map((m) => (
                    <option key={m.id} value={m.id}>{m.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Variety Name (Optional)</label>
                <input
                  type="text"
                  value={form.varietyName}
                  onChange={(e) => setForm({ ...form, varietyName: e.target.value })}
                  placeholder="e.g. BPT 5204 or RCH 659"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Season</label>
                  <select
                    value={form.season}
                    onChange={(e) => setForm({ ...form, season: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white capitalize"
                  >
                    <option value="kharif">Kharif</option>
                    <option value="rabi">Rabi</option>
                    <option value="zaid">Zaid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Area (Acres)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={form.area}
                    onChange={(e) => setForm({ ...form, area: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Sowing Date</label>
                <input
                  type="date"
                  required
                  value={form.sowingDate}
                  onChange={(e) => setForm({ ...form, sowingDate: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-agri-700 text-white font-bold hover:bg-agri-800 transition"
                >
                  Save Field Crop
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

