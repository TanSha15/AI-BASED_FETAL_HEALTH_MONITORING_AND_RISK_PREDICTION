import React, { useState } from 'react';
import { AuthProvider, useAuth } from './hooks/useAuth';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Dashboard } from './pages/Dashboard';
import { PatientList } from './pages/PatientList';
import { PatientDetail } from './pages/PatientDetail';
import { NewAssessment } from './pages/NewAssessment';
import { AssessmentResult } from './pages/AssessmentResult';
import { AssessmentHistory } from './pages/AssessmentHistory';
import { ModelInfo } from './pages/ModelInfo';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  const [currentTab, setCurrentTab] = useState('dashboard');
  
  // Navigation states
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [activeAssessment, setActiveAssessment] = useState(null);
  const [authEmail, setAuthEmail] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3 text-white text-sm">
          <div className="w-8 h-8 border-3 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <span>Initializing Fetal Health AI Platform...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated Flow
  if (!isAuthenticated) {
    if (authView === 'register') {
      return (
        <Register
          initialEmail={authEmail}
          onSwitchToLogin={(email) => {
            if (email) setAuthEmail(email);
            setAuthView('login');
          }}
        />
      );
    }
    return (
      <Login
        initialEmail={authEmail}
        onSwitchToRegister={(email) => {
          if (email) setAuthEmail(email);
          setAuthView('register');
        }}
      />
    );
  }

  // Authenticated Navigation Handlers
  const handleSelectPatient = (patient) => {
    setSelectedPatient(patient);
    setCurrentTab('patient-detail');
  };

  const handleStartAssessmentForPatient = (patient) => {
    setSelectedPatient(patient);
    setCurrentTab('new-assessment');
  };

  const handleAssessmentCompleted = (assessmentData) => {
    setActiveAssessment(assessmentData);
    setCurrentTab('assessment-result');
  };

  const handleSelectAssessmentFromHistory = (assessmentData) => {
    setActiveAssessment(assessmentData);
    setCurrentTab('assessment-result');
  };

  return (
    <DashboardLayout currentTab={currentTab} onNavigate={(tab) => setCurrentTab(tab)}>
      {currentTab === 'dashboard' && (
        <Dashboard
          onNavigate={setCurrentTab}
          onSelectAssessment={handleSelectAssessmentFromHistory}
        />
      )}

      {currentTab === 'patients' && (
        <PatientList
          onSelectPatient={handleSelectPatient}
          onStartAssessmentForPatient={handleStartAssessmentForPatient}
        />
      )}

      {currentTab === 'patient-detail' && (
        <PatientDetail
          patient={selectedPatient}
          onBack={() => setCurrentTab('patients')}
          onStartAssessment={handleStartAssessmentForPatient}
          onSelectAssessment={handleSelectAssessmentFromHistory}
        />
      )}

      {currentTab === 'new-assessment' && (
        <NewAssessment
          preselectedPatient={selectedPatient}
          onCompleteAssessment={handleAssessmentCompleted}
        />
      )}

      {currentTab === 'assessment-result' && (
        <AssessmentResult
          assessment={activeAssessment}
          onBack={() => setCurrentTab('history')}
          onNewAssessment={() => {
            setSelectedPatient(null);
            setCurrentTab('new-assessment');
          }}
        />
      )}

      {currentTab === 'history' && (
        <AssessmentHistory
          onSelectAssessment={handleSelectAssessmentFromHistory}
        />
      )}

      {currentTab === 'model-info' && (
        <ModelInfo />
      )}
    </DashboardLayout>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
