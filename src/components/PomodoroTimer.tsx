import React, { useState, useEffect, useRef } from 'react';
import { ActionItem } from '../types';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  Coffee, 
  Brain, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  CheckCircle2, 
  Flame,
  ChevronDown,
  Clock
} from 'lucide-react';

interface PomodoroTimerProps {
  actionItems: ActionItem[];
  onCompleteSession?: (taskName: string, minutes: number) => void;
  compact?: boolean;
}

type TimerMode = 'focus25' | 'ultradian50' | 'shortBreak' | 'longBreak';

const MODE_CONFIGS: Record<TimerMode, { label: string; duration: number; type: 'focus' | 'break'; desc: string }> = {
  focus25: {
    label: 'Standard Sprint (25m)',
    duration: 25 * 60,
    type: 'focus',
    desc: 'Classic Pomodoro for quick analytical sprints & problem sets',
  },
  ultradian50: {
    label: 'Ultradian Deep Work (50m)',
    duration: 50 * 60,
    type: 'focus',
    desc: 'Aligned with biological 90-minute circadian focus waves',
  },
  shortBreak: {
    label: 'Short Rest (5m)',
    duration: 5 * 60,
    type: 'break',
    desc: 'Hydrate, stretch, and ocular 20-20-20 distance rest',
  },
  longBreak: {
    label: 'Restorative Break (15m)',
    duration: 15 * 60,
    type: 'break',
    desc: 'Campus walk, light nourishment, and mental reset',
  },
};

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  actionItems,
  onCompleteSession,
  compact = false,
}) => {
  const [mode, setMode] = useState<TimerMode>('focus25');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(MODE_CONFIGS['focus25'].duration);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [completedSessions, setCompletedSessions] = useState<number>(3); // initial streak
  const [selectedTaskId, setSelectedTaskId] = useState<string>(actionItems[0]?.id || '');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [streakMinutes, setStreakMinutes] = useState<number>(75);

  const audioContextRef = useRef<AudioContext | null>(null);
  const noiseNodeRef = useRef<AudioNode | null>(null);

  // Sync mode changes with remaining seconds
  const handleSelectMode = (newMode: TimerMode) => {
    setMode(newMode);
    setIsRunning(false);
    setSecondsRemaining(MODE_CONFIGS[newMode].duration);
    stopAmbientSound();
  };

  // Timer Tick
  useEffect(() => {
    let interval: any = null;
    if (isRunning && secondsRemaining > 0) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => prev - 1);
      }, 1000);
    } else if (secondsRemaining === 0 && isRunning) {
      // Completed timer session
      setIsRunning(false);
      stopAmbientSound();

      const config = MODE_CONFIGS[mode];
      if (config.type === 'focus') {
        const addedMinutes = Math.round(config.duration / 60);
        setCompletedSessions((prev) => prev + 1);
        setStreakMinutes((prev) => prev + addedMinutes);

        const currentTask = actionItems.find((i) => i.id === selectedTaskId)?.task || 'General Study';
        if (onCompleteSession) {
          onCompleteSession(currentTask, addedMinutes);
        }
        // Auto-switch to short break
        handleSelectMode('shortBreak');
      } else {
        // Auto-switch back to focus
        handleSelectMode('focus25');
      }
    }
    return () => clearInterval(interval);
  }, [isRunning, secondsRemaining, mode]);

  // Web Audio Brown/Pink noise generator for zero-dependency ambient focus
  const startAmbientSound = () => {
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      const bufferSize = ctx.sampleRate * 2;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      let lastOut = 0.0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        // Brown noise filter for deep library focus
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 0.15; // low comfortable volume
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

      noise.connect(gainNode);
      gainNode.connect(ctx.destination);
      noise.start();
      noiseNodeRef.current = noise;
      setSoundEnabled(true);
    } catch (e) {
      console.warn('Ambient noise unsupported or blocked:', e);
    }
  };

  const stopAmbientSound = () => {
    if (noiseNodeRef.current) {
      try {
        (noiseNodeRef.current as any).stop();
      } catch {}
      noiseNodeRef.current = null;
    }
    setSoundEnabled(false);
  };

  const toggleSound = () => {
    if (soundEnabled) {
      stopAmbientSound();
    } else {
      startAmbientSound();
    }
  };

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const currentConfig = MODE_CONFIGS[mode];
  const totalDuration = currentConfig.duration;
  const progressPercent = Math.round(((totalDuration - secondsRemaining) / totalDuration) * 100);
  const selectedTask = actionItems.find((i) => i.id === selectedTaskId);

  return (
    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 shadow-xl space-y-6">
      {/* Top Header & Streak Stats */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-indigo-400 font-semibold uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5" />
            <span>Circadian Deep Focus Engine</span>
          </div>
          <h3 className="text-base font-bold text-white tracking-tight mt-0.5">
            Pomodoro Focus Sprint
          </h3>
        </div>

        {/* Daily Streak & Session Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-slate-400">Today:</span>
            <span className="font-mono font-bold text-amber-300 tabular-nums">
              {completedSessions} Sprints ({streakMinutes}m)
            </span>
          </div>

          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
              soundEnabled
                ? 'bg-indigo-950/80 border-indigo-700 text-indigo-300'
                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
            }`}
            title="Toggle Library Brown Noise (Focus Sound)"
          >
            {soundEnabled ? <Volume2 className="w-4 h-4 text-indigo-400" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline">{soundEnabled ? 'Library Noise On' : 'Ambient Noise'}</span>
          </button>
        </div>
      </div>

      {/* Mode Selector Segmented Control */}
      <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-950 border border-slate-800 rounded-xl">
        {(Object.keys(MODE_CONFIGS) as TimerMode[]).map((mKey) => {
          const cfg = MODE_CONFIGS[mKey];
          const isCurrent = mode === mKey;
          return (
            <button
              key={mKey}
              onClick={() => handleSelectMode(mKey)}
              className={`flex-1 min-w-[120px] py-1.5 px-3 text-xs font-semibold rounded-lg transition-all text-center cursor-pointer ${
                isCurrent
                  ? cfg.type === 'focus'
                    ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/40'
                    : 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-400/40'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
              }`}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Main Timer Display */}
      <div className="flex flex-col items-center justify-center py-4 space-y-4">
        {/* Large Tabular Time Display */}
        <div className="relative flex flex-col items-center">
          <div className="text-5xl sm:text-6xl font-extrabold font-mono tracking-tighter text-white tabular-nums drop-shadow-md">
            {formatTime(secondsRemaining)}
          </div>
          <div className="text-xs text-slate-400 font-medium mt-1">
            {currentConfig.desc}
          </div>
        </div>

        {/* Linear Progress Bar */}
        <div className="w-full max-w-md bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              currentConfig.type === 'focus' ? 'bg-indigo-500' : 'bg-emerald-500'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Timer Control Buttons */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => {
              if (!isRunning && soundEnabled) {
                startAmbientSound();
              }
              setIsRunning(!isRunning);
            }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all cursor-pointer ${
              isRunning
                ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                : currentConfig.type === 'focus'
                ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/30'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause Session</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Start Focus Sprint</span>
              </>
            )}
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              setSecondsRemaining(currentConfig.duration);
              stopAmbientSound();
            }}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => {
              setIsRunning(false);
              stopAmbientSound();
              if (currentConfig.type === 'focus') {
                handleSelectMode('shortBreak');
              } else {
                handleSelectMode('focus25');
              }
            }}
            className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:bg-slate-850 text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Skip to Next Cycle"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Target Task Linker */}
      <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <Clock className="w-4 h-4 text-indigo-400 shrink-0" />
          <span>Active Task Objective:</span>
        </div>

        <select
          value={selectedTaskId}
          onChange={(e) => setSelectedTaskId(e.target.value)}
          className="bg-slate-900 border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 max-w-md truncate cursor-pointer"
        >
          {actionItems.map((item) => (
            <option key={item.id} value={item.id}>
              [{item.course}] {item.task} ({item.dueDate})
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
