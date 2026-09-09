import React, { useState, useEffect } from 'react';
import {
  History,
  Search,
  Filter,
  FileDown,
  ChevronRight,
  User,
  Calendar,
  Clock,
  X,
  Radio
} from 'lucide-react';
import { assessmentService } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

export const AssessmentHistory = ({ onSelectAssessment }) => {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const data = await assessmentService.getAssessments();
      setAssessments(data);
    } catch (err) {
      console.error("Failed to load assessments:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPdf = (id, e) => {
    e.stopPropagation();
    window.open(assessmentService.getReportDownloadUrl(id), '_blank');
  };

  const filtered = assessments.filter((a) => {
    const matchesSearch =
      (a.patient_name || '').toLowerCase().includes(search.toLowerCase()) ||
      a.id.toLowerCase().includes(search.toLowerCase());

    if (statusFilter === 'all') return matchesSearch;
    return matchesSearch && a.prediction_label.toLowerCase() === statusFilter.toLowerCase();
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-obsidian-900 rounded-xl p-5 border border-white/[0.08] shadow-warm-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-3.5 h-3.5 text-vital-coral" />
            <span className="font-mono text-[10px] text-stone-400 uppercase tracking-wider">
              Clinical Assessment Archive
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-100">
            Cardiotocography Examination Ledger
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Audit log of all machine learning predictions and generated clinical reports
          </p>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-obsidian-900 p-3 sm:p-4 rounded-xl border border-white/[0.08] shadow-warm-card flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 flex-1">
          <Search className="w-4 h-4 text-stone-500 shrink-0 ml-1" />
          <input
            type="text"
            placeholder="Filter ledger by patient name or examination ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-xs font-mono text-stone-100 placeholder-stone-600 bg-transparent focus:outline-none"
          />
          {search && (
            <button onClick={() => setSearch('')} className="text-stone-400 hover:text-stone-200">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 border-t sm:border-t-0 sm:border-l border-white/[0.08] pt-2.5 sm:pt-0 sm:pl-3 overflow-x-auto scrollbar-none font-mono">
          {[
            { id: 'all', label: 'All Cases' },
            { id: 'normal', label: 'Cat I' },
            { id: 'suspect', label: 'Cat II' },
            { id: 'pathological', label: 'Cat III' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition ${
                statusFilter === tab.id
                  ? 'bg-vital-coral text-white font-semibold'
                  : 'bg-obsidian-850 text-stone-400 hover:text-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Ledger Table Card */}
      <div className="bg-obsidian-900 rounded-xl border border-white/[0.08] shadow-warm-card overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-stone-500 font-mono text-xs">
            Querying examination ledger...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-stone-500 font-mono text-xs">
            No matching cardiotocographic records found in ledger.
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-white/[0.06] font-mono text-[10px] text-stone-400 uppercase tracking-wider bg-obsidian-950/40">
                  <th className="py-3 px-4 font-medium">Patient Details</th>
                  <th className="py-3 px-4 font-medium">Exam Date</th>
                  <th className="py-3 px-4 font-medium">FIGO Classification</th>
                  <th className="py-3 px-4 font-medium">Confidence</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filtered.map((a) => (
                  <tr
                    key={a.id}
                    onClick={() => onSelectAssessment && onSelectAssessment(a)}
                    className="hover:bg-white/[0.015] cursor-pointer transition"
                  >
                    <td className="py-3 px-4">
                      <p className="font-serif text-sm font-medium text-stone-100">{a.patient_name || 'Patient Record'}</p>
                      <p className="font-mono text-[10px] text-stone-500">ID: {a.id.slice(0, 8)}</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-400">
                      {new Date(a.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge level={a.prediction?.fetal_health_prediction} />
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-300">
                      {a.prediction?.confidence ? `${Math.round(a.prediction.confidence * 100)}%` : '—'}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={(e) => handleDownloadPdf(a.id, e)}
                        className="p-1.5 rounded bg-obsidian-850 hover:bg-obsidian-800 text-stone-400 hover:text-vital-coral border border-white/10 transition"
                        title="Download PDF report"
                      >
                        <FileDown className="w-3.5 h-3.5" />
                      </button>
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
        )}
      </div>
    </div>
  );
};
