import React, { useState } from 'react';
import {
  AlertTriangle,
  Clock,
  Filter,
  Users,
  Search,
  CheckCircle2,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { Group, ImportantMessage } from '../types';

interface ImportantViewProps {
  groups: Group[];
  importantMessages: ImportantMessage[];
  selectedGroupId: string;
  onSelectGroup: (id: string) => void;
  onNavigateToDeadlines: () => void;
}

export const ImportantView: React.FC<ImportantViewProps> = ({
  groups,
  importantMessages,
  selectedGroupId,
  onSelectGroup,
  onNavigateToDeadlines
}) => {
  const [priorityFilter, setPriorityFilter] = useState<'All' | 'Urgent' | 'Important' | 'Normal'>('All');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');

  const categories = ['All', 'Deadlines', 'Exams', 'Assignments', 'Meetings', 'Project', 'Announcements', 'Instructions'];

  const filtered = importantMessages.filter((m) => {
    if (selectedGroupId && m.group_id !== selectedGroupId) return false;
    if (priorityFilter !== 'All' && m.priority !== priorityFilter) return false;
    if (categoryFilter !== 'All' && m.category !== categoryFilter) return false;
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      return (
        m.message_text.toLowerCase().includes(term) ||
        m.sender.toLowerCase().includes(term) ||
        m.explanation.toLowerCase().includes(term)
      );
    }
    return true;
  });

  const urgentCount = importantMessages.filter((m) => m.priority === 'Urgent').length;
  const deadlineCount = importantMessages.filter((m) => m.category === 'Deadlines').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-rose-400" />
            <h1 className="text-xl font-bold text-white">Important Messages & Urgent Alerts</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Automatically prioritized and categorized messages extracted from monitored WhatsApp groups.
          </p>
        </div>

        <button
          onClick={onNavigateToDeadlines}
          className="rounded-xl bg-rose-500/20 border border-rose-500/30 px-4 py-2 text-xs font-semibold text-rose-300 hover:bg-rose-500/30 transition-colors flex items-center gap-2 shrink-0"
        >
          <Clock className="h-4 w-4" />
          <span>View Deadlines Countdown ({deadlineCount})</span>
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Priority filter pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <span className="text-xs text-slate-400 mr-1 flex items-center gap-1">
              <Filter className="h-3 w-3" /> Priority:
            </span>
            {(['All', 'Urgent', 'Important', 'Normal'] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPriorityFilter(p)}
                className={`rounded-lg px-2.5 py-1 text-xs font-medium transition-all ${
                  priorityFilter === p
                    ? p === 'Urgent'
                      ? 'bg-rose-500 text-white font-bold'
                      : p === 'Important'
                      ? 'bg-amber-500 text-slate-950 font-bold'
                      : 'bg-emerald-500 text-slate-950 font-bold'
                    : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {p === 'Urgent' && '🔴 '}
                {p === 'Important' && '🟠 '}
                {p === 'Normal' && '🟢 '}
                {p}
              </button>
            ))}
          </div>

          {/* Group dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400">Group:</span>
            <select
              value={selectedGroupId}
              onChange={(e) => onSelectGroup(e.target.value)}
              className="rounded-xl border border-slate-800 bg-slate-950 py-1.5 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
            >
              <option value="">All Groups</option>
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.group_name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
          <span className="text-[11px] text-slate-400 mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategoryFilter(cat)}
              className={`rounded-lg px-2 py-0.5 text-[11px] transition-colors ${
                categoryFilter === cat
                  ? 'bg-slate-800 text-emerald-400 font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-white">No messages match this filter</p>
            <p className="text-xs text-slate-400 mt-1">Try resetting your filters or group selection.</p>
          </div>
        ) : (
          filtered.map((item) => {
            const group = groups.find((g) => g.id === item.group_id);
            const isUrgent = item.priority === 'Urgent';

            return (
              <div
                key={item.id}
                className={`rounded-2xl border p-4 sm:p-5 transition-all ${
                  isUrgent
                    ? 'border-rose-500/30 bg-rose-950/15 hover:border-rose-500/50'
                    : 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        isUrgent
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                          : item.priority === 'Important'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}
                    >
                      <span>{item.priority === 'Urgent' ? '🔴' : item.priority === 'Important' ? '🟠' : '🟢'}</span>
                      <span>{item.priority}</span>
                    </span>

                    <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-semibold text-slate-300">
                      {item.category}
                    </span>

                    {group && (
                      <span className="text-xs text-slate-400 font-medium">
                        in <strong className="text-white">{group.group_name}</strong>
                      </span>
                    )}
                  </div>

                  <span className="text-xs font-semibold text-emerald-400">
                    Sender: {item.sender}
                  </span>
                </div>

                <p className="text-sm sm:text-base font-semibold text-slate-100 mt-2 leading-relaxed">
                  "{item.message_text}"
                </p>

                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5 text-amber-400" />
                    <span>{item.explanation}</span>
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
