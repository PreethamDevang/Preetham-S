import React, { useState } from 'react';
import { AutomationWorkflow } from '../types';
import { 
  Zap, 
  Play, 
  CheckCircle2, 
  Clock, 
  Plus, 
  Sparkles, 
  ArrowRight, 
  Sliders, 
  RefreshCw,
  Layers,
  Activity,
  Briefcase
} from 'lucide-react';

interface WorkflowAutomatorProps {
  workflows: AutomationWorkflow[];
  onToggleWorkflow: (id: string) => void;
  onAddWorkflow: (wf: AutomationWorkflow) => void;
}

export const WorkflowAutomator: React.FC<WorkflowAutomatorProps> = ({
  workflows,
  onToggleWorkflow,
  onAddWorkflow,
}) => {
  const [activeWorkflow, setActiveWorkflow] = useState<AutomationWorkflow>(workflows[0]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [executionLogs, setExecutionLogs] = useState<string[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(-1);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false);

  // New Workflow form
  const [newTitle, setNewTitle] = useState('');
  const [newTrigger, setNewTrigger] = useState('New Lecture Recorded');
  const [newSource, setNewSource] = useState('Voice-to-Action Organizer');

  const handleRunWorkflow = async (wf: AutomationWorkflow) => {
    setIsRunning(true);
    setExecutionLogs([]);
    setCurrentStepIndex(0);

    const logs: string[] = [];
    logs.push(`[${new Date().toLocaleTimeString()}] Trigger event recognized: "${wf.trigger.event}" from ${wf.trigger.source}`);
    setExecutionLogs([...logs]);

    for (let i = 0; i < wf.actions.length; i++) {
      setCurrentStepIndex(i);
      await new Promise((resolve) => setTimeout(resolve, 850));
      logs.push(`[${new Date().toLocaleTimeString()}] Completed Step ${i + 1}: ${wf.actions[i].action} -> ${wf.actions[i].target}`);
      setExecutionLogs([...logs]);
    }

    setCurrentStepIndex(wf.actions.length);
    logs.push(`[${new Date().toLocaleTimeString()}] Autonomous pipeline completed successfully with 0 errors.`);
    setExecutionLogs([...logs]);
    setIsRunning(false);
  };

  const handleCreateWorkflow = () => {
    if (!newTitle.trim()) return;
    const wf: AutomationWorkflow = {
      id: `wf-${Date.now()}`,
      title: newTitle.trim(),
      description: `Custom automated pipeline triggered on ${newTrigger}.`,
      trigger: {
        event: newTrigger,
        source: newSource,
      },
      actions: [
        { id: `a-${Date.now()}-1`, action: 'Normalize & Ingest Input', target: 'Core Knowledge Base', status: 'idle' },
        { id: `a-${Date.now()}-2`, action: 'Process Autonomous AI Transformation', target: 'Gemini Engine', status: 'idle' },
        { id: `a-${Date.now()}-3`, action: 'Sync with Student Daily Schedule', target: 'Circadian Calendar', status: 'idle' },
      ],
      enabled: true,
      runCount: 0,
      lastRun: 'Never',
    };
    onAddWorkflow(wf);
    setActiveWorkflow(wf);
    setNewTitle('');
    setShowCreateModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold tracking-wider uppercase">
            <span>Automation Infrastructure</span>
            <span aria-hidden="true">·</span>
            <span>Autonomous Student Pipelines</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            AI Workflow Automator
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Campus "Zapier" chaining university events into autonomous pipelines. Turn lecture audio into quizzes, recruiter emails into resumes, and late-night study alerts into sleep guards.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-3.5 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>New Custom Flow</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Workflow Selector List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Configured Pipelines ({workflows.length})
            </h2>
            <span className="text-xs text-emerald-400 font-mono">
              {workflows.filter((w) => w.enabled).length} Active
            </span>
          </div>

          <div className="space-y-2.5">
            {workflows.map((wf) => {
              const isSelected = activeWorkflow.id === wf.id;
              return (
                <div
                  key={wf.id}
                  onClick={() => {
                    setActiveWorkflow(wf);
                    setExecutionLogs([]);
                    setCurrentStepIndex(-1);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-900 border-amber-500/80 shadow-md ring-1 ring-amber-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-white truncate">{wf.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleWorkflow(wf.id);
                      }}
                      className={`px-2 py-0.5 text-[11px] font-semibold rounded cursor-pointer transition-colors ${
                        wf.enabled
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                          : 'bg-slate-800 text-slate-500'
                      }`}
                    >
                      {wf.enabled ? 'ACTIVE' : 'PAUSED'}
                    </button>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {wf.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-800/60 font-mono">
                    <span>{wf.actions.length} Linked Actions</span>
                    <span>Ran {wf.runCount} times</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Interactive Visual Canvas & Execution Console */}
        <div className="lg:col-span-7 space-y-4">
          {activeWorkflow ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-lg">
              {/* Pipeline Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {activeWorkflow.title}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Trigger: <span className="text-amber-400 font-mono">{activeWorkflow.trigger.event}</span> ({activeWorkflow.trigger.source})
                  </p>
                </div>

                <button
                  onClick={() => handleRunWorkflow(activeWorkflow)}
                  disabled={isRunning}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 text-xs font-bold rounded-lg transition-colors shadow-md cursor-pointer"
                >
                  {isRunning ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Executing Steps...</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-3.5 h-3.5 fill-current" />
                      <span>Simulate Pipeline Execution</span>
                    </>
                  )}
                </button>
              </div>

              {/* Visual Trigger-to-Action Sequence Flow */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Automated Step Sequence
                </div>

                {/* Trigger Card */}
                <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-800/40 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-6 h-6 rounded-md bg-amber-500 text-slate-950 text-xs font-black flex items-center justify-center font-mono">
                      ⚡
                    </span>
                    <div>
                      <div className="text-xs font-bold text-amber-300">TRIGGER: {activeWorkflow.trigger.event}</div>
                      <div className="text-[11px] text-slate-400 font-mono">Source: {activeWorkflow.trigger.source}</div>
                    </div>
                  </div>
                  <span className="text-xs text-amber-400 font-mono">EVENT HOOK</span>
                </div>

                {/* Action Nodes */}
                <div className="space-y-2.5 pl-3 border-l-2 border-slate-800 ml-3">
                  {activeWorkflow.actions.map((act, index) => {
                    const isStepRunning = isRunning && currentStepIndex === index;
                    const isStepComplete = (isRunning && currentStepIndex > index) || (!isRunning && currentStepIndex >= activeWorkflow.actions.length);

                    return (
                      <div
                        key={act.id}
                        className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
                          isStepRunning
                            ? 'bg-amber-950/40 border-amber-500 ring-1 ring-amber-500/50'
                            : isStepComplete
                            ? 'bg-emerald-950/20 border-emerald-800/60'
                            : 'bg-slate-950/70 border-slate-800'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-md text-xs font-bold flex items-center justify-center font-mono ${
                              isStepComplete
                                ? 'bg-emerald-500 text-slate-950'
                                : isStepRunning
                                ? 'bg-amber-500 text-slate-950 animate-pulse'
                                : 'bg-slate-800 text-slate-300'
                            }`}
                          >
                            {index + 1}
                          </span>
                          <div>
                            <div className="text-xs font-semibold text-slate-200">
                              {act.action}
                            </div>
                            <div className="text-[11px] text-slate-400 font-mono">
                              Target: {act.target}
                            </div>
                          </div>
                        </div>

                        <span
                          className={`text-xs font-mono font-medium ${
                            isStepComplete
                              ? 'text-emerald-400'
                              : isStepRunning
                              ? 'text-amber-400'
                              : 'text-slate-500'
                          }`}
                        >
                          {isStepComplete ? 'COMPLETED' : isStepRunning ? 'RUNNING...' : 'STANDBY'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Live Execution Logs Window */}
              {executionLogs.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    Execution Trace & Log Timeline
                  </div>
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/90 font-mono text-xs text-slate-300 space-y-1 max-h-48 overflow-y-auto">
                    {executionLogs.map((log, lIdx) => (
                      <div
                        key={lIdx}
                        className={
                          log.includes('Completed Step')
                            ? 'text-emerald-400'
                            : log.includes('Trigger')
                            ? 'text-amber-400'
                            : 'text-slate-300'
                        }
                      >
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Zap className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No Workflow Selected</h3>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Create Custom Flow */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5 shadow-2xl">
            <h3 className="text-base font-bold text-white">Create Custom University Flow</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-slate-300">Pipeline Name:</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Canvas Homework Release to Schedule"
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans mt-1"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Trigger Event:</label>
                <select
                  value={newTrigger}
                  onChange={(e) => setNewTrigger(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans mt-1"
                >
                  <option value="New Lecture Recorded">New Lecture Recorded (Voice-to-Action)</option>
                  <option value="Recruiter Email Received">Recruiter Email Received (Email Digest)</option>
                  <option value="Grade Released < 80%">Grade Released Below 80% (Canvas Webhook)</option>
                  <option value="Study Session Past 11:30 PM">Study Session Past 11:30 PM (Health Guider)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-medium text-slate-300">Source Module:</label>
                <input
                  type="text"
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-sans mt-1"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-3 py-1.5 text-xs text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateWorkflow}
                disabled={!newTitle.trim()}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
              >
                Save & Activate Pipeline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
