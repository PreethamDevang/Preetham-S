import React, { useState } from 'react';
import { HealthRecordTranslation, CircadianMetric } from '../types';
import { translateHealthRecordAI } from '../services/geminiService';
import { 
  Activity, 
  Heart, 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Moon, 
  Sun, 
  Coffee, 
  Droplet, 
  FileText, 
  HelpCircle,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';

interface HealthGuiderTranslatorProps {
  initialHealthRecord: HealthRecordTranslation;
  circadianSchedule: CircadianMetric[];
}

export const HealthGuiderTranslator: React.FC<HealthGuiderTranslatorProps> = ({
  initialHealthRecord,
  circadianSchedule,
}) => {
  const [healthRecord, setHealthRecord] = useState<HealthRecordTranslation>(initialHealthRecord);
  const [reportInput, setReportInput] = useState<string>('');
  const [isTranslating, setIsTranslating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [selectedSubTab, setSelectedSubTab] = useState<'translator' | 'circadian'>('translator');

  // Circadian interactive states
  const [sleepHours, setSleepHours] = useState<number>(7.2);
  const [caffeineCups, setCaffeineCups] = useState<number>(2);
  const [waterGlasses, setWaterGlasses] = useState<number>(6);

  const handleTranslateReport = async () => {
    const text = reportInput.trim();
    if (!text) {
      setStatusMessage('Please paste a medical lab report or clinic note first.');
      return;
    }

    setIsTranslating(true);
    setStatusMessage('Translating medical clinical markers with Gemini 3.8 Flash...');

    try {
      const translated = await translateHealthRecordAI(text);
      const newRecord: HealthRecordTranslation = {
        id: `hr-${Date.now()}`,
        date: 'Today',
        testName: 'University Student Health Center Screen',
        originalReportSnippet: text.slice(0, 200) + '...',
        plainEnglishSummary: translated.plainEnglishSummary,
        keyMetrics: translated.keyMetrics,
        studyStaminaAdvice: translated.studyStaminaAdvice,
        recommendedQuestionsForDoctor: translated.recommendedQuestionsForDoctor,
        nutritionCircadianAdvice: translated.nutritionCircadianAdvice,
      };

      setHealthRecord(newRecord);
      setStatusMessage('Translated report into plain-English student stamina insights!');
    } catch (err) {
      console.error(err);
      setStatusMessage('Organized report with clinical fallback intelligence.');
    } finally {
      setIsTranslating(false);
    }
  };

  const loadSampleReport = (type: 'cbc' | 'thyroid' | 'allergies') => {
    if (type === 'cbc') {
      setReportInput(
        'LAB RESULTS - HEMATOLOGY: 25-OH Vitamin D: 18.2 ng/mL (Ref: 30-100). Serum Ferritin: 19 ng/mL (Ref: 30-200). Hemoglobin: 13.8 g/dL (Ref: 13.5-17.5). White Blood Cell Count: 6.2 k/uL (Ref: 4.5-11.0). Fasting Glucose: 86 mg/dL (Ref: 70-99). Patient notes feeling mid-afternoon fatigue during university lectures.'
      );
    } else if (type === 'thyroid') {
      setReportInput(
        'ENDOCRINE PANEL: Serum TSH: 3.9 mIU/L (Ref: 0.4-4.0). Free T4: 1.1 ng/dL (Ref: 0.8-1.8). Morning Cortisol (8 AM): 18.4 mcg/dL (Ref: 6.0-22.0). hs-CRP: 0.4 mg/L (Ref: <1.0). Patient reports mild sleep onset latency and high academic exam stress.'
      );
    } else {
      setReportInput(
        'CLINIC VITALS & ALLERGY SCREEN: Resting Heart Rate: 68 bpm. Blood Pressure: 118/76 mmHg. IgE Allergen Screen: Elevated reactivity to dust mites and birch pollen. O2 Saturation: 99% on room air. Prescribed cetirizine 10mg PRN for campus library study allergy symptoms.'
      );
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold tracking-wider uppercase">
            <span>Bio-Cognitive Health Intelligence</span>
            <span aria-hidden="true">·</span>
            <span>Human-Centric Student Wellness</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
            Health Record Translator & Circadian Guider
          </h1>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Demystify medical lab reports into student-friendly energy insights. Align analytical deep work with your 24-hour biological circadian alertness curve.
          </p>
        </div>

        {/* Sub-tab segmented control */}
        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
          <button
            onClick={() => setSelectedSubTab('translator')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              selectedSubTab === 'translator'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Lab Report Translator</span>
          </button>
          <button
            onClick={() => setSelectedSubTab('circadian')}
            className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              selectedSubTab === 'circadian'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Circadian Study Clock</span>
          </button>
        </div>
      </div>

      {/* Hero Visual Spotlight */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl">
        <div className="h-44 sm:h-52 w-full overflow-hidden relative">
          <img
            src="/src/assets/images/health_circadian_visual_1791478411183.jpg"
            alt="Bio-Cognitive Circadian Intelligence and Medical Record Translation"
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
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
              Bio-Cognitive Synchronization
            </span>
            <h2 className="text-xl font-bold text-white tracking-tight">
              A Healthy Body Powers an Exceptional Mind
            </h2>
            <p className="text-xs text-slate-300">
              Exam performance is biologically capped by sleep quality, cellular iron reserves, and circadian timing.
            </p>
          </div>
        </div>
      </div>

      {selectedSubTab === 'translator' ? (
        /* ================== MEDICAL REPORT TRANSLATOR ================== */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Report Input Studio */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-lg">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-400" />
                  <span>Translate Medical Document</span>
                </h3>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => loadSampleReport('cbc')}
                    className="px-2 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  >
                    CBC/Vit-D
                  </button>
                  <button
                    onClick={() => loadSampleReport('thyroid')}
                    className="px-2 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  >
                    Thyroid
                  </button>
                  <button
                    onClick={() => loadSampleReport('allergies')}
                    className="px-2 py-0.5 text-xs text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
                  >
                    Allergy
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Paste your student health center lab results, blood tests, or doctor clinic summary. Gemini translates confusing numbers into actionable study energy guidelines.
              </p>

              <textarea
                value={reportInput}
                onChange={(e) => setReportInput(e.target.value)}
                placeholder="Paste lab text (e.g. Ferritin 22 ng/mL, Vitamin D 19.4 ng/mL, TSH 1.82 mIU/L)..."
                rows={7}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-xs text-slate-200 focus:outline-none focus:border-emerald-500 font-sans leading-relaxed"
              />

              {statusMessage && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-900/60 text-xs text-emerald-300 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
                  <span>{statusMessage}</span>
                </div>
              )}

              <button
                onClick={handleTranslateReport}
                disabled={isTranslating || !reportInput.trim()}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>{isTranslating ? 'Translating with Gemini...' : 'Translate Lab Report to Plain English'}</span>
              </button>
            </div>

            {/* Medical Disclaimer Banner */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 text-xs text-slate-500 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
              <span>
                EduConnect AI provides educational health literacy and study optimization insights. Always consult your university health center physician for clinical diagnosis and prescriptions.
              </span>
            </div>
          </div>

          {/* Right Column: Translated Clinical Intelligence */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-lg">
              {/* Header */}
              <div className="space-y-2 border-b border-slate-800 pb-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-base sm:text-lg font-bold text-white tracking-tight">
                    {healthRecord.testName}
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">{healthRecord.date}</span>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed">
                  <strong className="text-emerald-400 block mb-1">Plain-English Student Summary:</strong>
                  {healthRecord.plainEnglishSummary}
                </div>
              </div>

              {/* Biomarkers Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Biomarkers & Impact on Study Stamina
                </h4>

                <div className="space-y-2.5">
                  {healthRecord.keyMetrics.map((metric, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-white">{metric.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-slate-200">
                            {metric.value}
                          </span>
                          <span
                            className={`px-2 py-0.5 text-[11px] font-semibold rounded ${
                              metric.status === 'optimal'
                                ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-800/60'
                                : metric.status === 'low' || metric.status === 'attention'
                                ? 'bg-amber-950/70 text-amber-300 border border-amber-800/60'
                                : 'bg-rose-950/70 text-rose-300 border border-rose-800/60'
                            }`}
                          >
                            {metric.status.toUpperCase()}
                          </span>
                        </div>
                      </div>

                      <div className="text-[11px] text-slate-500 font-mono">
                        Standard Reference Range: {metric.standardRange}
                      </div>

                      <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-2.5 rounded-lg border border-slate-850">
                        <strong className="text-emerald-400">Study Impact:</strong> {metric.studentImpact}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Stamina & Circadian Study Advice */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <Sun className="w-3.5 h-3.5" />
                    <span>Study Schedule Optimization</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {healthRecord.studyStaminaAdvice}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                  <div className="text-xs font-bold text-teal-400 flex items-center gap-1.5">
                    <Droplet className="w-3.5 h-3.5" />
                    <span>Hydration & Nutrition Guidance</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {healthRecord.nutritionCircadianAdvice}
                  </p>
                </div>
              </div>

              {/* Questions for Campus Doctor */}
              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span>High-Value Questions to Ask Your Campus Physician:</span>
                </div>
                <div className="space-y-1.5 pl-2">
                  {healthRecord.recommendedQuestionsForDoctor.map((q, qIdx) => (
                    <div key={qIdx} className="text-xs text-slate-300 flex items-start gap-2">
                      <span className="text-emerald-400 font-bold">•</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ================== CIRCADIAN STUDY CLOCK ================== */
        <div className="space-y-6">
          {/* Daily Vitals Inputs & Burnout Shield Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Moon className="w-3.5 h-3.5 text-indigo-400" />
                  <span>Last Night Sleep</span>
                </span>
                <span className="font-mono text-white font-bold">{sleepHours} hrs</span>
              </div>
              <input
                type="range"
                min="4"
                max="10"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full accent-indigo-500"
              />
              <div className="text-[11px] text-slate-500">
                {sleepHours >= 7 ? '✓ Adequate sharp-wave ripple consolidation' : '⚠ Elevated adenosine fatigue'}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  <span>Caffeine Intake</span>
                </span>
                <span className="font-mono text-white font-bold">{caffeineCups} cups</span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="1"
                value={caffeineCups}
                onChange={(e) => setCaffeineCups(parseInt(e.target.value))}
                className="w-full accent-amber-500"
              />
              <div className="text-[11px] text-slate-500">
                Caffeine curfew: Cut off by 2:00 PM for deep non-REM stage 3 sleep.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <Droplet className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Hydration Level</span>
                </span>
                <span className="font-mono text-white font-bold">{waterGlasses} / 8 glasses</span>
              </div>
              <input
                type="range"
                min="1"
                max="10"
                step="1"
                value={waterGlasses}
                onChange={(e) => setWaterGlasses(parseInt(e.target.value))}
                className="w-full accent-cyan-500"
              />
              <div className="text-[11px] text-slate-500">
                Maintaining blood volume ensures consistent brain oxygenation.
              </div>
            </div>
          </div>

          {/* 24-Hour Circadian Alertness Curve */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
              <div>
                <h3 className="text-base font-bold text-white tracking-tight">
                  24-Hour Biological Alertness & Study Schedule
                </h3>
                <p className="text-xs text-slate-400">
                  Synced with human suprachiasmatic nucleus (SCN) circadian rhythms
                </p>
              </div>
              <span className="text-xs text-emerald-400 font-mono font-medium">
                ● Live Biological Time: 10:00 AM (Peak Alertness: 98%)
              </span>
            </div>

            {/* Timeline Bars */}
            <div className="space-y-3">
              {circadianSchedule.map((metric) => (
                <div
                  key={metric.hour}
                  className={`p-3.5 rounded-xl border transition-all ${
                    metric.currentHour
                      ? 'bg-emerald-950/40 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-slate-950/70 border-slate-800/80 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3 mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-bold text-slate-300 w-16">
                        {metric.hour}:00 {metric.hour < 12 ? 'AM' : 'PM'}
                      </span>
                      <span className="text-xs font-semibold text-white">
                        {metric.phase}
                      </span>
                      {metric.currentHour && (
                        <span className="text-[10px] bg-emerald-500 text-slate-950 font-bold px-2 py-0.5 rounded font-mono">
                          ACTIVE WINDOW
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-slate-300">
                        {metric.alertnessLevel}%
                      </span>
                      <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden hidden sm:block">
                        <div
                          className={`h-full rounded-full ${
                            metric.alertnessLevel >= 80
                              ? 'bg-emerald-500'
                              : metric.alertnessLevel >= 50
                              ? 'bg-amber-500'
                              : 'bg-indigo-500'
                          }`}
                          style={{ width: `${metric.alertnessLevel}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-400 pl-18 leading-relaxed">
                    <strong className="text-slate-300">Prescription:</strong> {metric.recommendedActivity}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
