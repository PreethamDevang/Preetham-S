import React, { useState } from 'react';
import { TabType, ActionItem, VoiceNoteRecord, EmailMessage, QuizSet, SlideData, Flashcard, AutomationWorkflow, CampusOpportunity, ResumeProfile, HealthRecordTranslation } from './types';
import { 
  INITIAL_ACTION_ITEMS, 
  INITIAL_VOICE_NOTES, 
  INITIAL_EMAILS, 
  INITIAL_QUIZZES, 
  INITIAL_SLIDES, 
  INITIAL_FLASHCARDS, 
  INITIAL_WORKFLOWS, 
  INITIAL_OPPORTUNITIES, 
  INITIAL_RESUME, 
  INITIAL_JOB_POSTINGS, 
  INITIAL_HEALTH_RECORD, 
  CIRCADIAN_SCHEDULE 
} from './data/defaultData';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { VoiceToOrganizer } from './components/VoiceToOrganizer';
import { EmailDigestReplies } from './components/EmailDigestReplies';
import { QuizGenerator } from './components/QuizGenerator';
import { SlidesAndFlashcards } from './components/SlidesAndFlashcards';
import { WorkflowAutomator } from './components/WorkflowAutomator';
import { CampusOpportunities } from './components/CampusOpportunities';
import { ResumeAndJobMatcher } from './components/ResumeAndJobMatcher';
import { HealthGuiderTranslator } from './components/HealthGuiderTranslator';
import { IdeathonPitchDeck } from './components/IdeathonPitchDeck';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('overview');
  const [pitchMode, setPitchMode] = useState<boolean>(false);

  // Global Data State
  const [actionItems, setActionItems] = useState<ActionItem[]>(INITIAL_ACTION_ITEMS);
  const [voiceNotes, setVoiceNotes] = useState<VoiceNoteRecord[]>(INITIAL_VOICE_NOTES);
  const [emails, setEmails] = useState<EmailMessage[]>(INITIAL_EMAILS);
  const [quizSets, setQuizSets] = useState<QuizSet[]>(INITIAL_QUIZZES);
  const [slides, setSlides] = useState<SlideData[]>(INITIAL_SLIDES);
  const [flashcards, setFlashcards] = useState<Flashcard[]>(INITIAL_FLASHCARDS);
  const [workflows, setWorkflows] = useState<AutomationWorkflow[]>(INITIAL_WORKFLOWS);
  const [opportunities, setOpportunities] = useState<CampusOpportunity[]>(INITIAL_OPPORTUNITIES);
  const [resume, setResume] = useState<ResumeProfile>(INITIAL_RESUME);
  const [healthRecord, setHealthRecord] = useState<HealthRecordTranslation>(INITIAL_HEALTH_RECORD);

  // Action item handlers
  const handleAddActionItems = (newItems: ActionItem[]) => {
    setActionItems((prev) => [...newItems, ...prev]);
  };

  const handleAddVoiceNote = (note: VoiceNoteRecord) => {
    setVoiceNotes((prev) => [note, ...prev]);
  };

  const handleArchiveEmail = (id: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
  };

  const handleAddQuizSet = (newSet: QuizSet) => {
    setQuizSets((prev) => [newSet, ...prev]);
  };

  const handleAddSlides = (newSlides: SlideData[]) => {
    setSlides(newSlides);
  };

  const handleAddFlashcard = (newCard: Flashcard) => {
    setFlashcards((prev) => [newCard, ...prev]);
  };

  const handleToggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) => (w.id === id ? { ...w, enabled: !w.enabled } : w))
    );
  };

  const handleAddWorkflow = (wf: AutomationWorkflow) => {
    setWorkflows((prev) => [wf, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* 3-Zone Top Navigation Contract */}
      <Navbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          setPitchMode(false);
        }}
        pitchMode={pitchMode}
        onTogglePitchMode={() => setPitchMode(!pitchMode)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-16">
        {pitchMode ? (
          <IdeathonPitchDeck
            onNavigateToDemo={(demoTab) => {
              setPitchMode(false);
              setActiveTab(demoTab);
            }}
            onExitPitchMode={() => setPitchMode(false)}
          />
        ) : (
          <>
            {activeTab === 'overview' && (
              <OverviewDashboard
                onNavigate={setActiveTab}
                actionItems={actionItems}
                emails={emails}
                opportunities={opportunities}
                onTogglePitchMode={() => setPitchMode(true)}
              />
            )}

            {activeTab === 'voice-organizer' && (
              <VoiceToOrganizer
                voiceNotes={voiceNotes}
                onAddVoiceNote={handleAddVoiceNote}
                onAddActionItems={handleAddActionItems}
              />
            )}

            {activeTab === 'email-digest' && (
              <EmailDigestReplies
                emails={emails}
                onArchiveEmail={handleArchiveEmail}
              />
            )}

            {activeTab === 'quiz-maker' && (
              <QuizGenerator
                quizSets={quizSets}
                onAddQuizSet={handleAddQuizSet}
              />
            )}

            {activeTab === 'slides-flashcards' && (
              <SlidesAndFlashcards
                slides={slides}
                flashcards={flashcards}
                onAddSlides={handleAddSlides}
                onAddFlashcard={handleAddFlashcard}
              />
            )}

            {activeTab === 'workflow-automator' && (
              <WorkflowAutomator
                workflows={workflows}
                onToggleWorkflow={handleToggleWorkflow}
                onAddWorkflow={handleAddWorkflow}
              />
            )}

            {activeTab === 'campus-agent' && (
              <CampusOpportunities opportunities={opportunities} />
            )}

            {activeTab === 'resume-jobs' && (
              <ResumeAndJobMatcher
                initialResume={resume}
                jobPostings={INITIAL_JOB_POSTINGS}
                onUpdateResume={setResume}
              />
            )}

            {activeTab === 'health-guider' && (
              <HealthGuiderTranslator
                initialHealthRecord={healthRecord}
                circadianSchedule={CIRCADIAN_SCHEDULE}
              />
            )}
          </>
        )}
      </main>

      {/* Clean Editorial Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-6 px-4 lg:px-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">EduConnect OS</span>
            <span aria-hidden="true">·</span>
            <span>The Autonomous Bio-Cognitive Student Life Operating System</span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Powered by Gemini 3.8 Flash</span>
            <span aria-hidden="true">·</span>
            <span>Ideathon Edition 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
