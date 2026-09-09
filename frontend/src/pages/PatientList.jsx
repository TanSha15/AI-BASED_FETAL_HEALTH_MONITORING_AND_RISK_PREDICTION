import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  Activity,
  Trash2,
  AlertCircle,
  X,
  Phone,
  Calendar,
  Heart,
  ChevronRight,
  Radio
} from 'lucide-react';
import { patientService } from '../services/api';
import { RiskBadge } from '../components/RiskBadge';

export const PatientList = ({ onSelectPatient, onStartAssessmentForPatient }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: 26,
    pregnancy_week: 32,
    contact: '',
    blood_group: 'O+',
    medical_history: '',
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const data = await patientService.getPatients();
      setPatients(data);
    } catch (err) {
      console.error("Failed to load patients:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePatient = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      await patientService.createPatient(formData);
      setModalOpen(false);
      setFormData({
        name: '',
        age: 26,
        pregnancy_week: 32,
        contact: '',
        blood_group: 'O+',
        medical_history: '',
        notes: '',
      });
      loadPatients();
    } catch (err) {
      setError(err.response?.data?.detail || "Could not register patient.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, name, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to remove patient record for ${name}?`)) {
      try {
        await patientService.deletePatient(id);
        setPatients(patients.filter(p => p.id !== id));
      } catch (err) {
        alert("Failed to delete patient.");
      }
    }
  };

  const filteredPatients = patients.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.contact && p.contact.includes(search))
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-obsidian-900 rounded-xl p-5 border border-white/[0.08] shadow-warm-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Radio className="w-3.5 h-3.5 text-vital-coral" />
            <span className="font-mono text-[10px] text-stone-400 uppercase tracking-wider">
              Maternal Patient Census
            </span>
          </div>
          <h2 className="font-serif text-xl sm:text-2xl font-normal text-stone-100">
            Obstetric Directory & Clinical Cohort
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            Registered pregnant patients under continuous or periodic cardiotocographic surveillance
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2.5 bg-vital-coral hover:bg-vital-coral/90 text-white rounded-lg text-xs font-semibold shadow-vital-glow flex items-center justify-center gap-2 transition shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Enroll New Patient</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="w-4 h-4 text-stone-500 absolute left-3.5 top-3 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter cohort by patient name, MRN, or clinical contact..."
          className="w-full pl-10 pr-4 py-2.5 text-xs font-mono rounded-lg bg-obsidian-900 border border-white/[0.08] text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-vital-coral shadow-warm-card"
        />
      </div>

      {/* Patients Table Card */}
      <div className="bg-obsidian-900 rounded-xl border border-white/[0.08] shadow-warm-card overflow-hidden">
        {loading ? (
          <div className="py-12 text-center text-stone-400 font-mono text-xs">
            Querying clinical database...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="py-12 text-center text-stone-500 font-mono text-xs space-y-2">
            <p>No matching patient records found.</p>
            <button
              onClick={() => setModalOpen(true)}
              className="text-vital-coral hover:underline"
            >
              Enroll a new patient →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto scrollbar-none">
            <table className="w-full text-left text-xs min-w-[700px]">
              <thead>
                <tr className="border-b border-white/[0.06] font-mono text-[10px] text-stone-400 uppercase tracking-wider bg-obsidian-950/40">
                  <th className="py-3 px-4 font-medium">Patient Details</th>
                  <th className="py-3 px-4 font-medium">Gestation</th>
                  <th className="py-3 px-4 font-medium">Blood Group</th>
                  <th className="py-3 px-4 font-medium">Contact</th>
                  <th className="py-3 px-4 font-medium">Assessments</th>
                  <th className="py-3 px-4 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {filteredPatients.map((patient) => (
                  <tr
                    key={patient.id}
                    onClick={() => onSelectPatient && onSelectPatient(patient)}
                    className="hover:bg-white/[0.015] cursor-pointer transition"
                  >
                    <td className="py-3 px-4">
                      <p className="font-serif text-sm font-medium text-stone-100">{patient.name}</p>
                      <p className="font-mono text-[10px] text-stone-500">MRN: {patient.id.slice(0, 8)} • Age {patient.age}y</p>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-300">
                      Week {patient.pregnancy_week}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-400">
                      <span className="px-2 py-0.5 rounded bg-obsidian-950 border border-white/10 text-stone-300 text-[10px]">
                        {patient.blood_group || 'O+'}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-400 text-[11px]">
                      {patient.contact || 'None listed'}
                    </td>
                    <td className="py-3 px-4 font-mono text-stone-300">
                      {patient.assessment_count || 0} exams
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onStartAssessmentForPatient) onStartAssessmentForPatient(patient);
                        }}
                        className="px-2.5 py-1 rounded bg-vital-coral/15 text-vital-coral hover:bg-vital-coral/25 text-[11px] font-mono border border-vital-coral/30 transition"
                      >
                        + CTG Exam
                      </button>
                      <button
                        onClick={(e) => handleDelete(patient.id, patient.name, e)}
                        className="p-1 rounded text-stone-500 hover:text-rose-400 hover:bg-rose-950/30 transition"
                        title="Delete record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New Patient Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-obsidian-900 border border-white/10 rounded-xl max-w-md w-full p-6 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-4 right-4 text-stone-400 hover:text-stone-200"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <h3 className="font-serif text-lg text-stone-100 font-normal">Enroll Obstetric Patient</h3>
              <p className="text-xs text-stone-400">Register new maternal record for longitudinal monitoring</p>
            </div>

            {error && (
              <div className="p-3 mb-4 rounded-lg bg-rose-950/40 text-rose-200 text-xs border border-rose-900/60 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleCreatePatient} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Patient Full Name <span className="text-vital-coral">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Eleanor Vance"
                  className="w-full px-3 py-2 text-xs rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Maternal Age <span className="text-vital-coral">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="14"
                    max="60"
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 26 })}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Gestation (Week) <span className="text-vital-coral">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="44"
                    value={formData.pregnancy_week}
                    onChange={(e) => setFormData({ ...formData, pregnancy_week: parseInt(e.target.value) || 32 })}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Blood Group
                  </label>
                  <select
                    value={formData.blood_group}
                    onChange={(e) => setFormData({ ...formData, blood_group: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-stone-300 mb-1">
                    Contact / Phone
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    placeholder="e.g. +1 (555) 019-2834"
                    className="w-full px-3 py-2 text-xs font-mono rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 focus:outline-none focus:ring-1 focus:ring-vital-coral"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-300 mb-1">
                  Obstetric / Medical History
                </label>
                <textarea
                  rows="2"
                  value={formData.medical_history}
                  onChange={(e) => setFormData({ ...formData, medical_history: e.target.value })}
                  placeholder="e.g. G2P1, mild gestational hypertension at 30 weeks..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-obsidian-950 border border-white/10 text-stone-100 placeholder-stone-600 focus:outline-none focus:ring-1 focus:ring-vital-coral"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="w-1/2 py-2 rounded-lg bg-obsidian-800 hover:bg-obsidian-750 text-stone-300 text-xs font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2 rounded-lg bg-vital-coral hover:bg-vital-coral/90 text-white text-xs font-semibold shadow-vital-glow transition disabled:opacity-50"
                >
                  {submitting ? 'Enrolling...' : 'Enroll Patient'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
