import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Calendar,
  Phone,
  Droplet,
  FileText,
  Activity,
  Plus,
  Clock,
  ChevronRight,
  Radio
} from 'lucide-react';
import { patientService } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

export const PatientDetail = ({ patient, onBack, onStartAssessment, onSelectAssessment }) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (patient?.id) {
      loadHistory();
    }
  }, [patient]);

  const loadHistory = async () => {
    try {
      const data = await patientService.getPatientAssessments(patient.id);
      setAssessments(data);
    } catch (err) {
      console.error("Failed to load assessments:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!patient) return null;

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-mono text-stone-300 hover:text-white bg-obsidian-900 border border-white/10 px-3.5 py-2 rounded-lg transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Census
        </button>

        <button
          onClick={() => onStartAssessment(patient)}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-vital-coral hover:bg-vital-coral/90 text-white rounded-lg text-xs font-semibold shadow-vital-glow transition"
        >
          <Plus className="w-4 h-4" /> Start CTG Exam for {patient.name}
        </button>
      </div>

      {/* Patient Dossier Header */}
      <div className="bg-obsidian-900 rounded-xl border border-white/[0.08] shadow-warm-card p-5 sm:p-7">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-white/[0.06]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Radio className="w-3 h-3 text-vital-coral animate-pulse" />
              <span className="font-mono text-[10px] text-stone-400 uppercase tracking-wider">
                Maternal Clinical Dossier
              </span>
            </div>
            <h2 className="font-serif text-2xl text-stone-100 font-normal">{patient.name}</h2>
            <p className="text-xs text-stone-500 font-mono">MRN: {patient.id}</p>
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-3 w-full sm:w-auto font-mono">
            <div className="text-center px-4 py-2 bg-obsidian-950 rounded-lg border border-white/10">
              <span className="block text-[10px] text-stone-400">Gestation</span>
              <span className="text-sm font-bold text-vital-coral">{patient.pregnancy_week} Weeks</span>
            </div>
            <div className="text-center px-4 py-2 bg-obsidian-950 rounded-lg border border-white/10">
              <span className="block text-[10px] text-stone-400">Maternal Age</span>
              <span className="text-sm font-bold text-stone-100">{patient.age} Years</span>
            </div>
          </div>
        </div>

        {/* Clinical Parameters */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs font-mono">
          <div className="flex items-center gap-2 text-stone-400">
            <Phone className="w-3.5 h-3.5 text-stone-500" />
            <span>Contact: <strong className="text-stone-200">{patient.contact || 'None listed'}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-stone-400">
            <Droplet className="w-3.5 h-3.5 text-vital-coral" />
            <span>Blood Group: <strong className="text-stone-200">{patient.blood_group || 'Unspecified'}</strong></span>
          </div>
          <div className="flex items-center gap-2 text-stone-400">
            <Calendar className="w-3.5 h-3.5 text-vital-sage" />
            <span>Enrolled: <strong className="text-stone-200">{patient.created_at ? new Date(patient.created_at).toLocaleDateString() : 'N/A'}</strong></span>
          </div>
        </div>

        {patient.medical_history && (
          <div className="mt-4 pt-3 border-t border-white/[0.06] text-xs text-stone-300 bg-obsidian-950/60 p-3.5 rounded-lg border border-white/[0.04]">
            <span className="font-mono text-[10px] text-vital-amber uppercase tracking-wider block mb-1">
              Obstetric Clinical History & Risk Factors
            </span>
            <p className="font-sans leading-relaxed text-stone-300">{patient.medical_history}</p>
          </div>
        )}
      </div>

      {/* Longitudinal Assessment History */}
      <div className="bg-obsidian-900 rounded-xl border border-white/[0.08] shadow-warm-card p-5 sm:p-6">
        <h3 className="font-serif text-lg text-stone-100 font-normal mb-1">
          Longitudinal CTG Trajectory
        </h3>
        <p className="text-xs text-stone-400 mb-4">
          Historical record of cardiotocographic evaluations performed for {patient.name}
        </p>

        {loading ? (
          <div className="py-8 text-center text-stone-500 font-mono text-xs">
            Querying clinical trajectory...
          </div>
        ) : assessments.length === 0 ? (
          <div className="py-8 text-center text-stone-500 font-mono text-xs space-y-2">
            <p>No CTG assessments recorded for this patient yet.</p>
            <button
              onClick={() => onStartAssessment(patient)}
              className="text-vital-coral hover:underline"
            >
              Perform baseline CTG recording →
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {assessments.map((a) => (
              <div
                key={a.id}
                onClick={() => onSelectAssessment && onSelectAssessment(a)}
                className="flex items-center justify-between p-3.5 rounded-lg bg-obsidian-950 hover:bg-obsidian-850 border border-white/[0.06] hover:border-white/15 cursor-pointer transition"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded bg-obsidian-900 border border-white/10 text-vital-coral">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <RiskBadge level={a.prediction?.fetal_health_prediction} size="sm" />
                      <span className="font-mono text-xs text-stone-300">
                        {a.prediction?.confidence ? `${Math.round(a.prediction.confidence * 100)}% Confidence` : ''}
                      </span>
                    </div>
                    <p className="text-[10px] font-mono text-stone-500 mt-0.5">
                      Exam ID: {a.id.slice(0, 8)} • Recorded {new Date(a.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-stone-400">
                  <span className="text-xs font-mono text-stone-300 hidden sm:inline">Inspect Monograph</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
