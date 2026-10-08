import React from 'react';
import { TabType, ActionItem, EmailMessage, CampusOpportunity } from '../types';
import { PomodoroTimer } from './PomodoroTimer';
import { 
  Mic, 
  Mail, 
  BookOpen, 
  Layers, 
  Zap, 
  Sparkles, 
  Briefcase, 
  Activity, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  Presentation
} from 'lucide-react';

interface OverviewDashboardProps {
  onNavigate: (tab: TabType) => void;
  actionItems: ActionItem[];
  emails: EmailMessage[];
  opportunities: CampusOpportunity[];
  onTogglePitchMode: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  onNavigate,
  actionItems,
  emails,
  opportunities,
  onTogglePitchMode,
}) => {
  const pendingTasks = actionItems.filter((item) => !item.completed);
  const urgentEmails = emails.filter((e) => e.priority === 'Urgent');
  const topOpp = opportunities[0];

  return (
    <div className="space-y-8 pb-12">
      {/* Hero Showcase Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
        <div className="relative h-64 sm:h-72 lg:h-80 w-full overflow-hidden">
          <img
            src="/src/assets/images/educonnect_hero_1791478397414.jpg"
            alt="EduConnect OS Collaborative Academic Commons"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-85"
            onError={(e) => {
              // Resilient fallback container if needed
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          {/* Measured contrast scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end">
          <div className="max-w-3xl space-y-3">
            <div className="flex items-center gap-2 text-xs text-indigo-300 font-medium tracking-wide">
              <span>Bio-Cognitive Student OS</span>
              <span aria-hidden="true">·</span>
              <span>Class of 2027</span>
              <span aria-hidden="true">·</span>
              <span className="text-emerald-400 font-semibold">Live Circadian Peak (Alertness: 98%)</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
              EduConnect OS: Synchronizing Mind, Career & Biology
            </h1>

            <p className="text-sm sm:text-base text-slate-300 max-w-2xl text-balance">
              The autonomous operating system for higher education. Synthesize voice lectures into actions, triage campus emails, generate quizzes and slides, match opportunities, and monitor circadian stamina.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigate('voice-organizer')}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-lg transition-colors shadow-sm"
              >
                <Mic className="w-3.5 h-3.5" />
                <span>Voice-to-Action Organizer</span>
              </button>

              <button
                onClick={onTogglePitchMode}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>Launch Ideathon Pitch Deck</span>
              </button>

              <button
                onClick={() => onNavigate('health-guider')}
                className="flex items-center gap-2 px-4 py-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Health & Circadian Radar</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Metrics & Circadian Vitals Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Circadian Alertness</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-emerald-400">98%</div>
          <div className="text-xs text-slate-400">Deep Work Window (10 AM - 12 PM)</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Pending Actions</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-indigo-400">
            {pendingTasks.length} Tasks
          </div>
          <div className="text-xs text-slate-400">2 Due within 24 Hours</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">ATS Resume Match</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-cyan-400">94 / 100</div>
          <div className="text-xs text-slate-400">Palantir Distributed Systems</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
          <div className="text-xs text-slate-400">Bio-Stamina Factor</div>
          <div className="text-2xl font-bold font-mono tabular-nums text-amber-400">Good (7.2h)</div>
          <div className="text-xs text-slate-400">Vitamin D & Ferritin tracking</div>
        </div>
      </div>

      {/* Integrated Pomodoro Focus Sprint Engine */}
      <PomodoroTimer actionItems={actionItems} />

      {/* 8 Modular Feature Superpowers Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white tracking-tight">
            Integrated Autonomous Superpowers
          </h2>
          <span className="text-xs text-slate-400">8 Connected Engines</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Feature 1 */}
          <button
            onClick={() => onNavigate('voice-organizer')}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-indigo-950/70 text-indigo-400 flex items-center justify-center border border-indigo-800/40">
                <Mic className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
                Voice-to-Action Organizer
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Record lectures or dictations. Automatically extract deadlines, task priorities, and calendar items.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs text-indigo-400 font-medium">
              <span>Open Recorder</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Feature 2 */}
          <button
            onClick={() => onNavigate('email-digest')}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/50 hover:bg-slate-850 text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-blue-950/70 text-blue-400 flex items-center justify-center border border-blue-800/40">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-blue-300 transition-colors">
                Email Digest & Smart Reply
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Triage campus emails with AI priority ranking. Shift tone from Formal Professor to Recruiter in 1 click.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs text-blue-400 font-medium">
              <span>Review Inbox ({urgentEmails.length} Urgent)</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Feature 3 */}
          <button
            onClick={() => onNavigate('quiz-maker')}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-950/70 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
                <BookOpen className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                Automated Quiz Generator
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Turn rough study notes and textbook excerpts into interactive exam quizzes with instant scoring.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span>Generate Quiz</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Feature 4 */}
          <button
            onClick={() => onNavigate('slides-flashcards')}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/50 hover:bg-slate-850 text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-purple-950/70 text-purple-400 flex items-center justify-center border border-purple-800/40">
                <Layers className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-purple-300 transition-colors">
                PDF to Slides & Flashcards
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Instant slide decks for presentations + 3D Leitner spaced repetition flashcards for exam mastery.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs text-purple-400 font-medium">
              <span>View Decks</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Feature 5 */}
          <button
            onClick={() => onNavigate('workflow-automator')}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 hover:bg-slate-850 text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-amber-950/70 text-amber-400 flex items-center justify-center border border-amber-800/40">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                AI Workflow Automator
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Campus "Zapier" chaining triggers: lecture recordings to quizzes, recruiter emails to resume drafts.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs text-amber-400 font-medium">
              <span>Configure Flows</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Feature 6 */}
          <button
            onClick={() => onNavigate('campus-agent')}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-850 text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-rose-950/70 text-rose-400 flex items-center justify-center border border-rose-800/40">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
                AI Campus Opportunity Agent
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Autonomous crawler for hackathons, research labs, fellowships, and leadership opportunities.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs text-rose-400 font-medium">
              <span>Explore Opportunities</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Feature 7 */}
          <button
            onClick={() => onNavigate('resume-jobs')}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-teal-950/70 text-teal-400 flex items-center justify-center border border-teal-800/40">
                <Briefcase className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-teal-300 transition-colors">
                Resume Builder & Job Matcher
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Interactive resume editor with live ATS scoring against top internships and 1-click bullet point tailoring.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs text-teal-400 font-medium">
              <span>Optimize Resume</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Feature 8 */}
          <button
            onClick={() => onNavigate('health-guider')}
            className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 text-left transition-all group cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-2.5">
              <div className="w-9 h-9 rounded-lg bg-emerald-950/70 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
                <Activity className="w-5 h-5" />
              </div>
              <h3 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                Health Record & Circadian Guide
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Translate confusing medical lab reports to student English + 24-hour circadian study rhythm alignment.
              </p>
            </div>
            <div className="pt-4 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
              <span>Check Bio-Stamina</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </button>
        </div>
      </div>

      {/* Two Column Section: Action Velocity & Bio-Circadian Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Urgent Action Items & Deadlines */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Active Academic Deadlines</h3>
              <p className="text-xs text-slate-400">Synthesized from voice notes and course syllabi</p>
            </div>
            <button
              onClick={() => onNavigate('voice-organizer')}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
            >
              Manage All ({actionItems.length})
            </button>
          </div>

          <div className="space-y-2.5">
            {pendingTasks.slice(0, 4).map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-start gap-3 group"
              >
                <div className="mt-0.5 text-slate-500">
                  <Clock className="w-4 h-4 text-amber-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-slate-200 group-hover:text-white transition-colors truncate">
                    {task.task}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="font-mono text-indigo-400">{task.course}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-amber-400/90 font-medium">{task.dueDate}</span>
                    <span aria-hidden="true">·</span>
                    <span className={task.priority === 'high' ? 'text-rose-400' : 'text-slate-400'}>
                      {task.priority.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Featured Opportunity & Circadian Insight */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">Campus Opportunity Match</h3>
              <p className="text-xs text-slate-400">Targeted match for Computer Science & Bio-Intelligence</p>
            </div>
            <button
              onClick={() => onNavigate('campus-agent')}
              className="text-xs text-rose-400 hover:text-rose-300 font-medium"
            >
              View Feed
            </button>
          </div>

          {topOpp && (
            <div className="p-4 rounded-xl bg-gradient-to-br from-slate-950 to-indigo-950/20 border border-indigo-900/40 space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-sm font-bold text-white">{topOpp.title}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">{topOpp.organization}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono tabular-nums text-emerald-400">
                    {topOpp.matchScore}%
                  </div>
                  <div className="text-xs text-slate-400">Compatibility</div>
                </div>
              </div>

              <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                {topOpp.description}
              </p>

              <div className="flex items-center justify-between pt-1">
                <div className="text-xs text-slate-400 font-mono">
                  Deadline: <span className="text-slate-200">{topOpp.deadline}</span>
                </div>
                <button
                  onClick={() => onNavigate('campus-agent')}
                  className="px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-md transition-colors"
                >
                  AI Cold Pitch
                </button>
              </div>
            </div>
          )}

          {/* Quick Circadian Tip */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-950/60 text-emerald-400 flex items-center justify-center shrink-0">
              <Activity className="w-4 h-4" />
            </div>
            <div className="text-xs text-slate-300">
              <strong className="text-white">Circadian Recommendation:</strong> Peak prefrontal focus is active until 12:00 PM. Tackle your Raft consensus coding lab now before afternoon biological dip.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
