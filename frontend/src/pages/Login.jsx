import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Lock, 
  Mail, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Activity, 
  Sparkles, 
  ShieldCheck, 
  X, 
  KeyRound, 
  Stethoscope, 
  Check,
  Radio
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Login = ({ initialEmail = '', onSwitchToRegister }) => {
  const { login } = useAuth();
  
  const savedEmail = localStorage.getItem('fetal_health_saved_email') || '';
  const [email, setEmail] = useState(initialEmail || savedEmail || 'clinician@hospital.org');
  const [password, setPassword] = useState('password123');
  const [rememberMe, setRememberMe] = useState(!!savedEmail || true);
  
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeDemo, setActiveDemo] = useState(null);

  // Forgot Password Modal State
  const [forgotModalOpen, setForgotModalOpen] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const demoAccounts = [
    {
      label: 'Lead Obstetrician',
      name: 'Dr. Sarah Jenkins, MD',
      email: 'clinician@hospital.org',
      password: 'password123',
      dept: 'Labor & Delivery',
      badge: 'STAFF-01'
    },
    {
      label: 'MFM Specialist',
      name: 'Dr. Marcus Chen, FACOG',
      email: 'marcus.chen@hospital.org',
      password: 'password123',
      dept: 'Perinatal Unit',
      badge: 'STAFF-04'
    }
  ];

  const handleApplyDemo = (acc, idx) => {
    setEmail(acc.email);
    setPassword(acc.password);
    setActiveDemo(idx);
    setError('');
    setTimeout(() => setActiveDemo(null), 1200);
  };

  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateEmail(email)) {
      setError('Please provide a valid institutional hospital email.');
      return;
    }
    if (!password) {
      setError('Please enter your secure access password.');
      return;
    }

    setLoading(true);
    try {
      if (rememberMe) {
        localStorage.setItem('fetal_health_saved_email', email);
      } else {
        localStorage.removeItem('fetal_health_saved_email');
      }
      await login(email, password);
    } catch (err) {
      setError(err.response?.data?.detail || 'Authentication failed. Please check credentials or contact unit IT.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotSubmit = (e) => {
    e.preventDefault();
    if (!validateEmail(forgotEmail)) return;
    setForgotLoading(true);
    setTimeout(() => {
      setForgotLoading(false);
      setForgotSuccess(true);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-stone-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-vital-coral selection:text-white">
      {/* Subtle Warm Atmospheric Glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-vital-coral/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-vital-amber/[0.03] blur-[140px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        
        {/* Left Column: Human & Editorial Storytelling (Desktop) */}
        <div className="hidden lg:flex lg:col-span-6 flex-col justify-between space-y-8 pr-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-850 border border-white/10 text-stone-300 text-xs font-mono">
              <Radio className="w-3.5 h-3.5 text-vital-coral animate-pulse" />
              <span>CTG Surveillance & Decision Support</span>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-lg bg-obsidian-800 border border-white/10 flex items-center justify-center text-vital-coral shadow-inner">
                <HeartPulse className="w-6 h-6" />
              </div>
              <h1 className="font-serif text-2xl tracking-tight text-stone-100">
                Fetal<span className="italic text-vital-rose">Care</span> <span className="font-sans text-xs font-mono tracking-widest text-vital-sage px-2 py-0.5 rounded bg-vital-sage/10 border border-vital-sage/20 uppercase">Telemetry</span>
              </h1>
            </div>

            <h2 className="font-serif text-3xl xl:text-4xl text-stone-100 font-normal leading-snug pt-2">
              Compassionate obstetrics assisted by <span className="italic text-vital-coral">precision biophysical intelligence</span>.
            </h2>

            <p className="text-sm text-stone-400 font-sans leading-relaxed">
              Evaluating 21 cardiotocographic parameters aligned with the FIGO 2015 consensus standard, augmented with Google Gemini clinical narratives for immediate diagnostic confidence.
            </p>
          </div>

          {/* Stylized Telemetry Rhythm Strip */}
          <div className="p-4 rounded-xl bg-obsidian-900 border border-white/[0.08] shadow-warm-card space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 text-stone-300 font-medium">
                <Activity className="w-4 h-4 text-vital-coral" />
                <span className="font-mono text-[11px]">Telemetry Stream: Maternal Fetal Unit</span>
              </div>
              <span className="px-2 py-0.5 rounded font-mono text-[10px] bg-vital-sage/10 text-vital-sage border border-vital-sage/20">
                FIGO Category I • Normal
              </span>
            </div>

            {/* Heartbeat Waveform Strip */}
            <div className="h-16 w-full rounded bg-obsidian-950 border border-white/[0.05] p-1 flex items-center justify-center relative overflow-hidden telemetry-grid">
              <svg className="w-full h-full text-vital-coral" viewBox="0 0 240 40" preserveAspectRatio="none">
                <path
                  d="M0,20 L35,20 L42,12 L50,30 L58,16 L65,20 L105,20 L112,6 L120,34 L128,14 L136,20 L180,20 L188,11 L196,27 L204,20 L240,20"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs">
              <div className="bg-obsidian-850 p-2 rounded border border-white/[0.05]">
                <span className="text-[10px] text-stone-400 block font-mono">Baseline FHR</span>
                <span className="font-mono font-bold text-stone-200">142 bpm</span>
              </div>
              <div className="bg-obsidian-850 p-2 rounded border border-white/[0.05]">
                <span className="text-[10px] text-stone-400 block font-mono">Variability</span>
                <span className="font-mono font-bold text-vital-amber">Moderate (14)</span>
              </div>
              <div className="bg-obsidian-850 p-2 rounded border border-white/[0.05]">
                <span className="text-[10px] text-stone-400 block font-mono">Validation</span>
                <span className="font-mono font-bold text-vital-sage">96.8% Acc</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-vital-coral" />
              Role-Based Access
            </span>
            <span>•</span>
            <span>FIGO Standardized</span>
            <span>•</span>
            <span>Intrapartum Ready</span>
          </div>
        </div>

        {/* Right Column: Architectural Form Container */}
        <div className="lg:col-span-6 w-full">
          
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex p-3 rounded-xl bg-obsidian-850 border border-white/10 text-vital-coral mb-2">
              <HeartPulse className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-normal text-stone-100">
              Fetal<span className="italic text-vital-rose">Care</span> Telemetry
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">Cardiotocography Clinical Decision Support</p>
          </div>

          <div className="bg-obsidian-900 rounded-xl shadow-warm-card border border-white/[0.08] p-6 sm:p-8 relative">
            
            {/* Form Title & Security Badge */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
              <div>
                <h2 className="font-serif text-xl text-stone-100 font-normal">Clinician Sign In</h2>
                <p className="text-xs text-stone-400 mt-0.5 font-sans">Authorized obstetric staff credentialing</p>
              </div>
              <span className="font-mono text-[10px] text-stone-400 bg-obsidian-850 px-2.5 py-1 rounded border border-white/10 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-vital-sage" />
                256-Bit SSL
              </span>
            </div>

            {/* Quick Staff Badge Preset Selector */}
            <div className="mb-5 p-3 rounded-lg bg-obsidian-850 border border-white/[0.06]">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono uppercase tracking-wider text-stone-400">
                  Staff Quick Access
                </span>
                <span className="text-[10px] font-mono text-vital-coral">Instant Fill</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {demoAccounts.map((acc, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyDemo(acc, idx)}
                    className={`flex items-center justify-between p-2.5 rounded-lg text-left transition border text-xs ${
                      activeDemo === idx
                        ? 'bg-vital-coral/15 border-vital-coral/50 text-stone-100'
                        : 'bg-obsidian-900 hover:bg-obsidian-800 border-white/[0.06] text-stone-300'
                    }`}
                  >
                    <div className="truncate pr-2">
                      <p className="font-medium truncate text-stone-200 text-xs">{acc.name}</p>
                      <p className="text-[10px] text-stone-400 truncate">{acc.dept}</p>
                    </div>
                    <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-obsidian-950 text-vital-amber border border-white/10 shrink-0">
                      {acc.badge}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Error Notification */}
            {error && (
              <div className="flex items-start gap-2.5 p-3 mb-5 rounded-lg bg-rose-950/40 text-rose-200 text-xs border border-rose-900/60">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
                <span className="flex-1 leading-snug">{error}</span>
                <button
                  type="button"
                  onClick={() => setError('')}
                  className="text-rose-400 hover:text-rose-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-stone-300">
                    Institutional Hospital Email
                  </label>
                  {email && validateEmail(email) && (
                    <span className="text-[10px] font-mono text-vital-sage flex items-center gap-1">
                      <Check className="w-3 h-3" /> Valid format
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type="email"
                    required
                    inputMode="email"
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="clinician@hospital.org"
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-vital-coral focus:border-vital-coral transition font-mono"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-medium text-stone-300">Access Key / Password</label>
                  <button
                    type="button"
                    onClick={() => {
                      setForgotEmail(email);
                      setForgotModalOpen(true);
                    }}
                    className="text-xs text-vital-coral hover:underline"
                  >
                    Forgot key?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-10 pr-10 py-2.5 text-xs rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-vital-coral focus:border-vital-coral transition font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300 transition"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me Checkbox */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-3.5 h-3.5 rounded bg-obsidian-950 border-white/20 text-vital-coral focus:ring-vital-coral/40 cursor-pointer"
                  />
                  <span className="text-xs text-stone-400 hover:text-stone-300 transition">
                    Keep clinician authenticated on this workstation
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-3 py-2.5 px-4 rounded-lg bg-vital-coral hover:bg-vital-coral/90 text-white text-xs font-semibold shadow-vital-glow flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <span>Enter Telemetry Station</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Register */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
              <span>Unregistered medical practitioner?</span>
              <button
                type="button"
                onClick={() => onSwitchToRegister && onSwitchToRegister(email)}
                className="font-medium text-vital-coral hover:underline flex items-center gap-1"
              >
                <span>Register clinician account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] font-mono text-stone-500 mt-5">
            FIGO Consensus Standard • AI Assisted Telemetry • v2.4.0
          </p>
        </div>
      </div>

      {/* Forgot Password Modal */}
      {forgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-obsidian-900 border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl relative">
            <button
              type="button"
              onClick={() => {
                setForgotModalOpen(false);
                setForgotSuccess(false);
              }}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-vital-coral/10 text-vital-coral border border-vital-coral/20">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base text-stone-100">Practitioner Password Reset</h3>
                <p className="text-[11px] text-stone-400">Medical facility security protocol</p>
              </div>
            </div>

            {forgotSuccess ? (
              <div className="space-y-4">
                <div className="p-3 rounded-lg bg-vital-sage/10 border border-vital-sage/20 text-stone-200 text-xs flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-vital-sage shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-stone-100">Recovery Instructions Dispatched</p>
                    <p className="mt-1 text-stone-300 text-[11px] leading-relaxed">
                      If an account is associated with <span className="font-mono text-white">{forgotEmail}</span>, a secure authentication token has been dispatched.
                    </p>
                  </div>
                </div>
                <p className="text-[11px] text-stone-400 font-mono">
                  For urgent labor ward workstation issues, contact Hospital IT directly at ext. 4400.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setForgotModalOpen(false);
                    setForgotSuccess(false);
                  }}
                  className="w-full py-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-stone-200 text-xs font-medium"
                >
                  Return to Sign In
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotSubmit} className="space-y-4">
                <p className="text-xs text-stone-300 leading-relaxed">
                  Enter your registered institutional hospital email. You will receive a time-limited one-time security link to configure a new access password.
                </p>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Institutional Hospital Email
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                    <input
                      type="email"
                      required
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="doctor@hospital.org"
                      className="w-full pl-10 pr-3.5 py-2 text-xs rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-vital-coral focus:border-vital-coral font-mono"
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setForgotModalOpen(false)}
                    className="w-1/2 py-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-stone-300 text-xs font-medium transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={forgotLoading || !forgotEmail}
                    className="w-1/2 py-2 rounded-lg bg-vital-coral hover:bg-vital-coral/90 text-white text-xs font-semibold transition disabled:opacity-50"
                  >
                    {forgotLoading ? 'Dispatching...' : 'Send Reset Link'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
