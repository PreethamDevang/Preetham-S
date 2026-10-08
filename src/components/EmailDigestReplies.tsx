import React, { useState } from 'react';
import { EmailMessage } from '../types';
import { generateSmartEmailReplyAI } from '../services/geminiService';
import { 
  Mail, 
  Send, 
  Sparkles, 
  Check, 
  Copy, 
  Clock, 
  Tag, 
  User, 
  Inbox, 
  AlertCircle,
  Archive,
  MessageSquare
} from 'lucide-react';

interface EmailDigestRepliesProps {
  emails: EmailMessage[];
  onArchiveEmail?: (id: string) => void;
}

export const EmailDigestReplies: React.FC<EmailDigestRepliesProps> = ({
  emails,
  onArchiveEmail,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailMessage>(emails[0]);
  const [tone, setTone] = useState<'formal' | 'peer' | 'recruiter' | 'brief'>('formal');
  const [draftReply, setDraftReply] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [sentAlert, setSentAlert] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredEmails = emails.filter((e) => {
    if (filterCategory === 'all') return true;
    return e.category.toLowerCase() === filterCategory.toLowerCase();
  });

  const handleGenerateReply = async (selectedTone = tone) => {
    if (!selectedEmail) return;
    setIsGenerating(true);
    setSentAlert(null);
    try {
      const generated = await generateSmartEmailReplyAI(selectedEmail.fullBody, selectedTone);
      setDraftReply(generated);
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!draftReply) return;
    navigator.clipboard.writeText(draftReply);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulateSend = () => {
    if (!draftReply) return;
    setSentAlert(`Reply sent to ${selectedEmail.sender}! Archived from active inbox.`);
    setTimeout(() => {
      setSentAlert(null);
      setDraftReply('');
      if (onArchiveEmail) {
        onArchiveEmail(selectedEmail.id);
      }
    }, 2200);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-blue-400 font-semibold tracking-wider uppercase">
            <span>Communication Engine</span>
            <span aria-hidden="true">·</span>
            <span>AI Inbox Triage & Tone Shifter</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Email Digest & Smart Reply
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Triage campus messages from professors, recruiters, and teammates with urgency scoring. Draft context-aware responses with 1-click tone shifts.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          {['all', 'Academic', 'Career', 'Project', 'Campus'].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 text-xs font-medium rounded-md capitalize transition-colors ${
                filterCategory.toLowerCase() === cat.toLowerCase()
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Layout: Inbox on Left, Email Reader & Smart Reply on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Email Digest Feed */}
        <div className="lg:col-span-5 space-y-3">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Inbox className="w-4 h-4 text-blue-400" />
              <span>Campus Digest ({filteredEmails.length})</span>
            </h2>
            <span className="text-xs text-rose-400 font-medium">
              {emails.filter((e) => e.priority === 'Urgent').length} Urgent Items
            </span>
          </div>

          <div className="space-y-2.5">
            {filteredEmails.map((email) => {
              const isSelected = selectedEmail?.id === email.id;
              return (
                <div
                  key={email.id}
                  onClick={() => {
                    setSelectedEmail(email);
                    setDraftReply('');
                    setSentAlert(null);
                  }}
                  className={`p-4 rounded-xl border transition-all cursor-pointer text-left ${
                    isSelected
                      ? 'bg-slate-900 border-blue-500/80 shadow-md ring-1 ring-blue-500/30'
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <span className="text-xs font-bold text-white truncate">
                      {email.sender}
                    </span>
                    <span className="text-xs text-slate-500 shrink-0 font-mono">
                      {email.date}
                    </span>
                  </div>

                  <h3 className="text-xs font-semibold text-slate-200 line-clamp-1 mb-1">
                    {email.subject}
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {email.snippet}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-2.5 pt-2 border-t border-slate-800/60">
                    <span
                      className={`font-semibold ${
                        email.priority === 'Urgent'
                          ? 'text-rose-400'
                          : email.priority === 'Important'
                          ? 'text-amber-400'
                          : 'text-slate-400'
                      }`}
                    >
                      {email.priority}
                    </span>
                    <span aria-hidden="true">·</span>
                    <span className="text-blue-400">{email.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="text-slate-500">{email.senderRole}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Full Email View & Smart Reply Composer */}
        <div className="lg:col-span-7 space-y-4">
          {selectedEmail ? (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-lg">
              {/* Email Detail Header */}
              <div className="space-y-3 border-b border-slate-800 pb-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <h2 className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {selectedEmail.subject}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="text-slate-200 font-medium">{selectedEmail.sender}</span>
                      <span className="text-blue-400 font-mono">({selectedEmail.senderRole})</span>
                      <span aria-hidden="true">·</span>
                      <span>{selectedEmail.date}</span>
                    </div>
                  </div>

                  <span
                    className={`px-2.5 py-1 text-xs font-semibold rounded-md ${
                      selectedEmail.priority === 'Urgent'
                        ? 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
                        : selectedEmail.priority === 'Important'
                        ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                        : 'bg-slate-800 text-slate-300 border border-slate-700'
                    }`}
                  >
                    {selectedEmail.priority}
                  </span>
                </div>

                <div className="p-3 rounded-lg bg-blue-950/30 border border-blue-900/50 text-xs text-blue-300 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-blue-400" />
                  <span>
                    <strong>Suggested Action:</strong> {selectedEmail.suggestedAction}
                  </span>
                </div>

                {/* Email Body */}
                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/90 text-xs sm:text-sm text-slate-300 whitespace-pre-line leading-relaxed font-sans">
                  {selectedEmail.fullBody}
                </div>
              </div>

              {/* AI Smart Reply Generator Section */}
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-blue-400" />
                      <span>Smart Reply Assistant</span>
                    </h3>
                    <p className="text-xs text-slate-400">
                      Select persona tone to generate a polished draft in seconds.
                    </p>
                  </div>

                  {/* Tone Selector Segmented Control */}
                  <div className="flex items-center gap-1 p-1 bg-slate-950 border border-slate-800 rounded-lg">
                    {[
                      { id: 'formal', label: 'Professor' },
                      { id: 'recruiter', label: 'Recruiter' },
                      { id: 'peer', label: 'Peer' },
                      { id: 'brief', label: 'Brief' },
                    ].map((t) => (
                      <button
                        key={t.id}
                        onClick={() => {
                          const newTone = t.id as any;
                          setTone(newTone);
                          handleGenerateReply(newTone);
                        }}
                        className={`px-2.5 py-1 text-xs font-medium rounded transition-colors ${
                          tone === t.id
                            ? 'bg-blue-600 text-white font-semibold shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Draft generation trigger if empty */}
                {!draftReply && (
                  <button
                    onClick={() => handleGenerateReply()}
                    disabled={isGenerating}
                    className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-xs font-semibold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>{isGenerating ? 'Drafting with Gemini...' : `Draft Reply (${tone.toUpperCase()} TONE)`}</span>
                  </button>
                )}

                {/* Draft Editor & Action Bar */}
                {draftReply && (
                  <div className="space-y-3">
                    <textarea
                      value={draftReply}
                      onChange={(e) => setDraftReply(e.target.value)}
                      rows={6}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3.5 text-xs sm:text-sm text-slate-200 focus:outline-none focus:border-blue-500 font-sans leading-relaxed"
                    />

                    {sentAlert && (
                      <div className="p-3 rounded-lg bg-emerald-950/50 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>{sentAlert}</span>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleCopy}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                        >
                          {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copied ? 'Copied' : 'Copy Draft'}</span>
                        </button>

                        <button
                          onClick={() => handleGenerateReply()}
                          disabled={isGenerating}
                          className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition-colors"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                          <span>Regenerate</span>
                        </button>
                      </div>

                      <button
                        onClick={handleSimulateSend}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send & Mark Resolved</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-3">
              <Mail className="w-10 h-10 text-slate-600 mx-auto" />
              <h3 className="text-sm font-bold text-slate-300">No Email Selected</h3>
              <p className="text-xs text-slate-500">
                Select a message from your campus inbox digest to read and draft smart replies.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
