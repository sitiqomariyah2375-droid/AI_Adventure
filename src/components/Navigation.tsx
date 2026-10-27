import React from 'react';
import {
  LayoutDashboard,
  Compass,
  Bot,
  HelpCircle,
  Sparkles,
  ClipboardCheck,
  Users,
  MessageSquareQuote,
  Database,
  FileSpreadsheet,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  highlight?: boolean;
}

export const Navigation: React.FC = () => {
  const { role, activeNavTab, setActiveNavTab, student } = useApp();

  const siswaNavItems: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'missions',
      label: 'AI Mission',
      icon: Compass,
      badge: `${student.completedMissionIds.length}/6`,
    },
    { id: 'tutor', label: 'AI Tutor', icon: Bot, highlight: true },
    { id: 'quiz', label: 'Smart Quiz', icon: HelpCircle },
    { id: 'creator', label: 'Creator Studio', icon: Sparkles },
    { id: 'reflection', label: 'Refleksi', icon: ClipboardCheck },
  ];

  const guruNavItems: NavItem[] = [
    { id: 'teacher_dashboard', label: 'Ringkasan & Analitik', icon: LayoutDashboard },
    { id: 'teacher_reviews', label: 'Tinjau Siswa & Refleksi', icon: MessageSquareQuote },
    { id: 'teacher_bank', label: 'Misi & Bank Soal', icon: Database },
    { id: 'teacher_export', label: 'Ekspor Laporan CSV', icon: FileSpreadsheet },
  ];

  const activeItems = role === 'siswa' ? siswaNavItems : guruNavItems;

  return (
    <nav className="bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2.5 no-scrollbar">
          {activeItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeNavTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveNavTab(item.id)}
                className={`flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-500/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.badge && (
                  <span
                    className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-indigo-700 text-white' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
                {item.highlight && !isActive && (
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
