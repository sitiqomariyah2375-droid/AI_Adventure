import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import confetti from 'canvas-confetti';
import {
  UserRole,
  StudentProfile,
  Mission,
  QuizAttempt,
  CreatorProject,
  ReflectionRecord,
  QuizQuestion,
} from '../types';
import { INITIAL_MISSIONS } from '../data/initialMissions';
import { QUESTION_BANK } from '../data/questionBank';
import { DEMO_COHORT_STUDENTS } from '../data/demoStudents';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  student: StudentProfile;
  missions: Mission[];
  questionBank: QuizQuestion[];
  cohortStudents: StudentProfile[];
  updateStudent: (updates: Partial<StudentProfile>) => void;
  completeMission: (missionId: string, rewardXp: number, badge?: any) => boolean;
  saveQuizAttempt: (attempt: QuizAttempt) => void;
  saveCreatorProject: (project: CreatorProject) => void;
  saveReflection: (reflection: ReflectionRecord) => void;
  updateTeacherNote: (studentId: string, reflectionId: string, note: string) => void;
  addQuestionToBank: (q: QuizQuestion) => void;
  addMission: (m: Mission) => void;
  resetProgress: () => void;
  triggerCelebration: () => void;
  activeMissionId: string | null;
  setActiveMissionId: (id: string | null) => void;
  activeNavTab: string;
  setActiveNavTab: (tab: string) => void;
}

const STORAGE_KEY = 'ai_learning_adventure_student_v2';
const QUESTIONS_STORAGE_KEY = 'ai_learning_adventure_questions_v2';
const MISSIONS_STORAGE_KEY = 'ai_learning_adventure_missions_v2';

