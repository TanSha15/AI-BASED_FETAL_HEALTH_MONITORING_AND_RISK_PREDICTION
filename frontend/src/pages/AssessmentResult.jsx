import React, { useState } from 'react';
import {
  ArrowLeft,
  Download,
  Share2,
  Calendar,
  User,
  Activity,
  CheckCircle,
  FileDown,
  RefreshCw,
  Clock,
  Layers,
  Radio,
  Plus
} from 'lucide-react';
import { RiskBadge } from '../components/RiskBadge';
import { ProbabilityGauge } from '../components/ProbabilityGauge';
import { FeatureImportanceChart } from '../components/FeatureImportanceChart';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { assessmentService } from '../services/api';

export const AssessmentResult = ({ assessment, onBack, onNewAssessment }) => {
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [currentAssessment, setCurrentAssessment] = useState(assessment);

  if (!currentAssessment) return null;

  const handleDownloadPdf = async () => {
    setDownloadingPdf(true);
    try {
      const blob = await assessmentService.downloadReport(currentAssessment.id);
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `fetal_health_report_${currentAssessment.id.slice(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      window.open(assessmentService.getReportDownloadUrl(currentAssessment.id), '_blank');
    } finally {
      setDownloadingPdf(false);
    }
  };

  const handleExplanationUpdated = (newExp) => {
    setCurrentAssessment(prev => ({ ...prev, explanation: newExp }));
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Action Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="inline-flex items-center justify-center gap-1.5 text-xs font-mono text-stone-300 hover:text-white bg-obsidian-900 border border-white/10 px-3 py-2 rounded-lg transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Ledger
        </button>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <button
            onClick={handleDownloadPdf}
            disabled={downloadingPdf}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-obsidian-900 hover:bg-obsidian-850 text-stone-200 border border-white/10 rounded-lg text-xs font-mono transition disabled:opacity-50"
          >
            {downloadingPdf ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-vital-coral" />
            ) : (
              <FileDown className="w-3.5 h-3.5 text-vital-coral" />
            )}
            Download PDF Report
          </button>

          <button
            onClick={onNewAssessment}
            className="inline-flex items-center justify-center gap-2 px-3.5 py-2 bg-vital-coral hover:bg-vital-coral/90 text-white rounded-lg text-xs font-semibold shadow-vital-glow transition"
          >
            <Plus className="w-3.5 h-3.5" />
            New Assessment
          </button>
        </div>
      </div>

      {/* Main Diagnostic Result Monograph */}
      <div className="bg-obsidian-900 rounded-xl border border-white/[0.08] shadow-warm-card p-5 sm:p-7">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-5 pb-5 border-b border-white/[0.06]">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Radio className="w-3.5 h-3.5 text-vital-coral animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
                Diagnostic Evaluation • FIGO 2015 Classification
              </span>
            </div>
            
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <RiskBadge level={currentAssessment.prediction_label} size="lg" />
              <span className="text-xs font-mono text-stone-300">
                Stratification: <strong className="text-stone-100">{currentAssessment.risk_level}</strong>
              </span>
            </div>
            
            <p className="text-xs text-stone-400 max-w-xl leading-relaxed">
              Assessed via trained Gradient Boosting multi-tree ensemble using 21 biometric CTG parameters.
            </p>
          </div>

          <div className="bg-obsidian-950 p-3.5 rounded-lg border border-white/10 min-w-[200px] text-xs space-y-1 font-mono">
            <div className="flex items-center justify-between text-stone-400">
              <span>Patient:</span>
              <strong className="text-stone-200">{currentAssessment.patient_name || 'Patient'}</strong>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>Exam ID:</span>
              <span className="text-stone-300">{currentAssessment.id.slice(0, 8)}</span>
            </div>
            <div className="flex items-center justify-between text-stone-400">
              <span>Recorded:</span>
              <span className="text-stone-300">{new Date(currentAssessment.created_at).toLocaleDateString()}</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Deep Dive: Probability Gauge & Feature Contribution */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pt-6">
          <div className="lg:col-span-5 space-y-4">
            <h3 className="font-serif text-base text-stone-100 font-normal">
              Tri-Class Risk Probabilities
            </h3>
            <ProbabilityGauge
              probabilities={currentAssessment.prediction?.probabilities}
              confidence={currentAssessment.prediction?.confidence}
            />
          </div>

          <div className="lg:col-span-7 space-y-4">
            <h3 className="font-serif text-base text-stone-100 font-normal">
              Biophysical Feature Importance
            </h3>
            <FeatureImportanceChart factors={currentAssessment.prediction?.top_contributing_factors} />
          </div>
        </div>
      </div>

      {/* Gemini Generative Clinical Synthesis */}
      <ExplanationPanel
        assessmentId={currentAssessment.id}
        explanation={currentAssessment.explanation}
        onRegenerated={handleExplanationUpdated}
      />

      {/* Input Parameters Summary */}
      {currentAssessment.input_data && (
        <div className="bg-obsidian-900 rounded-xl border border-white/[0.08] shadow-warm-card p-5">
          <h3 className="font-serif text-base text-stone-100 font-normal mb-1">
            Recorded Biophysical Measurements
          </h3>
          <p className="text-xs text-stone-400 mb-4">
            Baseline telemetry values provided for machine inference
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 text-xs font-mono">
            {Object.entries(currentAssessment.input_data).map(([key, val]) => (
              <div key={key} className="p-2 rounded bg-obsidian-950 border border-white/[0.04]">
                <span className="text-[10px] text-stone-400 block truncate">{key}</span>
                <span className="text-stone-200 font-bold">{val}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
