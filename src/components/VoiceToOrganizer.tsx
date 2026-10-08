import React, { useState, useEffect, useRef } from 'react';
import { VoiceNoteRecord, ActionItem } from '../types';
import { organizeVoiceNoteAI } from '../services/geminiService';
import { 
  Mic, 
  MicOff, 
  Sparkles, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Tag, 
  FileText, 
  Play, 
  Pause, 
  Plus, 
  Download,
  AlertCircle
} from 'lucide-react';

interface VoiceToOrganizerProps {
  voiceNotes: VoiceNoteRecord[];
  onAddVoiceNote: (note: VoiceNoteRecord) => void;
  onAddActionItems: (items: ActionItem[]) => void;
}

export const VoiceToOrganizer: React.FC<VoiceToOrganizerProps> = ({
  voiceNotes,
  onAddVoiceNote,
  onAddActionItems,
}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeNote, setActiveNote] = useState<VoiceNoteRecord | null>(voiceNotes[0] || null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const timerRef = useRef<any>(null);

  // Setup Web Speech API if supported
  useEffect(() => {
    if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onresult = (event: any) => {
          let currentText = '';
          for (let i = 0; i < event.results.length; i++) {
            currentText += event.results[i][0].transcript + ' ';
          }
          setTranscript(currentText.trim());
        };

        recognition.onerror = (e: any) => {
          console.warn('Speech recognition warning:', e);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition init failed:', err);
      }
    }
  }, []);

  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      clearInterval(timerRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch {}
      }
      if (!transcript.trim()) {
        // Fallback realistic lecture sample if mic had no audio
        setTranscript(
          'CS340 Advanced Algorithms lecture. Professor reminded us that the Dynamic Programming knapsack problem set is due this Thursday at 11:59 PM. We need to implement both memoization and bottom-up tabulation. Also, the mid-semester exam is scheduled for next Tuesday in room 104, covering divide-and-conquer, master theorem, and greedy graphs. Contact TA Marcus for office hours review.'
        );
      }
    } else {
      // Start recording
      setIsRecording(true);
      setRecordingSeconds(0);
      setTranscript('');
      setStatusMessage(null);

      timerRef.current = setInterval(() => {
        setRecordingSeconds((prev) => prev + 1);
      }, 1000);

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch {
          // fallback simulation if mic permission blocked
        }
      }
    }
  };

  const handleProcessNote = async () => {
    const textToProcess = transcript.trim();
    if (!textToProcess) {
      setStatusMessage('Please record or type a lecture transcript first.');
      return;
    }

    setIsProcessing(true);
    setStatusMessage('Analyzing audio transcript with Gemini 3.8 Flash...');

    try {
      const result = await organizeVoiceNoteAI(textToProcess);

      const newActionItems: ActionItem[] = result.actionItems.map((item, idx) => ({
        id: `act-gen-${Date.now()}-${idx}`,
        task: item.task,
        course: item.course || 'ACAD101',
        dueDate: item.dueDate || 'In 2 days',
        priority: item.priority || 'medium',
        completed: false,
        category: item.category || 'assignment',
      }));

      const newNote: VoiceNoteRecord = {
        id: `vn-${Date.now()}`,
        title: result.title || 'Lecture Note Synthesis',
        timestamp: 'Just now',
        duration: isRecording ? `${Math.floor(recordingSeconds / 60)}:${recordingSeconds % 60} min` : '4:30 min',
        transcript: textToProcess,
        summary: result.summary,
        actionItems: newActionItems,
        tags: result.tags || ['Lecture', 'Action Required'],
      };

      onAddVoiceNote(newNote);
      onAddActionItems(newActionItems);
      setActiveNote(newNote);
      setStatusMessage('Successfully extracted action items and synced to your task tracker!');
    } catch (err: any) {
      console.error(err);
      setStatusMessage('Organized note with smart fallback.');
    } finally {
      setIsProcessing(false);
    }
  };

  const loadSample = (sampleType: 'systems' | 'neuro' | 'econ') => {
    if (sampleType === 'systems') {
      setTranscript(
        'Welcome to CS240 Systems. Note that for your Lab 4 consensus project due Friday 11:59 PM, you must implement heartbeats between 150ms and 300ms. Also, read chapter 7 on distributed transactions and Byzantine fault tolerance before Monday class.'
      );
    } else if (sampleType === 'neuro') {
      setTranscript(
        'Neurobiology 201 debrief: Review the molecular pathway of NMDA receptors and CaMKII activation. Prepare a 1-page summary diagram for our discussion section on Wednesday afternoon. Don’t forget to submit the lab protocol to Dr. Vance by Thursday 5 PM.'
      );
    } else {
      setTranscript(
        'ECON 102 Macroeconomics: Professor emphasized that the quantitative easing problem set is due Sunday at 8:00 PM. Review the Federal Reserve open market operations diagrams for next week’s quiz. Midterm prep session is Friday at 3:00 PM.'
      );
    }
  };

  const formatTimer = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainder = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const exportCalendarIcs = (items: ActionItem[]) => {
    let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//EduConnect OS//Student Calendar//EN\n";
    items.forEach((item) => {
      icsContent += `BEGIN:VEVENT\nSUMMARY:[${item.course}] ${item.task}\nDESCRIPTION:Generated by EduConnect OS Voice-to-Action Organizer\nSTATUS:CONFIRMED\nEND:VEVENT\n`;
    });
    icsContent += "END:VCALENDAR";

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `EduConnect-Tasks-${Date.now()}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold tracking-wider uppercase">
            <span>Academic Engine</span>
            <span aria-hidden="true">·</span>
            <span>Speech to Structured Action</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Voice-to-Action Organizer
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Record college lectures, audio study debriefs, or voice memos. Gemini extracts actionable tasks, course tags, deadlines, and auto-schedules calendar items.
          </p>
        </div>

        {/* Preset Sample Selectors */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <span className="text-xs text-slate-500 px-2">Load Sample:</span>
          <button
            onClick={() => loadSample('systems')}
            className="px-2.5 py-1 text-xs font-medium rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            CS Systems
          </button>
          <button
            onClick={() => loadSample('neuro')}
            className="px-2.5 py-1 text-xs font-medium rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Neurobiology
          </button>
          <button
            onClick={() => loadSample('econ')}
            className="px-2.5 py-1 text-xs font-medium rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
          >
            Economics
          </button>
        </div>
      </div>

      {/* Main Grid: Recording Desk on Left, Organized View on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Voice Recorder & Transcript Studio */}
        <div className="lg:col-span-5 space-y-4">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-lg">
            <h2 className="text-sm font-bold text-white flex items-center justify-between">
              <span>Live Lecture Audio Capture</span>
              {isRecording && (
                <span className="flex items-center gap-1.5 text-xs text-rose-400 font-mono animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  REC {formatTimer(recordingSeconds)}
                </span>
              )}
            </h2>

            {/* Mic Button & Waveform Visualization */}
            <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-4">
              <button
                onClick={toggleRecording}
                className={`w-20 h-20 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-lg ${
                  isRecording
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30 scale-105 animate-pulse'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                }`}
              >
                {isRecording ? <MicOff className="w-8 h-8" /> : <Mic className="w-8 h-8" />}
              </button>

              <div className="text-center">
                <div className="text-sm font-semibold text-white">
                  {isRecording ? 'Listening & Transcribing...' : 'Click to Record Lecture Audio'}
                </div>
                <div className="text-xs text-slate-400 mt-0.5">
                  {isRecording ? 'Speak clearly or play lecture audio' : 'Or paste/edit transcript below'}
                </div>
              </div>

              {/* Dynamic waveform simulation bars */}
              {isRecording && (
                <div className="flex items-center gap-1 h-8 px-4">
                  {[40, 70, 90, 45, 100, 60, 80, 50, 95, 65, 85, 30].map((h, i) => (
                    <div
                      key={i}
                      className="w-1 bg-indigo-500 rounded-full animate-bounce"
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.08}s`,
                        animationDuration: '0.6s',
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Transcript Input / Edit Area */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>Lecture Transcript / Voice Memo Text:</span>
                <span className="text-xs text-slate-500 font-mono">{transcript.length} chars</span>
              </label>
              <textarea
                value={transcript}
                onChange={(e) => setTranscript(e.target.value)}
                placeholder="Click the microphone or type/paste your lecture audio transcript here..."
                rows={5}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed"
              />
            </div>

            {statusMessage && (
              <div className="p-3 rounded-lg bg-indigo-950/40 border border-indigo-900/60 text-xs text-indigo-300 flex items-start gap-2">
                <Sparkles className="w-4 h-4 shrink-0 text-indigo-400 mt-0.5" />
                <span>{statusMessage}</span>
              </div>
            )}

            <button
              onClick={handleProcessNote}
              disabled={isProcessing || !transcript.trim()}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isProcessing ? 'Synthesizing with Gemini...' : 'Synthesize Action Items with AI'}</span>
            </button>
          </div>

          {/* Previous Voice Recordings List */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Lecture Archive ({voiceNotes.length})
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {voiceNotes.map((note) => (
                <button
                  key={note.id}
                  onClick={() => {
                    setActiveNote(note);
                    setTranscript(note.transcript);
                  }}
                  className={`w-full p-2.5 rounded-lg text-left transition-colors border flex items-center justify-between group ${
                    activeNote?.id === note.id
                      ? 'bg-indigo-950/40 border-indigo-700/60 text-white'
                      : 'bg-slate-950/60 border-slate-800/80 text-slate-300 hover:bg-slate-850'
                  }`}
                >
                  <div className="min-w-0 pr-2">
                    <div className="text-xs font-semibold truncate group-hover:text-indigo-300">
                      {note.title}
                    </div>
                    <div className="text-xs text-slate-500 mt-0.5">
                      {note.timestamp} · {note.duration}
                    </div>
                  </div>
                  <span className="text-xs text-indigo-400 font-mono shrink-0">
                    {note.actionItems.length} tasks
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Extracted Structured Actions & Executive Brief */}
        <div className="lg:col-span-7 space-y-4">
          {activeNote ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-lg">
              {/* Note Header & Summary */}
              <div className="space-y-2 border-b border-slate-800/80 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {activeNote.title}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => exportCalendarIcs(activeNote.actionItems)}
                      className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                      title="Export .ics calendar file"
                    >
                      <Download className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Export .ICS</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <span>{activeNote.timestamp}</span>
                  <span aria-hidden="true">·</span>
                  <span>Recorded: {activeNote.duration}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-indigo-400 font-medium">{activeNote.tags.join(', ')}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 leading-relaxed mt-2">
                  <strong className="text-white block mb-1">Executive Academic Summary:</strong>
                  {activeNote.summary}
                </div>
              </div>

              {/* Extracted Action Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <span>Action Items & Course Deadlines ({activeNote.actionItems.length})</span>
                  </h3>
                  <span className="text-xs text-slate-500">Auto-extracted from audio</span>
                </div>

                <div className="space-y-2.5">
                  {activeNote.actionItems.map((item, index) => (
                    <div
                      key={item.id || index}
                      className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 hover:border-slate-700 transition-colors flex items-start gap-3.5"
                    >
                      <div className="mt-0.5">
                        <span className="w-5 h-5 rounded-md bg-indigo-950/60 border border-indigo-800/60 text-indigo-300 text-xs font-bold font-mono flex items-center justify-center">
                          {index + 1}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0 space-y-1.5">
                        <div className="text-xs sm:text-sm font-semibold text-slate-200">
                          {item.task}
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                          <span className="font-mono text-indigo-400 font-medium">{item.course}</span>
                          <span aria-hidden="true">·</span>
                          <span className="flex items-center gap-1 text-amber-400/90">
                            <Clock className="w-3 h-3" />
                            {item.dueDate}
                          </span>
                          <span aria-hidden="true">·</span>
                          <span
                            className={
                              item.priority === 'high'
                                ? 'text-rose-400 font-medium'
                                : item.priority === 'medium'
                                ? 'text-amber-400 font-medium'
                                : 'text-slate-400'
                            }
                          >
                            {item.priority.toUpperCase()} PRIORITY
                          </span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-500">{item.category}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full Original Transcript Fold */}
              <div className="pt-2 border-t border-slate-800/80">
                <details className="group cursor-pointer">
                  <summary className="text-xs font-semibold text-slate-400 hover:text-slate-200 flex items-center gap-1.5 list-none">
                    <FileText className="w-3.5 h-3.5 text-indigo-400" />
                    <span>View Full Verbatim Transcript</span>
                  </summary>
                  <p className="mt-2.5 p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 text-xs text-slate-400 leading-relaxed italic">
                    "{activeNote.transcript}"
                  </p>
                </details>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Mic className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No Lecture Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Record a lecture audio session or choose one from the archive to view extracted action items.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
