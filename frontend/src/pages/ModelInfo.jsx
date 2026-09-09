import React from 'react';
import {
  Cpu,
  Database,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  BarChart3,
  ExternalLink,
  FileCheck,
  Radio
} from 'lucide-react';

export const ModelInfo = () => {
  const featuresList = [
    { name: "baseline value", label: "Baseline Fetal Heart Rate", unit: "bpm", desc: "Average FHR in the absence of uterine contractions and fetal movements (Normal: 110-160 bpm)." },
    { name: "accelerations", label: "Accelerations", unit: "/sec", desc: "Transient increases in FHR above baseline of at least 15 bpm for >=15 sec. Key indicator of fetal oxygenation." },
    { name: "fetal_movement", label: "Fetal Movements", unit: "/sec", desc: "Sensor-detected gross body movements of the fetus per second." },
    { name: "uterine_contractions", label: "Uterine Contractions", unit: "/sec", desc: "Number of maternal uterine contractions recorded per second." },
    { name: "light_decelerations", label: "Light Decelerations", unit: "/sec", desc: "Transient decreases in FHR with gradual onset and return, usually mirroring uterine pressure." },
    { name: "severe_decelerations", label: "Severe Decelerations", unit: "/sec", desc: "Abrupt or deep drops in FHR, highly correlated with umbilical cord compression or fetal compromise." },
    { name: "prolongued_decelerations", label: "Prolonged Decelerations", unit: "/sec", desc: "Decelerations lasting >2 minutes but <10 minutes, requiring urgent clinical investigation." },
    { name: "abnormal_short_term_variability", label: "Abnormal STV (%)", unit: "%", desc: "Percentage of time with abnormal cycle-to-cycle FHR variability." },
    { name: "mean_value_of_short_term_variability", label: "Mean STV", unit: "bpm", desc: "Mean value of short-term beat-to-beat variability (parasympathetic autonomic control)." },
    { name: "percentage_of_time_with_abnormal_long_term_variability", label: "Abnormal LTV (%)", unit: "%", desc: "Percentage of time with abnormal long-term baseline fluctuations." },
    { name: "mean_value_of_long_term_variability", label: "Mean LTV", unit: "bpm", desc: "Mean amplitude of long-term variability over 1-minute epochs." },
    { name: "histogram_width", label: "Histogram Width", unit: "bpm", desc: "Total dynamic range span between maximum and minimum FHR frequencies." },
    { name: "histogram_min", label: "Histogram Minimum", unit: "bpm", desc: "Lowest recorded FHR frequency in the CTG recording period." },
    { name: "histogram_max", label: "Histogram Maximum", unit: "bpm", desc: "Highest recorded FHR frequency in the CTG recording period." },
    { name: "histogram_number_of_peaks", label: "Histogram Peaks", unit: "count", desc: "Number of prominent distribution peaks in the frequency histogram." },
    { name: "histogram_number_of_zeroes", label: "Histogram Zeroes", unit: "count", desc: "Number of zero-count intervals in the signal distribution." },
    { name: "histogram_mode", label: "Histogram Mode", unit: "bpm", desc: "Most frequently occurring FHR value in the recording." },
    { name: "histogram_mean", label: "Histogram Mean", unit: "bpm", desc: "Mathematical average FHR across the histogram window." },
    { name: "histogram_median", label: "Histogram Median", unit: "bpm", desc: "Statistical median FHR value." },
    { name: "histogram_variance", label: "Histogram Variance", unit: "", desc: "Dispersion index reflecting variability around the modal heart rate." },
    { name: "histogram_tendency", label: "Histogram Tendency", unit: "", desc: "Skewness: -1 (left-skewed / deceleration bias), 0 (symmetric), 1 (right-skewed / acceleration bias)." }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="bg-obsidian-900 rounded-xl p-5 border border-white/[0.08] shadow-warm-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-3.5 h-3.5 text-vital-coral" />
            <span className="font-mono text-[10px] text-stone-400 uppercase tracking-wider">
              Biophysical Model Telemetry
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-100">
            Machine Learning Architecture & Parameter Matrix
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Statistical ensemble specifications, training benchmarks, and 21-parameter CTG dictionary
          </p>
        </div>
      </div>

      {/* Model Spec Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-obsidian-900 p-5 rounded-xl border border-white/[0.08] shadow-warm-card space-y-2">
          <span className="text-[10px] font-mono text-vital-coral uppercase tracking-wider bg-vital-coral/10 px-2 py-0.5 rounded border border-vital-coral/20">
            Ensemble Architecture
          </span>
          <h3 className="font-serif text-base text-stone-100 font-normal">GradientBoostingClassifier</h3>
          <p className="text-xs text-stone-400 leading-relaxed font-sans">
            Ensemble of 150 boosted decision trees with max depth 5, optimized with Friedman MSE splitting criteria.
          </p>
        </div>

        <div className="bg-obsidian-900 p-5 rounded-xl border border-white/[0.08] shadow-warm-card space-y-2">
          <span className="text-[10px] font-mono text-vital-amber uppercase tracking-wider bg-vital-amber/10 px-2 py-0.5 rounded border border-vital-amber/20">
            Evidence Base
          </span>
          <h3 className="font-serif text-base text-stone-100 font-normal">UCI / FIGO Cardiotocograms</h3>
          <p className="text-xs text-stone-400 leading-relaxed font-sans">
            2,126 Cardiotocograms classified into Normal (1), Suspect (2), and Pathological (3) by multi-expert consensus.
          </p>
        </div>

        <div className="bg-obsidian-900 p-5 rounded-xl border border-white/[0.08] shadow-warm-card space-y-2">
          <span className="text-[10px] font-mono text-vital-sage uppercase tracking-wider bg-vital-sage/10 px-2 py-0.5 rounded border border-vital-sage/20">
            Synthesis Layer
          </span>
          <h3 className="font-serif text-base text-stone-100 font-normal">Gemini 2.5 Flash</h3>
          <p className="text-xs text-stone-400 leading-relaxed font-sans">
            Generative diagnostic explanations highlighting contributing physiological anomalies and monitoring suggestions.
          </p>
        </div>
      </div>

      {/* 21 Features Dictionary Table */}
      <div className="bg-obsidian-900 rounded-xl border border-white/[0.08] shadow-warm-card p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/[0.06] pb-3 gap-1">
          <h3 className="font-serif text-base text-stone-100 font-normal flex items-center gap-2">
            <Layers className="w-4 h-4 text-vital-coral" />
            21 Cardiotocography Biophysical Parameter Matrix
          </h3>
          <span className="text-[10px] font-mono text-stone-400">Standard FIGO Feature Dictionary</span>
        </div>

        <div className="overflow-x-auto scrollbar-none">
          <table className="w-full text-left text-xs min-w-[700px]">
            <thead className="bg-obsidian-950/60 font-mono text-[10px] text-stone-400 uppercase tracking-wider border-b border-white/[0.06]">
              <tr>
                <th className="py-2.5 px-3">#</th>
                <th className="py-2.5 px-3">Feature Key</th>
                <th className="py-2.5 px-3">Clinical Term</th>
                <th className="py-2.5 px-3">Unit</th>
                <th className="py-2.5 px-3">Physiological Significance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-sans">
              {featuresList.map((f, i) => (
                <tr key={f.name} className="hover:bg-white/[0.015] transition">
                  <td className="py-2.5 px-3 font-mono text-stone-500 text-[10px]">{i + 1}</td>
                  <td className="py-2.5 px-3 font-mono text-vital-coral text-[11px]">{f.name}</td>
                  <td className="py-2.5 px-3 font-serif text-stone-200 text-xs font-medium">{f.label}</td>
                  <td className="py-2.5 px-3 font-mono text-stone-400 text-[10px]">{f.unit || '—'}</td>
                  <td className="py-2.5 px-3 text-stone-400 text-[11px] leading-relaxed max-w-md">{f.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
