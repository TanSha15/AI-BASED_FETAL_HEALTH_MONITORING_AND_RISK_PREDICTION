import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export const RiskBadge = ({ label, level, size = 'md' }) => {
  const norm = (label || level || '').toString().toLowerCase();
  
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1 font-mono',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-mono font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-mono font-semibold'
  };

  if (norm.includes('patholog') || norm === '3' || norm.includes('high')) {
    return (
      <span className={`inline-flex items-center rounded-md bg-rose-500/10 text-rose-300 border border-rose-500/30 ${sizeClasses[size]}`}>
        <AlertOctagon className={size === 'lg' ? 'w-4 h-4 text-rose-400' : 'w-3.5 h-3.5 text-rose-400'} />
        <span>Cat III • Pathological</span>
      </span>
    );
  }

  if (norm.includes('suspect') || norm === '2' || norm.includes('moderate')) {
    return (
      <span className={`inline-flex items-center rounded-md bg-vital-amber/10 text-vital-amber border border-vital-amber/30 ${sizeClasses[size]}`}>
        <AlertTriangle className={size === 'lg' ? 'w-4 h-4 text-vital-amber' : 'w-3.5 h-3.5 text-vital-amber'} />
        <span>Cat II • Suspect</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-md bg-vital-sage/10 text-vital-sage border border-vital-sage/30 ${sizeClasses[size]}`}>
      <ShieldCheck className={size === 'lg' ? 'w-4 h-4 text-vital-sage' : 'w-3.5 h-3.5 text-vital-sage'} />
      <span>Cat I • Normal</span>
    </span>
  );
};
