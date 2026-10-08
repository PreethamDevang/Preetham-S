import React, { useState, useEffect } from 'react';
import { TabType } from '../types';
import { IDEATHON_PITCH_SLIDES } from '../data/defaultData';
import { 
  Presentation, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  TrendingUp, 
  ShieldCheck, 
  Users, 
  DollarSign, 
  Zap, 
  ArrowRight,
  Maximize2,
  HelpCircle,
  Play
} from 'lucide-react';

interface IdeathonPitchDeckProps {
  onNavigateToDemo: (tab: TabType) => void;
  onExitPitchMode: () => void;
}

export const IdeathonPitchDeck: React.FC<IdeathonPitchDeckProps> = ({
  onNavigateToDemo,
  onExitPitchMode,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [showQACheatSheet, setShowQACheatSheet] = useState(false);

  const currentSlide = IDEATHON_PITCH_SLIDES[slideIndex];

  const handleNext = () => {
    if (slideIndex < IDEATHON_PITCH_SLIDES.length - 1) {
      setSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (slideIndex > 0) {
      setSlideIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'Space') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        onExitPitchMode();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slideIndex]);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Pitch Deck Top Controls */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
          <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
            Ideathon Pitch Mode · Slide {slideIndex + 1} of {IDEATHON_PITCH_SLIDES.length}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">
            (Use Arrow Keys or Space to advance)
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQACheatSheet(!showQACheatSheet)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
            <span>{showQACheatSheet ? 'Hide Judges Q&A' : 'Judges Q&A Defense'}</span>
          </button>

          <button
            onClick={onExitPitchMode}
            className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
          >
            Exit Pitch
          </button>
        </div>
      </div>

      {/* Main Pitch Slide Frame */}
      <div className="relative min-h-[480px] sm:min-h-[520px] rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-slate-900 via-indigo-950/30 to-slate-950 border border-indigo-800/50 shadow-2xl flex flex-col justify-between overflow-hidden">
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header of Slide */}
        <div className="relative z-10 flex items-center justify-between border-b border-white/10 pb-5">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs font-extrabold text-amber-400 bg-amber-950/60 border border-amber-700/60 px-2.5 py-1 rounded-md">
              {currentSlide.number} / 06
            </span>
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest font-mono">
              {currentSlide.category}
            </span>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            EduConnect OS · Pitch Deck
          </div>
        </div>

        {/* Core Slide Content */}
        <div className="relative z-10 py-6 my-auto space-y-6">
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight text-balance">
              {currentSlide.title}
            </h1>
            <p className="text-base sm:text-lg text-indigo-300 font-medium text-balance">
              {currentSlide.headline}
            </p>
          </div>

          <div className="space-y-4 max-w-3xl">
            {currentSlide.bullets.map((bullet, idx) => (
              <div key={idx} className="flex items-start gap-3.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 mt-2 shrink-0" />
                <span className="text-sm sm:text-base text-slate-200 leading-relaxed">
                  {bullet}
                </span>
              </div>
            ))}
          </div>

          {/* Key Stat / Metric Callout */}
          <div className="pt-2 flex flex-wrap items-center gap-4">
            <div className="inline-flex items-center gap-3 px-4 py-2.5 rounded-xl bg-slate-950/90 border border-amber-500/40 shadow-lg">
              <span className="text-xs text-slate-400 uppercase font-mono font-medium">Highlight:</span>
              <span className="text-sm sm:text-base font-extrabold text-amber-400 font-mono">
                {currentSlide.metric}
              </span>
            </div>

            <div className="text-xs italic text-slate-400 border-l-2 border-indigo-500 pl-3 hidden sm:block max-w-md">
              "{currentSlide.marketQuote}"
            </div>
          </div>
        </div>

        {/* Slide Footer with Stepper Controls */}
        <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-5">
          {/* Stepper Dots */}
          <div className="flex items-center gap-2">
            {IDEATHON_PITCH_SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setSlideIndex(idx)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  slideIndex === idx ? 'w-8 bg-amber-400' : 'w-2 bg-slate-700 hover:bg-slate-500'
                }`}
                aria-label={`Jump to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={slideIndex === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            <button
              onClick={handleNext}
              disabled={slideIndex === IDEATHON_PITCH_SLIDES.length - 1}
              className="flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
            >
              <span>Next Slide</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Live Interactive Product Demo Quick-Launcher */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Play className="w-4 h-4 text-emerald-400" />
              <span>Live Ideathon Product Demonstration Shortcuts</span>
            </h3>
            <p className="text-xs text-slate-400">
              Jump directly to working features during your pitch to prove execution feasibility to the judges:
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button
            onClick={() => onNavigateToDemo('voice-organizer')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-indigo-500 text-left transition-colors group cursor-pointer"
          >
            <div className="text-xs font-bold text-white group-hover:text-indigo-400">
              1. Voice-to-Action
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Live mic & action sync</div>
          </button>

          <button
            onClick={() => onNavigateToDemo('quiz-maker')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left transition-colors group cursor-pointer"
          >
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">
              2. Note-to-Quiz
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Instant AI assessment</div>
          </button>

          <button
            onClick={() => onNavigateToDemo('resume-jobs')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500 text-left transition-colors group cursor-pointer"
          >
            <div className="text-xs font-bold text-white group-hover:text-teal-400">
              3. ATS Job Matcher
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Live keyword tailoring</div>
          </button>

          <button
            onClick={() => onNavigateToDemo('health-guider')}
            className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-emerald-500 text-left transition-colors group cursor-pointer"
          >
            <div className="text-xs font-bold text-white group-hover:text-emerald-400">
              4. Health & Circadian
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">Lab translator & stamina</div>
          </button>
        </div>
      </div>

      {/* Judges Q&A Defense Cheat Sheet */}
      {showQACheatSheet && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-amber-400" />
              <span>Judges' Hard Q&A Defense Cheat Sheet</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">VC / Panel Preparation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-300">
                Q: "Why will universities pay for this instead of Canvas?"
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Answer:</strong> Canvas is a passive grading registry that students dislike. Student dropout costs universities $32,000+ per student in lost tuition. EduConnect's circadian burnout radar and academic velocity directly increase student retention and graduation rates, justifying student affairs budget procurement.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-300">
                Q: "How do you protect sensitive student health data?"
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Answer:</strong> We enforce zero-retention edge parsing. Lab report text is processed in transient memory through enterprise HIPAA-compliant API boundaries and never stored or used to train foundational models. The student owns their encrypted local health vault.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-bold text-amber-300">
                Q: "What prevents Notion or Quizlet from copying you?"
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong>Answer:</strong> Point solutions suffer from siloed utility. Quizlet does not know a student's blood iron levels or upcoming recruiter interview; Notion requires tedious manual database setup. EduConnect provides an autonomous closed-loop bio-cognitive flywheel that self-optimizes without user drag.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
