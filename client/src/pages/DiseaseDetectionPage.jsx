import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { api } from '../api/apiClient';
import {
  ScanLine,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ShieldAlert,
  Sparkles,
  Activity,
  Image as ImageIcon,
  X
} from 'lucide-react';
import { StatusBadge } from '../components/common/StatusBadge';

export function DiseaseDetectionPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [activeTab, setActiveTab] = useState('biological');

  const [form, setForm] = useState({
    cropName: 'Rice (Paddy)',
    cropVariety: '',
    growthStage: 'vegetative',
    affectedPlantPart: 'leaf',
    observedSymptoms: ['Yellowing along leaf edges', 'Small brown lesions'],
    symptomOnsetDays: 3,
    affectedAreaPercentage: 10,
    recentWeather: 'High humidity after light rainfall',
    recentChemicalApplication: 'None'
  });

  const availableSymptoms = [
    'Yellowing along leaf edges',
    'Concentric brown spots (target rings)',
    'Upward leaf curling',
    'Downward leaf curling with bronzing',
    'White powdery patches on leaf surface',
    'Wilting / drooping during midday',
    'Bore holes with sawdust-like frass',
    'Water-soaked lesions on leaf sheath'
  ];

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxSize: 8 * 1024 * 1024,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setSelectedFile(file);
        setPreviewUrl(URL.createObjectURL(file));
      }
    }
  });

  const toggleSymptom = (sym) => {
    if (form.observedSymptoms.includes(sym)) {
      setForm({ ...form, observedSymptoms: form.observedSymptoms.filter(s => s !== sym) });
    } else {
      setForm({ ...form, observedSymptoms: [...form.observedSymptoms, sym] });
    }
  };

  const handleScan = async (e) => {
    e.preventDefault();
    if (form.observedSymptoms.length === 0 && !selectedFile) {
      setErrorMsg('Please upload a leaf photograph OR select at least one observed symptom.');
      return;
    }

    setLoading(true);
    setErrorMsg('');
    setResult(null);

    try {
      const formData = new FormData();
      if (selectedFile) {
        formData.append('image', selectedFile);
      }
      formData.append('payload', JSON.stringify(form));

      const res = await api.scanDisease(formData);
      if (res?.data?.possible_diagnosis) {
        setResult(res.data.possible_diagnosis);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Diagnostic scan failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 flex items-center gap-2">
          <ScanLine className="w-6 h-6 text-rose-600" />
          Multimodal Crop Disease & Pest Diagnosis
        </h1>
        <p className="text-xs text-slate-500">
          Upload affected leaf/stem photographs and clinical field symptoms to formulate a 3-tier Integrated Pest Management (IPM) solution.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Image Upload & Symptoms */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <h2 className="text-sm font-bold text-slate-900 border-b pb-2 flex items-center justify-between">
            <span>Symptom & Specimen Submission</span>
            <span className="text-[10px] text-rose-700 bg-rose-50 px-2 py-0.5 rounded font-bold">Input</span>
          </h2>

          <form onSubmit={handleScan} className="space-y-4 text-xs">
            {/* Image Dropzone */}
            <div>
              <label className="block font-bold text-slate-700 mb-1">Upload Specimen Photograph (Optional)</label>
              {!previewUrl ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                    isDragActive ? 'border-agri-600 bg-agri-50' : 'border-slate-200 hover:border-slate-300 bg-slate-50'
                  }`}
                >
                  <input {...getInputProps()} />
                  <UploadCloud className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-bold text-slate-700">Drag & drop photo or tap to browse</p>
                  <p className="text-[10px] text-slate-400 mt-1">JPEG, PNG or WebP up to 8MB</p>
                </div>
              ) : (
                <div className="relative rounded-2xl overflow-hidden border border-slate-200 h-44 bg-slate-100">
                  <img src={previewUrl} alt="Leaf specimen preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-slate-900/80 text-white hover:bg-slate-900 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>

            {/* Crop & Part Selection */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Host Crop</label>
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
                <label className="block font-bold text-slate-700 mb-1">Affected Plant Part</label>
                <select
                  value={form.affectedPlantPart}
                  onChange={(e) => setForm({ ...form, affectedPlantPart: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 font-medium capitalize bg-white"
                >
                  <option value="leaf">Leaf / Foliage</option>
                  <option value="stem">Stem / Branch</option>
                  <option value="root">Root Zone</option>
                  <option value="fruit">Fruit / Pod / Grain</option>
                  <option value="flower">Flower / Inflorescence</option>
                </select>
              </div>
            </div>

            {/* Interactive Symptom Checkboxes */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">Observed Clinical Symptoms</label>
              <div className="space-y-1.5">
                {availableSymptoms.map((sym, idx) => {
                  const isChecked = form.observedSymptoms.includes(sym);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => toggleSymptom(sym)}
                      className={`w-full text-left px-3 py-2 rounded-xl border text-[11px] font-medium transition flex items-center justify-between ${
                        isChecked
                          ? 'border-rose-400 bg-rose-50/80 text-rose-950 font-semibold'
                          : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <span>{sym}</span>
                      {isChecked && <CheckCircle2 className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-rose-700 text-white font-bold hover:bg-rose-800 transition flex items-center justify-center gap-2 shadow-sm disabled:opacity-50"
            >
              <ScanLine className="w-4 h-4" />
              <span>{loading ? 'Analyzing Plant Pathology with Gemini Pro...' : 'Run Phytosanitary Diagnosis'}</span>
            </button>
          </form>
        </div>

        {/* Right Column: Diagnosis & IPM Remediation */}
        <div className="lg:col-span-7 space-y-4">
          {errorMsg && (
            <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl text-xs font-bold">
              {errorMsg}
            </div>
          )}

          {!result && !loading && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-400 mx-auto flex items-center justify-center">
                <ScanLine className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No Specimen Diagnosed Yet</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Submit an affected plant photograph or tap observed symptoms on the left to obtain scientific diagnostic findings.
              </p>
            </div>
          )}

          {loading && (
            <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-4">
              <div className="animate-spin w-8 h-8 border-4 border-rose-600 border-t-transparent rounded-full mx-auto" />
              <p className="text-xs font-bold text-slate-700">Examining pathological markers and Integrated Pest Management standards...</p>
            </div>
          )}

          {result && (
            <div className="space-y-4">
              {/* Identification Header Banner */}
              <div className="bg-slate-900 text-white p-6 rounded-3xl shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-wider uppercase bg-rose-500/20 text-rose-300 border border-rose-500/30">
                      Preliminary Diagnosis
                    </span>
                    <h2 className="text-xl font-black mt-1 text-white">
                      {result.possible_diagnoses[0]?.name || 'Identified Plant Condition'}
                    </h2>
                    <p className="text-xs text-slate-400 capitalize">
                      Category: {result.possible_diagnoses[0]?.type?.replace('_', ' ')} | Likelihood: {result.possible_diagnoses[0]?.likelihood}
                    </p>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase font-bold">Model Confidence</span>
                    <p className="text-sm font-black text-emerald-400 capitalize">{result.confidence}</p>
                  </div>
                </div>

                <div className="p-3 bg-white/10 rounded-xl text-xs text-slate-300">
                  <strong>Observations:</strong> {result.observations.join(' ')}
                </div>
              </div>

              {/* 3-Tier IPM Tabs */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-xs p-6 space-y-4">
                <h3 className="text-sm font-extrabold text-slate-900">Integrated Pest Management (IPM) Remediation</h3>

                <div className="flex border-b border-slate-200 text-xs font-bold">
                  <button
                    onClick={() => setActiveTab('biological')}
                    className={`pb-3 px-4 transition border-b-2 flex items-center gap-1.5 ${
                      activeTab === 'biological' ? 'border-agri-600 text-agri-800' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Biological Controls</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('cultural')}
                    className={`pb-3 px-4 transition border-b-2 flex items-center gap-1.5 ${
                      activeTab === 'cultural' ? 'border-agri-600 text-agri-800' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Cultural Practices</span>
                  </button>

                  <button
                    onClick={() => setActiveTab('chemical')}
                    className={`pb-3 px-4 transition border-b-2 flex items-center gap-1.5 ${
                      activeTab === 'chemical' ? 'border-rose-600 text-rose-800' : 'border-transparent text-slate-400 hover:text-slate-700'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Chemical Intervention</span>
                  </button>
                </div>

                {/* Tab Body */}
                <div className="text-xs">
                  {activeTab === 'biological' && (
                    <div className="space-y-3">
                      {result.management_recommendations.map((rec, rIdx) => (
                        <div key={rIdx} className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                          <p className="font-bold text-emerald-950">{rec.action}</p>
                          <p className="text-emerald-800"><strong>Timing:</strong> {rec.timing}</p>
                          {rec.precautions.length > 0 && (
                            <p className="text-emerald-700 text-[11px]"><strong>Precaution:</strong> {rec.precautions.join(', ')}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {activeTab === 'cultural' && (
                    <div className="space-y-2">
                      <p className="text-slate-600 font-medium">Recommended physical and field sanitation actions:</p>
                      <ul className="list-disc pl-5 space-y-1.5 text-slate-700">
                        {result.recommended_next_steps.map((step, sIdx) => (
                          <li key={sIdx}>{step}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {activeTab === 'chemical' && (
                    <div className="space-y-3">
                      {result.chemical_management?.recommended ? (
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-200 space-y-2 text-rose-900">
                          <div className="flex items-center gap-2 font-bold text-rose-950">
                            <AlertTriangle className="w-4 h-4 text-rose-600" />
                            <span>Chemical Treatment Justified (Economic Injury Threshold)</span>
                          </div>
                          <p className="text-xs leading-relaxed">{result.chemical_management.details}</p>
                          <div className="p-2.5 bg-white/70 rounded-xl text-[11px] font-semibold text-rose-800">
                            ⚠️ Mandatory Warning: Adhere strictly to the product label, Pre-Harvest Interval (PHI in days), and wear Personal Protective Equipment (mask and gloves).
                          </div>
                        </div>
                      ) : (
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-slate-600">
                          Chemical intervention is <strong>NOT recommended</strong> at this stage. Biological and cultural controls are sufficient to suppress the pest or fungal pathogen below the economic injury level.
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Legal Disclaimer */}
              <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 text-[11px] text-amber-900 flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <p>
                  <strong>Disclaimer:</strong> {result.disclaimer || 'Image-based diagnosis is preliminary. Before purchasing commercial pesticides, physically show leaf samples to your local Krishi Vigyan Kendra (KVK) or Mandal Agricultural Officer.'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

