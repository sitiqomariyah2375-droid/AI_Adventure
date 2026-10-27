import React, { useState } from 'react';
import {
  ClipboardCheck,
  Sparkles,
  Save,
  MessageSquare,
  CheckCircle2,
  Clock,
  BookOpen,
  Send,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { ReflectionRecord } from '../../types';

export const ReflectionView: React.FC = () => {
  const { student, missions, saveReflection } = useApp();

  const [selectedMissionId, setSelectedMissionId] = useState<string>(
    student.completedMissionIds[0] || missions[0].id
  );

  const [answers, setAnswers] = useState({
    q1: '',
    q2: '',
    q3: '',
    q4: '',
    q5: '',
  });

  const [isRequestingFeedback, setIsRequestingFeedback] = useState<boolean>(false);
  const [aiFeedbackResult, setAiFeedbackResult] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  const selectedMission = missions.find((m) => m.id === selectedMissionId) || missions[0];

  const handleRequestAiFeedback = async () => {
    if (!answers.q1 && !answers.q2) {
      alert('Mohon isi minimal pertanyaan hal baru atau bagian menantang terlebih dahulu.');
      return;
    }

    setIsRequestingFeedback(true);
    try {
      const res = await fetch('/api/ai/evaluate-reflection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          missionTitle: selectedMission.title,
        }),
      });

      const data = await res.json();
      setAiFeedbackResult(data.feedback || 'Refleksi sangat baik!');
    } catch (e) {
      console.error(e);
      setAiFeedbackResult(
        'Refleksi yang baik! Kemampuan mengidentifikasi kesulitan dan rencana perbaikan adalah kunci profil Pelajar Pancasila.'
      );
    } finally {
      setIsRequestingFeedback(false);
    }
  };

  const handleSave = () => {
    if (!answers.q1.trim() && !answers.q2.trim()) {
      alert('Mohon lengkapi catatan refleksi sebelum menyimpan.');
      return;
    }

    const record: ReflectionRecord = {
      id: `ref-${Date.now()}`,
      missionId: selectedMission.id,
      missionTitle: selectedMission.title,
      timestamp: new Date().toISOString(),
      answers,
      aiFeedback: aiFeedbackResult || undefined,
    };

    saveReflection(record);
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-emerald-600 uppercase tracking-wider mb-1">
            <ClipboardCheck className="w-4 h-4" />
            <span>Refleksi Pembelajaran — Kurikulum Merdeka</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Refleksi & Evaluasi Mandiri Siswa
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
            Tinjau proses belajarmu secara kritis. Identifikasi hal baru yang dipahami, tantangan yang
            dihadapi, serta bagaimana kamu memanfaatkan AI secara etis dan bertanggung jawab.
          </p>
        </div>

        {/* Mission Selector */}
        <div className="flex items-center space-x-2 text-xs self-start md:self-auto bg-slate-100 p-2 rounded-2xl border border-slate-200">
          <span className="font-bold text-slate-700">Pilih Misi:</span>
          <select
            value={selectedMissionId}
            onChange={(e) => {
              setSelectedMissionId(e.target.value);
              setAiFeedbackResult(null);
            }}
            className="p-2 rounded-xl bg-white border border-slate-300 text-xs font-semibold text-slate-800"
          >
            {missions.map((m) => (
              <option key={m.id} value={m.id}>
                Misi {m.number}: {m.title.slice(0, 35)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Form Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Form Inputs (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="font-bold text-base text-slate-900 flex items-center space-x-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>Lembar Refleksi: {selectedMission.title}</span>
            </h3>
            <span className="text-xs text-amber-600 font-bold bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200">
              +50 XP Simpan
            </span>
          </div>

          <div className="space-y-4 text-xs">
            {/* Q1 */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                1. Apa hal atau konsep baru yang saya pelajari dari misi ini?
              </label>
              <textarea
                rows={2}
                value={answers.q1}
                onChange={(e) => setAnswers({ ...answers, q1: e.target.value })}
                placeholder="Contoh: Saya baru memahami perbedaan sifat memori RAM yang volatile dengan NVMe SSD yang non-volatile..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Q2 */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                2. Bagian mana yang paling menantang dan bagaimana saya mengatasinya?
              </label>
              <textarea
                rows={2}
                value={answers.q2}
                onChange={(e) => setAnswers({ ...answers, q2: e.target.value })}
                placeholder="Contoh: Menganalisis kondisi if-else pada presensi gerbang. Saya mengatasinya dengan melihat petunjuk bertahap..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Q3 */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                3. Bagaimana AI Tutor membantu proses belajar saya dalam materi ini?
              </label>
              <textarea
                rows={2}
                value={answers.q3}
                onChange={(e) => setAnswers({ ...answers, q3: e.target.value })}
                placeholder="Contoh: AI memberi analogi dunia industri SMK dan memberikan pertanyaan pemantik saat saya buntu..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Q4 */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                4. Apakah saya menemukan informasi dari AI yang perlu dikoreksi atau diverifikasi?
              </label>
              <textarea
                rows={2}
                value={answers.q4}
                onChange={(e) => setAnswers({ ...answers, q4: e.target.value })}
                placeholder="Contoh: Saya memverifikasi nomor undang-undang PDP dan mengecek buku referensi untuk memastikannya..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Q5 */}
            <div>
              <label className="block font-bold text-slate-800 mb-1">
                5. Bagaimana saya akan menerapkan pengetahuan ini di kehidupan nyata atau jurusan saya?
              </label>
              <textarea
                rows={2}
                value={answers.q5}
                onChange={(e) => setAnswers({ ...answers, q5: e.target.value })}
                placeholder="Contoh: Saya akan mengaktifkan 2FA di semua akun sosial media dan berhati-hati sebelum membuka file APK..."
                className="w-full p-3 rounded-xl border border-slate-300 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              disabled={isRequestingFeedback}
              onClick={handleRequestAiFeedback}
              className="px-4 py-2 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center space-x-1.5 border border-indigo-200"
            >
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>
                {isRequestingFeedback ? 'Menilai Refleksi...' : 'Minta Umpan Balik AI Guru'}
              </span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 flex items-center space-x-1.5"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Lembar Refleksi</span>
            </button>
          </div>

          {savedSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs font-bold text-emerald-800 flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Lembar refleksi berhasil disimpan! (+50 XP)</span>
            </div>
          )}
        </div>

        {/* AI Formative Feedback & History (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* AI Formative Feedback Box */}
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-cyan-50/80 rounded-3xl p-6 border border-indigo-200 shadow-xs space-y-3">
            <div className="flex items-center space-x-2 text-indigo-950 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Umpan Balik Formatif AI (Pedagogis)</span>
            </div>

            {aiFeedbackResult ? (
              <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-wrap bg-white p-4 rounded-2xl border border-indigo-100">
                {aiFeedbackResult}
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-white/70 border border-slate-200 text-xs text-slate-500 italic">
                Klik tombol <strong>"Minta Umpan Balik AI Guru"</strong> di samping untuk mendapatkan
                evaluasi pemahaman konsep, kedalaman analisis, dan saran tindak lanjut.
              </div>
            )}
          </div>

          {/* History of Saved Reflections */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-xs space-y-3">
            <h4 className="font-bold text-sm text-slate-900 flex items-center space-x-2">
              <ClipboardCheck className="w-4 h-4 text-emerald-600" />
              <span>Riwayat Refleksi Saya ({student.reflections.length})</span>
            </h4>

            {student.reflections.length === 0 ? (
              <p className="text-xs text-slate-500 italic py-2">Belum ada refleksi tersimpan.</p>
            ) : (
              <div className="space-y-3 max-h-[360px] overflow-y-auto pr-1">
                {student.reflections.map((ref) => (
                  <div
                    key={ref.id}
                    className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-2"
                  >
                    <div className="flex items-center justify-between font-bold text-indigo-950">
                      <span>{ref.missionTitle}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(ref.timestamp).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <p className="text-slate-600 line-clamp-2 italic">
                      "Hal baru: {ref.answers.q1 || '-'}"
                    </p>

                    {ref.teacherNote && (
                      <div className="p-2 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px]">
                        <strong>Catatan Guru:</strong> {ref.teacherNote}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
