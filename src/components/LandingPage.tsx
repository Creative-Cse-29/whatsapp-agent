import React, { useState } from 'react';
import {
  Bot,
  Brain,
  Sparkles,
  Zap,
  ShieldCheck,
  Mic,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  MessageSquare,
  Volume2,
  Lock,
  ChevronRight,
  Database,
  Code2,
  Layers,
  GraduationCap
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onTryDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted, onTryDemo }) => {
  const [activeStep, setActiveStep] = useState(0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {/* Top Banner */}
      <div className="bg-emerald-950/40 border-b border-emerald-500/20 py-2 px-4 text-center text-xs text-emerald-300">
        🎓 <strong className="font-semibold text-white">Final Year Diploma CSE Project Demonstration</strong> — Grounded AI Assistant with Zero WhatsApp Security Bypass
      </div>

      {/* Navigation */}
      <nav className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20">
            <Bot className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white">WhatsApp AI Agent</span>
            <span className="hidden sm:inline-block ml-2 text-[10px] uppercase font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Diploma CSE Capstone
            </span>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-300">
          <a href="#problem" className="hover:text-emerald-400 transition-colors">The Problem</a>
          <a href="#how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</a>
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#voice-ai" className="hover:text-emerald-400 transition-colors">Voice AI</a>
          <a href="#privacy" className="hover:text-emerald-400 transition-colors">Privacy</a>
          <a href="#tech" className="hover:text-emerald-400 transition-colors">Tech Stack</a>
          <a href="#future" className="hover:text-emerald-400 transition-colors">Future Scope</a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onTryDemo}
            className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 hover:border-emerald-500/50 hover:text-white transition-all"
          >
            Try Demo
          </button>
          <button
            onClick={onGetStarted}
            className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:opacity-95 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
          >
            <span>Get Started</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-20 px-6 sm:px-12 max-w-7xl mx-auto">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-medium text-emerald-300 mb-6">
            <Sparkles className="h-4 w-4" />
            <span>🤖 WhatsApp AI Agent</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Understand Hundreds of Messages in{' '}
            <span className="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              Seconds.
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl mx-auto">
            Your personal AI communication assistant that summarizes conversations, finds important information, detects deadlines, and answers questions about your messages.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/25 transition-all flex items-center gap-2"
            >
              <span>Get Started Free</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button
              onClick={onTryDemo}
              className="rounded-xl border border-slate-700 bg-slate-900/80 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-emerald-500/60 hover:text-white transition-all"
            >
              ⚡ Try Demo Scenario
            </button>
            <a
              href="#how-it-works"
              className="rounded-xl px-5 py-3.5 text-sm font-medium text-slate-400 hover:text-slate-200 transition-colors"
            >
              See How It Works ↓
            </a>
          </div>
        </div>

        {/* Hero Visual: 100+ Messages -> AI Brain -> 5 Important Points */}
        <div className="mt-16 rounded-2xl border border-slate-800 bg-slate-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl relative">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-slate-400">whatsapp-ai-pipeline-visualizer.tsx</span>
            </div>
            <span className="text-xs text-emerald-400 font-mono font-medium">100+ messages → AI → 5 Key Action Items</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Column 1: Unstructured Chat Noise */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-400 mb-2">
                <span>Incoming Flooded Chat (100+ msgs)</span>
                <span className="text-[10px] text-rose-400 font-mono">Unstructured</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs opacity-75">
                <span className="font-semibold text-emerald-400">Prof. Sharma:</span> Tomorrow we need to discuss AI project evaluation criteria...
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs opacity-85">
                <span className="font-semibold text-cyan-400">Rohan:</span> When is the project submission deadline, Sir?
              </div>
              <div className="rounded-xl border border-rose-500/30 bg-rose-950/20 p-3 text-xs">
                <span className="font-semibold text-emerald-400">Prof. Sharma:</span> Deadline is Friday before 5:00 PM on the portal. No late submissions!
              </div>
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-xs">
                <span className="font-semibold text-purple-400">Pooja:</span> Presentation will be Saturday at 10 AM in Seminar Hall 2.
              </div>
            </div>

            {/* Column 2: The AI Core */}
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <div className="relative flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-emerald-500 via-teal-500 to-cyan-400 text-slate-950 shadow-2xl shadow-emerald-500/30 animate-pulse-glow">
                <Brain className="h-12 w-12 stroke-[2.2] animate-bounce" />
                <div className="absolute inset-0 rounded-3xl border-2 border-white/30 animate-ping opacity-25" />
              </div>
              <h3 className="mt-4 text-sm font-bold text-white">Gemini 3.8 Intelligence</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-xs">
                Contextual entity extraction, urgency prioritization, temporal reasoning & deadline detection.
              </p>
            </div>

            {/* Column 3: Synthesized Crisp Insights */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-xs font-semibold text-emerald-300 mb-2">
                <span>AI Actionable Synthesis</span>
                <span className="text-[10px] text-emerald-400 font-mono">5 High-Impact Items</span>
              </div>
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs">
                <div className="flex items-center gap-1.5 font-bold text-emerald-300">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Executive AI Summary</span>
                </div>
                <p className="text-slate-300 mt-1 text-[11px]">
                  Team finalized AI project deliverables. Submission due Friday; dry run Wednesday; presentation Saturday.
                </p>
              </div>
              <div className="rounded-xl border border-rose-500/40 bg-rose-950/30 p-2.5 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-rose-500" />
                  <span className="font-semibold text-rose-300">⏰ Deadline:</span>
                  <span className="text-slate-200">Friday, 5:00 PM (Portal)</span>
                </div>
              </div>
              <div className="rounded-xl border border-amber-500/40 bg-amber-950/30 p-2.5 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-amber-500" />
                  <span className="font-semibold text-amber-300">📅 Presentation:</span>
                  <span className="text-slate-200">Saturday, 10:00 AM (Seminar Hall 2)</span>
                </div>
              </div>
              <div className="rounded-xl border border-teal-500/40 bg-teal-950/30 p-2.5 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2 rounded-full bg-teal-400" />
                  <span className="font-semibold text-teal-300">✅ Action Task:</span>
                  <span className="text-slate-200">Upload slides before Friday</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">The Problem</span>
          <h2 className="mt-2 text-3xl font-bold text-white">Hundreds of Messages, Zero Time</h2>
          <p className="mt-3 text-sm text-slate-400">
            Students and professionals receive countless group notifications daily across College, Projects, AI/ML study groups, and announcements.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="h-10 w-10 rounded-xl bg-rose-500/10 text-rose-400 flex items-center justify-center font-bold text-lg mb-4">
              99+
            </div>
            <h3 className="text-sm font-semibold text-white">Endless Message Spam</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Groups flood with trivial chit-chat, memes, and repeat questions, burying the actual instructions.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center font-bold text-lg mb-4">
              ⏰
            </div>
            <h3 className="text-sm font-semibold text-white">Missed Deadlines & Cutoffs</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Crucial project synopsis submissions and exam registration links are easily overlooked.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="h-10 w-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center font-bold text-lg mb-4">
              ❓
            </div>
            <h3 className="text-sm font-semibold text-white">Lost Faculty Instructions</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Faculty and mentor directions get scattered over days of messages, making tracking difficult.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-5">
            <div className="h-10 w-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center font-bold text-lg mb-4">
              🧠
            </div>
            <h3 className="text-sm font-semibold text-white">Information Overload</h3>
            <p className="mt-1.5 text-xs text-slate-400 leading-relaxed">
              Reading through 200+ chats across 6 groups takes 45 minutes every day.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Step-by-Step Architecture</span>
          <h2 className="mt-2 text-3xl font-bold text-white">How WhatsApp AI Agent Works</h2>
          <p className="mt-3 text-sm text-slate-400">
            A secure 4-stage pipeline that converts raw conversations into actionable intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 relative">
            <div className="text-emerald-400 font-mono text-xs font-bold mb-3">01 // IMPORT</div>
            <h3 className="text-base font-semibold text-white">Import Authorized Data</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Upload exported chat files (TXT, CSV, JSON) or load demo scenario. Zero credential scraping.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 relative">
            <div className="text-emerald-400 font-mono text-xs font-bold mb-3">02 // NLP PARSER</div>
            <h3 className="text-base font-semibold text-white">Structured Parsing</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Extracts senders, timestamps, message bodies, and stores them in normalized SQLite 3NF tables.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 relative">
            <div className="text-emerald-400 font-mono text-xs font-bold mb-3">03 // AI ENGINE</div>
            <h3 className="text-base font-semibold text-white">Contextual Analysis</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Gemini 3.8 Flash classifies urgency (Urgent, Important, Normal), extracts events, and identifies deadlines.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-6 relative">
            <div className="text-emerald-400 font-mono text-xs font-bold mb-3">04 // VOICE & QA</div>
            <h3 className="text-base font-semibold text-white">Instant Answers & Voice</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Ask natural questions using voice or text. The agent speaks back answers grounded strictly in messages.
            </p>
          </div>
        </div>
      </section>

      {/* Core Features Grid */}
      <section id="features" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Capabilities</span>
          <h2 className="mt-2 text-3xl font-bold text-white">Engineered for Academic & Team Efficiency</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-emerald-500/40 transition-colors">
            <Brain className="h-8 w-8 text-emerald-400 mb-4" />
            <h3 className="text-base font-semibold text-white">Concise AI Summaries</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Generates executive summaries with key discussion topics so you grasp 200 messages in 10 seconds.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-emerald-500/40 transition-colors">
            <Clock className="h-8 w-8 text-rose-400 mb-4" />
            <h3 className="text-base font-semibold text-white">Deadline Detection & Countdown</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Detects time-sensitive notices like "Submit project details before Friday" and displays live countdowns.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-emerald-500/40 transition-colors">
            <Calendar className="h-8 w-8 text-amber-400 mb-4" />
            <h3 className="text-base font-semibold text-white">Event & Meeting Extraction</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Automatically captures presentations, faculty meetings, and lab rehearsals into a clean calendar schedule.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-emerald-500/40 transition-colors">
            <CheckCircle2 className="h-8 w-8 text-teal-400 mb-4" />
            <h3 className="text-base font-semibold text-white">Actionable Task Extraction</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Identifies todos ("Upload PPT", "Finalize accuracy graph") and tracks them in an interactive checklist.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-emerald-500/40 transition-colors">
            <Mic className="h-8 w-8 text-cyan-400 mb-4" />
            <h3 className="text-base font-semibold text-white">Voice-to-Voice Assistant</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Ask questions via microphone and listen to crystal-clear spoken answers using Web Speech & Gemini TTS.
            </p>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 hover:border-emerald-500/40 transition-colors">
            <ShieldCheck className="h-8 w-8 text-emerald-400 mb-4" />
            <h3 className="text-base font-semibold text-white">Strict Message Grounding</h3>
            <p className="mt-2 text-xs text-slate-400 leading-relaxed">
              Zero hallucination policy: If an answer is not in your group chat, the AI states it explicitly.
            </p>
          </div>
        </div>
      </section>

      {/* Voice AI Section */}
      <section id="voice-ai" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-900">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-900/80 to-slate-950 p-8 sm:p-12 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-300 mb-4">
                <Mic className="h-3.5 w-3.5 animate-pulse" />
                <span>Conversational Voice Mode</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                "Just Ask Your AI What Happened."
              </h2>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                No need to read pages of chat logs while walking or commuting. Tap the microphone and ask:
              </p>
              <div className="mt-4 space-y-2">
                <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-xs text-slate-200 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">🗣️ You:</span> "What happened in my project group today?"
                </div>
                <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3 text-xs text-emerald-200 flex items-center gap-2">
                  <span className="text-emerald-400 font-bold">🤖 AI:</span> "Prof. Sharma confirmed project details are due by Friday 5 PM, and the presentation is Saturday at 10 AM."
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center">
              <div className="relative flex h-40 w-40 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-500/30 via-teal-500/20 to-cyan-500/30 border-2 border-emerald-500/40 animate-pulse-glow">
                <div className="h-28 w-28 rounded-full bg-emerald-500/40 blur-md animate-pulse" />
                <Mic className="absolute h-12 w-12 text-emerald-300" />
              </div>
              <span className="mt-4 text-xs font-mono text-emerald-400">Interactive Speech-to-Text & Spoken Answers</span>
            </div>
          </div>
        </div>
      </section>

      {/* Privacy & Authorization Section */}
      <section id="privacy" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-cyan-400">Academic Integrity & Safety</span>
          <h2 className="mt-2 text-3xl font-bold text-white">Privacy & Ethics by Design</h2>
        </div>

        <div className="rounded-2xl border border-cyan-500/20 bg-slate-900/40 p-6 sm:p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex gap-3">
              <Lock className="h-6 w-6 text-cyan-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Authorized Data Only</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Only analyzes messages explicitly provided or imported by the user (chat export files or demo datasets).
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <ShieldCheck className="h-6 w-6 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">No WhatsApp Security Bypass</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Does not attempt to secretly access private accounts, scrape unauthorized chats, or bypass end-to-end encryption.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <GraduationCap className="h-6 w-6 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-white">Academic Prototype</h4>
                <p className="mt-1 text-xs text-slate-400 leading-relaxed">
                  Created for final-year Diploma Computer Science Engineering curriculum demonstrating NLP, SQLite 3NF, and AI pipelines.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="tech" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400">Architecture</span>
          <h2 className="mt-2 text-3xl font-bold text-white">Modern Full-Stack & AI Stack</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <Code2 className="h-6 w-6 text-emerald-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">React 19 & Vite</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Frontend SPA</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <Layers className="h-6 w-6 text-teal-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">Tailwind CSS v4</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Modern UI/UX</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <Brain className="h-6 w-6 text-cyan-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">Gemini 3.8 Flash</div>
            <div className="text-[10px] text-slate-400 mt-0.5">@google/genai SDK</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <Database className="h-6 w-6 text-amber-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">SQLite 3NF</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Relational DB</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <Mic className="h-6 w-6 text-purple-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">Web Speech API</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Voice STT + TTS</div>
          </div>

          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4">
            <GraduationCap className="h-6 w-6 text-rose-400 mx-auto mb-2" />
            <div className="text-xs font-semibold text-white">Python Flask</div>
            <div className="text-[10px] text-slate-400 mt-0.5">Academic Ref API</div>
          </div>
        </div>
      </section>

      {/* Future Scope */}
      <section id="future" className="py-16 px-6 sm:px-12 max-w-7xl mx-auto border-t border-slate-900">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-semibold uppercase tracking-wider text-purple-400">Roadmap</span>
          <h2 className="mt-2 text-3xl font-bold text-white">Future Scope & Extensions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 flex gap-3">
            <span className="text-emerald-400 font-bold">01.</span>
            <div>
              <strong className="text-white">Official WhatsApp Cloud API & Webhooks:</strong> Support verified enterprise integrations via Meta Developer Portal.
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 flex gap-3">
            <span className="text-emerald-400 font-bold">02.</span>
            <div>
              <strong className="text-white">Multi-Platform Aggregation:</strong> Unified AI summaries across Slack, Discord, Telegram, and Microsoft Teams.
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 flex gap-3">
            <span className="text-emerald-400 font-bold">03.</span>
            <div>
              <strong className="text-white">Multilingual Dialect Parsing:</strong> Support regional Indian languages (Hindi, Tamil, Telugu, Kannada, Marathi) in chat scripts.
            </div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/30 p-4 flex gap-3">
            <span className="text-emerald-400 font-bold">04.</span>
            <div>
              <strong className="text-white">Google Calendar Auto-Sync:</strong> 1-click addition of detected project presentations directly into Google Calendar.
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 px-6 sm:px-12 max-w-5xl mx-auto text-center">
        <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/30 via-slate-900 to-slate-950 p-10 sm:p-14">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
            Ready to Cut Through the Noise?
          </h2>
          <p className="mt-4 text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            «"Instead of reading hundreds of messages, just ask your AI what happened, and it will understand, summarize, and tell you."»
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="rounded-xl bg-emerald-500 px-6 py-3.5 text-sm font-semibold text-slate-950 hover:bg-emerald-400 shadow-lg shadow-emerald-500/25 transition-all"
            >
              Open Dashboard
            </button>
            <button
              onClick={onTryDemo}
              className="rounded-xl border border-slate-700 bg-slate-900 px-6 py-3.5 text-sm font-semibold text-slate-200 hover:border-emerald-500/60 hover:text-white transition-all"
            >
              ⚡ Load Final Year Demo Scenario
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 px-6 text-center text-xs text-slate-400">
        <p>WhatsApp AI Agent — Final Year Diploma Computer Science Engineering Project</p>
        <p className="mt-1 text-[11px] text-slate-400">
          Built with React 19, TypeScript, Tailwind CSS, Express, SQLite Schema & Google Gemini AI SDK.
        </p>
      </footer>
    </div>
  );
};
