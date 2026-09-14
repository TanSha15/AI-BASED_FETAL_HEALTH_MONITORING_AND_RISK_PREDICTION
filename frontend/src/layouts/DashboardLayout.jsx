import React, { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  Activity,
  History,
  Info,
  LogOut,
  Plus,
  Menu,
  X,
  HeartPulse,
  Radio,
  Clock,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const DashboardLayout = ({ currentTab, onNavigate, children }) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Surveillance Overview', shortLabel: 'Overview', icon: LayoutDashboard },
    { id: 'patients', label: 'Maternal Census', shortLabel: 'Census', icon: Users },
    { id: 'new-assessment', label: 'New CTG Exam', shortLabel: 'New Exam', icon: Activity, primaryAction: true },
    { id: 'history', label: 'Assessment Ledger', shortLabel: 'Ledger', icon: History },
    { id: 'model-info', label: 'Decision Model', shortLabel: 'Model', icon: Info },
  ];

  return (
    <div className="min-h-screen bg-obsidian-950 text-stone-100 flex flex-col selection:bg-vital-coral selection:text-white">
      {/* Top Architectural Clinical Header */}
      <header className="bg-obsidian-900/95 border-b border-white/[0.07] sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left: Brand Identity & Telemetry Status */}
            <div className="flex items-center gap-4 sm:gap-6">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-obsidian-800 transition"
                aria-label="Toggle navigation"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

              <div
                onClick={() => onNavigate('dashboard')}
                className="flex items-center gap-3 cursor-pointer group select-none"
              >
                <div className="w-9 h-9 rounded-lg bg-obsidian-800 border border-white/10 flex items-center justify-center text-vital-coral shadow-inner group-hover:border-vital-coral/40 transition">
                  <HeartPulse className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-serif text-lg font-normal tracking-tight text-stone-100">
                      Fetal<span className="italic text-vital-rose">Care</span>
                    </span>
                  </div>
                  <p className="text-[10px] text-stone-400 font-sans tracking-wide hidden sm:block">
                    Cardiotocography Clinical Decision Telemetry
                  </p>
                </div>
              </div>

              {/* Station Context Marker (Desktop) */}
              <div className="hidden xl:flex items-center gap-2 pl-4 border-l border-white/[0.08] text-xs text-stone-400">
                <Radio className="w-3.5 h-3.5 text-vital-coral" />
                <span className="font-mono text-[11px] text-stone-300">Station 04 • L&D Unit</span>
              </div>
            </div>

            {/* Right: Quick Action & Clinician Profile */}
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={() => onNavigate('new-assessment')}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-vital-coral hover:bg-vital-coral/90 text-white text-xs font-semibold shadow-vital-glow transition active:scale-[0.98]"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Start CTG Exam</span>
                <span className="inline sm:hidden">Exam</span>
              </button>

              <div className="h-5 w-px bg-white/[0.08] hidden sm:block" />

              {/* Clinician Badge Card */}
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-obsidian-850 border border-white/10 flex items-center justify-center text-vital-rose font-mono text-xs font-bold shadow-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-xs font-medium text-stone-200 leading-tight truncate max-w-[140px]">
                    {user?.name || 'Dr. Clinician'}
                  </p>
                  <p className="text-[10px] font-mono text-stone-400 leading-tight truncate max-w-[140px]">
                    {user?.role || 'Obstetric Specialist'}
                  </p>
                </div>
                <button
                  onClick={logout}
                  title="Sign Out"
                  className="p-1.5 text-stone-400 hover:text-vital-coral rounded-lg hover:bg-obsidian-800 transition-colors ml-1"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Desktop Architectural Sub-Navigation Bar */}
          <nav className="hidden lg:flex items-center space-x-1 -mb-px border-t border-white/[0.05] overflow-x-auto scrollbar-none">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => onNavigate(item.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-xs font-medium transition-all relative border-b-2 whitespace-nowrap ${
                    isActive
                      ? 'border-vital-coral text-stone-100 font-semibold bg-white/[0.02]'
                      : 'border-transparent text-stone-400 hover:text-stone-200 hover:bg-white/[0.01]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-vital-coral' : 'text-stone-500'}`} />
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-vital-coral to-transparent" />
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 pb-24 md:pb-10">
        {children}
      </main>

      {/* Mobile Drawer (Slide-over) */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-50 lg:hidden bg-black/80 backdrop-blur-sm flex transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 max-w-[85vw] bg-obsidian-900 border-r border-white/10 p-5 shadow-2xl flex flex-col justify-between h-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-vital-coral/20 border border-vital-coral/30 flex items-center justify-center text-vital-coral">
                    <HeartPulse className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-serif text-base text-stone-100">Fetal<span className="italic text-vital-rose">Care</span></span>
                    <span className="text-[10px] text-stone-400 block -mt-1 font-mono">Telemetry Suite</span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-obsidian-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        onNavigate(item.id);
                        setMobileMenuOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition ${
                        isActive
                          ? 'bg-vital-coral/15 text-vital-coral border border-vital-coral/30 font-semibold'
                          : 'text-stone-300 hover:bg-obsidian-800 hover:text-stone-100'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-4 h-4 ${isActive ? 'text-vital-coral' : 'text-stone-400'}`} />
                        <span>{item.label}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 opacity-50" />
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-3">
              <div className="flex items-center gap-3 px-1">
                <div className="w-8 h-8 rounded-lg bg-obsidian-800 border border-white/10 flex items-center justify-center text-vital-rose font-mono text-xs font-bold">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'C'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-stone-200 truncate">{user?.name || 'Dr. Clinician'}</p>
                  <p className="text-[10px] font-mono text-stone-400 truncate">{user?.role || 'Obstetric Specialist'}</p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full py-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-stone-300 text-xs font-medium flex items-center justify-center gap-2 border border-white/5 transition"
              >
                <LogOut className="w-3.5 h-3.5 text-vital-coral" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Ergonomic Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-obsidian-900/95 border-t border-white/10 backdrop-blur-lg px-2 py-1.5 flex items-center justify-around shadow-2xl">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-lg transition text-[10px] font-medium ${
                isActive ? 'text-vital-coral' : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Icon className={`w-4 h-4 mb-0.5 ${isActive ? 'text-vital-coral' : 'text-stone-400'}`} />
              <span className="truncate max-w-[56px]">{item.shortLabel}</span>
            </button>
          );
        })}
      </div>

      {/* Footer with FIGO Clinical Consensus Standard */}
      <footer className="border-t border-white/[0.05] bg-obsidian-900/40 text-stone-500 text-[11px] py-4 mt-auto mb-12 lg:mb-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <ShieldCheck className="w-3.5 h-3.5 text-vital-sage" />
            <span>FIGO 2015 Intrapartum Fetal Monitoring Standard</span>
          </div>
          <p className="text-stone-400 text-center sm:text-right">
            Clinical Decision Support Prototype • Authorized Medical Staff Only
          </p>
        </div>
      </footer>
    </div>
  );
};
