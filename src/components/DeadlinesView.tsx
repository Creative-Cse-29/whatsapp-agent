import React from 'react';
import { Clock, AlertTriangle, CheckCircle2, Calendar, ArrowRight } from 'lucide-react';
import { Group, ImportantMessage } from '../types';

interface DeadlinesViewProps {
  groups: Group[];
  importantMessages: ImportantMessage[];
  onNavigateToGroup: (groupId: string) => void;
}

export const DeadlinesView: React.FC<DeadlinesViewProps> = ({
  groups,
  importantMessages,
  onNavigateToGroup
}) => {
  // Filter messages classified as Deadlines or containing deadline keywords
  const deadlines = importantMessages.filter(
    (m) =>
      m.category === 'Deadlines' ||
      m.message_text.toLowerCase().includes('deadline') ||
      m.message_text.toLowerCase().includes('submission') ||
      m.message_text.toLowerCase().includes('due')
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Clock className="h-6 w-6 text-rose-400" />
          <h1 className="text-xl font-bold text-white">Detected Deadlines & Due Dates</h1>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Time-sensitive submission deadlines extracted from conversations with remaining countdown status.
        </p>
      </div>

      {/* Deadlines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {deadlines.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-white">No active deadlines detected</p>
            <p className="text-xs text-slate-400 mt-1">All project milestones are currently up to date.</p>
          </div>
        ) : (
          deadlines.map((item) => {
            const group = groups.find((g) => g.id === item.group_id);
            const isUrgent = item.priority === 'Urgent';

            return (
              <div
                key={item.id}
                className="flex flex-col justify-between rounded-2xl border border-rose-500/30 bg-gradient-to-b from-rose-950/20 via-slate-900 to-slate-900 p-5 shadow-lg relative overflow-hidden"
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/20 px-2.5 py-0.5 text-xs font-bold text-rose-300 border border-rose-500/30">
                      <Clock className="h-3.5 w-3.5" />
                      <span>⏰ Due Friday 5:00 PM</span>
                    </span>

                    <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                      {item.category}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white leading-snug">
                    {item.message_text.includes('Friday')
                      ? 'AI Project Details & Architecture Submission'
                      : item.message_text.includes('examination')
                      ? 'Diploma Final Semester Exam Registration'
                      : 'Coursework / Assignment Submission'}
                  </h3>

                  <p className="mt-2 text-xs text-slate-300 italic">
                    "{item.message_text}"
                  </p>

                  <div className="mt-4 rounded-xl bg-slate-950/70 p-3 border border-slate-800 text-xs space-y-1.5">
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Sender / Authority:</span>
                      <strong className="text-emerald-400 font-semibold">{item.sender}</strong>
                    </div>
                    {group && (
                      <div className="flex items-center justify-between text-slate-400">
                        <span>Group:</span>
                        <strong className="text-white font-semibold">{group.group_name}</strong>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-slate-400">
                      <span>Status:</span>
                      <span className="text-rose-400 font-bold">Portal Hard Cutoff</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 font-mono">
                    Countdown: ~48 Hours Remaining
                  </span>
                  {group && (
                    <button
                      onClick={() => onNavigateToGroup(group.id)}
                      className="text-xs font-semibold text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>View Chat</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
