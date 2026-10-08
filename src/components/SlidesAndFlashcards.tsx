import React, { useState } from 'react';
import { SlideData, Flashcard } from '../types';
import { generateSlidesFromNotesAI } from '../services/geminiService';
import { 
  Layers, 
  Presentation, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  RotateCw, 
  Download, 
  Plus, 
  Check, 
  HelpCircle,
  FileText,
  Sliders,
  Sparkle
} from 'lucide-react';

interface SlidesAndFlashcardsProps {
  slides: SlideData[];
  flashcards: Flashcard[];
  onAddSlides: (slides: SlideData[]) => void;
  onAddFlashcard: (card: Flashcard) => void;
}

export const SlidesAndFlashcards: React.FC<SlidesAndFlashcardsProps> = ({
  slides,
  flashcards,
  onAddSlides,
  onAddFlashcard,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'slides' | 'flashcards'>('slides');

  // Slide Presenter State
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeSlides, setActiveSlides] = useState<SlideData[]>(slides);
  const [notesInput, setNotesInput] = useState('');
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);
  const [showSpeakerNotes, setShowSpeakerNotes] = useState(true);
  const [slideTheme, setSlideTheme] = useState<'indigo' | 'slate' | 'cyber'>('indigo');

  // Flashcards State
  const [activeCards, setActiveCards] = useState<Flashcard[]>(flashcards);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [newFront, setNewFront] = useState('');
  const [newBack, setNewBack] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);

  const currentSlide = activeSlides[currentSlideIndex] || activeSlides[0];
  const currentCard = activeCards[currentCardIndex] || activeCards[0];

  const handleNextSlide = () => {
    if (currentSlideIndex < activeSlides.length - 1) {
      setCurrentSlideIndex((prev) => prev + 1);
    }
  };

  const handlePrevSlide = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prev) => prev - 1);
    }
  };

  const handleGenerateSlides = async () => {
    if (!notesInput.trim()) return;
    setIsGeneratingSlides(true);
    try {
      const generated = await generateSlidesFromNotesAI(notesInput);
      setActiveSlides(generated);
      onAddSlides(generated);
      setCurrentSlideIndex(0);
      setNotesInput('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingSlides(false);
    }
  };

  // Flashcards Leitner Action
  const handleRateCard = (level: 'learning' | 'review' | 'mastered') => {
    const updated = [...activeCards];
    updated[currentCardIndex] = {
      ...updated[currentCardIndex],
      masteryLevel: level,
      lastReviewed: 'Just now',
    };
    setActiveCards(updated);
    setIsFlipped(false);
    if (currentCardIndex < activeCards.length - 1) {
      setCurrentCardIndex((prev) => prev + 1);
    } else {
      setCurrentCardIndex(0);
    }
  };

  const handleAddCustomFlashcard = () => {
    if (!newFront.trim() || !newBack.trim()) return;
    const card: Flashcard = {
      id: `fc-${Date.now()}`,
      front: newFront.trim(),
      back: newBack.trim(),
      category: 'Custom Notes',
      masteryLevel: 'learning',
      lastReviewed: 'Today',
    };
    setActiveCards((prev) => [card, ...prev]);
    onAddFlashcard(card);
    setNewFront('');
    setNewBack('');
    setShowAddModal(false);
  };

  const exportSlidesMarkdown = () => {
    let md = `# ${currentSlide?.title || 'EduConnect Presentation Deck'}\n\n`;
    activeSlides.forEach((s, idx) => {
      md += `## Slide ${idx + 1}: ${s.title}\n`;
      if (s.subtitle) md += `*${s.subtitle}*\n\n`;
      s.bullets.forEach((b) => (md += `- ${b}\n`));
      md += `\n> **Speaker Notes:** ${s.notes}\n\n---\n\n`;
    });

    const blob = new Blob([md], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EduConnect-SlideDeck-${Date.now()}.md`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-purple-400 font-semibold tracking-wider uppercase">
            <span>Academic Synthesis Engine</span>
            <span aria-hidden="true">·</span>
            <span>Multimodal Knowledge Formats</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            PDF to Slides & Leitner Flashcards
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Convert complex study notes or PDF transcripts into executive presentation slide decks and 3D spaced-repetition flashcard sets.
          </p>
        </div>

        {/* Sub-tab segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setActiveSubTab('slides')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSubTab === 'slides'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Presentation className="w-3.5 h-3.5" />
            <span>Slide Deck Viewer</span>
          </button>
          <button
            onClick={() => setActiveSubTab('flashcards')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              activeSubTab === 'flashcards'
                ? 'bg-purple-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>3D Leitner Cards</span>
          </button>
        </div>
      </div>

      {activeSubTab === 'slides' ? (
        /* ================== SLIDES VIEW ================== */
        <div className="space-y-6">
          {/* Slide Deck Canvas */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Main Stage Slide Presenter */}
            <div className="lg:col-span-8 space-y-4">
              <div
                className={`min-h-[380px] sm:min-h-[440px] rounded-2xl p-8 sm:p-10 flex flex-col justify-between border shadow-2xl relative overflow-hidden transition-all ${
                  slideTheme === 'indigo'
                    ? 'bg-gradient-to-br from-slate-900 via-indigo-950/40 to-slate-950 border-indigo-800/60'
                    : slideTheme === 'cyber'
                    ? 'bg-gradient-to-br from-slate-950 via-cyan-950/30 to-slate-900 border-cyan-800/60'
                    : 'bg-slate-900 border-slate-800'
                }`}
              >
                {/* Slide Top Metadata */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 text-xs text-purple-300 font-medium">
                    <span>EduConnect Presentation Deck</span>
                    <span aria-hidden="true">·</span>
                    <span>Classroom Ready</span>
                  </div>
                  <div className="text-xs font-mono font-semibold text-slate-400">
                    Slide {currentSlideIndex + 1} of {activeSlides.length}
                  </div>
                </div>

                {/* Slide Body */}
                <div className="space-y-5 my-auto py-6">
                  <div>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight text-balance">
                      {currentSlide?.title}
                    </h2>
                    {currentSlide?.subtitle && (
                      <p className="text-sm sm:text-base text-purple-300 font-medium mt-1">
                        {currentSlide.subtitle}
                      </p>
                    )}
                  </div>

                  <div className="space-y-3 pt-2">
                    {currentSlide?.bullets.map((bullet, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="w-2 h-2 rounded-full bg-purple-400 mt-2 shrink-0" />
                        <span className="text-sm sm:text-base text-slate-200 leading-relaxed">
                          {bullet}
                        </span>
                      </div>
                    ))}
                  </div>

                  {currentSlide?.highlightStat && (
                    <div className="pt-3">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-purple-950/60 border border-purple-700/60 text-xs font-mono font-bold text-purple-300">
                        <span>★ Key Metric:</span>
                        <span>{currentSlide.highlightStat}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Slide Footer */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4 text-xs text-slate-400">
                  <div className="font-mono">EduConnect OS · Knowledge Engine</div>
                  <div>Confidential · Academic Use</div>
                </div>
              </div>

              {/* Slide Navigation & Control Bar */}
              <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl bg-slate-900 border border-slate-800">
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevSlide}
                    disabled={currentSlideIndex === 0}
                    className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-white transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-mono text-slate-300 px-2">
                    {currentSlideIndex + 1} / {activeSlides.length}
                  </span>
                  <button
                    onClick={handleNextSlide}
                    disabled={currentSlideIndex === activeSlides.length - 1}
                    className="p-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg text-white transition-colors"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Theme Selector */}
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">Theme:</span>
                  <button
                    onClick={() => setSlideTheme('indigo')}
                    className={`w-5 h-5 rounded-full bg-indigo-600 border ${
                      slideTheme === 'indigo' ? 'ring-2 ring-white' : 'border-transparent'
                    }`}
                  />
                  <button
                    onClick={() => setSlideTheme('cyber')}
                    className={`w-5 h-5 rounded-full bg-cyan-600 border ${
                      slideTheme === 'cyber' ? 'ring-2 ring-white' : 'border-transparent'
                    }`}
                  />
                  <button
                    onClick={() => setSlideTheme('slate')}
                    className={`w-5 h-5 rounded-full bg-slate-700 border ${
                      slideTheme === 'slate' ? 'ring-2 ring-white' : 'border-transparent'
                    }`}
                  />
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowSpeakerNotes(!showSpeakerNotes)}
                    className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-200 rounded-lg border border-slate-700 transition-colors"
                  >
                    {showSpeakerNotes ? 'Hide Notes' : 'Show Speaker Notes'}
                  </button>

                  <button
                    onClick={exportSlidesMarkdown}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-xs font-semibold text-white rounded-lg transition-colors"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Export Deck</span>
                  </button>
                </div>
              </div>

              {/* Speaker Notes Drawer */}
              {showSpeakerNotes && currentSlide && (
                <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                  <div className="font-bold text-purple-400 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>Presenter Speaking Points:</span>
                  </div>
                  <p className="leading-relaxed">{currentSlide.notes}</p>
                </div>
              )}
            </div>

            {/* Right Column: PDF / Note to Slides Generator */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  <span>Convert Notes to Slide Deck</span>
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Paste lecture excerpts or study notes. Gemini formats them into 4 professional presentation slides with speaker notes.
                </p>

                <textarea
                  value={notesInput}
                  onChange={(e) => setNotesInput(e.target.value)}
                  placeholder="Paste your PDF notes, lecture summary, or assignment instructions here..."
                  rows={8}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-sans leading-relaxed"
                />

                <button
                  onClick={handleGenerateSlides}
                  disabled={isGeneratingSlides || !notesInput.trim()}
                  className="w-full py-2.5 px-4 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isGeneratingSlides ? 'Generating Slides...' : 'Generate 4-Slide Deck'}</span>
                </button>
              </div>

              {/* Slide Thumbnails Outline */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Slide Deck Outline
                </div>
                <div className="space-y-1.5">
                  {activeSlides.map((s, idx) => (
                    <button
                      key={s.id || idx}
                      onClick={() => setCurrentSlideIndex(idx)}
                      className={`w-full p-2.5 rounded-lg text-left text-xs font-medium transition-colors border flex items-center justify-between ${
                        currentSlideIndex === idx
                          ? 'bg-purple-950/50 border-purple-700 text-white'
                          : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      <span className="truncate pr-2">
                        {idx + 1}. {s.title}
                      </span>
                      <span className="text-purple-400 font-mono text-[11px] shrink-0">
                        {s.bullets.length} pts
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================== 3D FLASHCARDS VIEW ================== */
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Flashcard Studio on Left */}
            <div className="lg:col-span-8 space-y-6">
              {/* Mastery Counters */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400">Learning</div>
                  <div className="text-xl font-bold font-mono text-rose-400">
                    {activeCards.filter((c) => c.masteryLevel === 'learning').length}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400">In Review</div>
                  <div className="text-xl font-bold font-mono text-amber-400">
                    {activeCards.filter((c) => c.masteryLevel === 'review').length}
                  </div>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-center">
                  <div className="text-xs text-slate-400">Mastered</div>
                  <div className="text-xl font-bold font-mono text-emerald-400">
                    {activeCards.filter((c) => c.masteryLevel === 'mastered').length}
                  </div>
                </div>
              </div>

              {/* 3D Flip Card */}
              {currentCard && (
                <div
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="min-h-[280px] sm:min-h-[320px] rounded-2xl p-8 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 hover:border-purple-600/50 shadow-2xl flex flex-col justify-between cursor-pointer transition-all transform hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="font-mono text-purple-400 font-semibold">
                      {currentCard.category}
                    </span>
                    <span className="flex items-center gap-1 text-slate-500">
                      <RotateCw className="w-3.5 h-3.5" />
                      Click anywhere to flip
                    </span>
                  </div>

                  <div className="py-6 my-auto text-center px-4">
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">
                      {isFlipped ? 'Answer & Conceptual Mechanism' : 'Concept Question (Front)'}
                    </div>
                    <p className="text-base sm:text-lg font-semibold text-white leading-relaxed">
                      {isFlipped ? currentCard.back : currentCard.front}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-slate-800/80 pt-3">
                    <span>
                      Card {currentCardIndex + 1} of {activeCards.length}
                    </span>
                    <span
                      className={`capitalize font-semibold ${
                        currentCard.masteryLevel === 'mastered'
                          ? 'text-emerald-400'
                          : currentCard.masteryLevel === 'review'
                          ? 'text-amber-400'
                          : 'text-rose-400'
                      }`}
                    >
                      Status: {currentCard.masteryLevel}
                    </span>
                  </div>
                </div>
              )}

              {/* Leitner Spaced Repetition Buttons */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div className="text-xs text-slate-400 font-medium">Rate Recall Ease:</div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRateCard('learning')}
                    className="px-3.5 py-1.5 bg-rose-950/70 hover:bg-rose-900/80 text-rose-300 text-xs font-semibold rounded-lg border border-rose-800/60 transition-colors"
                  >
                    Again (Reset)
                  </button>
                  <button
                    onClick={() => handleRateCard('review')}
                    className="px-3.5 py-1.5 bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 text-xs font-semibold rounded-lg border border-amber-800/60 transition-colors"
                  >
                    Hard (Review)
                  </button>
                  <button
                    onClick={() => handleRateCard('mastered')}
                    className="px-3.5 py-1.5 bg-emerald-950/70 hover:bg-emerald-900/80 text-emerald-300 text-xs font-semibold rounded-lg border border-emerald-800/60 transition-colors"
                  >
                    Good (Mastered)
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Add Custom Card */}
            <div className="lg:col-span-4 space-y-4">
              <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-purple-400" />
                  <span>Create Flashcard</span>
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs font-medium text-slate-300">Front Prompt / Term:</label>
                    <textarea
                      value={newFront}
                      onChange={(e) => setNewFront(e.target.value)}
                      placeholder="e.g. What is the Paxos consensus safety invariant?"
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-sans mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium text-slate-300">Back Explanation / Answer:</label>
                    <textarea
                      value={newBack}
                      onChange={(e) => setNewBack(e.target.value)}
                      placeholder="e.g. Only a single value can be chosen across all quorum proposals..."
                      rows={3}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-purple-500 font-sans mt-1"
                    />
                  </div>
                  <button
                    onClick={handleAddCustomFlashcard}
                    disabled={!newFront.trim() || !newBack.trim()}
                    className="w-full py-2 px-3 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    Add to Active Deck
                  </button>
                </div>
              </div>

              {/* Flashcards Queue List */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 max-h-64 overflow-y-auto pr-1">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Deck Queue ({activeCards.length})
                </div>
                {activeCards.map((card, idx) => (
                  <button
                    key={card.id || idx}
                    onClick={() => {
                      setCurrentCardIndex(idx);
                      setIsFlipped(false);
                    }}
                    className={`w-full p-2.5 rounded-lg text-left text-xs transition-colors border truncate ${
                      currentCardIndex === idx
                        ? 'bg-purple-950/50 border-purple-700 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {idx + 1}. {card.front}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
