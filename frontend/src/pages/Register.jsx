import React, { useState, useEffect } from 'react';
import { 
  HeartPulse, 
  Lock, 
  Mail, 
  User, 
  Shield, 
  ArrowRight, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  Building2, 
  FileText, 
  X, 
  Check, 
  ShieldCheck, 
  Stethoscope, 
  Sparkles,
  Radio
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const Register = ({ initialEmail = '', onSwitchToLogin }) => {
  const { register } = useAuth();
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState(initialEmail || '');
  const [hospital, setHospital] = useState('');
  const [role, setRole] = useState('Obstetrician & Gynecologist');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [protocolModalOpen, setProtocolModalOpen] = useState(false);

  useEffect(() => {
    if (initialEmail) {
      setEmail(initialEmail);
    }
  }, [initialEmail]);

  const calculateStrength = (pass) => {
    if (!pass) return { score: 0, label: 'Empty', color: 'bg-obsidian-750' };
    let score = 0;
    if (pass.length >= 6) score += 1;
    if (pass.length >= 8) score += 1;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 1;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 1;

    if (score <= 1) return { score: 1, label: 'Weak', color: 'bg-rose-500', width: 'w-1/4' };
    if (score === 2) return { score: 2, label: 'Fair', color: 'bg-vital-amber', width: 'w-2/4' };
    if (score === 3) return { score: 3, label: 'Good', color: 'bg-vital-coral', width: 'w-3/4' };
    return { score: 4, label: 'Strong', color: 'bg-vital-sage', width: 'w-full' };
  };

  const strength = calculateStrength(password);
  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;
  const validateEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please provide your full legal practitioner name and medical credentials.');
      return;
    }
    if (!validateEmail(email)) {
      setError('Please enter a valid institutional medical email.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (!agreedToTerms) {
      setError('You must acknowledge and accept the Clinical Decision Support Protocol to continue.');
      return;
    }

    setLoading(true);
    try {
      const combinedRole = hospital.trim() ? `${role} (${hospital.trim()})` : role;
      await register({ name, email, password, role: combinedRole });
    } catch (err) {
      setError(err.response?.data?.detail || 'Registration failed. Please check credentials or contact unit IT.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-950 text-stone-100 flex flex-col justify-center py-10 px-4 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-vital-coral selection:text-white">
      {/* Subtle Warm Glow */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-vital-coral/[0.04] blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-vital-amber/[0.03] blur-[140px] pointer-events-none" />

      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 items-center relative z-10">
        
        {/* Left Column: Clinical Credentialing Overview (Desktop) */}
        <div className="hidden lg:flex lg:col-span-5 flex-col justify-between space-y-8 pr-4">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-obsidian-850 border border-white/10 text-stone-300 text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-vital-sage" />
              <span>Medical Practitioner Verification</span>
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
              Empowering obstetricians with <span className="italic text-vital-coral">objective biophysical telemetry</span>.
            </h2>

            <p className="text-sm text-stone-400 font-sans leading-relaxed">
              Create a certified clinical account to access 21-parameter machine learning CTG interpretation, automated risk stratification, and patient longitudinal tracking.
            </p>
          </div>

          {/* 3-Step Verification Ledger Card */}
          <div className="p-4 rounded-xl bg-obsidian-900 border border-white/[0.08] shadow-warm-card space-y-3">
            <span className="font-mono text-[10px] uppercase tracking-wider text-stone-400">
              Practitioner Onboarding Sequence
            </span>

            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded bg-vital-coral/15 text-vital-coral font-mono font-bold flex items-center justify-center shrink-0 border border-vital-coral/30 text-[10px]">
                  1
                </div>
                <div>
                  <p className="font-medium text-stone-200">Physician & Hospital Identity</p>
                  <p className="text-stone-400 text-[11px]">Enrolled under hospital institutional domain.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded bg-vital-coral/15 text-vital-coral font-mono font-bold flex items-center justify-center shrink-0 border border-vital-coral/30 text-[10px]">
                  2
                </div>
                <div>
                  <p className="font-medium text-stone-200">Department Alignment</p>
                  <p className="text-stone-400 text-[11px]">Specialized for OB/GYN, MFM, and L&D nurses.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 text-xs">
                <div className="w-5 h-5 rounded bg-vital-coral/15 text-vital-coral font-mono font-bold flex items-center justify-center shrink-0 border border-vital-coral/30 text-[10px]">
                  3
                </div>
                <div>
                  <p className="font-medium text-stone-200">Telemetry & AI Explanations</p>
                  <p className="text-stone-400 text-[11px]">Immediate access to live assessment suite.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-stone-400 font-mono">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-vital-sage" />
              FIGO 2015 Guidelines
            </span>
            <span>•</span>
            <span>Gemini 2.5 Flash</span>
          </div>
        </div>

        {/* Right Column: Registration Form */}
        <div className="lg:col-span-7 w-full">
          
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <div className="inline-flex p-3 rounded-xl bg-obsidian-850 border border-white/10 text-vital-coral mb-2">
              <HeartPulse className="w-7 h-7" />
            </div>
            <h1 className="font-serif text-2xl font-normal text-stone-100">
              Fetal<span className="italic text-vital-rose">Care</span> Telemetry
            </h1>
            <p className="text-xs text-stone-400 mt-0.5">Practitioner Registration & Credentialing</p>
          </div>

          <div className="bg-obsidian-900 rounded-xl shadow-warm-card border border-white/[0.08] p-6 sm:p-8 relative">
            
            {/* Form Title */}
            <div className="flex items-center justify-between mb-5 pb-4 border-b border-white/[0.06]">
              <div>
                <h2 className="font-serif text-xl text-stone-100 font-normal">Clinician Registration</h2>
                <p className="text-xs text-stone-400 mt-0.5 font-sans">Establish authorized institutional access</p>
              </div>
              <span className="font-mono text-[10px] text-stone-400 bg-obsidian-850 px-2.5 py-1 rounded border border-white/10 flex items-center gap-1">
                <Stethoscope className="w-3 h-3 text-vital-coral" />
                Medical Staff
              </span>
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
              
              {/* Name & Hospital Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Full Name & Title <span className="text-vital-coral">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-500 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      required
                      autoComplete="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Dr. Sarah Jenkins, MD"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-vital-coral focus:border-vital-coral transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Institutional Email <span className="text-vital-coral">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="email"
                      required
                      inputMode="email"
                      autoComplete="username"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="s.jenkins@maternity.org"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-vital-coral focus:border-vital-coral transition font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Hospital Affiliation & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Medical Center / Hospital
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-stone-500 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type="text"
                      value={hospital}
                      onChange={(e) => setHospital(e.target.value)}
                      placeholder="St. Jude Maternity Hospital"
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-vital-coral focus:border-vital-coral transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Clinical Role / Specialty <span className="text-vital-coral">*</span>
                  </label>
                  <div className="relative">
                    <Shield className="w-4 h-4 text-stone-500 absolute left-3.5 top-3 pointer-events-none" />
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral focus:border-vital-coral transition cursor-pointer"
                    >
                      <option value="Obstetrician & Gynecologist">Obstetrician & Gynecologist</option>
                      <option value="Maternal-Fetal Medicine Specialist">Maternal-Fetal Medicine Specialist</option>
                      <option value="Labor & Delivery Nurse / Midwife">Labor & Delivery Nurse / Midwife</option>
                      <option value="Obstetric Resident / Fellow">Obstetric Resident / Fellow</option>
                      <option value="Perinatal Clinical Researcher">Perinatal Clinical Researcher</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Password & Confirm */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Password <span className="text-vital-coral">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min. 6 characters"
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-vital-coral focus:border-vital-coral transition font-mono"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {password.length > 0 && (
                    <div className="mt-1.5 space-y-1">
                      <div className="h-1 w-full bg-obsidian-850 rounded-full overflow-hidden">
                        <div className={`h-full ${strength.width} ${strength.color} transition-all duration-300`} />
                      </div>
                      <div className="flex justify-between text-[10px] font-mono text-stone-400">
                        <span>Strength: {strength.label}</span>
                        <span>{password.length >= 6 ? '✓ Meets min' : 'Must be ≥6 chars'}</span>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1.5">
                    Confirm Password <span className="text-vital-coral">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3 pointer-events-none" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      required
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter password"
                      className={`w-full pl-10 pr-10 py-2.5 text-xs rounded-lg bg-obsidian-950 border text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 transition font-mono ${
                        passwordsMatch
                          ? 'border-vital-sage focus:ring-vital-sage'
                          : passwordsMismatch
                          ? 'border-rose-500 focus:ring-rose-500'
                          : 'border-white/10 focus:ring-vital-coral'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-2.5 text-stone-500 hover:text-stone-300"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>

                  {confirmPassword.length > 0 && (
                    <div className="mt-1.5 text-[10px] font-mono flex items-center gap-1">
                      {passwordsMatch ? (
                        <span className="text-vital-sage flex items-center gap-1">
                          <Check className="w-3 h-3" /> Passwords match
                        </span>
                      ) : (
                        <span className="text-rose-400 flex items-center gap-1">
                          <X className="w-3 h-3" /> Passwords do not match
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Protocol Agreement */}
              <div className="pt-2">
                <label className="flex items-start gap-2.5 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={agreedToTerms}
                    onChange={(e) => setAgreedToTerms(e.target.checked)}
                    className="mt-0.5 w-3.5 h-3.5 rounded bg-obsidian-950 border-white/20 text-vital-coral focus:ring-vital-coral/40 cursor-pointer shrink-0"
                  />
                  <span className="text-xs text-stone-400 leading-snug">
                    I acknowledge this platform provides clinical decision support telemetry and does not replace primary physician diagnosis.{' '}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setProtocolModalOpen(true);
                      }}
                      className="text-vital-coral hover:underline font-medium"
                    >
                      Read Protocol Guidelines
                    </button>
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading || !agreedToTerms || passwordsMismatch}
                className="w-full mt-3 py-2.5 px-4 rounded-lg bg-vital-coral hover:bg-vital-coral/90 text-white text-xs font-semibold shadow-vital-glow flex items-center justify-center gap-2 transition active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Configuring Clinician Account...</span>
                  </>
                ) : (
                  <>
                    <span>Complete Clinician Registration</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Switch to Login */}
            <div className="mt-6 pt-4 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-stone-400">
              <span>Already registered as a provider?</span>
              <button
                type="button"
                onClick={() => onSwitchToLogin && onSwitchToLogin(email)}
                className="font-medium text-vital-coral hover:underline flex items-center gap-1"
              >
                <span>Sign in here</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          <p className="text-center text-[10px] font-mono text-stone-500 mt-5">
            FIGO Consensus Standard • AI Assisted Telemetry • v2.4.0
          </p>
        </div>
      </div>

      {/* Protocol Modal */}
      {protocolModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-obsidian-900 border border-white/10 rounded-xl max-w-lg w-full p-6 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setProtocolModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-vital-coral/10 text-vital-coral border border-vital-coral/20">
                <FileText className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-serif text-base text-stone-100">Clinical Protocol & Scope of Use</h3>
                <p className="text-[11px] text-stone-400 font-mono">FIGO 2015 Guideline Standards</p>
              </div>
            </div>

            <div className="space-y-4 text-xs text-stone-300 leading-relaxed">
              <div className="p-3 rounded-lg bg-vital-amber/10 border border-vital-amber/20 text-stone-200">
                <p className="font-medium text-vital-amber mb-1">Advisory Clinical Support</p>
                <p>
                  This system is an artificial intelligence decision-support tool. It assists qualified healthcare providers in identifying suspicious or pathological cardiotocographic patterns. It is not an automated diagnostic substitute.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-stone-100 mb-1">1. Physician Interpretation & Corroboration</h4>
                <p>
                  All predictive outputs must be evaluated in conjunction with maternal clinical history, uterine contraction monitoring, gestational maturity, and labor progression.
                </p>
              </div>

              <div>
                <h4 className="font-medium text-stone-100 mb-1">2. Standardization</h4>
                <p>
                  Biophysical parameter classifications conform with the International Federation of Gynecology and Obstetrics (FIGO) 2015 guidelines.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setAgreedToTerms(true);
                  setProtocolModalOpen(false);
                }}
                className="px-4 py-2 rounded-lg bg-vital-coral hover:bg-vital-coral/90 text-white text-xs font-semibold"
              >
                Accept & Acknowledge
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
