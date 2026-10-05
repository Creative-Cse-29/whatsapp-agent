import React, { useState } from 'react';
import {
  Brain,
  Sparkles,
  AlertTriangle,
  Calendar,
  CheckSquare,
  Clock,
  Volume2,
  Square,
  Pause,
  Play,
  RotateCcw,
  CheckCircle2,
  Tag
} from 'lucide-react';
import { Group, Summary, ImportantMessage, EventItem, TaskItem } from '../types';
import { voiceManager } from '../utils/voice';

interface SummaryViewProps {
  groups: Group[];
  selectedGroupId: string;
  onSelectGroup: (id: string) => void;
  summary: Summary | null;
  importantMessages: ImportantMessage[];
  events: EventItem[];
  tasks: TaskItem[];
  isLoading: boolean;
  onAnalyze: (groupId: string) => void;
  onToggleTask: (taskId: string) => void;
}

export const SummaryView: React.FC<SummaryViewProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  summary,
  importantMessages,
  events,
  tasks,
  isLoading,
  onAnalyze,
  onToggleTask
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const selectedGroup = groups.find((g) => g.id === selectedGroupId) || groups[0];

  const handleSpeak = () => {
    if (!summary?.summary) return;

    if (isSpeaking && isPaused) {
      voiceManager.resumeSpeaking();
      setIsPaused(false);
      return;
    }

    if (isSpeaking && !isPaused) {
      voiceManager.pauseSpeaking();
      setIsPaused(true);
      return;
    }

    voiceManager.speak(
      summary.summary,
      () => {
        setIsSpeaking(true);
        setIsPaused(false);
      },
      () => {
        setIsSpeaking(false);
        setIsPaused(false);
      },
      () => {
        setIsSpeaking(false);
        setIsPaused(false);
      }
    );
  };

  const handleStopSpeaking = () => {
    voiceManager.stopSpeaking();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls: Group Selector & Action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Brain className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-bold text-white">AI Message Summary & Extraction</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Synthesized intelligence from group messages: Topics, Critical Alerts, Events, and Tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedGroupId}
            onChange={(e) => onSelectGroup(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs font-semibold text-white focus:border-emerald-500 focus:outline-none"
          >
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.group_name}
              </option>
            ))}
          </select>

          <button
            onClick={() => onAnalyze(selectedGroupId)}
            disabled={isLoading}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20 disabled:opacity-50"
          >
            <Sparkles className="h-4 w-4" />
            <span>{isLoading ? 'Analyzing...' : 'Re-Analyze with AI'}</span>
          </button>
        </div>
      </div>

      {/* Main AI Summary Box */}
      <div className="rounded-3xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-900/90 to-slate-900 p-6 sm:p-8 shadow-xl relative overflow-hidden">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20">
              <Brain className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>🤖 AI Summary:</span>
                <span className="text-emerald-400">{selectedGroup?.group_name}</span>
              </h2>
              <span className="text-[11px] text-slate-400 font-mono">
                Engine: {summary?.source === 'gemini' ? 'Google Gemini 3.8 Flash' : 'Academic Fallback NLP'}
              </span>
            </div>
          </div>

          {/* Voice Output Controls (Listen, Pause, Stop) */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSpeak}
              disabled={!summary}
              className={`rounded-xl px-3.5 py-1.5 text-xs font-semibold flex items-center gap-1.5 transition-all ${
                isSpeaking
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
              }`}
            >
              {isSpeaking ? (
                isPaused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />
              ) : (
                <Volume2 className="h-3.5 w-3.5" />
              )}
              <span>{isSpeaking ? (isPaused ? 'Resume' : 'Pause') : '🔊 Listen'}</span>
            </button>

            {isSpeaking && (
              <button
                onClick={handleStopSpeaking}
                className="rounded-xl border border-rose-500/30 bg-rose-500/10 p-1.5 text-rose-300 hover:bg-rose-500/20 transition-colors"
                title="Stop Speaking"
              >
                <Square className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Summary text */}
        <div className="mt-5 text-sm sm:text-base text-slate-200 leading-relaxed font-normal">
          {isLoading ? (
            <div className="space-y-2 animate-pulse py-4">
              <div className="h-4 bg-slate-800 rounded w-5/6" />
              <div className="h-4 bg-slate-800 rounded w-full" />
              <div className="h-4 bg-slate-800 rounded w-4/6" />
            </div>
          ) : summary?.summary ? (
            <p className="bg-slate-950/40 p-4 rounded-2xl border border-slate-800/80 text-slate-200">
              "{summary.summary}"
            </p>
          ) : (
            <p className="text-slate-400 italic py-4">
              No summary generated for this group yet. Click "Re-Analyze with AI" above to extract insights.
            </p>
          )}
        </div>

        {/* 📌 Main Topics */}
        {summary?.main_topics && summary.main_topics.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800/80">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2.5">
              <Tag className="h-3.5 w-3.5 text-emerald-400" />
              <span>📌 Main Topics Discussed</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {summary.main_topics.map((topic, i) => (
                <span
                  key={i}
                  className="rounded-xl border border-emerald-500/20 bg-emerald-950/30 px-3 py-1 text-xs font-medium text-emerald-300 shadow-sm"
                >
                  • {topic}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Grid: 🚨 Important, 📅 Events, ✅ Tasks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* 🚨 Important / Deadlines */}
        <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-rose-500/20">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              🚨 Important Messages ({importantMessages.length})
            </h3>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {importantMessages.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No urgent messages detected.</p>
            ) : (
              importantMessages.map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-rose-500/20 bg-slate-950/80 p-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-rose-300">{item.category}</span>
                    <span
                      className={`rounded px-1.5 py-0.2 text-[9px] font-bold ${
                        item.priority === 'Urgent'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <p className="mt-1 text-slate-200 font-medium leading-relaxed">
                    "{item.message_text}"
                  </p>
                  <p className="mt-1 text-[10px] text-slate-400">{item.explanation}</p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* 📅 Events */}
        <div className="rounded-2xl border border-amber-500/20 bg-amber-950/10 p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-amber-500/20">
            <Calendar className="h-4 w-4 text-amber-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              📅 Detected Events ({events.length})
            </h3>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {events.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No scheduled events detected.</p>
            ) : (
              events.map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-xl border border-amber-500/20 bg-slate-950/80 p-3 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-white">{evt.event_name}</h4>
                    <span className="font-mono text-[10px] text-amber-400 font-bold">
                      {evt.event_time}
                    </span>
                  </div>
                  <p className="mt-1 text-amber-300 text-[11px] font-semibold">
                    Date: {evt.event_date}
                  </p>
                  <p className="mt-1 text-[11px] text-slate-400">{evt.description}</p>
                  {evt.location && (
                    <p className="mt-1 text-[10px] text-slate-400 font-mono">📍 {evt.location}</p>
                  )}
                </div>
              ))
            )}
          </div>
        </div>

        {/* ✅ Tasks */}
        <div className="rounded-2xl border border-teal-500/20 bg-teal-950/10 p-5 space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-teal-500/20">
            <CheckSquare className="h-4 w-4 text-teal-400" />
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              ✅ Action Tasks ({tasks.length})
            </h3>
          </div>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {tasks.length === 0 ? (
              <p className="text-xs text-slate-400 py-3">No action tasks detected.</p>
            ) : (
              tasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => onToggleTask(task.id)}
                  className={`cursor-pointer rounded-xl border p-3 text-xs transition-all ${
                    task.status === 'completed'
                      ? 'border-slate-800 bg-slate-950/50 opacity-60'
                      : 'border-teal-500/20 bg-slate-950/90 hover:border-teal-500/40'
                  }`}
                >
                  <div className="flex items-start gap-2.5">
                    <div
                      className={`mt-0.5 h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                        task.status === 'completed'
                          ? 'border-teal-500 bg-teal-500 text-slate-950'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {task.status === 'completed' && <CheckCircle2 className="h-3.5 w-3.5" />}
                    </div>

                    <div className="flex-1">
                      <p
                        className={`font-medium ${
                          task.status === 'completed'
                            ? 'line-through text-slate-400'
                            : 'text-slate-200'
                        }`}
                      >
                        {task.task_name}
                      </p>
                      <div className="mt-1 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="text-teal-400 font-semibold">Due: {task.deadline}</span>
                        {task.assigned_to && <span>{task.assigned_to}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
