import React from 'react';

export const ProbabilityGauge = ({ probabilities = {}, confidence = 0 }) => {
  const normalPct = Math.round((probabilities.Normal || 0) * 100);
  const suspectPct = Math.round((probabilities.Suspect || 0) * 100);
  const patholPct = Math.round((probabilities.Pathological || 0) * 100);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs">
        <span className="text-stone-400 font-mono">Biophysical Confidence Level</span>
        <span className="font-mono text-base font-bold text-stone-100">
          {(confidence * 100).toFixed(1)}%
        </span>
      </div>

      {/* Tri-color stacked bar */}
      <div className="w-full h-2.5 bg-obsidian-950 rounded overflow-hidden flex border border-white/10 p-0.5 shadow-inner">
        <div
          style={{ width: `${normalPct}%` }}
          className="bg-vital-sage transition-all duration-500 rounded-l-xs"
          title={`Normal: ${normalPct}%`}
        />
        <div
          style={{ width: `${suspectPct}%` }}
          className="bg-vital-amber transition-all duration-500"
          title={`Suspect: ${suspectPct}%`}
        />
        <div
          style={{ width: `${patholPct}%` }}
          className="bg-rose-500 transition-all duration-500 rounded-r-xs"
          title={`Pathological: ${patholPct}%`}
        />
      </div>

      {/* 3 cards breakdown */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        <div className="p-2 rounded-lg bg-obsidian-850 border border-white/[0.05] text-center">
          <span className="block text-[10px] font-mono text-vital-sage uppercase tracking-wider">Cat I • Normal</span>
          <span className="font-mono text-base font-bold text-stone-100 mt-0.5 block">{normalPct}%</span>
        </div>
        <div className="p-2 rounded-lg bg-obsidian-850 border border-white/[0.05] text-center">
          <span className="block text-[10px] font-mono text-vital-amber uppercase tracking-wider">Cat II • Suspect</span>
          <span className="font-mono text-base font-bold text-stone-100 mt-0.5 block">{suspectPct}%</span>
        </div>
        <div className="p-2 rounded-lg bg-obsidian-850 border border-white/[0.05] text-center">
          <span className="block text-[10px] font-mono text-rose-400 uppercase tracking-wider truncate">Cat III • Path</span>
          <span className="font-mono text-base font-bold text-stone-100 mt-0.5 block">{patholPct}%</span>
        </div>
      </div>
    </div>
  );
};
