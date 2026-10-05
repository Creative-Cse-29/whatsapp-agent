import React from 'react';
import { ShieldCheck, Lock, AlertCircle, Sparkles, CheckCircle2, FileText, Globe } from 'lucide-react';

export const PrivacyView: React.FC = () => {
  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-emerald-400" />
          <h1 className="text-xl font-bold text-white">Privacy Charter & Academic Compliance</h1>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Ethical AI principles, WhatsApp security boundaries, and authorization protocols.
        </p>
      </div>

      {/* Main Principles Card */}
      <div className="rounded-2xl border border-emerald-500/30 bg-slate-900/60 p-6 shadow-lg space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Lock className="h-5 w-5 text-emerald-400" />
          <span>Core Privacy Safeguards</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <h3 className="font-semibold text-white mb-1">1. User-Authorized Data Only</h3>
            <p className="text-slate-400 leading-relaxed">
              The agent exclusively processes message data uploaded or authorized by the student (exported text chats or verified demo scenarios).
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <h3 className="font-semibold text-white mb-1">2. Zero Credential Scraping</h3>
            <p className="text-slate-400 leading-relaxed">
              The application never asks for WhatsApp passwords, QR codes, session tokens, or phone verification codes.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <h3 className="font-semibold text-white mb-1">3. No WhatsApp Security Bypass</h3>
            <p className="text-slate-400 leading-relaxed">
              We strictly respect WhatsApp’s end-to-end encryption and terms of service. No unofficial APIs or background sniffers are deployed.
            </p>
          </div>

          <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
            <h3 className="font-semibold text-white mb-1">4. Right to Deletion</h3>
            <p className="text-slate-400 leading-relaxed">
              Users can permanently wipe their imported message history and parsed insights anytime from the Settings page with a single click.
            </p>
          </div>
        </div>
      </div>

      {/* Academic Disclaimer */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/15 p-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-bold text-white">Academic Prototype Classification</h3>
            <p className="mt-1 text-xs text-slate-300 leading-relaxed">
              This application is an educational prototype developed for the Final Year Diploma Computer Science Engineering curriculum. It models conversational intelligence, relational database schema normalization, and natural language understanding for educational evaluation.
            </p>
          </div>
        </div>
      </div>

      {/* Future Scope Section */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Globe className="h-5 w-5 text-teal-400" />
          <span>Future Scope & Extensions</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-300">
          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="font-bold text-emerald-400 mb-1">Official WhatsApp Cloud API</h4>
            <p className="text-slate-400">
              Future releases can integrate authorized Meta Developer webhooks for automated incoming notification processing.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="font-bold text-emerald-400 mb-1">Multilingual Dialect Parsing</h4>
            <p className="text-slate-400">
              Expanding NLP support to Indian vernacular languages (Hinglish, Tamil, Telugu, Hindi) commonly used in college group chats.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="font-bold text-emerald-400 mb-1">Cross-Platform Unified Inbox</h4>
            <p className="text-slate-400">
              Single AI briefing across Slack, Microsoft Teams, Discord, and Telegram academic channels.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <h4 className="font-bold text-emerald-400 mb-1">Calendar & Task Sync</h4>
            <p className="text-slate-400">
              Automated one-click push of detected exam deadlines and presentation dates directly into Google Calendar.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
