import React from 'react';
import {
  BarChart3,
  PieChart as PieIcon,
  MessageSquare,
  Users,
  AlertTriangle,
  Calendar,
  CheckSquare,
  TrendingUp,
  Activity
} from 'lucide-react';
import { AnalyticsData } from '../types';

interface AnalyticsViewProps {
  data: AnalyticsData | null;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({ data }) => {
  if (!data) {
    return (
      <div className="flex h-64 items-center justify-center text-slate-400">
        Loading group analytics...
      </div>
    );
  }

  const maxGroupCount = Math.max(...data.groups_breakdown.map((g) => g.count), 1);
  const totalUrgent = data.priority_breakdown.Urgent;
  const totalImportant = data.priority_breakdown.Important;
  const totalNormal = data.priority_breakdown.Normal;
  const totalPriorityAll = totalUrgent + totalImportant + totalNormal || 1;

  const urgentPct = Math.round((totalUrgent / totalPriorityAll) * 100);
  const importantPct = Math.round((totalImportant / totalPriorityAll) * 100);
  const normalPct = 100 - urgentPct - importantPct;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-emerald-400" />
          <h1 className="text-xl font-bold text-white">Group Messaging & AI Analytics</h1>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Quantitative distribution of messages, urgency classification, and task completion across groups.
        </p>
      </div>

      {/* Top Stat Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">Total Messages</span>
            <MessageSquare className="h-4 w-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-white">{data.total_messages}</div>
          <span className="text-[10px] text-emerald-400">Across {data.total_groups} groups</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">Urgent / Important</span>
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold text-white">{data.total_important}</div>
          <span className="text-[10px] text-rose-400">{data.priority_breakdown.Urgent} hard deadlines</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">Scheduled Events</span>
            <Calendar className="h-4 w-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-white">{data.total_events}</div>
          <span className="text-[10px] text-amber-400">Milestones & reviews</span>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs">Tasks Tracked</span>
            <CheckSquare className="h-4 w-4 text-teal-400" />
          </div>
          <div className="text-2xl font-bold text-white">{data.total_tasks}</div>
          <span className="text-[10px] text-teal-400">{data.tasks_completed} done • {data.tasks_pending} pending</span>
        </div>
      </div>

      {/* Chart 1: Messages by Group (Horizontal Bar Chart) */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-bold text-white">Message Activity by Group</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">Volume breakdown</span>
        </div>

        <div className="space-y-4">
          {data.groups_breakdown.map((grp, i) => {
            const pct = Math.round((grp.count / maxGroupCount) * 100);
            return (
              <div key={i} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">{grp.name}</span>
                    <span className="text-[10px] text-slate-400">({grp.category})</span>
                  </div>
                  <span className="font-mono text-emerald-400 font-bold">{grp.count} msgs</span>
                </div>

                <div className="h-3 w-full rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                    style={{ width: `${Math.max(pct, 5)}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Charts Grid: Priority Breakdown & Top Senders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Priority Doughnut Visual */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <PieIcon className="h-5 w-5 text-rose-400" />
              <h3 className="text-sm font-bold text-white">AI Urgency Classification</h3>
            </div>
            <span className="text-xs text-slate-400">Ratio</span>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 py-4">
            {/* Visual SVG Ring */}
            <div className="relative h-32 w-32 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#1e293b"
                  strokeWidth="3.5"
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#f43f5e"
                  strokeWidth="3.8"
                  strokeDasharray={`${urgentPct} 100`}
                />
                <circle
                  cx="18"
                  cy="18"
                  r="15.915"
                  fill="none"
                  stroke="#f59e0b"
                  strokeWidth="3.8"
                  strokeDasharray={`${importantPct} 100`}
                  strokeDashoffset={-urgentPct}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                <span className="text-base font-bold text-white">{data.total_important}</span>
                <span className="text-[9px] text-slate-400">Flagged</span>
              </div>
            </div>

            {/* Legend */}
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-rose-500" />
                <span className="text-slate-300">Urgent ({urgentPct}%): {totalUrgent} items</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-amber-500" />
                <span className="text-slate-300">Important ({importantPct}%): {totalImportant} items</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-emerald-500" />
                <span className="text-slate-300">Normal / Informational: {totalNormal} items</span>
              </div>
            </div>
          </div>
        </div>

        {/* Top Active Senders */}
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-400" />
              <h3 className="text-sm font-bold text-white">Most Active Senders</h3>
            </div>
            <span className="text-xs text-slate-400">Chat frequency</span>
          </div>

          <div className="space-y-3">
            {data.top_senders.map((s, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between rounded-xl bg-slate-950/70 p-2.5 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-2.5">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-slate-800 font-mono text-[11px] font-bold text-slate-300">
                    #{idx + 1}
                  </span>
                  <span className="font-semibold text-white">{s.sender}</span>
                </div>
                <span className="font-mono font-bold text-emerald-400">{s.count} messages</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
