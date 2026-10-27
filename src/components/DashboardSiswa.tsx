import React from 'react';
import {
  Sparkles,
  Trophy,
  CheckCircle2,
  HelpCircle,
  ArrowRight,
  Compass,
  Bot,
  Brain,
  ShieldCheck,
  Cpu,
  GitBranch,
  Scale,
  Rocket,
  Flame,
  Award,
  BookOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DashboardSiswa: React.FC = () => {
  const { student, missions, setActiveNavTab, setActiveMissionId } = useApp();

  // Find next uncompleted mission
  const nextMission = missions.find((m) => !student.completedMissionIds.includes(m.id)) || missions[0];

  // Calculate average quiz score
  const avgQuizScore =
    student.quizAttempts.length > 0
      ? Math.round(
          student.quizAttempts.reduce((acc, curr) => acc + curr.scorePercentage, 0) /
            student.quizAttempts.length
        )
      : 0;

  // Calculate XP threshold for next level
  let currentLevelMin = 0;
  let nextLevelTarget = 600;
  if (student.levelNumber === 2) {
    currentLevelMin = 600;
    nextLevelTarget = 1200;
  } else if (student.levelNumber === 3) {
    currentLevelMin = 1200;
    nextLevelTarget = 2000;
  }
  const levelProgressPercent = Math.min(
    Math.round(((student.xp - currentLevelMin) / (nextLevelTarget - currentLevelMin)) * 100),
    100
  );

  // Topics mastery calculation
  const topics = [
    { name: 'Perangkat TIK & Hardware', completedMissions: student.completedMissionIds.filter((id) => id === 'misi-1').length, total: 1 },
    { name: 'Berpikir Komputasional', completedMissions: student.completedMissionIds.filter((id) => id === 'misi-2').length, total: 1 },
    { name: 'Algoritma & Pemrograman', completedMissions: student.completedMissionIds.filter((id) => id === 'misi-3').length, total: 1 },
    { name: 'Keamanan Siber & Privasi', completedMissions: student.completedMissionIds.filter((id) => id === 'misi-4').length, total: 1 },
    { name: 'Etika AI & Inovasi Sekolah', completedMissions: student.completedMissionIds.filter((id) => id === 'misi-5' || id === 'misi-6').length, total: 2 },
  ];

  const getBadgeIcon = (iconName: string) => {
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
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-6 sm:p-8 shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute right-20 top-0 w-48 h-48 bg-indigo-500/20 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-indigo-500/30 border border-indigo-400/30 text-indigo-200 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
            <span>Informatika SMK Kurikulum Merdeka</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Selamat Datang, <span className="text-cyan-300">{student.name}</span>! 🚀
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 leading-relaxed">
            Jelajahi petualangan digital kelas X. Taklukkan misi berpikir komputasional, berdialog
            dengan AI Tutor, asah kemampuan kuis cerdas, dan ciptakan karya digital membanggakan!
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setActiveMissionId(nextMission.id);
                setActiveNavTab('missions');
              }}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 flex items-center space-x-2 transition-transform active:scale-95"
            >
              <Compass className="w-4 h-4" />
              <span>Lanjutkan Petualangan (Misi {nextMission.number})</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </button>

            <button
              type="button"
              onClick={() => setActiveNavTab('tutor')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm backdrop-blur-xs border border-white/10 flex items-center space-x-2 transition-colors"
            >
              <Bot className="w-4 h-4 text-cyan-300" />
              <span>Tanya AI Tutor</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Key Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {/* Total XP Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total XP
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {student.xp.toLocaleString('id-ID')}
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center space-x-1">
            <Flame className="w-3.5 h-3.5 text-amber-500" />
            <span>Streak {student.dailyStreak} hari belajar</span>
          </div>
        </div>

        {/* Level Card */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Level Petualang
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-xl sm:text-2xl font-extrabold text-slate-900 truncate">
            Lv.{student.levelNumber} {student.levelTitle}
          </div>
          <div className="mt-2.5">
            <div className="flex justify-between text-[11px] font-medium text-slate-500 mb-1">
              <span>Progress Lv.{student.levelNumber + 1}</span>
              <span>{Math.max(0, levelProgressPercent)}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
              <div
                className="bg-indigo-600 h-1.5 rounded-full transition-all duration-500"
                style={{ width: `${Math.max(5, Math.min(100, levelProgressPercent))}%` }}
              />
            </div>
          </div>
        </div>

        {/* Missions Completed */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Misi Selesai
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {student.completedMissionIds.length}{' '}
            <span className="text-sm font-normal text-slate-500">/ {missions.length}</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 font-semibold">
            {Math.round((student.completedMissionIds.length / missions.length) * 100)}% Capaian Kurikulum
          </div>
        </div>

        {/* Avg Quiz Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rata-rata Kuis
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center">
              <HelpCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900">
            {avgQuizScore}%
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {student.quizAttempts.length} sesi kuis telah dikerjakan
          </div>
        </div>
      </div>

      {/* Main Grid: Continue Adventure + Quick Feature Hub */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): Next Mission Spotlight + Topic Progress */}
        <div className="lg:col-span-2 space-y-6">
          {/* Continue Card */}
          <div className="bg-gradient-to-br from-indigo-50 via-white to-cyan-50/50 rounded-3xl p-6 border border-indigo-100 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-indigo-600 text-white">
                  Misi Berikutnya
                </span>
                <span className="text-xs text-slate-500">{nextMission.level}</span>
              </div>
              <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200">
                +{nextMission.xpReward} XP
              </span>
            </div>

            <h3 className="mt-4 text-xl font-bold text-slate-900">
              Misi {nextMission.number}: {nextMission.title}
            </h3>
            <p className="mt-1 text-sm text-slate-600">{nextMission.subtitle}</p>

            <div className="mt-4 bg-white/80 p-3.5 rounded-2xl border border-slate-200/80 text-xs text-slate-700">
              <div className="font-semibold text-slate-900 mb-1">Studi Kasus Ringkas:</div>
              <p className="italic text-slate-600">"{nextMission.contextualCase.scenario}"</p>
            </div>

            <div className="mt-5 flex items-center justify-between pt-2">
              <div className="text-xs text-slate-500">
                Estimasi Waktu: ~{nextMission.estimatedMinutes} Menit
              </div>
              <button
                type="button"
                onClick={() => {
                  setActiveMissionId(nextMission.id);
                  setActiveNavTab('missions');
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 flex items-center space-x-2 transition-all"
              >
                <span>Buka Misi Ini</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Kurikulum Merdeka Topic Progress */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
                <BookOpen className="w-5 h-5 text-indigo-600" />
                <span>Penguasaan Materi Informatika Kelas X</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium">Berdasarkan Aktivitas Nyata</span>
            </div>

            <div className="space-y-4">
              {topics.map((t, idx) => {
                const percent = Math.round((t.completedMissions / t.total) * 100);
                return (
                  <div key={idx} className="space-y-1.5">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-800">{t.name}</span>
                      <span className="text-indigo-600">{percent}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-700 ${
                          percent === 100
                            ? 'bg-emerald-500'
                            : percent > 0
                            ? 'bg-indigo-600'
                            : 'bg-slate-300'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Badges & Smart Recommendations */}
        <div className="space-y-6">
          {/* Quick Hub Buttons */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-slate-900 mb-2">Akses Cepat Belajar</h3>

            <button
              onClick={() => setActiveNavTab('tutor')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 hover:border-indigo-200 text-left flex items-center space-x-3 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Bot className="w-5 h-5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900">AI Tutor Informatika</div>
                <div className="text-slate-500">Scaffolding & bimbingan materi</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600" />
            </button>

            <button
              onClick={() => setActiveNavTab('quiz')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-cyan-50/70 border border-slate-200/80 hover:border-cyan-200 text-left flex items-center space-x-3 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-100 text-cyan-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900">Smart Quiz Interaktif</div>
                <div className="text-slate-500">Bank soal & evaluasi adaptif</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-cyan-600" />
            </button>

            <button
              onClick={() => setActiveNavTab('creator')}
              className="w-full p-3 rounded-2xl bg-slate-50 hover:bg-purple-50/70 border border-slate-200/80 hover:border-purple-200 text-left flex items-center space-x-3 transition-colors group"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="flex-1 text-xs">
                <div className="font-bold text-slate-900">Creator Studio</div>
                <div className="text-slate-500">Rancang naskah & karya digital</div>
              </div>
              <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600" />
            </button>
          </div>

          {/* Badges Collection */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Koleksi Lencana ({student.badges.length})</span>
              </h3>
            </div>

            {student.badges.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">
                Belum ada lencana. Selesaikan misi untuk meraih lencana pertamamu!
              </p>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {student.badges.map((b) => (
                  <div
                    key={b.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col items-center text-center space-y-1.5"
                    title={b.description}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white shadow-xs flex items-center justify-center">
                      {getBadgeIcon(b.icon)}
                    </div>
                    <div className="font-bold text-xs text-slate-900 leading-tight">{b.name}</div>
                    <div className="text-[10px] text-slate-500">Diperoleh {b.earnedAt}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Smart Recommendation Box */}
          <div className="bg-amber-50/70 rounded-3xl p-5 border border-amber-200 text-xs">
            <div className="font-bold text-amber-900 flex items-center space-x-1.5 mb-1.5">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Rekomendasi Petualangan Hari Ini</span>
            </div>
            <p className="text-amber-800 leading-relaxed">
              Berdasarkan capaianmu, coba buka <strong>AI Tutor</strong> pada mode <em>"Uji Pemahaman Saya"</em> untuk materi Berpikir Komputasional sebelum mengerjakan Smart Quiz!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
