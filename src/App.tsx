/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { DashboardSiswa } from './components/DashboardSiswa';
import { MissionList } from './components/Missions/MissionList';
import { AITutor } from './components/Tutor/AITutor';
import { SmartQuiz } from './components/Quiz/SmartQuiz';
import { CreatorStudio } from './components/Creator/CreatorStudio';
import { ReflectionView } from './components/Reflection/ReflectionView';
import { TeacherDashboard } from './components/Teacher/TeacherDashboard';
import { Compass, BookOpen, Sparkles, GraduationCap } from 'lucide-react';

const MainContent: React.FC = () => {
  const { role, activeNavTab } = useApp();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      {role === 'siswa' && (
        <>
          {activeNavTab === 'dashboard' && <DashboardSiswa />}
          {activeNavTab === 'missions' && <MissionList />}
          {activeNavTab === 'tutor' && <AITutor />}
          {activeNavTab === 'quiz' && <SmartQuiz />}
          {activeNavTab === 'creator' && <CreatorStudio />}
          {activeNavTab === 'reflection' && <ReflectionView />}
        </>
      )}

      {role === 'guru' && <TeacherDashboard />}
    </main>
  );
};

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500 selection:text-white">
        <Header />
        <Navigation />
        <div className="flex-1">
          <MainContent />
        </div>

        {/* Footer */}
        <footer className="mt-auto bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-black text-xs">
                AI
              </div>
              <span className="font-bold text-slate-800">
                AI LEARNING ADVENTURE — Informatika SMK Kelas X
              </span>
            </div>
            <p className="text-slate-500 text-[11px]">
              Dirancang untuk Kurikulum Merdeka • Berbasis Misi, Gamifikasi, Scaffolding AI Tutor, dan Evaluasi Guru.
            </p>
          </div>
        </footer>
      </div>
    </AppProvider>
  );
}
