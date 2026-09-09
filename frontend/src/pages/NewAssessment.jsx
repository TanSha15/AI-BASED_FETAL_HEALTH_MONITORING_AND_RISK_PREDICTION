import React, { useState, useEffect } from 'react';
import {
  Activity,
  User,
  Zap,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Sliders,
  HelpCircle,
  FileText,
  Radio,
  Plus
} from 'lucide-react';
import { patientService, predictionService, assessmentService } from '../services/api';

const DEFAULT_INPUT = {
  "baseline value": 132.0,
  "accelerations": 0.006,
  "fetal_movement": 0.0,
  "uterine_contractions": 0.006,
  "light_decelerations": 0.003,
  "severe_decelerations": 0.0,
  "prolongued_decelerations": 0.0,
  "abnormal_short_term_variability": 17.0,
  "mean_value_of_short_term_variability": 2.1,
  "percentage_of_time_with_abnormal_long_term_variability": 0.0,
  "mean_value_of_long_term_variability": 10.4,
  "histogram_width": 130.0,
  "histogram_min": 68.0,
  "histogram_max": 198.0,
  "histogram_number_of_peaks": 6.0,
  "histogram_number_of_zeroes": 1.0,
  "histogram_mode": 141.0,
  "histogram_mean": 136.0,
  "histogram_median": 140.0,
  "histogram_variance": 12.0,
  "histogram_tendency": 0.0
};

