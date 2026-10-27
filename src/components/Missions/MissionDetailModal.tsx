import React, { useState } from 'react';
import {
  X,
  Sparkles,
  BookOpen,
  Award,
  CheckCircle2,
  HelpCircle,
  Lightbulb,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Check,
  ClipboardCheck,
} from 'lucide-react';
import { Mission, InteractiveStep } from '../../types';
import { useApp } from '../../context/AppContext';

interface MissionDetailModalProps {
  mission: Mission;
  onClose: () => void;
}

export const MissionDetailModal: React.FC<MissionDetailModalProps> = ({ mission, onClose }) => {
  const { student, completeMission, setActiveNavTab } = useApp();

  const [activeTab, setActiveTab] = useState<'overview' | 'challenge' | 'quiz' | 'finish'>('overview');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [shownHintsCount, setShownHintsCount] = useState<Record<string, number>>({});
  const [stepAnswers, setStepAnswers] = useState<Record<string, any>>({});
  const [stepFeedback, setStepFeedback] = useState<Record<string, { isCorrect: boolean; text: string } | null>>({});

  // Quiz state within mission
  const [quizAnswers, setQuizAnswers] = useState<Record<string, any>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);

  const isAlreadyCompleted = student.completedMissionIds.includes(mission.id);
  const alreadyClaimedXp = student.claimedMissionXp.includes(mission.id);

  const currentStep: InteractiveStep | undefined = mission.interactiveSteps[currentStepIndex];

  // Helper for hints
  const handleShowNextHint = (stepId: string, maxHints: number) => {
    setShownHintsCount((prev) => ({
      ...prev,
      [stepId]: Math.min((prev[stepId] || 0) + 1, maxHints),
    }));
  };

  // Step 1: Categorization check
  const handleCategorizeSelect = (itemId: string, category: string) => {
    setStepAnswers((prev) => ({
      ...prev,
      [currentStep.id]: {
        ...(prev[currentStep.id] || {}),
        [itemId]: category,
      },
    }));
  };

  const verifyCategorizeStep = () => {
    const userAnswers = stepAnswers[currentStep.id] || {};
    const items = currentStep.data.items as Array<{ id: string; correctCategory: string }>;
    let allCorrect = true;

    for (const item of items) {
      if (userAnswers[item.id] !== item.correctCategory) {
        allCorrect = false;
        break;
      }
    }

    setStepFeedback((prev) => ({
      ...prev,
      [currentStep.id]: {
        isCorrect: allCorrect,
        text: allCorrect
          ? 'Hebat! Semua perangkat TIK berhasil dikelompokkan dengan tepat sesuai fungsi dasarnya.'
          : 'Ada pengelompokan yang belum tepat. Buka petunjuk untuk melihat cara kerja komponen.',
      },
    }));
  };

  // Step 2: Scenario Decision check
  const handleSelectScenarioOption = (optionId: string, isCorrect: boolean, feedback: string) => {
    setStepAnswers((prev) => ({
      ...prev,
      [currentStep.id]: optionId,
    }));
    setStepFeedback((prev) => ({
      ...prev,
      [currentStep.id]: {
        isCorrect,
        text: feedback,
      },
    }));
  };

  // Step 3: Reorder steps check
  const [reorderedItems, setReorderedItems] = useState<string[]>(() => {
    if (currentStep && currentStep.type === 'order_steps') {
      return [...currentStep.data.initialItems];
    }
    return [];
  });

  const moveItem = (fromIdx: number, toIdx: number) => {
    const list = [...reorderedItems];
    const [moved] = list.splice(fromIdx, 1);
    list.splice(toIdx, 0, moved);
    setReorderedItems(list);
  };

  const verifyOrderStep = () => {
    const correctOrder = currentStep.data.correctOrder as string[];
    const isCorrect = JSON.stringify(reorderedItems) === JSON.stringify(correctOrder);

    setStepFeedback((prev) => ({
      ...prev,
      [currentStep.id]: {
        isCorrect,
        text: isCorrect
          ? 'Sempurna! Urutan algoritma tersusun runtut dan logis.'
          : 'Urutan langkah belum tepat. Periksa kembali alur logika dari input sensor hingga eksekusi akhir.',
      },
    }));
  };

  // Step 4: Matching check
  const [matchedSelections, setMatchedSelections] = useState<Record<string, string>>({});
  const verifyMatchingStep = () => {
    const pairs = currentStep.data.pairs as Array<{ left: string; right: string }>;
    let correctCount = 0;
    pairs.forEach((p) => {
      if (matchedSelections[p.left] === p.right) {
        correctCount++;
      }
    });

    const isAll = correctCount === pairs.length;
    setStepFeedback((prev) => ({
      ...prev,
      [currentStep.id]: {
        isCorrect: isAll,
        text: isAll
          ? `Luar biasa! ${correctCount}/${pairs.length} pasangan konsep cocok sempurna.`
          : `Baru ${correctCount}/${pairs.length} pasangan yang sesuai. Coba cek kembali definisi masing-masing konsep.`,
      },
    }));
  };

  // Quiz submission
  const handleAnswerQuiz = (qId: string, ans: any) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [qId]: ans }));
  };

  const handleSubmitQuiz = () => {
    let correct = 0;
    mission.missionQuiz.forEach((q) => {
      const userAns = quizAnswers[q.id];
      if (q.type === 'multiple_choice' || q.type === 'case_study') {
        if (userAns === q.correctIndex) correct++;
      } else if (q.type === 'true_false') {
        if (userAns === q.correctAnswerBool) correct++;
      }
    });

    const pct = Math.round((correct / mission.missionQuiz.length) * 100);
    setQuizScore(pct);
    setQuizSubmitted(true);
  };

  // Final completion
  const handleClaimMission = () => {
    completeMission(mission.id, mission.xpReward, mission.badge);
    setActiveTab('finish');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        {/* Header Modal */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-900 text-white p-5 sm:p-6 shrink-0 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-300 hover:text-white p-1 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2 text-xs font-semibold text-cyan-300 mb-1">
            <span>{mission.level}</span>
            <span>•</span>
            <span>Topik: {mission.topic}</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white pr-8">
            Misi {mission.number}: {mission.title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            <span className="bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2.5 py-1 rounded-lg font-bold flex items-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                +{mission.xpReward} XP {alreadyClaimedXp && '(Sudah Diklaim)'}
              </span>
            </span>
            <span className="bg-indigo-400/20 text-indigo-200 border border-indigo-400/30 px-2.5 py-1 rounded-lg font-medium">
              Lencana: {mission.badge.name}
            </span>
            <span className="bg-white/10 text-slate-300 px-2.5 py-1 rounded-lg">
              ⏱ ~{mission.estimatedMinutes} Menit
            </span>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-4 sm:px-6 overflow-x-auto shrink-0 text-xs sm:text-sm font-bold text-slate-600">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>1. Ringkasan & Kasus</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('challenge')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'challenge'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>2. Tantangan Interaktif ({mission.interactiveSteps.length} Step)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('quiz')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'quiz'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>3. Kuis Misi ({mission.missionQuiz.length} Soal)</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('finish')}
            className={`py-3 px-3.5 border-b-2 flex items-center space-x-1.5 transition-colors whitespace-nowrap ${
              activeTab === 'finish'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>4. Selesai & Klaim XP</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-7 overflow-y-auto space-y-6 flex-1 text-sm text-slate-700">
          {/* TAB 1: OVERVIEW & CONTEXTUAL CASE */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Learning Objectives */}
              <div className="bg-indigo-50/60 rounded-2xl p-5 border border-indigo-100">
                <h4 className="font-bold text-sm text-indigo-950 flex items-center space-x-2 mb-2.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>Tujuan Pembelajaran (Capaian Pembelajaran Informatika SMK):</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-indigo-900">
                  {mission.learningObjectives.map((obj, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="text-indigo-600 font-bold">•</span>
                      <span>{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Contextual Case Study */}
              <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 space-y-3">
                <div className="flex items-center space-x-2 text-xs font-bold text-indigo-700 uppercase tracking-wide">
                  <span>Peran Kamu:</span>
                  <span className="bg-indigo-100 px-2.5 py-0.5 rounded-full text-indigo-800">
                    {mission.contextualCase.role}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-slate-900 text-sm mb-1">Skenario Lapangan:</h4>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {mission.contextualCase.scenario}
                  </p>
                </div>

                <div className="bg-white p-3.5 rounded-xl border border-slate-200/80 text-xs">
                  <span className="font-bold text-slate-900">Tantangan Utama: </span>
                  <span className="text-slate-700">{mission.contextualCase.challenge}</span>
                </div>
              </div>

              {/* Quick Summary */}
              <div className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-white p-4 rounded-2xl border border-slate-200">
                <div className="font-bold text-slate-900 mb-1">Materi Pengantar:</div>
                {mission.quickSummary}
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('challenge')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm flex items-center space-x-2 shadow-xs"
                >
                  <span>Lanjut ke Tantangan Interaktif</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: INTERACTIVE CHALLENGE (STEPS) */}
          {activeTab === 'challenge' && currentStep && (
            <div className="space-y-6">
              {/* Step Progress Pills */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="text-xs font-bold text-slate-500 uppercase">
                  Tantangan {currentStepIndex + 1} dari {mission.interactiveSteps.length}
                </div>
                <div className="flex space-x-1.5">
                  {mission.interactiveSteps.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentStepIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                        currentStepIndex === idx
                          ? 'bg-indigo-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-slate-900">{currentStep.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">{currentStep.instruction}</p>
              </div>

              {/* STEP TYPE 1: CATEGORIZATION */}
              {currentStep.type === 'categorize' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {currentStep.data.items.map((item: any) => {
                      const selectedCat = stepAnswers[currentStep.id]?.[item.id] || '';
                      return (
                        <div
                          key={item.id}
                          className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                        >
                          <div className="font-bold text-xs sm:text-sm text-slate-900">
                            {item.name}
                          </div>
                          <div className="flex flex-wrap gap-1.5">
                            {currentStep.data.categories.map((cat: string) => (
                              <button
                                key={cat}
                                type="button"
                                onClick={() => handleCategorizeSelect(item.id, cat)}
                                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                                  selectedCat === cat
                                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                                    : 'bg-white text-slate-700 hover:bg-slate-200 border border-slate-200'
                                }`}
                              >
                                {cat}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={verifyCategorizeStep}
                      className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm"
                    >
                      Periksa Pengelompokan
                    </button>
                  </div>
                </div>
              )}

              {/* STEP TYPE 2: SCENARIO DECISION */}
              {currentStep.type === 'scenario_decision' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100 text-xs sm:text-sm text-indigo-950 italic">
                    "{currentStep.data.scenario}"
                  </div>

                  <div className="space-y-2.5">
                    {currentStep.data.options.map((opt: any) => {
                      const isSelected = stepAnswers[currentStep.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() =>
                            handleSelectScenarioOption(opt.id, opt.isCorrect, opt.feedback)
                          }
                          className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start space-x-3 ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/50 text-indigo-950 font-medium'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                          }`}
                        >
                          <div
                            className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 ${
                              isSelected ? 'border-indigo-600 bg-indigo-600 text-white' : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="flex-1">{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* STEP TYPE 3: ORDER STEPS */}
              {currentStep.type === 'order_steps' && (
                <div className="space-y-3">
                  <p className="text-xs text-slate-500">
                    Gunakan tombol panah untuk menaikkan atau menurunkan posisi langkah:
                  </p>
                  <div className="space-y-2">
                    {reorderedItems.map((itemStr, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs sm:text-sm"
                      >
                        <div className="flex items-center space-x-2.5 flex-1 pr-2">
                          <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-xs">
                            {idx + 1}
                          </span>
                          <span className="text-slate-800">{itemStr}</span>
                        </div>
                        <div className="flex space-x-1 shrink-0">
                          <button
                            type="button"
                            disabled={idx === 0}
                            onClick={() => moveItem(idx, idx - 1)}
                            className="p-1 rounded bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-xs"
                          >
                            ▲
                          </button>
                          <button
                            type="button"
                            disabled={idx === reorderedItems.length - 1}
                            onClick={() => moveItem(idx, idx + 1)}
                            className="p-1 rounded bg-white hover:bg-slate-100 disabled:opacity-30 border border-slate-200 text-xs"
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={verifyOrderStep}
                      className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm"
                    >
                      Periksa Urutan Algoritma
                    </button>
                  </div>
                </div>
              )}

              {/* STEP TYPE 4: MATCHING */}
              {currentStep.type === 'matching' && (
                <div className="space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {currentStep.data.pairs.map((p: any, idx: number) => {
                      const selectedVal = matchedSelections[p.left] || '';
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2"
                        >
                          <div className="font-bold text-xs text-indigo-900">{p.left}</div>
                          <select
                            value={selectedVal}
                            onChange={(e) =>
                              setMatchedSelections({
                                ...matchedSelections,
                                [p.left]: e.target.value,
                              })
                            }
                            className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white"
                          >
                            <option value="">-- Pilih Definisi / Fungsi --</option>
                            {currentStep.data.pairs.map((opt: any, optIdx: number) => (
                              <option key={optIdx} value={opt.right}>
                                {opt.right}
                              </option>
                            ))}
                          </select>
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex justify-end pt-2">
                    <button
                      type="button"
                      onClick={verifyMatchingStep}
                      className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs sm:text-sm"
                    >
                      Periksa Kecocokan
                    </button>
                  </div>
                </div>
              )}

              {/* Step Feedback Box */}
              {stepFeedback[currentStep.id] && (
                <div
                  className={`p-4 rounded-2xl border text-xs sm:text-sm ${
                    stepFeedback[currentStep.id]?.isCorrect
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                      : 'bg-amber-50 border-amber-200 text-amber-900'
                  }`}
                >
                  <div className="font-bold flex items-center space-x-1.5 mb-1">
                    {stepFeedback[currentStep.id]?.isCorrect ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <HelpCircle className="w-4 h-4 text-amber-600" />
                    )}
                    <span>
                      {stepFeedback[currentStep.id]?.isCorrect
                        ? 'Analisis Tepat!'
                        : 'Evaluasi Pembelajaran'}
                    </span>
                  </div>
                  <p>{stepFeedback[currentStep.id]?.text}</p>
                  {stepFeedback[currentStep.id]?.isCorrect && (
                    <p className="mt-2 text-xs text-slate-600 border-t border-emerald-200/60 pt-2 italic">
                      💡 <strong>Konsep:</strong> {currentStep.explanation}
                    </p>
                  )}
                </div>
              )}

              {/* Scaffolding Hints Section */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-800">
                    <Lightbulb className="w-4 h-4 text-amber-500" />
                    <span>Petunjuk Bertahap (Scaffolding):</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      handleShowNextHint(currentStep.id, currentStep.hints.length)
                    }
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
                  >
                    + Buka Petunjuk ({(shownHintsCount[currentStep.id] || 0)}/{currentStep.hints.length})
                  </button>
                </div>

                {(shownHintsCount[currentStep.id] || 0) === 0 ? (
                  <p className="text-xs text-slate-500 italic">
                    Butuh arahan langkah? Klik tombol di atas untuk membuka petunjuk pemantik.
                  </p>
                ) : (
                  <div className="space-y-1.5">
                    {currentStep.hints
                      .slice(0, shownHintsCount[currentStep.id])
                      .map((h, i) => (
                        <div
                          key={i}
                          className="text-xs bg-white p-2.5 rounded-lg border border-slate-200 text-slate-700 flex items-start space-x-2"
                        >
                          <span className="font-bold text-indigo-600 shrink-0">H{i + 1}:</span>
                          <span>{h}</span>
                        </div>
                      ))}
                  </div>
                )}
              </div>

              {/* Step Navigation Controls */}
              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  disabled={currentStepIndex === 0}
                  onClick={() => setCurrentStepIndex((prev) => prev - 1)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-40 flex items-center space-x-1 border border-slate-200"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Step Sebelumnya</span>
                </button>

                {currentStepIndex < mission.interactiveSteps.length - 1 ? (
                  <button
                    type="button"
                    onClick={() => setCurrentStepIndex((prev) => prev + 1)}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-xs"
                  >
                    <span>Step Berikutnya</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('quiz')}
                    className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center space-x-1.5 shadow-xs"
                  >
                    <span>Lanjut ke Kuis Misi</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: MISSION QUIZ */}
          {activeTab === 'quiz' && (
            <div className="space-y-6">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm">
                <div className="font-bold text-slate-900 mb-0.5">Uji Pemahaman Misi</div>
                <p className="text-slate-600">
                  Jawab pertanyaan berikut untuk memverifikasi pemahaman konsep sebelum mengklaim lencana.
                </p>
              </div>

              <div className="space-y-5">
                {mission.missionQuiz.map((q, idx) => (
                  <div
                    key={q.id}
                    className="p-4 sm:p-5 rounded-2xl bg-white border border-slate-200 space-y-3"
                  >
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-indigo-600">Pertanyaan {idx + 1}</span>
                      <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
                        {q.difficulty}
                      </span>
                    </div>

                    <div className="font-semibold text-slate-900 text-xs sm:text-sm">
                      {q.question}
                    </div>

                    {/* Multiple choice options */}
                    {q.options && (
                      <div className="space-y-2">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = quizAnswers[q.id] === optIdx;
                          const isCorrectOpt = q.correctIndex === optIdx;

                          let btnStyle =
                            'border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800';
                          if (isSelected) {
                            btnStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold';
                          }
                          if (quizSubmitted) {
                            if (isCorrectOpt) {
                              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                            } else if (isSelected && !isCorrectOpt) {
                              btnStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                            }
                          }

                          return (
                            <button
                              key={optIdx}
                              type="button"
                              onClick={() => handleAnswerQuiz(q.id, optIdx)}
                              className={`w-full text-left p-3 rounded-xl border text-xs sm:text-sm transition-all flex items-center space-x-2.5 ${btnStyle}`}
                            >
                              <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center shrink-0 text-xs">
                                {String.fromCharCode(65 + optIdx)}
                              </span>
                              <span>{opt}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* True/False buttons */}
                    {q.type === 'true_false' && (
                      <div className="grid grid-cols-2 gap-3">
                        {[true, false].map((val) => {
                          const isSelected = quizAnswers[q.id] === val;
                          const isCorrect = q.correctAnswerBool === val;
                          let btnStyle = 'border-slate-200 hover:bg-slate-50 text-slate-800';
                          if (isSelected) {
                            btnStyle = 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold';
                          }
                          if (quizSubmitted) {
                            if (isCorrect) {
                              btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 font-bold';
                            } else if (isSelected && !isCorrect) {
                              btnStyle = 'border-rose-500 bg-rose-50 text-rose-950';
                            }
                          }

                          return (
                            <button
                              key={String(val)}
                              type="button"
                              onClick={() => handleAnswerQuiz(q.id, val)}
                              className={`p-3 rounded-xl border text-xs sm:text-sm font-bold text-center transition-all ${btnStyle}`}
                            >
                              {val ? 'BENAR' : 'SALAH'}
                            </button>
                          );
                        })}
                      </div>
                    )}

                    {/* Explanation after submit */}
                    {quizSubmitted && (
                      <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700">
                        <span className="font-bold text-slate-900">Pembahasan: </span>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('challenge')}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 border border-slate-200"
                >
                  Kembali ke Tantangan
                </button>

                {!quizSubmitted ? (
                  <button
                    type="button"
                    onClick={handleSubmitQuiz}
                    disabled={Object.keys(quizAnswers).length < mission.missionQuiz.length}
                    className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white font-bold text-xs sm:text-sm shadow-xs"
                  >
                    Kumpulkan Jawaban Kuis
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActiveTab('finish')}
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center space-x-1.5"
                  >
                    <span>Lanjut ke Penyelesaian</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* TAB 4: FINISH & CLAIM XP */}
          {activeTab === 'finish' && (
            <div className="text-center py-6 space-y-5 max-w-md mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-500 text-white flex items-center justify-center mx-auto shadow-xl shadow-amber-500/20">
                <Award className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-900">
                  {isAlreadyCompleted ? 'Misi Telah Dituntaskan!' : 'Selamat! Misi Berhasil Dituntaskan!'}
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-1">
                  Kamu telah menyelesaikan seluruh tahapan studi kasus dan kuis pemahaman untuk{' '}
                  <strong>{mission.title}</strong>.
                </p>
              </div>

              {/* Reward Box */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">XP Hadiah:</span>
                  <span className="font-extrabold text-indigo-600 text-sm">
                    +{mission.xpReward} XP {alreadyClaimedXp ? '(Sudah Diklaim)' : ''}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Lencana Diraih:</span>
                  <span className="font-bold text-slate-900">{mission.badge.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Skor Kuis Misi:</span>
                  <span className="font-bold text-emerald-600">{quizScore > 0 ? `${quizScore}%` : '100%'}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-2.5 justify-center">
                {!isAlreadyCompleted && (
                  <button
                    type="button"
                    onClick={handleClaimMission}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold text-xs sm:text-sm shadow-md shadow-indigo-500/20"
                  >
                    Klaim Hadiah & Selesaikan Misi
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    setActiveNavTab('reflection');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-xs flex items-center justify-center space-x-1.5"
                >
                  <ClipboardCheck className="w-4 h-4" />
                  <span>Isi Refleksi Belajar</span>
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Tutup Misi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