const DEFAULT_STUDENT: StudentProfile = {
  id: 'current-siswa-user',
  name: 'Rizky Pratama',
  nisn: '0089234120',
  school: 'SMK Negeri 1 Surabaya',
  gradeClass: 'X-RPL 1',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  xp: 350,
  levelTitle: 'Explorer',
  levelNumber: 1,
  claimedMissionXp: ['misi-1'],
  completedMissionIds: ['misi-1'],
  badges: [
    {
      id: 'b1',
      name: 'Hardware Master',
      icon: 'Cpu',
      earnedAt: new Date().toISOString().split('T')[0],
      description: 'Berhasil menguasai klasifikasi hardware & upgrade workstation.',
    },
  ],
  quizAttempts: [
    {
      id: 'init-attempt-1',
      timestamp: new Date().toISOString(),
      topic: 'Perangkat TIK',
      mode: 'bank',
      totalQuestions: 6,
      correctCount: 5,
      scorePercentage: 83,
      timeSpentSeconds: 155,
      reviewTopics: ['Hirarki Memori Komputer'],
      userAnswers: {},
    },
  ],
  creatorProjects: [],
  reflections: [
    {
      id: 'init-ref-1',
      missionId: 'misi-1',
      missionTitle: 'Kenali Perangkat TIK',
      timestamp: new Date().toISOString(),
      answers: {
        q1: 'Saya belajar perbedaan RAM yang sementara dan NVMe SSD yang menyimpan file permanen.',
        q2: 'Menghafal letak cache L1/L2/L3 pada prosesor.',
        q3: 'AI membantu memberi analogi lemari berkas (storage) dan meja kerja (RAM).',
        q4: 'Tidak ada, penjelasannya logis.',
        q5: 'Saya bisa membantu teman memilih laptop yang cocok untuk jurusan multimedia.',
      },
      aiFeedback: 'Analogi lemari berkas dan meja kerja sangat tepat untuk mengingat perbedaan sifat memori volatile dan non-volatile.',
      teacherNote: 'Awal yang hebat, Rizky! Lanjutkan ke Misi Berpikir Komputasional.',
    },
  ],
  dailyStreak: 3,
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('siswa');
  const [activeNavTab, setActiveNavTab] = useState<string>('dashboard');
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);

  // Load student profile
  const [student, setStudent] = useState<StudentProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('Error reading stored student:', e);
    }
    return DEFAULT_STUDENT;
  });

  // Load custom questions if any
  const [questionBank, setQuestionBank] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(QUESTIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading stored questions:', e);
    }
    return QUESTION_BANK;
  });

  // Load missions
  const [missionsList, setMissionsList] = useState<Mission[]>(() => {
    try {
      const saved = localStorage.getItem(MISSIONS_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error reading stored missions:', e);
    }
    return INITIAL_MISSIONS;
  });

  // Sync student to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(student));
    } catch (e) {
      console.warn('Error saving student to storage:', e);
    }
  }, [student]);

  // Recalculate level based on XP
  const calculateLevel = (totalXp: number): { title: 'Explorer' | 'Problem Solver' | 'Digital Innovator'; level: number } => {
    if (totalXp >= 1200) {
      return { title: 'Digital Innovator', level: 3 };
    } else if (totalXp >= 600) {
      return { title: 'Problem Solver', level: 2 };
    } else {
      return { title: 'Explorer', level: 1 };
    }
  };

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#06b6d4', '#6366f1', '#eab308', '#10b981', '#3b82f6'],
      });
    } catch (e) {
      // ignore in environments without canvas
    }
  };

  const updateStudent = (updates: Partial<StudentProfile>) => {
    setStudent((prev) => {
      const updated = { ...prev, ...updates };
      const { title, level } = calculateLevel(updated.xp);
      updated.levelTitle = title;
      updated.levelNumber = level;
      return updated;
    });
  };

  const completeMission = (missionId: string, rewardXp: number, badge?: any): boolean => {
    let xpAdded = false;

    setStudent((prev) => {
      const alreadyClaimed = prev.claimedMissionXp.includes(missionId);
      const isCompleted = prev.completedMissionIds.includes(missionId);

      const nextCompleted = isCompleted ? prev.completedMissionIds : [...prev.completedMissionIds, missionId];
      const nextClaimed = alreadyClaimed ? prev.claimedMissionXp : [...prev.claimedMissionXp, missionId];
      const newXp = alreadyClaimed ? prev.xp : prev.xp + rewardXp;

      if (!alreadyClaimed) {
        xpAdded = true;
      }

      // Check badge
      let nextBadges = [...prev.badges];
      if (badge && !nextBadges.some((b) => b.name === badge.name)) {
        nextBadges.push({
          id: `badge-${missionId}`,
          name: badge.name,
          icon: badge.icon,
          earnedAt: new Date().toISOString().split('T')[0],
          description: badge.description,
        });
      }

      const { title, level } = calculateLevel(newXp);

      return {
        ...prev,
        xp: newXp,
        levelTitle: title,
        levelNumber: level,
        claimedMissionXp: nextClaimed,
        completedMissionIds: nextCompleted,
        badges: nextBadges,
      };
    });

    if (xpAdded) {
      triggerCelebration();
    }
    return xpAdded;
  };

  const saveQuizAttempt = (attempt: QuizAttempt) => {
    setStudent((prev) => {
      // Add small bonus XP for quiz attempt (e.g. 10 XP per correct question)
      const earnedXp = Math.min(attempt.correctCount * 15, 100);
      const newXp = prev.xp + earnedXp;
      const { title, level } = calculateLevel(newXp);

      return {
        ...prev,
        xp: newXp,
        levelTitle: title,
        levelNumber: level,
        quizAttempts: [attempt, ...prev.quizAttempts],
      };
    });

    if (attempt.scorePercentage >= 80) {
      triggerCelebration();
    }
  };

  const saveCreatorProject = (project: CreatorProject) => {
    setStudent((prev) => {
      const existingIdx = prev.creatorProjects.findIndex((p) => p.id === project.id);
      let updatedProjects = [...prev.creatorProjects];
      let bonusXp = 0;

      if (existingIdx >= 0) {
        updatedProjects[existingIdx] = project;
      } else {
        updatedProjects = [project, ...updatedProjects];
        bonusXp = 150; // XP for new project creation
      }

      const newXp = prev.xp + bonusXp;
      const { title, level } = calculateLevel(newXp);

      return {
        ...prev,
        xp: newXp,
        levelTitle: title,
        levelNumber: level,
        creatorProjects: updatedProjects,
      };
    });
    triggerCelebration();
  };

  const saveReflection = (reflection: ReflectionRecord) => {
    setStudent((prev) => {
      const updatedReflections = [reflection, ...prev.reflections.filter((r) => r.id !== reflection.id)];
      // 50 XP reward for completing reflection
      const newXp = prev.xp + 50;
      const { title, level } = calculateLevel(newXp);

      return {
        ...prev,
        xp: newXp,
        levelTitle: title,
        levelNumber: level,
        reflections: updatedReflections,
      };
    });
  };

  const updateTeacherNote = (targetStudentId: string, reflectionId: string, note: string) => {
    if (targetStudentId === student.id) {
      setStudent((prev) => ({
        ...prev,
        reflections: prev.reflections.map((r) => (r.id === reflectionId ? { ...r, teacherNote: note } : r)),
      }));
    }
  };

  const addQuestionToBank = (q: QuizQuestion) => {
    setQuestionBank((prev) => {
      const updated = [q, ...prev];
      try {
        localStorage.setItem(QUESTIONS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const addMission = (m: Mission) => {
    setMissionsList((prev) => {
      const updated = [...prev, m];
      try {
        localStorage.setItem(MISSIONS_STORAGE_KEY, JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const resetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setStudent(DEFAULT_STUDENT);
  };

  // Combine demo cohort + current student for Teacher View
  const cohortStudents = [student, ...DEMO_COHORT_STUDENTS];

  // Map missions with live student completion status
  const missionsWithStatus: Mission[] = missionsList.map((m) => {
    const isCompleted = student.completedMissionIds.includes(m.id);
    return {
      ...m,
      status: isCompleted ? 'completed' : 'available',
    };
  });

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        student,
        missions: missionsWithStatus,
        questionBank,
        cohortStudents,
        updateStudent,
        completeMission,
        saveQuizAttempt,
        saveCreatorProject,
        saveReflection,
        updateTeacherNote,
        addQuestionToBank,
        addMission,
        resetProgress,
        triggerCelebration,
        activeMissionId,
        setActiveMissionId,
        activeNavTab,
        setActiveNavTab,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
