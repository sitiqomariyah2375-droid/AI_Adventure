import React, { useState } from 'react';
import {
  Sparkles,
  Trophy,
  Flame,
  User,
  GraduationCap,
  BookOpen,
  Edit3,
  Check,
  X,
  Compass,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Header: React.FC = () => {
  const { role, setRole, student, updateStudent } = useApp();
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(student.name);
  const [editClass, setEditClass] = useState(student.gradeClass);
  const [editSchool, setEditSchool] = useState(student.school);
  const [editNisn, setEditNisn] = useState(student.nisn);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent({
      name: editName,
      gradeClass: editClass,
      school: editSchool,
      nisn: editNisn,
    });
    setIsEditingProfile(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18">
            {/* Logo and Tagline */}
            <div className="flex items-center space-x-3">
              <div className="w-11 h-11 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="font-extrabold text-xl tracking-tight text-slate-900">
                    AI LEARNING <span className="text-indigo-600">ADVENTURE</span>
                  </span>
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-cyan-100 text-cyan-800 border border-cyan-200">
                    SMK Kelas X
                  </span>
                </div>
                <p className="text-xs text-slate-500 hidden md:block">
                  "Belajar Cerdas, Berani Bereksplorasi, Siap Berinovasi."
                </p>
              </div>
            </div>

            {/* Right section: Gamification Stats + Role Switcher */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Gamification Pills (Shown for Siswa role) */}
              {role === 'siswa' && (
                <div className="flex items-center space-x-2">
                  {/* Streak */}
                  <div
                    className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg bg-amber-50 text-amber-700 border border-amber-200 text-xs font-bold"
                    title="Hari belajar beruntun"
                  >
                    <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
                    <span>{student.dailyStreak} Hari</span>
                  </div>

                  {/* Level */}
                  <div
                    className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 border border-indigo-200 text-xs font-bold"
                    title="Level Petualang"
                  >
                    <Trophy className="w-4 h-4 text-indigo-600" />
                    <span>
                      Lv.{student.levelNumber} {student.levelTitle}
                    </span>
                  </div>

                  {/* XP */}
                  <div
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs font-bold shadow-xs"
                    title="Total Experience Points"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{student.xp.toLocaleString('id-ID')} XP</span>
                  </div>
                </div>
              )}

              {/* Role Switcher Button */}
              <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => setRole('siswa')}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-all ${
                    role === 'siswa'
                      ? 'bg-white text-indigo-700 font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Siswa</span>
                </button>
                <button
                  type="button"
                  onClick={() => setRole('guru')}
                  className={`flex items-center space-x-1 px-2.5 py-1.5 rounded-lg transition-all ${
                    role === 'guru'
                      ? 'bg-indigo-600 text-white font-bold shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Guru</span>
                </button>
              </div>

              {/* User Avatar & Profile Trigger */}
              <button
                type="button"
                onClick={() => {
                  setEditName(student.name);
                  setEditClass(student.gradeClass);
                  setEditSchool(student.school);
                  setEditNisn(student.nisn);
                  setIsEditingProfile(true);
                }}
                className="flex items-center space-x-2 p-1 pl-1.5 pr-2 rounded-xl hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200 text-left"
                title="Kelola Profil Siswa"
              >
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-indigo-500/30"
                />
                <div className="hidden lg:block text-xs">
                  <div className="font-bold text-slate-800 leading-tight truncate max-w-[110px]">
                    {student.name}
                  </div>
                  <div className="text-[11px] text-slate-500">{student.gradeClass}</div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Edit Profile Modal */}
      {isEditingProfile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <User className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-lg text-slate-900">Profil Siswa Petualang</h3>
              </div>
              <button
                onClick={() => setIsEditingProfile(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProfile} className="mt-4 space-y-3.5 text-sm">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap Siswa
                </label>
                <input
                  type="text"
                  required
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NISN</label>
                  <input
                    type="text"
                    value={editNisn}
                    onChange={(e) => setEditNisn(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kelas / Jurusan
                  </label>
                  <input
                    type="text"
                    value={editClass}
                    onChange={(e) => setEditClass(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                    placeholder="Contoh: X-RPL 1"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Sekolah
                </label>
                <input
                  type="text"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-slate-800">Status Belajar:</div>
                  <div>
                    {student.completedMissionIds.length} Misi Selesai • {student.badges.length} Lencana
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-indigo-600 font-bold">{student.xp} XP</div>
                  <div className="text-[11px] text-slate-400">Tersimpan di Browser</div>
                </div>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-sm"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
