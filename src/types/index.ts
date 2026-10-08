export type TabType = 
  | 'overview'
  | 'voice-organizer'
  | 'email-digest'
  | 'quiz-maker'
  | 'slides-flashcards'
  | 'workflow-automator'
  | 'campus-agent'
  | 'resume-jobs'
  | 'health-guider'
  | 'pitch-deck';

export interface ActionItem {
  id: string;
  task: string;
  course: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  category: 'assignment' | 'reading' | 'exam' | 'admin';
}

export interface VoiceNoteRecord {
  id: string;
  title: string;
  timestamp: string;
  duration: string;
  transcript: string;
  summary: string;
  actionItems: ActionItem[];
  tags: string[];
}

export interface EmailMessage {
  id: string;
  sender: string;
  senderRole: 'Professor' | 'Recruiter' | 'TA' | 'Administration' | 'Peer';
  subject: string;
  snippet: string;
  fullBody: string;
  date: string;
  priority: 'Urgent' | 'Important' | 'Informational';
  category: 'Academic' | 'Career' | 'Campus' | 'Project';
  suggestedAction: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface QuizSet {
  id: string;
  title: string;
  topic: string;
  questions: QuizQuestion[];
  createdDate: string;
}

export interface SlideData {
  id: number;
  title: string;
  subtitle?: string;
  bullets: string[];
  notes: string;
  highlightStat?: string;
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  masteryLevel: 'learning' | 'review' | 'mastered';
  lastReviewed?: string;
}

export interface AutomationWorkflow {
  id: string;
  title: string;
  description: string;
  trigger: {
    event: string;
    source: string;
  };
  actions: {
    id: string;
    action: string;
    target: string;
    status: 'idle' | 'running' | 'success' | 'failed';
  }[];
  enabled: boolean;
  runCount: number;
  lastRun?: string;
}

export interface CampusOpportunity {
  id: string;
  title: string;
  organization: string;
  type: 'Hackathon' | 'Research Lab' | 'Internship' | 'Fellowship' | 'Leadership';
  deadline: string;
  compensation: string;
  matchScore: number;
  tags: string[];
  description: string;
  requirements: string[];
  contactPerson: string;
}

export interface ResumeProfile {
  name: string;
  email: string;
  education: {
    institution: string;
    degree: string;
    graduationYear: string;
    gpa: string;
  };
  skills: string[];
  experience: {
    id: string;
    role: string;
    company: string;
    duration: string;
    bullets: string[];
  }[];
  projects: {
    id: string;
    title: string;
    tech: string;
    description: string;
  }[];
}

export interface JobPosting {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Summer 2027 Internship' | 'Fall Co-op' | 'New Grad' | 'Campus Lab';
  matchScore: number;
  requiredSkills: string[];
  description: string;
  atsKeywords: string[];
}

export interface HealthRecordTranslation {
  id: string;
  date: string;
  testName: string;
  originalReportSnippet: string;
  plainEnglishSummary: string;
  keyMetrics: {
    name: string;
    value: string;
    standardRange: string;
    status: 'optimal' | 'attention' | 'low' | 'high';
    studentImpact: string;
  }[];
  studyStaminaAdvice: string;
  recommendedQuestionsForDoctor: string[];
  nutritionCircadianAdvice: string;
}

export interface CircadianMetric {
  hour: number;
  phase: string;
  alertnessLevel: number; // 0 - 100
  recommendedActivity: string;
  currentHour?: boolean;
}
