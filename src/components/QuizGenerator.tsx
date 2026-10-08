import React, { useState } from 'react';
import { QuizSet, QuizQuestion } from '../types';
import { generateQuizFromNotesAI } from '../services/geminiService';
import { 
  BookOpen, 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  RotateCcw, 
  Award, 
  ChevronRight, 
  Check,
  HelpCircle,
  Plus
} from 'lucide-react';

interface QuizGeneratorProps {
  quizSets: QuizSet[];
  onAddQuizSet: (set: QuizSet) => void;
}

export const QuizGenerator: React.FC<QuizGeneratorProps> = ({
  quizSets,
  onAddQuizSet,
}) => {
  const [activeSet, setActiveSet] = useState<QuizSet>(quizSets[0]);
  const [notesInput, setNotesInput] = useState<string>('');
  const [topicInput, setTopicInput] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleSelectOption = (questionId: string, optionIndex: number) => {
    if (showResults) return; // Prevent changing after submission
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleGenerate = async () => {
    const text = notesInput.trim();
    if (!text) {
      setStatusMessage('Please paste or write your study notes first.');
      return;
    }

    setIsGenerating(true);
    setStatusMessage('Generating interactive high-yield quiz with Gemini 3.8 Flash...');

    try {
      const questionsData = await generateQuizFromNotesAI(text, 3);
      const newQuestions: QuizQuestion[] = questionsData.map((q, idx) => ({
        id: `q-gen-${Date.now()}-${idx}`,
        question: q.question,
        options: q.options,
        correctIndex: q.correctIndex,
        explanation: q.explanation,
      }));

      const newSet: QuizSet = {
        id: `qz-${Date.now()}`,
        title: topicInput.trim() || 'Custom Notes Quiz',
        topic: topicInput.trim() || 'Study Notes Synthesis',
        createdDate: 'Today',
        questions: newQuestions,
      };

      onAddQuizSet(newSet);
      setActiveSet(newSet);
      setUserAnswers({});
      setShowResults(false);
      setStatusMessage('New quiz created successfully! Test your knowledge below.');
    } catch (err) {
      console.error(err);
      setStatusMessage('Error creating quiz. Loaded standard set.');
    } finally {
      setIsGenerating(false);
    }
  };

  const calculateScore = () => {
    if (!activeSet) return { correct: 0, total: 0, percentage: 0 };
    let correct = 0;
    activeSet.questions.forEach((q) => {
      if (userAnswers[q.id] === q.correctIndex) {
        correct++;
      }
    });
    const total = activeSet.questions.length;
    const percentage = Math.round((correct / total) * 100);
    return { correct, total, percentage };
  };

  const score = calculateScore();

  const loadSampleNotes = (type: 'db' | 'bio' | 'stats') => {
    if (type === 'db') {
      setTopicInput('Distributed Storage: Paxos & Quorums');
      setNotesInput(
        'In distributed systems, a quorum consensus protocol requires that any read quorum R and write quorum W satisfy R + W > N, where N is the total number of nodes in the cluster. This pigeonhole principle ensures that at least one node in the read quorum contains the latest write version. Split-brain conditions occur when a network partition creates disjoint subsets of nodes that each believe they form a valid majority.'
      );
    } else if (type === 'bio') {
      setTopicInput('Neurobiology: Long-Term Depression (LTD)');
      setNotesInput(
        'Long-Term Depression (LTD) is an activity-dependent reduction in the efficacy of neuronal synapses lasting hours or longer. In Purkinje cells of the cerebellum, LTD requires simultaneous activation of parallel fibers and climbing fibers, triggering calcium influx and protein kinase C (PKC) activation. This leads to endocytosis and internalization of post-synaptic AMPA receptors, reducing synaptic sensitivity to glutamate.'
      );
    } else {
      setTopicInput('Statistical Learning: Bias-Variance Tradeoff');
      setNotesInput(
        'In supervised machine learning, prediction error decomposes into Bias squared, Variance, and Irreducible Noise. Underfitting occurs when model complexity is too low, yielding high bias. Overfitting occurs when model parameters memorize training noise, yielding high variance. Regularization methods such as L1 (Lasso) and L2 (Ridge) introduce penalty terms on parameter norms to constrain model variance.'
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase">
            <span>Academic Engine</span>
            <span aria-hidden="true">·</span>
            <span>Notes-to-Knowledge Validation</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Automated Quiz Generator from Notes
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Synthesize lecture transcripts, raw study notes, or textbook chapters into interactive practice questions with in-depth conceptual explanations.
          </p>
        </div>

        {/* Quiz Set Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <span className="text-xs text-slate-500 px-2">Quiz Sets:</span>
          {quizSets.map((qs) => (
            <button
              key={qs.id}
              onClick={() => {
                setActiveSet(qs);
                setUserAnswers({});
                setShowResults(false);
              }}
              className={`px-2.5 py-1 text-xs font-medium rounded truncate max-w-[140px] transition-colors ${
                activeSet?.id === qs.id
                  ? 'bg-emerald-600 text-white font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {qs.title}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Note Ingestion Studio */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white">Generate From Study Notes</h2>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => loadSampleNotes('db')}
                  className="px-2 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                >
                  Systems
                </button>
                <button
                  onClick={() => loadSampleNotes('bio')}
                  className="px-2 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                >
                  Bio
                </button>
                <button
                  onClick={() => loadSampleNotes('stats')}
                  className="px-2 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                >
                  ML
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">Topic or Subject:</label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="e.g. CS240 Distributed Systems: Raft Quorum"
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Lecture Notes / Textbook Text:</span>
                <span className="text-xs text-slate-500 font-mono">{notesInput.length} chars</span>
              </label>
              <textarea
                value={notesInput}
                onChange={(e) => setNotesInput(e.target.value)}
                placeholder="Paste your study notes, lecture summary, or textbook chapter here..."
                rows={7}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
              />
            </div>

            {statusMessage && (
              <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                <span>{statusMessage}</span>
              </div>
            )}

            <button
              onClick={handleGenerate}
              disabled={isGenerating || !notesInput.trim()}
              className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isGenerating ? 'Synthesizing Questions...' : 'Generate 3 High-Yield Questions'}</span>
            </button>
          </div>

          {/* Quick Mastery Tips */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-400 space-y-1.5">
            <div className="font-semibold text-slate-200 flex items-center gap-1.5">
              <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
              <span>Active Recall Science</span>
            </div>
            <p className="leading-relaxed">
              Immediate practice testing yields a 50% higher long-term retention rate compared to passive re-reading (Roediger & Karpicke, 2006).
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Quiz Arena */}
        <div className="lg:col-span-7 space-y-4">
          {activeSet ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-lg">
              {/* Quiz Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white tracking-tight">{activeSet.title}</h2>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
                    <span className="text-emerald-400 font-medium">{activeSet.topic}</span>
                    <span aria-hidden="true">·</span>
                    <span>{activeSet.questions.length} Questions</span>
                    <span aria-hidden="true">·</span>
                    <span>Created: {activeSet.createdDate}</span>
                  </div>
                </div>

                {showResults && (
                  <div className="p-2.5 px-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center gap-3">
                    <Award className="w-5 h-5 text-amber-400" />
                    <div>
                      <div className="text-xs text-slate-400 font-medium">Your Score</div>
                      <div className="text-base font-bold font-mono text-emerald-400">
                        {score.correct} / {score.total} ({score.percentage}%)
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Questions List */}
              <div className="space-y-6">
                {activeSet.questions.map((q, qIndex) => {
                  const selectedOpt = userAnswers[q.id];
                  const isAnswered = selectedOpt !== undefined;

                  return (
                    <div
                      key={q.id}
                      className="p-5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-3.5"
                    >
                      <div className="flex items-start gap-3">
                        <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-300 text-xs font-bold font-mono flex items-center justify-center shrink-0">
                          {qIndex + 1}
                        </span>
                        <h3 className="text-sm font-semibold text-white leading-snug">
                          {q.question}
                        </h3>
                      </div>

                      {/* Options */}
                      <div className="space-y-2 pl-9">
                        {q.options.map((opt, optIndex) => {
                          const isSelected = selectedOpt === optIndex;
                          const isCorrect = optIndex === q.correctIndex;

                          let optionStyle = 'bg-slate-900 border-slate-800 text-slate-300 hover:bg-slate-850';
                          if (isSelected && !showResults) {
                            optionStyle = 'bg-emerald-950/60 border-emerald-500 text-white ring-1 ring-emerald-500/30';
                          } else if (showResults) {
                            if (isCorrect) {
                              optionStyle = 'bg-emerald-950/80 border-emerald-500 text-emerald-200 font-medium';
                            } else if (isSelected && !isCorrect) {
                              optionStyle = 'bg-rose-950/80 border-rose-500 text-rose-200';
                            } else {
                              optionStyle = 'bg-slate-900/60 border-slate-850 text-slate-500 opacity-60';
                            }
                          }

                          return (
                            <button
                              key={optIndex}
                              onClick={() => handleSelectOption(q.id, optIndex)}
                              disabled={showResults}
                              className={`w-full p-3 rounded-lg border text-xs text-left transition-all flex items-center justify-between cursor-pointer ${optionStyle}`}
                            >
                              <div className="flex items-center gap-2.5">
                                <span className="font-mono text-slate-400 font-medium">
                                  {String.fromCharCode(65 + optIndex)}.
                                </span>
                                <span>{opt}</span>
                              </div>
                              {showResults && isCorrect && (
                                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                              )}
                              {showResults && isSelected && !isCorrect && (
                                <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                              )}
                            </button>
                          );
                        })}
                      </div>

                      {/* Conceptual Explanation Box */}
                      {showResults && (
                        <div className="ml-9 p-3.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                          <strong className="text-emerald-400 block mb-1">Pedagogical Explanation:</strong>
                          {q.explanation}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
                <button
                  onClick={() => {
                    setUserAnswers({});
                    setShowResults(false);
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg border border-slate-700 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset Answers</span>
                </button>

                {!showResults ? (
                  <button
                    onClick={() => setShowResults(true)}
                    disabled={Object.keys(userAnswers).length === 0}
                    className="flex items-center gap-2 px-5 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Submit & Grade Quiz</span>
                  </button>
                ) : (
                  <div className="text-xs text-slate-400">
                    Review your answers above or generate another quiz from new notes.
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <BookOpen className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No Quiz Loaded</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
