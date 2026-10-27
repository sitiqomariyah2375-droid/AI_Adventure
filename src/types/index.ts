export type UserRole = 'siswa' | 'guru';

export type MissionLevel = 'Level 1 — Explorer' | 'Level 2 — Problem Solver' | 'Level 3 — Digital Innovator';

export type QuestionType = 'multiple_choice' | 'true_false' | 'matching' | 'reorder' | 'case_study';

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  topic: string;
  difficulty: 'Dasar' | 'Menengah' | 'Tantangan';
  question: string;
  context?: string;
  options?: string[];
  correctIndex?: number;
  correctAnswerBool?: boolean;
  matchingPairs?: Array<{ left: string; right: string }>;
  reorderItems?: string[]; // Correct order
  explanation: string;
  hint: string;
  reviewTopic: string;
}

export interface InteractiveStep {
  id: string;
  title: string;
  type: 'order_steps' | 'categorize' | 'multiple_choice' | 'scenario_decision' | 'matching';
  instruction: string;
  data: any;
  hints: string[];
  explanation: string;
}

export interface Mission {
  id: string;
  number: number;
  title: string;
  subtitle: string;
  level: MissionLevel;
  topic: string;
  estimatedMinutes: number;
  xpReward: number;
  badge: {
    name: string;
    icon: string;
    description: string;
  };
  learningObjectives: string[];
  quickSummary: string;
  contextualCase: {
    scenario: string;
    role: string;
    challenge: string;
  };
  interactiveSteps: InteractiveStep[];
  missionQuiz: QuizQuestion[];
  status: 'locked' | 'available' | 'in_progress' | 'completed';
}

export interface QuizAttempt {
  id: string;
  timestamp: string;
  topic: string;
  mode: 'bank' | 'dynamic';
  totalQuestions: number;
  correctCount: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  reviewTopics: string[];
  userAnswers: Record<string, any>;
}

export interface CreatorProject {
  id: string;
  title: string;
  projectType: string;
  theme: string;
  goal: string;
  targetAudience: string;
  studentIdeas: string;
  aiAssistanceNote: string;
  sourcesUsed: string;
  content: string;
  createdAt: string;
}

export interface ReflectionRecord {
  id: string;
  missionId: string;
  missionTitle: string;
  timestamp: string;
  answers: {
    q1: string; // Hal baru
    q2: string; // Paling menantang
    q3: string; // Bantuan AI
    q4: string; // Verifikasi/koreksi AI
    q5: string; // Penerapan nyata
  };
  aiFeedback?: string;
  teacherNote?: string;
}

export interface StudentProfile {
  id: string;
  name: string;
  nisn: string;
  school: string;
  gradeClass: string;
  avatar: string;
  xp: number;
  levelTitle: 'Explorer' | 'Problem Solver' | 'Digital Innovator';
  levelNumber: number;
  claimedMissionXp: string[]; // mission IDs to prevent duplicate XP claims
  completedMissionIds: string[];
  badges: Array<{
    id: string;
    name: string;
    icon: string;
    earnedAt: string;
    description: string;
  }>;
  quizAttempts: QuizAttempt[];
  creatorProjects: CreatorProject[];
  reflections: ReflectionRecord[];
  dailyStreak: number;
}