export const NewAssessment = ({ preselectedPatient, onCompleteAssessment }) => {
  const [patients, setPatients] = useState([]);
  const [selectedPatientId, setSelectedPatientId] = useState(preselectedPatient?.id || '');
  const [ctgData, setCtgData] = useState(DEFAULT_INPUT);
  const [presets, setPresets] = useState({});
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [activePreset, setActivePreset] = useState('normal');

  useEffect(() => {
    loadPatientsAndMetadata();
  }, []);

  const loadPatientsAndMetadata = async () => {
    try {
      const [patientsData, metaData] = await Promise.all([
        patientService.getPatients(),
        predictionService.getMetadata()
      ]);
      setPatients(patientsData);
      if (!selectedPatientId && patientsData.length > 0) {
        setSelectedPatientId(patientsData[0].id);
      }
      if (metaData?.presets) {
        setPresets(metaData.presets);
      }
    } catch (err) {
      console.error("Failed to load metadata/patients:", err);
    }
  };

  const handleApplyPreset = (type) => {
    setActivePreset(type);
    if (presets[type]) {
      setCtgData({ ...presets[type] });
    }
  };

  const handleInputChange = (key, value) => {
    setCtgData(prev => ({
      ...prev,
      [key]: parseFloat(value) || 0
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatientId) {
      setError("Please select or enroll a patient before submitting an assessment.");
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await assessmentService.createAssessment({
        patient_id: selectedPatientId,
        input_data: ctgData,
        notes: notes || undefined
      });
      if (onCompleteAssessment) {
        onCompleteAssessment(res);
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Assessment submission failed. Please check values.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="bg-obsidian-900 rounded-xl p-5 border border-white/[0.08] shadow-warm-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-3.5 h-3.5 text-vital-coral" />
            <span className="font-mono text-[10px] text-stone-400 uppercase tracking-wider">
              Biophysical Data Entry Console
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-100">
            Cardiotocography (CTG) Risk Assessment
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Evaluate 21 biometric recording features with gradient boosting tree inference
          </p>
        </div>

        {/* Clinical Presets */}
        <div className="flex flex-wrap items-center gap-1.5 bg-obsidian-850 p-1.5 rounded-lg border border-white/[0.06] w-full sm:w-auto">
          <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider px-2">Presets:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('normal')}
            className={`px-3 py-1 rounded text-xs font-mono transition ${
              activePreset === 'normal'
                ? 'bg-vital-sage text-obsidian-950 font-bold'
                : 'bg-obsidian-900 text-stone-300 hover:text-white'
            }`}
          >
            Cat I Normal
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('suspect')}
            className={`px-3 py-1 rounded text-xs font-mono transition ${
              activePreset === 'suspect'
                ? 'bg-vital-amber text-obsidian-950 font-bold'
                : 'bg-obsidian-900 text-stone-300 hover:text-white'
            }`}
          >
            Cat II Suspect
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('pathological')}
            className={`px-3 py-1 rounded text-xs font-mono transition ${
              activePreset === 'pathological'
                ? 'bg-rose-500 text-white font-bold'
                : 'bg-obsidian-900 text-stone-300 hover:text-white'
            }`}
          >
            Cat III Path
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-rose-950/40 text-rose-200 text-xs border border-rose-900/60">
          <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Patient Selector */}
        <div className="bg-obsidian-900 p-5 rounded-xl border border-white/[0.08] shadow-warm-card">
          <label className="block text-xs font-mono text-stone-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <User className="w-4 h-4 text-vital-coral" />
            Selected Obstetric Patient
          </label>
          {patients.length === 0 ? (
            <div className="text-xs text-vital-amber bg-vital-amber/10 p-3 rounded-lg border border-vital-amber/20">
              No registered patients found. Please create a patient in the "Maternal Census" tab first.
            </div>
          ) : (
            <select
              value={selectedPatientId}
              onChange={(e) => setSelectedPatientId(e.target.value)}
              className="w-full px-3 py-2 text-xs font-mono rounded-lg border border-white/10 bg-obsidian-950 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral cursor-pointer"
            >
              {patients.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name} — Age: {p.age} yrs | Gestation: Week {p.pregnancy_week} | MRN: {p.id.slice(0, 8)}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Group 1: Baseline & Uterine Activity */}
        <div className="bg-obsidian-900 p-5 rounded-xl border border-white/[0.08] shadow-warm-card space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="font-serif text-base text-stone-100 font-normal">
              1. Baseline Fetal Heart Rate & Uterine Dynamics
            </h3>
            <p className="text-[11px] text-stone-400">Core physiological FHR baseline and contraction frequencies</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Baseline FHR <span className="font-mono text-stone-400">(bpm)</span>
              </label>
              <input
                type="number"
                step="1"
                required
                value={ctgData["baseline value"]}
                onChange={(e) => handleInputChange("baseline value", e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
              <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">Norm: 110-160</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Accelerations <span className="font-mono text-stone-400">(/sec)</span>
              </label>
              <input
                type="number"
                step="0.001"
                required
                value={ctgData["accelerations"]}
                onChange={(e) => handleInputChange("accelerations", e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
              <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">Norm: &gt;0.000</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Fetal Movement <span className="font-mono text-stone-400">(/sec)</span>
              </label>
              <input
                type="number"
                step="0.001"
                required
                value={ctgData["fetal_movement"]}
                onChange={(e) => handleInputChange("fetal_movement", e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
              <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">Sensor movement count</span>
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Uterine Contractions <span className="font-mono text-stone-400">(/sec)</span>
              </label>
              <input
                type="number"
                step="0.001"
                required
                value={ctgData["uterine_contractions"]}
                onChange={(e) => handleInputChange("uterine_contractions", e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
              <span className="text-[10px] text-stone-400 font-mono mt-0.5 block">Contraction frequency</span>
            </div>
          </div>
        </div>

        {/* Group 2: Decelerations & Heart Rate Variability */}
        <div className="bg-obsidian-900 p-5 rounded-xl border border-white/[0.08] shadow-warm-card space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="font-serif text-base text-stone-100 font-normal">
              2. Decelerations & Autonomic Variability (STV & LTV)
            </h3>
            <p className="text-[11px] text-stone-400">Indices of autonomic tone and fetal oxygenation</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Light Decelerations <span className="font-mono text-stone-400">(/sec)</span>
              </label>
              <input
                type="number"
                step="0.001"
                required
                value={ctgData["light_decelerations"]}
                onChange={(e) => handleInputChange("light_decelerations", e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Severe Decelerations <span className="font-mono text-stone-400">(/sec)</span>
              </label>
              <input
                type="number"
                step="0.001"
                required
                value={ctgData["severe_decelerations"]}
                onChange={(e) => handleInputChange("severe_decelerations", e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Prolonged Decel. <span className="font-mono text-stone-400">(/sec)</span>
              </label>
              <input
                type="number"
                step="0.001"
                required
                value={ctgData["prolongued_decelerations"]}
                onChange={(e) => handleInputChange("prolongued_decelerations", e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Abnormal STV <span className="font-mono text-stone-400">(%)</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={ctgData["abnormal_short_term_variability"]}
                onChange={(e) => handleInputChange("abnormal_short_term_variability", e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Mean Value of STV <span className="font-mono text-stone-400">(ms)</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={ctgData["mean_value_of_short_term_variability"]}
                onChange={(e) => handleInputChange("mean_value_of_short_term_variability", e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Abnormal LTV <span className="font-mono text-stone-400">(%)</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={ctgData["percentage_of_time_with_abnormal_long_term_variability"]}
                onChange={(e) => handleInputChange("percentage_of_time_with_abnormal_long_term_variability", e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-stone-300 mb-1">
                Mean Value of LTV <span className="font-mono text-stone-400">(ms)</span>
              </label>
              <input
                type="number"
                step="0.1"
                required
                value={ctgData["mean_value_of_long_term_variability"]}
                onChange={(e) => handleInputChange("mean_value_of_long_term_variability", e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>
          </div>
        </div>

        {/* Group 3: FHR Histogram Distribution */}
        <div className="bg-obsidian-900 p-5 rounded-xl border border-white/[0.08] shadow-warm-card space-y-4">
          <div className="border-b border-white/[0.06] pb-3">
            <h3 className="font-serif text-base text-stone-100 font-normal">
              3. Cardiotocographic Histogram Morphometrics
            </h3>
            <p className="text-[11px] text-stone-400">Statistical distribution properties of the continuous FHR signal</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-1">Width</label>
              <input
                type="number"
                step="1"
                required
                value={ctgData["histogram_width"]}
                onChange={(e) => handleInputChange("histogram_width", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-1">Min (bpm)</label>
              <input
                type="number"
                step="1"
                required
                value={ctgData["histogram_min"]}
                onChange={(e) => handleInputChange("histogram_min", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-1">Max (bpm)</label>
              <input
                type="number"
                step="1"
                required
                value={ctgData["histogram_max"]}
                onChange={(e) => handleInputChange("histogram_max", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-1">Peaks</label>
              <input
                type="number"
                step="1"
                required
                value={ctgData["histogram_number_of_peaks"]}
                onChange={(e) => handleInputChange("histogram_number_of_peaks", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-1">Zeroes</label>
              <input
                type="number"
                step="1"
                required
                value={ctgData["histogram_number_of_zeroes"]}
                onChange={(e) => handleInputChange("histogram_number_of_zeroes", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-1">Mode</label>
              <input
                type="number"
                step="1"
                required
                value={ctgData["histogram_mode"]}
                onChange={(e) => handleInputChange("histogram_mode", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-1">Mean</label>
              <input
                type="number"
                step="1"
                required
                value={ctgData["histogram_mean"]}
                onChange={(e) => handleInputChange("histogram_mean", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-1">Median</label>
              <input
                type="number"
                step="1"
                required
                value={ctgData["histogram_median"]}
                onChange={(e) => handleInputChange("histogram_median", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-1">Variance</label>
              <input
                type="number"
                step="1"
                required
                value={ctgData["histogram_variance"]}
                onChange={(e) => handleInputChange("histogram_variance", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-stone-300 mb-1">Tendency</label>
              <input
                type="number"
                step="1"
                required
                value={ctgData["histogram_tendency"]}
                onChange={(e) => handleInputChange("histogram_tendency", e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
              />
            </div>
          </div>
        </div>

        {/* Clinical Notes */}
        <div className="bg-obsidian-900 p-5 rounded-xl border border-white/[0.08] shadow-warm-card">
          <label className="block text-xs font-medium text-stone-300 mb-1.5 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-vital-coral" />
            Obstetrician / Midwife Clinical Observations (Optional)
          </label>
          <textarea
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Record active labor stage, maternal vitals, epidural administration, or acoustic stimulation response..."
            className="w-full px-3 py-2 text-xs rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-vital-coral"
          />
        </div>

        {/* Action Button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-3 px-4 rounded-lg bg-vital-coral hover:bg-vital-coral/90 text-white text-xs font-semibold shadow-vital-glow flex items-center justify-center gap-2 transition active:scale-[0.99] disabled:opacity-50"
        >
          {submitting ? (
            <>
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Executing Biophysical Inference & Gemini Synthesis...</span>
            </>
          ) : (
            <>
              <Activity className="w-4 h-4" />
              <span>Submit for Automated CTG Classification & AI Narrative</span>
            </>
          )}
        </button>
      </form>
    </div>
  );
};
