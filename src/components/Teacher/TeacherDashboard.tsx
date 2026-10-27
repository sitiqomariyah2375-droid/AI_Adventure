import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  HelpCircle,
  TrendingUp,
  Download,
  Search,
  Filter,
  FileSpreadsheet,
  AlertTriangle,
  Award,
  BookOpen,
  MessageSquareQuote,
  Eye,
  PlusCircle,
  Database,
  Check,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { StudentProfile, QuizQuestion, Mission } from '../../types';

export const TeacherDashboard: React.FC = () => {
  const {
    cohortStudents,
    missions,
    questionBank,
    addQuestionToBank,
    updateTeacherNote,
    activeNavTab,
    setActiveNavTab,
  } = useApp();

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterClass, setFilterClass] = useState<string>('all');
  const [selectedStudentForModal, setSelectedStudentForModal] = useState<StudentProfile | null>(null);
  const [teacherNoteInput, setTeacherNoteInput] = useState<string>('');
  const [noteSavedId, setNoteSavedId] = useState<string | null>(null);

  // New question form state
  const [newQuestionTopic, setNewQuestionTopic] = useState<string>('Berpikir Komputasional');
  const [newQuestionText, setNewQuestionText] = useState<string>('');
  const [newQuestionOptions, setNewQuestionOptions] = useState<string[]>(['', '', '', '']);
  const [newQuestionCorrectIndex, setNewQuestionCorrectIndex] = useState<number>(0);
  const [newQuestionExplanation, setNewQuestionExplanation] = useState<string>('');
  const [showAddQuestionModal, setShowAddQuestionModal] = useState<boolean>(false);
  const [addQuestionSuccess, setAddQuestionSuccess] = useState<boolean>(false);

  // Calculate cohort statistics
  const totalStudents = cohortStudents.length;

  // Average quiz score across all attempts
  let totalScoreSum = 0;
  let totalAttemptsCount = 0;
  cohortStudents.forEach((std) => {
    std.quizAttempts.forEach((qa) => {
      totalScoreSum += qa.scorePercentage;
      totalAttemptsCount++;
    });
  });
  const avgCohortQuizScore = totalAttemptsCount > 0 ? Math.round(totalScoreSum / totalAttemptsCount) : 0;

  // Average mission completion rate
  const totalPossibleMissions = totalStudents * missions.length;
  const totalCompletedMissions = cohortStudents.reduce(
    (acc, std) => acc + std.completedMissionIds.length,
    0
  );
  const missionCompletionRate =
    totalPossibleMissions > 0 ? Math.round((totalCompletedMissions / totalPossibleMissions) * 100) : 0;

  // Mastery categories
  let categorySangatMahir = 0; // >= 85%
  let categoryMahir = 0; // 70-84%
  let categoryBerkembang = 0; // 50-69%
  let categoryPerluBimbingan = 0; // < 50%

  cohortStudents.forEach((std) => {
    const stdAvg =
      std.quizAttempts.length > 0
        ? std.quizAttempts.reduce((acc, curr) => acc + curr.scorePercentage, 0) /
          std.quizAttempts.length
        : 0;

    if (stdAvg >= 85) categorySangatMahir++;
    else if (stdAvg >= 70) categoryMahir++;
    else if (stdAvg >= 50) categoryBerkembang++;
    else categoryPerluBimbingan++;
  });

  // Topics needing review aggregate
  const topicErrorCounts: Record<string, number> = {};
  cohortStudents.forEach((std) => {
    std.quizAttempts.forEach((qa) => {
      qa.reviewTopics.forEach((rt) => {
        topicErrorCounts[rt] = (topicErrorCounts[rt] || 0) + 1;
      });
    });
  });

  const sortedWeakTopics = Object.entries(topicErrorCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Filter students
  const filteredStudents = cohortStudents.filter((std) => {
    const matchesSearch =
      std.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      std.nisn.includes(searchTerm) ||
      std.school.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesClass = filterClass === 'all' || std.gradeClass === filterClass;
    return matchesSearch && matchesClass;
  });

  // Export to CSV Function
  const handleExportCSV = () => {
    const headers = [
      'ID Siswa',
      'Nama Lengkap',
      'Tipe Data',
      'NISN',
      'Kelas',
      'Sekolah',
      'Total XP',
      'Level',
      'Misi Selesai (Count)',
      'Daftar Misi Selesai',
      'Rata-rata Kuis (%)',
      'Jumlah Kuis Dikerjakan',
      'Jumlah Karya Digital',
      'Jumlah Refleksi',
      'Catatan Refleksi Terakhir',
    ];

    const rows = cohortStudents.map((std) => {
      const isDemo = std.school.includes('[DEMO]') ? 'Data Demo' : 'Data Siswa Nyata (Lokal)';
      const avgQuiz =
        std.quizAttempts.length > 0
          ? Math.round(
              std.quizAttempts.reduce((acc, c) => acc + c.scorePercentage, 0) /
                std.quizAttempts.length
            )
          : 0;

      const latestReflection = std.reflections[0]?.answers?.q1 || '-';

      return [
        `"${std.id}"`,
        `"${std.name}"`,
        `"${isDemo}"`,
        `"${std.nisn}"`,
        `"${std.gradeClass}"`,
        `"${std.school}"`,
        std.xp,
        `"Lv.${std.levelNumber} ${std.levelTitle}"`,
        std.completedMissionIds.length,
        `"${std.completedMissionIds.join(', ')}"`,
        `${avgQuiz}%`,
        std.quizAttempts.length,
        std.creatorProjects.length,
        std.reflections.length,
        `"${latestReflection.replace(/"/g, '""')}"`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute(
      'download',
      `Laporan_Informatika_SMK_${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveTeacherNote = (refId: string) => {
    if (!selectedStudentForModal || !teacherNoteInput.trim()) return;
    updateTeacherNote(selectedStudentForModal.id, refId, teacherNoteInput);
    setNoteSavedId(refId);
    setTimeout(() => setNoteSavedId(null), 2000);
  };

  const handleCreateQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newQuestionText.trim() || newQuestionOptions.some((o) => !o.trim())) {
      alert('Harap lengkapi semua teks soal dan 4 pilihan jawaban.');
      return;
    }

    const newQ: QuizQuestion = {
      id: `q-custom-${Date.now()}`,
      type: 'multiple_choice',
      topic: newQuestionTopic,
      difficulty: 'Menengah',
      question: newQuestionText,
      options: [...newQuestionOptions],
      correctIndex: newQuestionCorrectIndex,
      explanation: newQuestionExplanation || 'Kunci jawaban dan pembahasan resmi dari Guru.',
      hint: 'Perhatikan konsep dasar materi ini.',
      reviewTopic: newQuestionTopic,
    };

    addQuestionToBank(newQ);
    setAddQuestionSuccess(true);
    setTimeout(() => {
      setAddQuestionSuccess(false);
      setShowAddQuestionModal(false);
      setNewQuestionText('');
      setNewQuestionOptions(['', '', '', '']);
      setNewQuestionExplanation('');
    }, 1500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* DEMO Indicator Banner */}
      <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 shadow-xs">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>
            <strong>MODE GURU INFORMATIKA (Kompilasi Data Siswa & DEMO Cohort X-RPL/TKJ):</strong>{' '}
            Data siswa yang tersimpan di browser Anda digabungkan dengan sampel profil demo terlabel
            [DEMO] untuk simulasi analitik kelas dan ekspor laporan.
          </span>
        </div>
        <button
          type="button"
          onClick={handleExportCSV}
          className="px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center space-x-1.5 shrink-0 shadow-xs"
        >
          <FileSpreadsheet className="w-3.5 h-3.5" />
          <span>Unduh CSV Sekarang</span>
        </button>
      </div>

      {/* Main Teacher Summary Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Dashboard Guru Informatika SMK</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Ringkasan Aktivitas & Analitik Belajar Siswa
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
            Pantau progres penyelesaian 6 misi Kurikulum Merdeka, rata-rata ketuntasan kuis,
            identifikasi materi yang sering keliru, dan tinjau jawaban refleksi siswa.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowAddQuestionModal(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Tambah Soal Bank</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-xs"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Laporan (CSV)</span>
          </button>
        </div>
      </div>

      {/* Top 4 Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Total Siswa Terdata
            </span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{totalStudents} Siswa</div>
          <div className="mt-1 text-xs text-slate-500">1 Siswa Lokal + 5 Siswa [DEMO]</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Ketuntasan Misi
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{missionCompletionRate}%</div>
          <div className="mt-1 text-xs text-emerald-600 font-semibold">
            {totalCompletedMissions} dari {totalPossibleMissions} misi selesai
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rata-rata Skor Kuis
            </span>
            <div className="w-9 h-9 rounded-xl bg-cyan-50 text-cyan-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{avgCohortQuizScore}%</div>
          <div className="mt-1 text-xs text-slate-500">Dari {totalAttemptsCount} sesi pengerjaan</div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Bank Soal Aktif
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Database className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 text-3xl font-extrabold text-slate-900">{questionBank.length} Soal</div>
          <div className="mt-1 text-xs text-slate-500">5 Topik Kurikulum Merdeka</div>
        </div>
      </div>

      {/* Analytics Row: Mastery Distribution & Weak Topics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Distribution of Learning Mastery (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Distribusi Capaian Belajar Siswa</span>
            </h3>
            <span className="text-xs text-slate-500">Berdasarkan Skor Kuis & Misi</span>
          </div>

          <div className="space-y-3 pt-1">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-emerald-700">Sangat Mahir (&gt;= 85%)</span>
                <span>
                  {categorySangatMahir} Siswa ({Math.round((categorySangatMahir / totalStudents) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-emerald-500 h-2.5 rounded-full"
                  style={{ width: `${(categorySangatMahir / totalStudents) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-cyan-700">Mahir (70% - 84%)</span>
                <span>
                  {categoryMahir} Siswa ({Math.round((categoryMahir / totalStudents) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-cyan-500 h-2.5 rounded-full"
                  style={{ width: `${(categoryMahir / totalStudents) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-amber-700">Berkembang (50% - 69%)</span>
                <span>
                  {categoryBerkembang} Siswa ({Math.round((categoryBerkembang / totalStudents) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-amber-500 h-2.5 rounded-full"
                  style={{ width: `${(categoryBerkembang / totalStudents) * 100}%` }}
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-rose-700">Perlu Bimbingan Khusus (&lt; 50%)</span>
                <span>
                  {categoryPerluBimbingan} Siswa ({Math.round((categoryPerluBimbingan / totalStudents) * 100)}%)
                </span>
              </div>
              <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-rose-500 h-2.5 rounded-full"
                  style={{ width: `${(categoryPerluBimbingan / totalStudents) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Topics Needing Reinforcement (5 Cols) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center space-x-2 font-bold text-base text-slate-900">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Materi Paling Sering Butuh Pengulangan</span>
          </div>
          <p className="text-xs text-slate-500">
            Dianalisis dari riwayat salah jawab kuis dan laporan refleksi kesulitan siswa:
          </p>

          <div className="space-y-2 pt-1">
            {sortedWeakTopics.map(([topik, count], idx) => (
              <div
                key={idx}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs"
              >
                <div className="font-semibold text-slate-800 truncate pr-2">
                  {idx + 1}. {topik}
                </div>
                <span className="px-2 py-0.5 rounded-full font-bold bg-rose-100 text-rose-800 text-[11px] shrink-0">
                  {count} Siswa Butuh Remedial
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filterable Student Data Table */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Daftar Hasil Belajar Siswa</h3>
            <p className="text-xs text-slate-500">
              Menampilkan {filteredStudents.length} siswa dalam database aplikasi
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Cari nama atau NISN..."
                className="pl-9 pr-3 py-1.5 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              />
            </div>

            {/* Class Filter */}
            <select
              value={filterClass}
              onChange={(e) => setFilterClass(e.target.value)}
              className="p-1.5 rounded-xl border border-slate-300 text-xs bg-slate-50 font-medium"
            >
              <option value="all">Semua Kelas</option>
              <option value="X-RPL 1">Kelas X-RPL 1</option>
              <option value="X-TKJ 2">Kelas X-TKJ 2</option>
            </select>
          </div>
        </div>

        {/* Responsive Table */}
        <div className="overflow-x-auto -mx-6 sm:mx-0">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold">
                <th className="py-3 px-4">Nama & NISN</th>
                <th className="py-3 px-4">Kelas & Sekolah</th>
                <th className="py-3 px-4">Level & XP</th>
                <th className="py-3 px-4">Misi Selesai</th>
                <th className="py-3 px-4">Rata Kuis</th>
                <th className="py-3 px-4">Refleksi</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.map((std) => {
                const avgQuiz =
                  std.quizAttempts.length > 0
                    ? Math.round(
                        std.quizAttempts.reduce((acc, c) => acc + c.scorePercentage, 0) /
                          std.quizAttempts.length
                      )
                    : 0;

                const isDemo = std.school.includes('[DEMO]');

                return (
                  <tr key={std.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-2.5">
                        <img
                          src={std.avatar}
                          alt={std.name}
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 flex items-center space-x-1.5">
                            <span>{std.name}</span>
                            {isDemo && (
                              <span className="text-[10px] font-bold text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded-md">
                                DEMO
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-slate-400">NISN: {std.nisn}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-medium text-slate-800">{std.gradeClass}</div>
                      <div className="text-[11px] text-slate-400 truncate max-w-[140px]">
                        {std.school}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="font-bold text-indigo-600">
                        Lv.{std.levelNumber} {std.levelTitle}
                      </div>
                      <div className="text-[11px] text-slate-500">{std.xp} XP</div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-800">
                        <span>{std.completedMissionIds.length} / {missions.length} Misi</span>
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-bold">
                      <span
                        className={
                          avgQuiz >= 80
                            ? 'text-emerald-600'
                            : avgQuiz >= 60
                            ? 'text-cyan-600'
                            : 'text-amber-600'
                        }
                      >
                        {avgQuiz}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-600">
                      {std.reflections.length} Catatan
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentForModal(std)}
                        className="px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs inline-flex items-center space-x-1 transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Detail</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Detail Modal */}
      {selectedStudentForModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-slate-200 my-auto space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedStudentForModal.avatar}
                  alt={selectedStudentForModal.name}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {selectedStudentForModal.name}
                  </h3>
                  <div className="text-xs text-slate-500">
                    {selectedStudentForModal.gradeClass} • NISN: {selectedStudentForModal.nisn}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudentForModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Misi & Badges List */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
              <div className="font-bold text-slate-900">Misi yang Telah Diselesaikan:</div>
              <div className="flex flex-wrap gap-1.5">
                {selectedStudentForModal.completedMissionIds.map((mId) => {
                  const m = missions.find((item) => item.id === mId);
                  return (
                    <span
                      key={mId}
                      className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 font-semibold"
                    >
                      ✓ {m ? m.title : mId}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Reflections Review */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-1.5">
                <MessageSquareQuote className="w-4 h-4 text-indigo-600" />
                <span>Lembar Refleksi Siswa ({selectedStudentForModal.reflections.length})</span>
              </h4>

              {selectedStudentForModal.reflections.length === 0 ? (
                <p className="text-xs text-slate-500 italic">Siswa belum mengisi lembar refleksi.</p>
              ) : (
                selectedStudentForModal.reflections.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200 text-xs space-y-2 shadow-xs"
                  >
                    <div className="flex justify-between font-bold text-indigo-950">
                      <span>{ref.missionTitle}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ref.timestamp).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <div className="space-y-1 text-slate-700">
                      <div>
                        <strong>1. Hal Baru:</strong> {ref.answers.q1 || '-'}
                      </div>
                      <div>
                        <strong>2. Tantangan:</strong> {ref.answers.q2 || '-'}
                      </div>
                      <div>
                        <strong>3. Bantuan AI:</strong> {ref.answers.q3 || '-'}
                      </div>
                      <div>
                        <strong>4. Koreksi AI:</strong> {ref.answers.q4 || '-'}
                      </div>
                      <div>
                        <strong>5. Rencana Aksi:</strong> {ref.answers.q5 || '-'}
                      </div>
                    </div>

                    {/* Teacher Feedback input */}
                    <div className="pt-2 border-t border-slate-100 space-y-1.5">
                      <label className="block text-[11px] font-bold text-slate-700">
                        Catatan Guru untuk Siswa Ini:
                      </label>
                      <div className="flex items-center space-x-2">
                        <input
                          type="text"
                          defaultValue={ref.teacherNote || ''}
                          onChange={(e) => setTeacherNoteInput(e.target.value)}
                          placeholder="Beri apresiasi atau bimbingan perbaikan..."
                          className="flex-1 p-2 rounded-xl border border-slate-300 text-xs"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveTeacherNote(ref.id)}
                          className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shrink-0 flex items-center space-x-1"
                        >
                          {noteSavedId === ref.id ? <Check className="w-3.5 h-3.5" /> : null}
                          <span>{noteSavedId === ref.id ? 'Tersimpan' : 'Simpan'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* Add Question to Bank Modal */}
      {showAddQuestionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 my-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-2">
                <Database className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">Tambah Soal ke Bank Kurikulum</h3>
              </div>
              <button onClick={() => setShowAddQuestionModal(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>

            <form onSubmit={handleCreateQuestion} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Topik Materi:</label>
                <select
                  value={newQuestionTopic}
                  onChange={(e) => setNewQuestionTopic(e.target.value)}
                  className="w-full p-2 rounded-xl border border-slate-300"
                >
                  <option value="Perangkat TIK">Perangkat TIK</option>
                  <option value="Sistem Komputer">Sistem Komputer</option>
                  <option value="Berpikir Komputasional">Berpikir Komputasional</option>
                  <option value="Algoritma">Algoritma & Pemrograman</option>
                  <option value="Literasi Digital & Keamanan">Literasi Digital & Keamanan</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pertanyaan Soal:</label>
                <textarea
                  rows={2}
                  required
                  value={newQuestionText}
                  onChange={(e) => setNewQuestionText(e.target.value)}
                  placeholder="Ketik kalimat soal studi kasus atau konsep..."
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-slate-700">4 Pilihan Jawaban (A, B, C, D):</label>
                {newQuestionOptions.map((opt, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="correctRadio"
                      checked={newQuestionCorrectIndex === idx}
                      onChange={() => setNewQuestionCorrectIndex(idx)}
                      title="Pilih sebagai kunci jawaban"
                    />
                    <span className="font-bold text-slate-600">{String.fromCharCode(65 + idx)}:</span>
                    <input
                      type="text"
                      required
                      value={opt}
                      onChange={(e) => {
                        const next = [...newQuestionOptions];
                        next[idx] = e.target.value;
                        setNewQuestionOptions(next);
                      }}
                      placeholder={`Opsi ${String.fromCharCode(65 + idx)}`}
                      className="flex-1 p-1.5 rounded-lg border border-slate-300 text-xs"
                    />
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pembahasan / Penjelasan:</label>
                <textarea
                  rows={2}
                  value={newQuestionExplanation}
                  onChange={(e) => setNewQuestionExplanation(e.target.value)}
                  placeholder="Jelaskan alasan kunci jawaban benar..."
                  className="w-full p-2 rounded-xl border border-slate-300"
                />
              </div>

              {addQuestionSuccess && (
                <div className="text-emerald-600 font-bold text-center">
                  ✓ Soal berhasil ditambahkan ke Bank Soal!
                </div>
              )}

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddQuestionModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 text-xs font-semibold hover:bg-slate-100"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs"
                >
                  Simpan Soal Baru
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
