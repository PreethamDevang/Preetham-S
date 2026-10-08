import React, { useState } from 'react';
import { CampusOpportunity } from '../types';
import { generateWithGemini } from '../services/geminiService';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Clock, 
  DollarSign, 
  User, 
  Tag, 
  ExternalLink,
  Award,
  Filter,
  CheckCircle2
} from 'lucide-react';

interface CampusOpportunitiesProps {
  opportunities: CampusOpportunity[];
}

export const CampusOpportunities: React.FC<CampusOpportunitiesProps> = ({
  opportunities,
}) => {
  const [selectedOpp, setSelectedOpp] = useState<CampusOpportunity>(opportunities[0]);
  const [filterType, setFilterType] = useState<string>('all');
  const [pitchDraft, setPitchDraft] = useState<string>('');
  const [isGeneratingPitch, setIsGeneratingPitch] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);

  const filtered = opportunities.filter((o) => {
    if (filterType === 'all') return true;
    return o.type.toLowerCase() === filterType.toLowerCase();
  });

  const handleGenerateColdPitch = async (opp: CampusOpportunity) => {
    setIsGeneratingPitch(true);
    const prompt = `Write a persuasive, highly tailored student application / cold email pitch to the following campus opportunity.
Student Profile: Alex Chen, B.S. Computer Science & Cognitive Systems (GPA 3.88), experience with Go, Distributed Systems (Raft consensus), React, TypeScript, and bio-intelligence data analysis.

Opportunity:
Title: ${opp.title}
Organization: ${opp.organization}
Description: ${opp.description}
Contact: ${opp.contactPerson}

Write a professional, concise 3-paragraph cold email pitch highlighting specific alignment with this lab/hackathon/fellowship.`;

    try {
      const res = await generateWithGemini(prompt, 'You are a career and research mentor for elite university students.');
      if (res.success && res.text) {
        setPitchDraft(res.text.trim());
      } else {
        setPitchDraft(
          `Dear ${opp.contactPerson.split(' ')[0] || 'Team'},\n\nI am writing to express my strong interest in the ${opp.title} with ${opp.organization}. As a Computer Science and Cognitive Systems student at the University of Washington with a focus on high-throughput distributed systems and autonomous agents, I have closely tracked your recent initiatives.\n\nIn my recent research and project work, I engineered a Raft consensus leader election engine in Go capable of handling 14,000+ synthetic concurrent requests/sec with sub-12ms tail latency. I also architected full-stack event processing pipelines that synchronize bio-circadian telemetry with cognitive study schedules. I believe this systems-level background directly aligns with your requirements.\n\nI would welcome the opportunity to discuss how I can contribute to your upcoming project milestones. Thank you for your time and consideration.\n\nSincerely,\nAlex Chen\nalex.chen@university.edu | (555) 234-8901\nGitHub: @alexchen-ai | Portfolio: alexchen.dev`
        );
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingPitch(false);
    }
  };

  const handleCopy = () => {
    if (!pitchDraft) return;
    navigator.clipboard.writeText(pitchDraft);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-rose-400 font-semibold tracking-wider uppercase">
            <span>Career & Campus Agent</span>
            <span aria-hidden="true">·</span>
            <span>Autonomous Opportunity Matcher</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            AI Campus Opportunity Agent
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Autonomous crawler curating campus hackathons, research labs, grants, and internships matched to your academic trajectory.
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {['all', 'Research Lab', 'Hackathon', 'Internship', 'Leadership'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                filterType.toLowerCase() === t.toLowerCase()
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Visual Spotlight Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="h-44 sm:h-52 w-full overflow-hidden relative">
          <img
            src="/src/assets/images/campus_innovation_visual_1791478422597.jpg"
            alt="University Innovation Lab & Hackathon Workspace"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center filter brightness-90"
            onError={(e) => {
              (e.target as HTMLElement).style.display = 'none';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
        </div>
        <div className="absolute inset-0 p-6 flex flex-col justify-end">
          <div className="max-w-2xl space-y-1">
            <span className="text-xs font-semibold text-rose-400 uppercase tracking-wider">
              Campus Intelligence Feed
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              High-Signal Opportunities Tailored to Your Profile
            </h2>
            <p className="text-xs text-slate-300">
              Scanned across 14 university departmental bulletin boards, laboratory wikis, and student engineering consortiums.
            </p>
          </div>
        </div>
      </div>

      {/* Two Column Layout: Feed on Left, Opportunity Detail & AI Cold Pitch on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Opportunities List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Matched Opportunities ({filtered.length})
            </h3>
            <span className="text-xs text-rose-400 font-mono">Ranked by Compatibility</span>
          </div>

          <div className="space-y-2.5">
            {filtered.map((opp) => {
              const isSelected = selectedOpp?.id === opp.id;
              return (
                <div
                  key={opp.id}
                  onClick={() => {
                    setSelectedOpp(opp);
                    setPitchDraft('');
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-900 border-rose-500/80 shadow-md ring-1 ring-rose-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div>
                      <h4 className="text-xs font-bold text-white line-clamp-1">{opp.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">{opp.organization}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-bold font-mono tabular-nums text-emerald-400">
                        {opp.matchScore}%
                      </div>
                      <div className="text-[10px] text-slate-500 uppercase">Match</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed mt-2">
                    {opp.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-slate-800/60">
                    <span className="text-rose-400 font-medium">{opp.type}</span>
                    <span className="font-mono text-slate-400">Due: {opp.deadline}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Opportunity Detail & AI Cold Pitch Generator */}
        <div className="lg:col-span-7 space-y-4">
          {selectedOpp ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-lg">
              {/* Header */}
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      {selectedOpp.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="text-slate-200 font-semibold">{selectedOpp.organization}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-rose-400 font-medium">{selectedOpp.type}</span>
                      <span aria-hidden="true">·</span>
                      <span>Contact: {selectedOpp.contactPerson}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 text-center shrink-0">
                    <div className="text-lg font-bold font-mono tabular-nums text-emerald-400">
                      {selectedOpp.matchScore}%
                    </div>
                    <div className="text-[10px] text-slate-400 uppercase font-medium">Match</div>
                  </div>
                </div>

                {/* Compensation & Deadline */}
                <div className="grid grid-cols-2 gap-3 pt-1">
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                    <span className="text-slate-500 block mb-0.5">Stipend / Prize:</span>
                    <span className="text-slate-200 font-semibold">{selectedOpp.compensation}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/80 border border-slate-800 text-xs">
                    <span className="text-slate-500 block mb-0.5">Application Deadline:</span>
                    <span className="text-amber-400 font-mono font-medium">{selectedOpp.deadline}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {selectedOpp.description}
                </div>

                {/* Requirements Checklist */}
                <div className="space-y-2">
                  <div className="text-xs font-bold text-slate-300">Prerequisites & Requirements:</div>
                  <div className="space-y-1.5">
                    {selectedOpp.requirements.map((req, rIdx) => (
                      <div key={rIdx} className="flex items-center gap-2 text-xs text-slate-300">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{req}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Cold Pitch Generator */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-rose-400" />
                      <span>AI Cold Pitch & Application Cover Letter</span>
                    </h4>
                    <p className="text-xs text-slate-400">
                      Synthesize your projects and GPA into a tailored pitch to Dr. {selectedOpp.contactPerson.split(' ')[0]}.
                    </p>
                  </div>

                  {!pitchDraft && (
                    <button
                      onClick={() => handleGenerateColdPitch(selectedOpp)}
                      disabled={isGeneratingPitch}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs font-bold rounded-lg transition-colors shadow-sm cursor-pointer"
                    >
                      {isGeneratingPitch ? 'Drafting...' : 'Generate Pitch'}
                    </button>
                  )}
                </div>

                {pitchDraft && (
                  <div className="space-y-3">
                    <textarea
                      value={pitchDraft}
                      onChange={(e) => setPitchDraft(e.target.value)}
                      rows={8}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-rose-500 font-sans leading-relaxed"
                    />

                    <div className="flex items-center justify-between gap-3">
                      <button
                        onClick={handleCopy}
                        className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? 'Copied to Clipboard' : 'Copy Email Pitch'}</span>
                      </button>

                      <button
                        onClick={() => handleGenerateColdPitch(selectedOpp)}
                        disabled={isGeneratingPitch}
                        className="text-xs text-rose-400 hover:text-rose-300 font-medium"
                      >
                        Regenerate Pitch
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Sparkles className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No Opportunity Selected</h3>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
