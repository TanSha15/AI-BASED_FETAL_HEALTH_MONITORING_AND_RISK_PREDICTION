import React, { useState } from 'react';
import { Sparkles, RefreshCw, AlertCircle, Info, FileText } from 'lucide-react';
import { assessmentService } from '../services/api';

export const ExplanationPanel = ({ assessmentId, explanation, onRegenerated }) => {
  const [loading, setLoading] = useState(false);
  const [currentText, setCurrentText] = useState(explanation || '');
  const [error, setError] = useState(null);

  const handleRegenerate = async () => {
    if (!assessmentId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await assessmentService.generateExplanation(assessmentId);
      setCurrentText(res.explanation);
      if (onRegenerated) onRegenerated(res.explanation);
    } catch (err) {
      setError("Failed to regenerate clinical explanation. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderFormattedMarkdown = (text) => {
    if (!text) return null;
    const lines = text.split('\n');
    return (
      <div className="space-y-2.5 text-xs text-stone-300 leading-relaxed font-sans">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return <div key={idx} className="h-1" />;

          if (trimmed.startsWith('### ')) {
            return (
              <h4 key={idx} className="font-serif text-sm font-medium text-stone-100 pt-2 tracking-normal">
                {trimmed.replace('### ', '')}
              </h4>
            );
          }
          if (trimmed.startsWith('#### ')) {
            return (
              <h5 key={idx} className="font-serif text-xs font-medium text-vital-rose pt-1">
                {trimmed.replace('#### ', '')}
              </h5>
            );
          }
          if (trimmed.startsWith('• ') || trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
            const content = trimmed.substring(2);
            return (
              <div key={idx} className="flex items-start gap-2 pl-1">
                <span className="text-vital-coral font-bold">•</span>
                <span>{renderInlineBold(content)}</span>
              </div>
            );
          }
          if (trimmed.startsWith('*Disclaimer:')) {
            return (
              <p key={idx} className="text-[11px] text-stone-400 italic pt-2 border-t border-white/[0.06] mt-3">
                {trimmed.replace(/\*/g, '')}
              </p>
            );
          }
          return <p key={idx}>{renderInlineBold(trimmed)}</p>;
        })}
      </div>
    );
  };

  const renderInlineBold = (str) => {
    const parts = str.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i} className="font-semibold text-stone-100">{part.slice(2, -2)}</strong>;
      }
      return part;
    });
  };

  return (
    <div className="rounded-xl border border-white/[0.08] bg-obsidian-900 p-5 shadow-warm-card">
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.06] mb-4 gap-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-vital-coral/15 text-vital-coral border border-vital-coral/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-serif text-base text-stone-100 font-normal">
              Gemini Clinical Synthesis
            </h3>
            <p className="text-[10px] font-mono text-stone-400">Generative Diagnostic Rationale</p>
          </div>
        </div>
        {assessmentId && (
          <button
            onClick={handleRegenerate}
            disabled={loading}
            className="inline-flex items-center gap-1.5 text-xs font-mono text-stone-300 hover:text-white bg-obsidian-850 hover:bg-obsidian-800 border border-white/10 px-2.5 py-1.5 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-vital-coral' : ''}`} />
            <span>{loading ? 'Synthesizing...' : 'Re-synthesize'}</span>
          </button>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-rose-950/40 text-rose-200 text-xs border border-rose-900/60">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="bg-obsidian-950/70 rounded-lg p-4 border border-white/[0.04]">
        {renderFormattedMarkdown(currentText)}
      </div>

      <div className="mt-4 pt-3 border-t border-white/[0.06] flex items-center justify-between text-[10px] font-mono text-stone-500">
        <span className="flex items-center gap-1">
          <FileText className="w-3 h-3 text-vital-coral" />
          Synthesized via Google Gemini 2.5 Flash
        </span>
        <span>Physician Review Mandatory</span>
      </div>
    </div>
  );
};
