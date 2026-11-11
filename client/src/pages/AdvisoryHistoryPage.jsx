import React, { useState, useEffect } from 'react';
import { api } from '../api/apiClient';
import { History, Search, Trash2, Eye, Printer, X, CheckCircle2 } from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export function AdvisoryHistoryPage() {
  const [advisories, setAdvisories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [selectedAdvisory, setSelectedAdvisory] = useState(null);

  const loadAdvisories = async () => {
    try {
      setLoading(true);
      const res = await api.getAdvisories(categoryFilter ? `?category=${encodeURIComponent(categoryFilter)}` : '');
      if (res?.data) {
        setAdvisories(res.data);
      }
    } catch (err) {
      console.warn('Failed to fetch advisory archive:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdvisories();
  }, [categoryFilter]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this advisory report?')) return;
    try {
      await api.deleteAdvisory(id);
      setAdvisories(advisories.filter(a => a.id !== id));
      if (selectedAdvisory?.id === id) {
        setSelectedAdvisory(null);
      }
    } catch (err) {
      alert('Failed to delete advisory: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
            <History className="w-6 h-6 text-agri-600" />
            Advisory Archive & History
          </h1>
          <p className="text-xs text-slate-500">Immutable record of all AI-generated agricultural recommendations</p>
        </div>

        {/* Filter Pills */}
        <div className="flex gap-1.5 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setCategoryFilter('')}
            className={`px-3 py-1.5 rounded-xl transition ${categoryFilter === '' ? 'bg-agri-700 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
          >
            All
          </button>
          <button
            onClick={() => setCategoryFilter('Crop Selection')}
            className={`px-3 py-1.5 rounded-xl transition ${categoryFilter === 'Crop Selection' ? 'bg-agri-700 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
          >
            Crops
          </button>
          <button
            onClick={() => setCategoryFilter('Fertilizer Management')}
            className={`px-3 py-1.5 rounded-xl transition ${categoryFilter === 'Fertilizer Management' ? 'bg-agri-700 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
          >
            Fertilizer
          </button>
          <button
            onClick={() => setCategoryFilter('Irrigation')}
            className={`px-3 py-1.5 rounded-xl transition ${categoryFilter === 'Irrigation' ? 'bg-agri-700 text-white' : 'bg-white border border-slate-200 text-slate-600'}`}
          >
            Irrigation
          </button>
        </div>
      </div>

      {/* Advisory Cards Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        {advisories.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No advisory reports found matching your criteria.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {advisories.map((adv) => (
              <div key={adv.id} className="p-4 sm:p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:bg-slate-50/50 transition">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold text-agri-800 bg-agri-100 px-2 py-0.5 rounded">
                      {adv.category}
                    </span>
                    <span className="text-xs text-slate-400">
                      {new Date(adv.created_at).toLocaleString()}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">{adv.title}</h3>
                  <p className="text-xs text-slate-500 line-clamp-1">
                    {adv.result?.analysis_summary || adv.result?.summary || 'Detailed agricultural recommendations'}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedAdvisory(adv)}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={() => handleDelete(adv.id)}
                    className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                    title="Delete record"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Detail Modal */}
      {selectedAdvisory && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-slate-200 shadow-xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden">
            <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-agri-800 bg-agri-100 px-2 py-0.5 rounded">
                  {selectedAdvisory.category}
                </span>
                <h3 className="text-base font-black text-slate-900 mt-1">{selectedAdvisory.title}</h3>
                <p className="text-[11px] text-slate-400">Generated: {new Date(selectedAdvisory.created_at).toLocaleString()}</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition"
                  title="Print"
                >
                  <Printer className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSelectedAdvisory(null)}
                  className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:text-slate-900 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-xs">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-1">
                <h4 className="font-bold text-slate-900">Executive Summary</h4>
                <p className="text-slate-700 leading-relaxed">
                  {selectedAdvisory.result?.analysis_summary || selectedAdvisory.result?.summary || 'Complete advisory recorded in system.'}
                </p>
              </div>

              {/* Recommendations list */}
              {selectedAdvisory.result?.recommendations && (
                <div className="space-y-2">
                  <h4 className="font-bold text-slate-900">Advisory Details</h4>
                  <div className="space-y-2">
                    {selectedAdvisory.result.recommendations.map((rec, rIdx) => (
                      <div key={rIdx} className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                        <p className="font-bold text-slate-800">{rec.crop_name || rec.fertilizer_name || rec.action}</p>
                        <p className="text-slate-600">{rec.reason || rec.timing || rec.soil_compatibility}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

