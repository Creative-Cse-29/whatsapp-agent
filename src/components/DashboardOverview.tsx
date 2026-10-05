import React, { useState } from 'react';
import {
  MessageSquare,
  Users,
  AlertTriangle,
  Calendar,
  CheckSquare,
  Sparkles,
  ArrowRight,
  Clock,
  Mic,
  Brain,
  Volume2,
  Upload,
  Search,
  CheckCircle2,
  ChevronRight
} from 'lucide-react';
import { Group, ImportantMessage, EventItem, TaskItem } from '../types';

interface DashboardOverviewProps {
  groups: Group[];
  totalMessages: number;
  importantMessages: ImportantMessage[];
  events: EventItem[];
  tasks: TaskItem[];
  onSelectGroup: (groupId: string) => void;
  onNavigate: (tab: string) => void;
  onOpenVoice: () => void;
  onOpenBriefing: () => void;
  onQuickAsk: (question: string) => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  groups,
  totalMessages,
  importantMessages,
  events,
  tasks,
  onSelectGroup,
  onNavigate,
  onOpenVoice,
  onOpenBriefing,
  onQuickAsk
}) => {
  const [quickQuestion, setQuickQuestion] = useState('');
  const urgentCount = importantMessages.filter((m) => m.priority === 'Urgent').length;
  const pendingTasks = tasks.filter((t) => t.status === 'pending').length;

  const handleAskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (quickQuestion.trim()) {
      onQuickAsk(quickQuestion.trim());
      setQuickQuestion('');
    }
  };

  const samplePrompts = [
    'What happened in my project group today?',
    'When is the project submission deadline?',
    'What is the presentation schedule?',
    'What did the mentor say about the project?'
  ];

  return (
    <div className="space-y-6">
      {/* Top Welcome / Daily Briefing Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-emerald-500/30 bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 p-6 sm:p-8 shadow-xl">
        <div className="absolute right-0 top-0 -mt-6 -mr-6 h-64 w-64 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-300 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>AI Executive Briefing Available</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            "Understand Hundreds of Messages in Seconds."
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
            Today you have <strong className="text-white font-semibold">{totalMessages} messages</strong> analyzed across{' '}
            <strong className="text-white font-semibold">{groups.length} groups</strong>. The AI has detected{' '}
            <span className="text-rose-400 font-semibold">{urgentCount} urgent alerts</span>,{' '}
            <span className="text-amber-400 font-semibold">{events.length} upcoming events</span>, and{' '}
            <span className="text-teal-400 font-semibold">{pendingTasks} pending tasks</span>.
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenBriefing}
              className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 transition-all flex items-center gap-2 shadow-md shadow-emerald-500/20"
            >
              <Volume2 className="h-4 w-4" />
              <span>Listen to Daily Briefing</span>
            </button>

            <button
              onClick={onOpenVoice}
              className="rounded-xl border border-emerald-500/40 bg-slate-900/80 px-4 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-950/40 transition-colors flex items-center gap-1.5"
            >
              <Mic className="h-4 w-4 animate-pulse" />
              <span>Ask Voice Assistant</span>
            </button>

            <button
              onClick={() => onNavigate('import')}
              className="rounded-xl border border-slate-700 bg-slate-900/60 px-4 py-2 text-xs font-medium text-slate-300 hover:border-slate-500 hover:text-white transition-colors flex items-center gap-1.5"
            >
              <Upload className="h-3.5 w-3.5" />
              <span>Import Chat Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* Overview Cards (Messages Analyzed: 128, Groups: 5, Important: 6, Events: 3, Tasks: 4) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div
          onClick={() => onNavigate('groups')}
          className="cursor-pointer group rounded-2xl border border-slate-800 bg-slate-900/50 p-4 hover:border-emerald-500/40 hover:bg-slate-900/80 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Messages Analyzed</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 group-hover:scale-110 transition-transform">
              <MessageSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{totalMessages}</div>
          <div className="mt-1 text-[11px] text-emerald-400 flex items-center gap-1">
            <span>Across all groups</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('groups')}
          className="cursor-pointer group rounded-2xl border border-slate-800 bg-slate-900/50 p-4 hover:border-blue-500/40 hover:bg-slate-900/80 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Monitored Groups</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 group-hover:scale-110 transition-transform">
              <Users className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{groups.length}</div>
          <div className="mt-1 text-[11px] text-blue-400 flex items-center gap-1">
            <span>College & Projects</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('important')}
          className="cursor-pointer group rounded-2xl border border-slate-800 bg-slate-900/50 p-4 hover:border-rose-500/40 hover:bg-slate-900/80 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Important / Urgent</span>
            <div className="p-2 rounded-xl bg-rose-500/10 text-rose-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{importantMessages.length}</div>
          <div className="mt-1 text-[11px] text-rose-400 flex items-center gap-1">
            <span>{urgentCount} critical deadlines</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('events')}
          className="cursor-pointer group rounded-2xl border border-slate-800 bg-slate-900/50 p-4 hover:border-amber-500/40 hover:bg-slate-900/80 transition-all shadow-sm"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Events Detected</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 group-hover:scale-110 transition-transform">
              <Calendar className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{events.length}</div>
          <div className="mt-1 text-[11px] text-amber-400 flex items-center gap-1">
            <span>Scheduled milestones</span>
          </div>
        </div>

        <div
          onClick={() => onNavigate('tasks')}
          className="cursor-pointer group rounded-2xl border border-slate-800 bg-slate-900/50 p-4 hover:border-teal-500/40 hover:bg-slate-900/80 transition-all shadow-sm col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-medium">Extracted Tasks</span>
            <div className="p-2 rounded-xl bg-teal-500/10 text-teal-400 group-hover:scale-110 transition-transform">
              <CheckSquare className="h-4 w-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">{tasks.length}</div>
          <div className="mt-1 text-[11px] text-teal-400 flex items-center gap-1">
            <span>{pendingTasks} pending completion</span>
          </div>
        </div>
      </div>

      {/* Quick AI Ask bar directly on Dashboard */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4 sm:p-5 backdrop-blur-md">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold text-white">
            <Brain className="h-4 w-4 text-emerald-400" />
            <span>Ask AI About Your Messages</span>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Grounded directly in your group chat records
          </span>
        </div>

        <form onSubmit={handleAskSubmit} className="relative flex items-center">
          <input
            type="text"
            value={quickQuestion}
            onChange={(e) => setQuickQuestion(e.target.value)}
            placeholder="Ask anything (e.g. 'What happened in my project group today?', 'When is the deadline?')..."
            className="w-full rounded-xl border border-slate-800 bg-slate-950 py-3 pl-4 pr-24 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none shadow-inner"
          />
          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={onOpenVoice}
              className="rounded-lg p-2 text-slate-400 hover:text-emerald-400 hover:bg-slate-900 transition-colors"
              title="Speak with Voice"
            >
              <Mic className="h-4 w-4" />
            </button>
            <button
              type="submit"
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              Ask AI
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span className="text-[10px] text-slate-400 font-medium">Quick suggestions:</span>
          {samplePrompts.map((p, i) => (
            <button
              key={i}
              type="button"
              onClick={() => onQuickAsk(p)}
              className="rounded-lg border border-slate-800 bg-slate-950/60 px-2.5 py-1 text-[11px] text-slate-300 hover:border-emerald-500/40 hover:text-white transition-colors"
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Grid: Urgent Alerts & Upcoming Deadlines vs Recent Groups */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Urgent Alerts & Scheduled Events */}
        <div className="lg:col-span-2 space-y-6">
          {/* Urgent Alerts section */}
          <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-rose-500/20 mb-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-400 animate-pulse" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Urgent Classifications & Deadlines
                </h3>
              </div>
              <button
                onClick={() => onNavigate('deadlines')}
                className="text-[11px] font-medium text-rose-300 hover:underline flex items-center gap-1"
              >
                <span>View All Deadlines</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="space-y-2.5">
              {importantMessages.slice(0, 3).map((item) => (
                <div
                  key={item.id}
                  className="rounded-xl border border-slate-800/80 bg-slate-950/80 p-3 flex items-start justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          item.priority === 'Urgent'
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {item.priority} • {item.category}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-300">{item.sender}</span>
                    </div>
                    <p className="mt-1.5 text-slate-200 font-medium leading-relaxed">
                      "{item.message_text}"
                    </p>
                    <p className="mt-1 text-[11px] text-slate-400">{item.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scheduled Events preview */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-amber-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Upcoming Events & Presentations
                </h3>
              </div>
              <button
                onClick={() => onNavigate('events')}
                className="text-[11px] font-medium text-amber-300 hover:underline flex items-center gap-1"
              >
                <span>Calendar View</span>
                <ChevronRight className="h-3 w-3" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {events.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  className="rounded-xl border border-slate-800 bg-slate-950/70 p-3.5 text-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-300">{evt.event_date}</span>
                      <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] text-amber-400 font-mono">
                        {evt.event_time}
                      </span>
                    </div>
                    <h4 className="mt-1.5 text-xs font-bold text-white">{evt.event_name}</h4>
                    <p className="mt-1 text-[11px] text-slate-400 line-clamp-2">{evt.description}</p>
                  </div>
                  {evt.location && (
                    <div className="mt-2 pt-2 border-t border-slate-800/80 text-[10px] text-slate-400 flex items-center gap-1">
                      <span>📍</span>
                      <span>{evt.location}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Group Cards Quick Access */}
        <div className="space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/50 p-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-emerald-400" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">Monitored Groups</h3>
              </div>
              <button
                onClick={() => onNavigate('groups')}
                className="text-[11px] font-medium text-emerald-400 hover:underline"
              >
                All Groups
              </button>
            </div>

            <div className="space-y-2.5">
              {groups.map((group) => (
                <div
                  key={group.id}
                  onClick={() => onSelectGroup(group.id)}
                  className="cursor-pointer rounded-xl border border-slate-800 bg-slate-950/80 p-3 hover:border-emerald-500/40 hover:bg-slate-900 transition-all text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`h-7 w-7 rounded-lg bg-gradient-to-tr ${group.avatar_color} flex items-center justify-center font-bold text-slate-950 text-xs shrink-0`}
                      >
                        {group.group_name.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-semibold text-white leading-tight">{group.group_name}</h4>
                        <span className="text-[10px] text-slate-400">{group.category}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-emerald-400">{group.message_count || 0}</span>
                      <span className="text-[10px] text-slate-400 block">msgs</span>
                    </div>
                  </div>

                  <div className="mt-2.5 flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-400">
                    <div className="flex gap-2">
                      <span className="text-rose-400 font-medium">{group.important_count || 0} urgent</span>
                      <span>•</span>
                      <span className="text-amber-400 font-medium">{group.event_count || 0} events</span>
                    </div>
                    <span className="text-emerald-400 font-medium hover:underline">View Summary →</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => onNavigate('groups')}
              className="mt-4 w-full rounded-xl border border-slate-800 bg-slate-950 py-2 text-center text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              + Manage Groups & Data
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
