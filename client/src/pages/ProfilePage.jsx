import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/apiClient';
import { User, MapPin, Sprout, Droplets, CheckCircle, Save, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export function ProfilePage() {
  const { profile, refreshProfile } = useAuth();
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    phone: '',
    state: 'Andhra Pradesh',
    district: 'Guntur',
    mandal: 'Tenali',
    village: 'Angalakuduru',
    pincode: '522211',
    preferredLanguage: 'en',
    landArea: 3.5,
    landUnit: 'acre',
    soilType: 'black_cotton',
    irrigationType: 'borewell',
    farmingExperience: 10
  });

  useEffect(() => {
    if (profile) {
      setForm({
        fullName: profile.full_name || '',
        phone: profile.phone || '',
        state: profile.state || 'Andhra Pradesh',
        district: profile.district || 'Guntur',
        mandal: profile.mandal || '',
        village: profile.village || '',
        pincode: profile.pincode || '',
        preferredLanguage: profile.preferred_language || 'en',
        landArea: Number(profile.land_area) || 3.5,
        landUnit: profile.land_unit || 'acre',
        soilType: profile.soil_type || 'black_cotton',
        irrigationType: profile.irrigation_type || 'borewell',
        farmingExperience: profile.farming_experience || 5
      });
    }
  }, [profile]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSuccessMsg('');
    setErrorMsg('');

    try {
      await api.updateProfile(form);
      setSuccessMsg('Farmer profile and land parameters updated successfully!');
      refreshProfile();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <Link to="/dashboard" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-900 transition">
          <ArrowLeft className="w-4 h-4" />
        </Link>
        <div>
          <h1 className="text-xl font-black text-slate-900">Farmer & Field Profile</h1>
          <p className="text-xs text-slate-500">Manage your farm location, soil classification, and irrigation sources</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center gap-2 text-xs font-bold">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs space-y-6">
        {/* Personal Details */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2 mb-4">
            <User className="w-4 h-4 text-agri-600" />
            <span>Personal & Contact Information</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mobile Number</label>
              <input
                type="tel"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="10-digit Indian Mobile"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Location Information */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2 mb-4">
            <MapPin className="w-4 h-4 text-agri-600" />
            <span>Geographic & Administrative Location</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">State</label>
              <select
                value={form.state}
                onChange={(e) => setForm({ ...form, state: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white focus:ring-2 focus:ring-agri-600 focus:outline-hidden font-medium"
              >
                <option value="Andhra Pradesh">Andhra Pradesh</option>
                <option value="Telangana">Telangana</option>
                <option value="Karnataka">Karnataka</option>
                <option value="Tamil Nadu">Tamil Nadu</option>
                <option value="Maharashtra">Maharashtra</option>
                <option value="Madhya Pradesh">Madhya Pradesh</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">District</label>
              <input
                type="text"
                required
                value={form.district}
                onChange={(e) => setForm({ ...form, district: e.target.value })}
                placeholder="Guntur / Warangal"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Mandal / Taluka</label>
              <input
                type="text"
                value={form.mandal}
                onChange={(e) => setForm({ ...form, mandal: e.target.value })}
                placeholder="e.g. Tenali"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Village</label>
              <input
                type="text"
                value={form.village}
                onChange={(e) => setForm({ ...form, village: e.target.value })}
                placeholder="Village name"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-hidden"
              />
            </div>
          </div>
        </div>

        {/* Agricultural Field Parameters */}
        <div>
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2 border-b pb-2 mb-4">
            <Sprout className="w-4 h-4 text-agri-600" />
            <span>Farm & Soil Characteristics</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Cultivated Land Area</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  required
                  value={form.landArea}
                  onChange={(e) => setForm({ ...form, landArea: parseFloat(e.target.value) || 0 })}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-hidden font-bold"
                />
                <select
                  value={form.landUnit}
                  onChange={(e) => setForm({ ...form, landUnit: e.target.value })}
                  className="px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-bold"
                >
                  <option value="acre">Acres</option>
                  <option value="hectare">Hectares</option>
                  <option value="gunta">Guntas</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Dominant Soil Type</label>
              <select
                value={form.soilType}
                onChange={(e) => setForm({ ...form, soilType: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:ring-2 focus:ring-agri-600 focus:outline-hidden capitalize"
              >
                <option value="black_cotton">Black Cotton Soil (Regur)</option>
                <option value="red_soil">Red Soil (Chalka)</option>
                <option value="sandy_loam">Sandy Loam</option>
                <option value="clay_loam">Clay Loam</option>
                <option value="alluvial">Alluvial Soil</option>
                <option value="laterite">Laterite Soil</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Irrigation Source</label>
              <select
                value={form.irrigationType}
                onChange={(e) => setForm({ ...form, irrigationType: e.target.value })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs bg-white font-medium focus:ring-2 focus:ring-agri-600 focus:outline-hidden capitalize"
              >
                <option value="borewell">Borewell (Groundwater)</option>
                <option value="canal">Canal (Surface water)</option>
                <option value="drip">Drip Irrigation System</option>
                <option value="sprinkler">Sprinkler Irrigation</option>
                <option value="flood">Flood / Furrow</option>
                <option value="rainfed">Strictly Rainfed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-agri-700 text-white text-xs font-bold hover:bg-agri-800 transition flex items-center gap-2 shadow-sm disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving Profile...' : 'Save Profile Changes'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}

