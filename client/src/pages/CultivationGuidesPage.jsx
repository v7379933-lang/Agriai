import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import { BookOpen, Search, ChevronDown, ChevronUp, Sprout, CheckCircle2 } from 'lucide-react';

export function CultivationGuidesPage() {
  const [guides, setGuides] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedSlug, setExpandedSlug] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchGuides = async () => {
    try {
      setLoading(true);
      const res = await api.getGuides(search ? `?search=${encodeURIComponent(search)}` : '');
      if (res?.data) {
        setGuides(res.data);
        if (res.data.length > 0 && !expandedSlug) {
          setExpandedSlug(res.data[0].slug);
        }
      }
    } catch (err) {
      console.warn('Failed to load guides:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuides();
  }, [search]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-agri-600" />
            Crop Cultivation Knowledge Guides
          </h1>
          <p className="text-xs text-slate-500">
            Official package of practices sourced from ICAR, ANGRAU, and PJTSAU agricultural universities.
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search crops (e.g. Paddy, Cotton)..."
            className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-agri-600 focus:outline-hidden bg-white"
          />
        </div>
      </div>

      {/* Guides Accordion */}
      <div className="space-y-4">
        {guides.map((guide) => {
          const isExpanded = expandedSlug === guide.slug;
          return (
            <div key={guide.slug} className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
              <button
                onClick={() => setExpandedSlug(isExpanded ? null : guide.slug)}
                className="w-full p-6 text-left flex justify-between items-center hover:bg-slate-50/50 transition"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-agri-50 text-agri-800 border border-agri-200">
                      {guide.category}
                    </span>
                    <span className="text-xs text-slate-400">~{guide.duration_days} days maturity</span>
                  </div>
                  <h2 className="text-lg font-black text-slate-900 mt-1">{guide.crop_name}</h2>
                  <p className="text-xs text-slate-500 italic font-serif">{guide.scientific_name}</p>
                </div>
                {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
              </button>

              {isExpanded && guide.sections && (
                <div className="p-6 pt-0 border-t border-slate-100 text-xs space-y-4">
                  <p className="p-3.5 bg-slate-50 rounded-2xl text-slate-700 leading-relaxed">
                    {guide.sections.introduction}
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 rounded-2xl border border-slate-100 space-y-1">
                      <h4 className="font-bold text-slate-900">Climate & Sowing Window</h4>
                      <p className="text-slate-600">{guide.sections.suitable_climate}</p>
                      <p className="text-slate-700 mt-1"><strong>Seasons:</strong> {guide.sections.sowing_season}</p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-100 space-y-1">
                      <h4 className="font-bold text-slate-900">Soil & Land Preparation</h4>
                      <p className="text-slate-600">{guide.sections.suitable_soil}</p>
                      <p className="text-slate-600 mt-1">{guide.sections.land_preparation}</p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-100 space-y-1">
                      <h4 className="font-bold text-slate-900">Seed Rate & Treatment</h4>
                      <p className="text-slate-600"><strong>Seed Rate:</strong> {guide.sections.seed_rate}</p>
                      <p className="text-slate-600"><strong>Spacing:</strong> {guide.sections.spacing}</p>
                      <p className="text-emerald-800 mt-1"><strong>Seed Treatment:</strong> {guide.sections.seed_treatment}</p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-100 space-y-1">
                      <h4 className="font-bold text-slate-900">Fertilizer & Irrigation Schedule</h4>
                      <p className="text-slate-600">{guide.sections.fertilizer_management}</p>
                      <p className="text-slate-600 mt-1">{guide.sections.irrigation_management}</p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-100 space-y-1">
                      <h4 className="font-bold text-slate-900">Weed & Pest Management</h4>
                      <p className="text-slate-600"><strong>Weed:</strong> {guide.sections.weed_management}</p>
                      <p className="text-slate-600 mt-1"><strong>Pests:</strong> {guide.sections.pest_management}</p>
                    </div>

                    <div className="p-4 rounded-2xl border border-slate-100 space-y-1">
                      <h4 className="font-bold text-slate-900">Harvest & Post-Harvest Storage</h4>
                      <p className="text-slate-600">{guide.sections.harvesting}</p>
                      <p className="text-slate-600 mt-1">{guide.sections.post_harvest}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

