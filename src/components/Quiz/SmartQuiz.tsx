import React, { useState } from 'react';
import {
  HelpCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  RotateCcw,
  BookOpen,
  Award,
  AlertCircle,
  Lightbulb,
  Clock,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { QuizQuestion, QuizAttempt } from '../../types';

export const SmartQuiz: React.FC = () => {
  const { questionBank, saveQuizAttempt, setActiveNavTab } = useApp();

  // Mode: setup | in_progress | completed
  const [quizState, setQuizState] = useState<'setup' | 'in_progress' | 'completed'>('setup');
  const [quizMode, setQuizMode] = useState<'bank' | 'dynamic'>('bank');
  const [selectedTopic, setSelectedTopic] = useState<string>('Semua Topik');
  const [questionCount, setQuestionCount] = useState<number>(6);
  const [isGeneratingAi, setIsGeneratingAi] = useState<boolean>(false);
  const [aiGenError, setAiGenError] = useState<string | null>(null);

  // Active quiz session
  const [activeQuestions, setActiveQuestions] = useState<QuizQuestion[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [startTime, setStartTime] = useState<number>(0);
  const [showHint, setShowHint] = useState<boolean>(false);

  // Results
  const [lastAttempt, setLastAttempt] = useState<QuizAttempt | null>(null);

  const topicsList = [
    'Semua Topik',
    'Perangkat TIK',
    'Sistem Komputer',
    'Berpikir Komputasional',
    'Algoritma',
    'Literasi Digital & Keamanan',
  ];

  // Start standard bank quiz
  const handleStartBankQuiz = () => {
    let pool = [...questionBank];
    if (selectedTopic !== 'Semua Topik') {
      pool = pool.filter((q) => q.topic.includes(selectedTopic) || selectedTopic.includes(q.topic));
    }

    // Shuffle pool
    const shuffled = pool.sort(() => 0.5 - Math.random()).slice(0, questionCount);
    if (shuffled.length === 0) {
      alert('Belum ada soal untuk topik ini di bank soal.');
      return;
    }

    setActiveQuestions(shuffled);
    setCurrentIndex(0);
    setUserAnswers({});
    setShowHint(false);
    setStartTime(Date.now());
    setQuizState('in_progress');
  };

  // Start AI Dynamic Quiz
  const handleStartDynamicQuiz = async () => {
    setIsGeneratingAi(true);
    setAiGenError(null);

    const topicTarget = selectedTopic === 'Semua Topik' ? 'Informatika SMK Kurikulum Merdeka' : selectedTopic;

    try {
      const res = await fetch('/api/ai/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topicTarget,
          count: questionCount,
          level: 'Menengah',
        }),
      });

      if (!res.ok) {
        throw new Error('Gagal menghubungi generator kuis AI. Beralih ke bank soal.');
      }

      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error('Format soal AI tidak valid.');
      }

      setActiveQuestions(data.questions);
      setCurrentIndex(0);
      setUserAnswers({});
      setShowHint(false);
      setStartTime(Date.now());
      setQuizState('in_progress');
    } catch (err: any) {
      console.warn('AI Quiz fallback to bank:', err);
      setAiGenError(`${err.message} (Menggunakan soal cadangan dari bank soal terkurasi).`);

      // Fallback
      let pool = [...questionBank];
      if (selectedTopic !== 'Semua Topik') {
        pool = pool.filter((q) => q.topic.includes(selectedTopic));
      }
      const shuffled = (pool.length > 0 ? pool : questionBank)
        .sort(() => 0.5 - Math.random())
        .slice(0, questionCount);

      setActiveQuestions(shuffled);
      setCurrentIndex(0);
      setUserAnswers({});
      setShowHint(false);
      setStartTime(Date.now());
      setQuizState('in_progress');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const currentQ = activeQuestions[currentIndex];

  const handleSelectAnswer = (ans: any) => {
    setUserAnswers((prev) => ({
      ...prev,
      [currentQ.id]: ans,
    }));
  };

  // Submit and calculate results
  const handleSubmitQuiz = () => {
    const timeSpent = Math.max(10, Math.round((Date.now() - startTime) / 1000));
    let correct = 0;
    const reviewTopicsSet = new Set<string>();

    activeQuestions.forEach((q) => {
      const userAns = userAnswers[q.id];
      let isCorrect = false;

      if (q.type === 'multiple_choice' || q.type === 'case_study') {
        isCorrect = userAns === q.correctIndex;
      } else if (q.type === 'true_false') {
        isCorrect = userAns === q.correctAnswerBool;
      } else if (q.type === 'matching' && q.matchingPairs) {
        // check matching
        let matches = 0;
        q.matchingPairs.forEach((p) => {
          if (userAns && userAns[p.left] === p.right) matches++;
        });
        isCorrect = matches === q.matchingPairs.length;
      } else if (q.type === 'reorder' && q.reorderItems) {
        isCorrect = JSON.stringify(userAns) === JSON.stringify(q.reorderItems);
      }

      if (isCorrect) {
        correct++;
      } else {
        if (q.reviewTopic) {
          reviewTopicsSet.add(q.reviewTopic);
        }
      }
    });

    const pct = Math.round((correct / activeQuestions.length) * 100);

    const attempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      timestamp: new Date().toISOString(),
      topic: selectedTopic,
      mode: quizMode,
      totalQuestions: activeQuestions.length,
      correctCount: correct,
      scorePercentage: pct,
      timeSpentSeconds: timeSpent,
      reviewTopics: Array.from(reviewTopicsSet),
      userAnswers,
    };

    saveQuizAttempt(attempt);
    setLastAttempt(attempt);
    setQuizState('completed');
  };

  return (
    <div className="space-y-6 sm:space-y-8 animate-fadeIn">
      {/* Page Header */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 text-xs font-bold text-cyan-600 uppercase tracking-wider mb-1">
            <HelpCircle className="w-4 h-4" />
            <span>Smart Quiz — Evaluasi Pemahaman Mandiri</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Kuis Interaktif Informatika Kelas X
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-slate-600 max-w-2xl">
            Tersedia bank soal kurikulum dan generator soal dinamis Gemini AI. Uji penalaran
            studi kasus, dapatkan pembahasan detail, dan ketahui materi yang perlu diperdalam.
          </p>
        </div>

        {quizState !== 'setup' && (
          <button
            type="button"
            onClick={() => setQuizState('setup')}
            className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200 flex items-center space-x-1.5 self-start md:self-auto"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Ganti Sesi Kuis</span>
          </button>
        )}
      </div>

      {/* STATE 1: SETUP SCREEN */}
      {quizState === 'setup' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Bank Soal Terkurasi */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col justify-between space-y-6">
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900">
                Bank Soal Kurikulum Merdeka ({questionBank.length}+ Soal)
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                Kumpulan soal standar yang telah dikurasi oleh instruktur Informatika SMK.
                Mencakup pilihan ganda, benar-salah, matching konsep, dan urutan algoritma.
              </p>

              <div className="mt-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Pilih Topik:</label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                  >
                    {topicsList.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1.5">Jumlah Soal:</label>
                  <div className="flex space-x-2">
                    {[4, 6, 8, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setQuestionCount(num)}
                        className={`flex-1 py-2 rounded-xl font-bold transition-all ${
                          questionCount === num
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {num} Soal
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                setQuizMode('bank');
                handleStartBankQuiz();
              }}
              className="w-full py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-transform active:scale-98"
            >
              <span>Mulai Kuis Bank Soal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Card 2: AI Dynamic Quiz Generator */}
          <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-blue-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl flex flex-col justify-between space-y-6 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-48 h-48 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10">
              <div className="w-12 h-12 rounded-2xl bg-cyan-400/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center mb-4">
                <Sparkles className="w-6 h-6 animate-pulse" />
              </div>
              <h3 className="text-xl font-bold text-white">
                Buat Kuis Dinamis dengan Gemini AI
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                Hasilkan soal studi kasus baru secara otomatis berdasarkan capaian pembelajaran
                Informatika kelas X. Validasi format JSON dan kunci jawaban terlindungi.
              </p>

              <div className="mt-6 space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-300 mb-1.5">Topik Kuis AI:</label>
                  <select
                    value={selectedTopic}
                    onChange={(e) => setSelectedTopic(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-white/20 bg-white/10 text-white font-medium focus:outline-hidden focus:ring-2 focus:ring-cyan-400"
                  >
                    {topicsList.map((t) => (
                      <option key={t} value={t} className="bg-slate-900 text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-[11px] text-slate-300">
                  ✨ Dilengkapi pengecoh logis, petunjuk scaffolding, dan auto-fallback jika jaringan lambat.
                </div>
              </div>
            </div>

            <button
              type="button"
              disabled={isGeneratingAi}
              onClick={() => {
                setQuizMode('dynamic');
                handleStartDynamicQuiz();
              }}
              className="relative z-10 w-full py-3 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-transform active:scale-98"
            >
              {isGeneratingAi ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Gemini Sedang Merancang Soal...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate Kuis AI Baru</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* STATE 2: QUIZ IN PROGRESS */}
      {quizState === 'in_progress' && currentQ && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
          {aiGenError && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              <span>{aiGenError}</span>
            </div>
          )}

          {/* Question Nav Track */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-sm text-slate-900">
                Soal {currentIndex + 1} dari {activeQuestions.length}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700">
                {currentQ.topic}
              </span>
            </div>

            {/* Question Selector Pills */}
            <div className="flex items-center space-x-1.5 overflow-x-auto">
              {activeQuestions.map((q, idx) => {
                const isAnswered = userAnswers[q.id] !== undefined;
                const isCurrent = currentIndex === idx;

                return (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => {
                      setCurrentIndex(idx);
                      setShowHint(false);
                    }}
                    className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                    title={isAnswered ? 'Sudah dijawab' : 'Belum dijawab'}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Question Text */}
          <div className="space-y-4">
            <div className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
              {currentQ.question}
            </div>

            {/* Context snippet if any */}
            {currentQ.context && (
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 italic">
                {currentQ.context}
              </div>
            )}
          </div>

          {/* Answers Component */}
          {/* Option Type: Multiple Choice or Case Study */}
          {(currentQ.type === 'multiple_choice' || currentQ.type === 'case_study') && currentQ.options && (
            <div className="space-y-2.5">
              {currentQ.options.map((opt, optIdx) => {
                const isSelected = userAnswers[currentQ.id] === optIdx;
                return (
                  <button
                    key={optIdx}
                    type="button"
                    onClick={() => handleSelectAnswer(optIdx)}
                    className={`w-full text-left p-4 rounded-2xl border text-xs sm:text-sm transition-all flex items-start space-x-3 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                    }`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full border flex items-center justify-center shrink-0 text-xs mt-0.5 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-600 text-white'
                          : 'border-slate-300 text-slate-600'
                      }`}
                    >
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1">{opt}</span>
                  </button>
                );
              })}
            </div>
          )}

          {/* Option Type: True or False */}
          {currentQ.type === 'true_false' && (
            <div className="grid grid-cols-2 gap-4">
              {[true, false].map((val) => {
                const isSelected = userAnswers[currentQ.id] === val;
                return (
                  <button
                    key={String(val)}
                    type="button"
                    onClick={() => handleSelectAnswer(val)}
                    className={`p-5 rounded-2xl border text-sm sm:text-base font-bold text-center transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 shadow-xs'
                        : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {val ? 'BENAR (True)' : 'SALAH (False)'}
                  </button>
                );
              })}
            </div>
          )}

          {/* Option Type: Matching */}
          {currentQ.type === 'matching' && currentQ.matchingPairs && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">Pilih pasangan yang tepat untuk masing-masing item:</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {currentQ.matchingPairs.map((p, idx) => {
                  const currentSelection = (userAnswers[currentQ.id] || {})[p.left] || '';
                  return (
                    <div key={idx} className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                      <div className="font-bold text-xs text-indigo-950">{p.left}</div>
                      <select
                        value={currentSelection}
                        onChange={(e) => {
                          const updated = {
                            ...(userAnswers[currentQ.id] || {}),
                            [p.left]: e.target.value,
                          };
                          handleSelectAnswer(updated);
                        }}
                        className="w-full text-xs p-2 rounded-xl border border-slate-300 bg-white"
                      >
                        <option value="">-- Pilih Pasangan --</option>
                        {currentQ.matchingPairs?.map((pairOption, optIdx) => (
                          <option key={optIdx} value={pairOption.right}>
                            {pairOption.right}
                          </option>
                        ))}
                      </select>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Option Type: Reorder */}
          {currentQ.type === 'reorder' && currentQ.reorderItems && (
            <div className="space-y-3">
              <p className="text-xs text-slate-500">
                Susun langkah dari urutan pertama sampai terakhir (gunakan tombol panah):
              </p>
              {(() => {
                const currentOrder: string[] =
                  userAnswers[currentQ.id] || [...currentQ.reorderItems];

                const moveOrder = (fromIdx: number, toIdx: number) => {
                  const arr = [...currentOrder];
                  const [item] = arr.splice(fromIdx, 1);
                  arr.splice(toIdx, 0, item);
                  handleSelectAnswer(arr);
                };

                return (
                  <div className="space-y-2">
                    {currentOrder.map((stepText, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
                      >
                        <div className="flex items-center space-x-2.5 flex-1 pr-2">
                          <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                            {idx + 1}
                          </span>
                          <span className="text-slate-800">{stepText}</span>
                        </div>
                        <div className="flex space-x-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveOrder(idx, idx - 1)}
                            className="p-1 rounded bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-xs"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === currentOrder.length - 1}
                            onClick={() => moveOrder(idx, idx + 1)}
                            className="p-1 rounded bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-xs"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
          )}

          {/* Hint toggle */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setShowHint(!showHint)}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1.5"
            >
              <Lightbulb className="w-4 h-4 text-amber-500" />
              <span>{showHint ? 'Sembunyikan Petunjuk' : 'Butuh Petunjuk Soal?'}</span>
            </button>
            {showHint && currentQ.hint && (
              <div className="mt-2 p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 animate-fadeIn">
                💡 {currentQ.hint}
              </div>
            )}
          </div>

          {/* Navigation & Submit Bar */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              disabled={currentIndex === 0}
              onClick={() => {
                setCurrentIndex((prev) => prev - 1);
                setShowHint(false);
              }}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-30 border border-slate-200 flex items-center space-x-1.5"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            <div className="flex items-center space-x-2">
              {currentIndex < activeQuestions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => {
                    setCurrentIndex((prev) => prev + 1);
                    setShowHint(false);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm flex items-center space-x-1.5"
                >
                  <span>Selanjutnya</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-600/20 flex items-center space-x-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kumpulkan & Nilai Kuis</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* STATE 3: RESULTS & COMPREHENSIVE DISCUSSION */}
      {quizState === 'completed' && lastAttempt && (
        <div className="space-y-6">
          {/* Result Score Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <div className="inline-flex items-center space-x-2 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                <Award className="w-4 h-4 text-amber-500" />
                <span>Hasil Evaluasi Kuis</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                {lastAttempt.scorePercentage >= 80
                  ? 'Luar Biasa, Pemahaman Sangat Baik! 🎉'
                  : lastAttempt.scorePercentage >= 60
                  ? 'Bagus, Kamu Sudah Berada di Jalur Benar! 👍'
                  : 'Tetap Semangat, Pelajari Lagi Materi Kuncinya! 💪'}
              </h2>
              <p className="mt-1.5 text-xs sm:text-sm text-slate-600">
                Topik: {lastAttempt.topic} • Durasi pengerjaan: {lastAttempt.timeSpentSeconds} detik
              </p>
            </div>

            <div className="bg-gradient-to-tr from-indigo-50 to-cyan-50 p-6 rounded-3xl border border-indigo-100 flex items-center space-x-5 shrink-0">
              <div className="text-center">
                <div className="text-4xl sm:text-5xl font-black text-indigo-600">
                  {lastAttempt.scorePercentage}%
                </div>
                <div className="text-xs font-bold text-slate-500 mt-1">
                  {lastAttempt.correctCount} / {lastAttempt.totalQuestions} Soal Benar
                </div>
              </div>
            </div>
          </div>

          {/* Topics to Review Recommendation */}
          {lastAttempt.reviewTopics.length > 0 && (
            <div className="bg-amber-50 rounded-3xl p-6 border border-amber-200 space-y-3">
              <div className="font-bold text-sm text-amber-950 flex items-center space-x-2">
                <Lightbulb className="w-4 h-4 text-amber-600" />
                <span>Materi yang Direkomendasikan untuk Dipelajari Ulang:</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {lastAttempt.reviewTopics.map((topik, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1.5 rounded-xl bg-white border border-amber-300 text-xs font-semibold text-amber-900"
                  >
                    📖 {topik}
                  </span>
                ))}
              </div>
              <div className="pt-1 flex items-center space-x-3 text-xs">
                <button
                  type="button"
                  onClick={() => setActiveNavTab('tutor')}
                  className="font-bold text-indigo-700 hover:underline flex items-center space-x-1"
                >
                  <span>Tanyakan topik ini ke AI Tutor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Full Question Discussion Review */}
          <div className="space-y-4">
            <h3 className="font-bold text-lg text-slate-900">Pembahasan Setiap Soal</h3>

            <div className="space-y-4">
              {activeQuestions.map((q, idx) => {
                const userAns = lastAttempt.userAnswers[q.id];
                let isCorrect = false;

                if (q.type === 'multiple_choice' || q.type === 'case_study') {
                  isCorrect = userAns === q.correctIndex;
                } else if (q.type === 'true_false') {
                  isCorrect = userAns === q.correctAnswerBool;
                } else if (q.type === 'matching' && q.matchingPairs) {
                  let matches = 0;
                  q.matchingPairs.forEach((p) => {
                    if (userAns && userAns[p.left] === p.right) matches++;
                  });
                  isCorrect = matches === q.matchingPairs.length;
                }

                return (
                  <div
                    key={q.id}
                    className={`p-5 rounded-3xl border space-y-3 ${
                      isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <div className="flex items-center space-x-2">
                        {isCorrect ? (
                          <span className="flex items-center space-x-1 text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Benar</span>
                          </span>
                        ) : (
                          <span className="flex items-center space-x-1 text-rose-700 bg-rose-100 px-2 py-0.5 rounded-full">
                            <XCircle className="w-3.5 h-3.5" />
                            <span>Perlu Pembahasan</span>
                          </span>
                        )}
                        <span className="text-slate-500">Soal {idx + 1}</span>
                      </div>
                      <span className="text-slate-500">{q.topic}</span>
                    </div>

                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {q.question}
                    </div>

                    {/* Pembahasan detail */}
                    <div className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs text-slate-700 space-y-1">
                      <div className="font-bold text-slate-900">Pembahasan Konsep:</div>
                      <p>{q.explanation}</p>
                      {q.reviewTopic && (
                        <div className="pt-1 text-[11px] text-slate-500">
                          Fokus Materi: <strong>{q.reviewTopic}</strong>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-4 flex justify-center space-x-3">
            <button
              type="button"
              onClick={() => setQuizState('setup')}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-xs"
            >
              Mulai Kuis Baru
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
