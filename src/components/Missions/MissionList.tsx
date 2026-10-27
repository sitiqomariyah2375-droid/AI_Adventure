import React, { useState } from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Cpu,
  Brain,
  GitBranch,
  ShieldCheck,
  Scale,
  Rocket,
  Award,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Mission } from '../../types';
import { MissionDetailModal } from './MissionDetailModal';

export const MissionList: React.FC = () => {
  const { missions, student, activeMissionId, setActiveMissionId } = useApp();
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);

  // If activeMissionId set from elsewhere, trigger selection
  React.useEffect(() => {
    if (activeMissionId) {
      const found = missions.find((m) => m.id === activeMissionId);
      if (found) {
        setSelectedMission(found);
      }
    }
  }, [activeMissionId, missions]);

  const filteredMissions = missions.filter((m) => {
    if (filterLevel === 'all') return true;
    return m.level.includes(filterLevel);
  });

  const getMissionIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu':
        return <Cpu className="w-5 h-5 text-indigo-600" />;
      case 'Brain':
        return <Brain className="w-5 h-5 text-purple-600" />;
      case 'GitBranch':
        return <GitBranch className="w-5 h-5 text-blue-600" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-5 h-5 text-emerald-600" />;
      case 'Scale':
        return <Scale className="w-5 h-5 text-amber-600" />;
      case 'Rocket':
        return <Rocket className="w-5 h-5 text-rose-600" />;
      default:
        return <Award className="w-5 h-5 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <Compass className="w-4 h-4" />
            <span>AI Mission — Petualangan Pembelajaran</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Misi Informatika SMK Kelas X
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
            Selesaikan misi berbasis skenario nyata di lab dan industri. Selesaikan tantangan
            interaktif bertahap untuk membuka lencana dan mengumpulkan XP!
          </p>
        </div>

        {/* Level Filters */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-2xl border border-slate-200 self-start md:self-auto text-xs font-semibold">
          <button
            type="button"
            onClick={() => setFilterLevel('all')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterLevel === 'all'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Semua ({missions.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterLevel('Explorer')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterLevel === 'Explorer'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lv.1 Explorer
          </button>
          <button
            type="button"
            onClick={() => setFilterLevel('Problem Solver')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterLevel === 'Problem Solver'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lv.2 Solver
          </button>
          <button
            type="button"
            onClick={() => setFilterLevel('Digital Innovator')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterLevel === 'Digital Innovator'
                ? 'bg-white text-indigo-700 font-bold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Lv.3 Innovator
          </button>
        </div>
      </div>

      {/* Missions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredMissions.map((mission) => {
          const isCompleted = student.completedMissionIds.includes(mission.id);

          return (
            <div
              key={mission.id}
              className={`rounded-3xl p-6 border transition-all flex flex-col justify-between relative overflow-hidden group ${
                isCompleted
                  ? 'bg-gradient-to-b from-emerald-50/50 via-white to-white border-emerald-200 shadow-xs'
                  : 'bg-white border-slate-200 shadow-xs hover:shadow-md hover:border-indigo-200'
              }`}
            >
              {/* Card Header Top */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center">
                      {getMissionIcon(mission.badge.icon)}
                    </span>
                    <span className="text-[11px] font-bold text-slate-500">{mission.level}</span>
                  </div>

                  {isCompleted ? (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Selesai</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                      <span>Tersedia</span>
                    </span>
                  )}
                </div>

                <div className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">
                  Misi {mission.number} • {mission.topic}
                </div>

                <h3 className="mt-1.5 text-base sm:text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {mission.title}
                </h3>

                <p className="mt-2 text-xs text-slate-600 line-clamp-2">{mission.subtitle}</p>

                {/* Skenario preview */}
                <div className="mt-3.5 bg-slate-50 p-3 rounded-xl border border-slate-200/80 text-[11px] text-slate-600">
                  <span className="font-bold text-slate-800">Kasus: </span>
                  <span className="line-clamp-2">{mission.contextualCase.scenario}</span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                <div className="flex items-center space-x-3 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>~{mission.estimatedMinutes}m</span>
                  </span>
                  <span className="flex items-center space-x-1 font-bold text-amber-600">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>+{mission.xpReward} XP</span>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedMission(mission)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-all ${
                    isCompleted
                      ? 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs'
                  }`}
                >
                  <span>{isCompleted ? 'Pelajari Ulang' : 'Mulai Misi'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mission Detail Modal */}
      {selectedMission && (
        <MissionDetailModal
          mission={selectedMission}
          onClose={() => {
            setSelectedMission(null);
            setActiveMissionId(null);
          }}
        />
      )}
    </div>
  );
};
