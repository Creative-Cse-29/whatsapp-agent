import React, { useState } from 'react';
import {
  GraduationCap,
  Database,
  Code2,
  FileText,
  CheckCircle2,
  HelpCircle,
  Layers,
  Brain,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const TechVivaView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'viva' | 'schema' | 'python' | 'arch'>('viva');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const vivaQuestions = [
    {
      q: 'Q1. What is the core problem solved by WhatsApp AI Agent?',
      a: 'Students and professionals are flooded with hundreds of messages daily across academic and project groups. Crucial instructions, deadlines, exam dates, and tasks get lost in chit-chat. WhatsApp AI Agent summarizes conversations, extracts actionable deadlines, meetings, and tasks, and answers natural language questions using voice or text without reading through entire chat histories.'
    },
    {
      q: 'Q2. Does this application bypass WhatsApp security or scrape private accounts?',
      a: 'NO. This project strictly complies with security and privacy ethics. It processes only authorized, user-provided chat export data (via TXT, CSV, JSON) or authorized datasets. It does NOT scrape private WhatsApp credentials, breach end-to-end encryption, or violate WhatsApp terms of service.'
    },
    {
      q: 'Q3. How is the database organized for 3NF normalization?',
      a: 'The relational SQLite database adheres to Third Normal Form (3NF). Groups and Users are primary entities. Messages reference groups with foreign key constraints. Summaries, ImportantMessages, Events, and Tasks maintain atomic attributes without transitive or partial dependencies. A dedicated Conversations table archives multi-turn Q&A context.'
    },
    {
      q: 'Q4. How does the AI ensure zero hallucination during Q&A?',
      a: 'The agent employs strict context grounding. During prompt construction, the current group’s authorized messages are injected as the bounded context. The system instruction strictly dictates: "If the requested information is not mentioned in the messages, explicitly answer: I couldn\'t find that information in the available messages." It will never invent facts.'
    },
    {
      q: 'Q5. How does the project function if there is no internet or no external AI API key?',
      a: 'The architecture includes an autonomous Fallback Demo Engine with heuristic NLP tokenizers and regular expression pattern detectors. It recognizes temporal indicators ("Friday", "tomorrow at 2 PM"), urgency keywords ("deadline", "portal", "presentation"), and delivers structured summaries and answers completely offline.'
    },
    {
      q: 'Q6. How does the Voice-to-Voice assistant work?',
      a: 'The voice pipeline is divided into three stages: 1) Speech-to-Text (STT) via Web Speech API converting acoustic microphone input into textual queries; 2) Backend AI contextual reasoning retrieving grounded answers; 3) Text-to-Speech (TTS) synthesizing human-like audio response with play, pause, and stop controls.'
    }
  ];

  const sqliteSchemaText = `-- SQLite 3NF Schema Specification
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    role TEXT DEFAULT 'Student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE groups (
    id TEXT PRIMARY KEY,
    group_name TEXT NOT NULL,
    category TEXT DEFAULT 'Academic',
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE messages (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    message_text TEXT NOT NULL,
    message_date TEXT NOT NULL,
    message_time TEXT NOT NULL,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

CREATE TABLE summaries (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    summary TEXT NOT NULL,
    main_topics TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id)
);

CREATE TABLE important_messages (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    group_id TEXT NOT NULL,
    priority TEXT CHECK(priority IN ('Urgent', 'Important', 'Normal')),
    category TEXT,
    explanation TEXT
);

CREATE TABLE events (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_date TEXT NOT NULL,
    event_time TEXT NOT NULL,
    description TEXT
);

CREATE TABLE tasks (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    task_name TEXT NOT NULL,
    deadline TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending', 'completed'))
);`;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-emerald-400" />
          <h1 className="text-xl font-bold text-white">Diploma CSE Viva & Technology Guide</h1>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Everything you need to explain during your final-year Diploma Computer Science viva voce examination.
        </p>
      </div>

      {/* Navigation tabs */}
      <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
        <button
          onClick={() => setActiveTab('viva')}
          className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
            activeTab === 'viva' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          🎓 Viva Questions & Answers
        </button>
        <button
          onClick={() => setActiveTab('schema')}
          className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
            activeTab === 'schema' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          🗄️ SQLite 3NF Schema
        </button>
        <button
          onClick={() => setActiveTab('python')}
          className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
            activeTab === 'python' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          🐍 Python Flask Backend
        </button>
        <button
          onClick={() => setActiveTab('arch')}
          className={`flex-1 py-2 font-semibold rounded-lg transition-all ${
            activeTab === 'arch' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
          }`}
        >
          📐 Pipeline Architecture
        </button>
      </div>

      {/* Tab 1: Viva Questions */}
      {activeTab === 'viva' && (
        <div className="space-y-3">
          {vivaQuestions.map((item, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 transition-all"
            >
              <div
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="cursor-pointer flex items-center justify-between text-sm font-bold text-white hover:text-emerald-400 transition-colors"
              >
                <span>{item.q}</span>
                {openFaq === idx ? (
                  <ChevronUp className="h-4 w-4 text-emerald-400" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-slate-400" />
                )}
              </div>

              {openFaq === idx && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-xs text-slate-300 leading-relaxed font-normal bg-slate-950/60 p-3 rounded-xl border">
                  {item.a}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: SQLite Schema */}
      {activeTab === 'schema' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">SQLite Relational Database Schema</h3>
              <p className="text-xs text-slate-400">File: database/schema.sql • 3NF Compliant</p>
            </div>
            <span className="rounded bg-emerald-500/10 px-2 py-1 text-xs font-mono text-emerald-400 border border-emerald-500/20">
              8 Normalized Tables
            </span>
          </div>

          <pre className="p-4 rounded-xl bg-slate-950 font-mono text-xs text-emerald-300 overflow-x-auto border border-slate-800/80 leading-relaxed">
            {sqliteSchemaText}
          </pre>
        </div>
      )}

      {/* Tab 3: Python Flask code */}
      {activeTab === 'python' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Python Flask Academic Reference Server</h3>
              <p className="text-xs text-slate-400">File: backend/app.py & backend/requirements.txt</p>
            </div>
            <span className="rounded bg-blue-500/10 px-2 py-1 text-xs font-mono text-blue-400 border border-blue-500/20">
              Python 3.10+ / Flask / CORS
            </span>
          </div>

          <div className="rounded-xl bg-slate-950 p-4 border border-slate-800 font-mono text-xs text-slate-300 space-y-3 leading-relaxed">
            <p className="text-emerald-400"># Run Python backend locally:</p>
            <p className="text-slate-400">$ cd backend</p>
            <p className="text-slate-400">$ pip install -r requirements.txt</p>
            <p className="text-slate-400">$ python app.py</p>
            <p className="text-slate-300">
              * Serves REST endpoints for <code className="text-emerald-300">/api/messages/import</code>,{' '}
              <code className="text-emerald-300">/api/messages/analyze</code>, and{' '}
              <code className="text-emerald-300">/api/ai/ask</code> matching the live Node.js Express server.
            </p>
          </div>
        </div>
      )}

      {/* Tab 4: Architecture Pipeline */}
      {activeTab === 'arch' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 space-y-6">
          <h3 className="text-sm font-bold text-white">End-to-End System Architecture</h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-emerald-400 font-bold block mb-1">Layer 1: Input</span>
              <p className="text-slate-300 font-semibold">User Chat Ingestion</p>
              <p className="text-slate-400 mt-1 text-[11px]">
                Authorized TXT / CSV / JSON WhatsApp exports or predefined demo scenarios.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-teal-400 font-bold block mb-1">Layer 2: Database</span>
              <p className="text-slate-300 font-semibold">SQLite 3NF Storage</p>
              <p className="text-slate-400 mt-1 text-[11px]">
                Messages, groups, entities, and summaries stored in atomic normalized tables.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-cyan-400 font-bold block mb-1">Layer 3: AI Service</span>
              <p className="text-slate-300 font-semibold">Gemini 3.8 / Fallback</p>
              <p className="text-slate-400 mt-1 text-[11px]">
                Structured extraction of summaries, topics, urgency, deadlines, and events.
              </p>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950 p-4">
              <span className="text-purple-400 font-bold block mb-1">Layer 4: Voice & UX</span>
              <p className="text-slate-300 font-semibold">Voice UI & Dashboard</p>
              <p className="text-slate-400 mt-1 text-[11px]">
                Web Speech STT/TTS, responsive charts, and natural language communication.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
