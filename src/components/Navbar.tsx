import React from 'react';
import { TabType } from '../types';
import { Sparkles, Presentation, Activity, GraduationCap, Briefcase, Zap, Mic, Mail, BookOpen, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  pitchMode: boolean;
  onTogglePitchMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  pitchMode,
  onTogglePitchMode,
}) => {
  const navItems: { id: TabType; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <GraduationCap className="w-4 h-4" /> },
    { id: 'voice-organizer', label: 'Voice Organizer', icon: <Mic className="w-4 h-4" /> },
    { id: 'email-digest', label: 'Email Digest', icon: <Mail className="w-4 h-4" /> },
    { id: 'quiz-maker', label: 'Quiz Maker', icon: <BookOpen className="w-4 h-4" /> },
    { id: 'slides-flashcards', label: 'Slides & Flashcards', icon: <Layers className="w-4 h-4" /> },
    { id: 'workflow-automator', label: 'AI Automations', icon: <Zap className="w-4 h-4" /> },
    { id: 'campus-agent', label: 'Campus Opps', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'resume-jobs', label: 'Resume & Jobs', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'health-guider', label: 'Health & Circadian', icon: <Activity className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-50 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 lg:px-8 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => onTabChange('overview')}
            className="text-left group cursor-pointer focus:outline-none"
          >
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">
              EduConnect<span className="text-indigo-500 font-black">OS</span>
            </span>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line, unboxed, text with hover states) */}
        <nav className="hidden xl:flex items-center gap-1 overflow-x-auto py-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.id && !pitchMode;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (pitchMode) onTogglePitchMode();
                  onTabChange(item.id);
                }}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-white bg-slate-800/90 shadow-sm border border-slate-700/60'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
                }`}
              >
                <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>
                  {item.icon}
                </span>
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Mobile / Compact Tab Select */}
        <div className="xl:hidden flex items-center">
          <select
            value={activeTab}
            onChange={(e) => {
              if (pitchMode) onTogglePitchMode();
              onTabChange(e.target.value as TabType);
            }}
            className="bg-slate-900 border border-slate-700 text-xs text-slate-200 rounded-md px-2.5 py-1.5 focus:outline-none focus:border-indigo-500"
          >
            {navItems.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        {/* Zone 3: Primary Action: Ideathon Pitch Mode */}
        <div className="flex items-center gap-2">
          <button
            onClick={onTogglePitchMode}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              pitchMode
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20 ring-2 ring-amber-400'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>{pitchMode ? 'Exit Pitch Deck' : 'Ideathon Pitch Deck'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
