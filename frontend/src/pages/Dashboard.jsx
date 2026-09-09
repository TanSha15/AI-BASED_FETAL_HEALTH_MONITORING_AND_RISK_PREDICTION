import React, { useState, useEffect } from 'react';
import {
  Activity,
  Users,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Plus,
  Clock,
  ArrowUpRight,
  TrendingUp,
  Radio,
  FileText,
  ChevronRight,
  Stethoscope,
  HeartPulse
} from 'lucide-react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { assessmentService } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

export const Dashboard = ({ onNavigate, onSelectAssessment }) => {
  const [stats, setStats] = useState({
    total_assessments: 0,
    total_patients: 0,
    normal_count: 0,
    suspect_count: 0,
    pathological_count: 0,
    distribution: [],
    recent_assessments: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const data = await assessmentService.getDashboardStats();
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const pieData = [
    { name: 'Category I (Normal)', value: stats.normal_count, color: '#22c55e' },
    { name: 'Category II (Suspect)', value: stats.suspect_count, color: '#f59e0b' },
    { name: 'Category III (Pathological)', value: stats.pathological_count, color: '#f43f5e' }
  ].filter(d => d.value > 0);

  const defaultPieData = pieData.length > 0 ? pieData : [
    { name: 'Category I (Normal)', value: 1, color: '#22c55e' },
    { name: 'Category II (Suspect)', value: 0, color: '#f59e0b' },
    { name: 'Category III (Pathological)', value: 0, color: '#f43f5e' }
  ];

  const normalPct = stats.total_assessments > 0 ? Math.round((stats.normal_count / stats.total_assessments) * 100) : 100;
  const suspectPct = stats.total_assessments > 0 ? Math.round((stats.suspect_count / stats.total_assessments) * 100) : 0;
  const pathPct = stats.total_assessments > 0 ? Math.round((stats.pathological_count / stats.total_assessments) * 100) : 0;

  return (
    <div className="space-y-6">
      
      {/* Top Editorial Surveillance Header */}
      <div className="bg-obsidian-900 rounded-xl p-5 sm:p-7 border border-white/[0.08] shadow-warm-card flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-2 z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-full bg-obsidian-850 border border-white/10 text-stone-300 font-mono text-[11px]">
            <Radio className="w-3 h-3 text-vital-coral animate-pulse" />
            <span>Labor & Delivery Surveillance Unit</span>
          </div>

          <h1 className="font-serif text-2xl sm:text-3xl text-stone-100 font-normal leading-tight">
            Maternal-Fetal Telemetry & <span className="italic text-vital-coral">Risk Stratification</span>
          </h1>

          <p className="text-xs sm:text-sm text-stone-400 font-sans leading-relaxed">
            Multi-parameter cardiotocography evaluation aligned with FIGO 2015 consensus criteria, augmented with Gemini clinical reasoning.
          </p>
        </div>

        <div className="flex items-center gap-3 z-10 shrink-0">
          <button
            onClick={() => onNavigate('new-assessment')}
            className="w-full sm:w-auto px-4 py-2.5 bg-vital-coral hover:bg-vital-coral/90 text-white rounded-lg text-xs font-semibold shadow-vital-glow flex items-center justify-center gap-2 transition active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>Initiate CTG Exam</span>
          </button>
        </div>
      </div>

      {/* Integrated Clinical Vitals Ribbon (Replaces 4 generic square boxes) */}
      <div className="bg-obsidian-900 rounded-xl border border-white/[0.08] shadow-warm-card overflow-hidden">
        <div className="p-4 sm:p-5 border-b border-white/[0.06] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-mono text-stone-300 uppercase tracking-wider">
            <Activity className="w-3.5 h-3.5 text-vital-coral" />
            <span>Ward Acuity & Census Breakdown</span>
          </div>
          <span className="text-[11px] font-mono text-stone-400">
            Shift Updated: Just Now
          </span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 divide-y lg:divide-y-0 lg:divide-x divide-white/[0.06]">
          {/* Census */}
          <div className="p-4 sm:p-5 space-y-1">
            <p className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">Maternal Census</p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-stone-100 tracking-tight">
              {stats.total_patients} <span className="text-xs font-sans font-normal text-stone-400">Patients</span>
            </p>
            <p className="text-[11px] text-stone-400">
              {stats.total_assessments} recorded examinations
            </p>
          </div>

          {/* Normal (Cat I) */}
          <div className="p-4 sm:p-5 space-y-1">
            <p className="text-[11px] font-mono text-vital-sage uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-vital-sage" />
              Category I • Normal
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-vital-sage tracking-tight">
              {stats.normal_count} <span className="text-xs font-sans font-normal text-stone-400">({normalPct}%)</span>
            </p>
            <p className="text-[11px] text-stone-400">
              Reassuring baseline & variability
            </p>
          </div>

          {/* Suspect (Cat II) */}
          <div className="p-4 sm:p-5 space-y-1">
            <p className="text-[11px] font-mono text-vital-amber uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-vital-amber" />
              Category II • Suspect
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-vital-amber tracking-tight">
              {stats.suspect_count} <span className="text-xs font-sans font-normal text-stone-400">({suspectPct}%)</span>
            </p>
            <p className="text-[11px] text-stone-400">
              Surveillance indicated
            </p>
          </div>

          {/* Pathological (Cat III) */}
          <div className="p-4 sm:p-5 space-y-1">
            <p className="text-[11px] font-mono text-rose-400 uppercase tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Category III • Pathological
            </p>
            <p className="font-mono text-2xl sm:text-3xl font-bold text-rose-400 tracking-tight">
              {stats.pathological_count} <span className="text-xs font-sans font-normal text-stone-400">({pathPct}%)</span>
            </p>
            <p className="text-[11px] text-rose-300/80">
              Urgent clinician intervention
            </p>
          </div>
        </div>

        {/* Visual Acuity Proportional Ribbon */}
        <div className="h-1.5 w-full bg-obsidian-950 flex">
          <div style={{ width: `${normalPct}%` }} className="h-full bg-vital-sage transition-all duration-500" title="Normal" />
          <div style={{ width: `${suspectPct}%` }} className="h-full bg-vital-amber transition-all duration-500" title="Suspect" />
          <div style={{ width: `${pathPct}%` }} className="h-full bg-rose-500 transition-all duration-500" title="Pathological" />
        </div>
      </div>

      {/* Middle Diagnostic Section: Telemetry Monitor + Risk Donut + Workflow */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* CTG Telemetry Rhythm Monitor (7 cols) */}
        <div className="lg:col-span-7 bg-obsidian-900 rounded-xl p-5 border border-white/[0.08] shadow-warm-card space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-vital-coral animate-ping" />
              <h3 className="font-serif text-lg text-stone-100 font-normal">
                Live CTG Surveillance Trace
              </h3>
            </div>
            <span className="font-mono text-[10px] text-stone-400 bg-obsidian-850 px-2 py-0.5 rounded border border-white/10">
              Sample Telemetry Feed
            </span>
          </div>

          <div className="h-44 w-full rounded-lg bg-obsidian-950 border border-white/[0.05] p-2 relative flex flex-col justify-between telemetry-grid overflow-hidden">
            <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 z-10">
              <span>FHR: 142 BPM</span>
              <span>TOCO: 28 mmHg</span>
              <span>SPEED: 1 cm/min</span>
            </div>

            {/* Smooth SVG Heartbeat Trace */}
            <svg className="w-full h-24 text-vital-coral/90 my-auto" viewBox="0 0 400 60" preserveAspectRatio="none">
              <path
                d="M0,30 L60,30 L70,18 L80,44 L90,22 L100,30 L160,30 L170,10 L180,50 L190,25 L200,30 L280,30 L290,16 L300,40 L310,28 L320,30 L400,30"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>

            <div className="flex items-center justify-between text-[10px] font-mono text-stone-400 z-10 border-t border-white/[0.04] pt-1">
              <span className="text-vital-sage">Baseline: 140–145 bpm</span>
              <span className="text-stone-400">Variability: Moderate</span>
              <span className="text-vital-coral">Accelerations: Present</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1 text-xs">
            <div className="bg-obsidian-850 p-2.5 rounded-lg border border-white/[0.05]">
              <span className="text-[10px] font-mono text-stone-400 block">Baseline Standard</span>
              <span className="text-stone-200 font-medium text-xs">110 – 160 bpm (Normal)</span>
            </div>
            <div className="bg-obsidian-850 p-2.5 rounded-lg border border-white/[0.05]">
              <span className="text-[10px] font-mono text-stone-400 block">Baseline Variability</span>
              <span className="text-stone-200 font-medium text-xs">5 – 25 bpm (Moderate)</span>
            </div>
            <div className="bg-obsidian-850 p-2.5 rounded-lg border border-white/[0.05] col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-stone-400 block">Uterine Dynamics</span>
              <span className="text-stone-200 font-medium text-xs">≤ 5 contractions / 10m</span>
            </div>
          </div>
        </div>

        {/* Risk Distribution Donut & Workflow (5 cols) */}
        <div className="lg:col-span-5 bg-obsidian-900 rounded-xl p-5 border border-white/[0.08] shadow-warm-card flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-serif text-lg text-stone-100 font-normal">
                Acuity Distribution
              </h3>
              <span className="font-mono text-[10px] text-stone-400">FIGO Standard</span>
            </div>
            <p className="text-xs text-stone-400">Diagnostic ratio of classified examinations</p>

            <div className="h-44 w-full flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={defaultPieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={44}
                    outerRadius={70}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {defaultPieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value, name) => [`${value} Records`, name]}
                    contentStyle={{ backgroundColor: '#101216', borderColor: '#282e3a', borderRadius: '8px', color: '#f5f5f5', fontSize: '11px', fontFamily: 'monospace' }}
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', paddingTop: '6px', color: '#a8a29e' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between text-xs">
            <span className="text-stone-400 text-[11px] font-mono">
              Model: GradientBoosting (21 Biometrics)
            </span>
            <button
              onClick={() => onNavigate('model-info')}
              className="text-vital-coral hover:underline font-mono text-xs flex items-center gap-1"
            >
              <span>Specs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Recent Examinations Ledger */}
      <div className="bg-obsidian-900 rounded-xl border border-white/[0.08] shadow-warm-card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-white/[0.06] gap-2">
          <div>
            <h3 className="font-serif text-lg text-stone-100 font-normal">Clinical Examination Ledger</h3>
            <p className="text-xs text-stone-400">Chronological list of recent CTG recordings with ML classifications</p>
          </div>
          <button
            onClick={() => onNavigate('history')}
            className="text-vital-coral hover:underline text-xs font-mono flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Complete Ledger</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {stats.recent_assessments && stats.recent_assessments.length > 0 ? (
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-xs min-w-[640px]">
              <thead>
                <tr className="border-b border-white/[0.06] font-mono text-[10px] text-stone-400 uppercase tracking-wider">
                  <th className="pb-3 font-medium">Patient Details</th>
                  <th className="pb-3 font-medium">Examination Date</th>
                  <th className="pb-3 font-medium">Classification</th>
                  <th className="pb-3 font-medium">Confidence</th>
                  <th className="pb-3 font-medium text-right">Review Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {stats.recent_assessments.map((a, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.015] transition">
                    <td className="py-3 pr-4">
                      <p className="font-serif text-stone-200 text-sm font-medium">{a.patient_name || 'Patient Record'}</p>
                      <p className="font-mono text-[10px] text-stone-500">ID: {a.patient_id?.slice(0, 8) || 'N/A'}</p>
                    </td>
                    <td className="py-3 pr-4 font-mono text-[11px] text-stone-400">
                      {a.created_at ? new Date(a.created_at).toLocaleDateString() : 'Recent'}
                    </td>
                    <td className="py-3 pr-4">
                      <RiskBadge level={a.prediction?.fetal_health_prediction} />
                    </td>
                    <td className="py-3 pr-4 font-mono text-[11px] text-stone-300">
                      {a.prediction?.confidence ? `${Math.round(a.prediction.confidence * 100)}%` : '—'}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => onSelectAssessment && onSelectAssessment(a)}
                        className="px-2.5 py-1 rounded bg-obsidian-850 hover:bg-obsidian-800 text-stone-300 hover:text-stone-100 text-xs font-mono border border-white/10 transition"
                      >
                        Inspect →
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-10 text-stone-500 text-xs space-y-3 font-mono">
            <p>No historical examinations recorded yet.</p>
            <button
              onClick={() => onNavigate('new-assessment')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vital-coral hover:bg-vital-coral/90 text-white text-xs font-sans font-medium transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Record First CTG Evaluation</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
