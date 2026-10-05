import React, { useState } from 'react';
import {
  Users,
  Brain,
  MessageSquare,
  AlertTriangle,
  Calendar,
  CheckSquare,
  Plus,
  ArrowRight,
  Sparkles,
  Bot,
  Layers,
  X
} from 'lucide-react';
import { Group } from '../types';

interface GroupsViewProps {
  groups: Group[];
  onSelectGroup: (groupId: string) => void;
  onAnalyzeGroup: (groupId: string) => void;
  onChatWithGroup: (groupId: string) => void;
  onCreateGroup: (name: string, category: string, description: string) => Promise<void>;
}

export const GroupsView: React.FC<GroupsViewProps> = ({
  groups,
  onSelectGroup,
  onAnalyzeGroup,
  onChatWithGroup,
  onCreateGroup
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Academic');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setIsSubmitting(true);
    try {
      await onCreateGroup(name.trim(), category, description.trim());
      setName('');
      setDescription('');
      setShowAddModal(false);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="h-6 w-6 text-emerald-400" />
            <h1 className="text-xl font-bold text-white">Monitored Communication Groups</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Select a group to view synthesized AI summaries, urgent alerts, and conversational insights.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shrink-0 shadow-md shadow-emerald-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>Add Custom Group</span>
        </button>
      </div>

      {/* Group Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {groups.map((group) => (
          <div
            key={group.id}
            className="flex flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-5 hover:border-emerald-500/40 hover:bg-slate-900/90 transition-all shadow-md"
          >
            <div>
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`h-11 w-11 rounded-2xl bg-gradient-to-tr ${group.avatar_color} flex items-center justify-center font-bold text-slate-950 text-base shadow-sm shrink-0`}
                  >
                    {group.group_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white leading-tight">{group.group_name}</h3>
                    <span className="inline-block mt-0.5 rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                      {group.category}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-emerald-400">{group.message_count || 0}</span>
                  <span className="block text-[10px] text-slate-400">messages</span>
                </div>
              </div>

              {/* Description */}
              <p className="mt-3 text-xs text-slate-300 leading-relaxed min-h-[36px]">
                {group.description || 'Monitored WhatsApp conversation stream.'}
              </p>

              {/* Key Indicators */}
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-slate-950/70 p-2.5 border border-slate-800/80 text-center">
                <div>
                  <div className="text-xs font-bold text-rose-400">{group.important_count || 0}</div>
                  <div className="text-[10px] text-slate-400">Important</div>
                </div>
                <div className="border-x border-slate-800">
                  <div className="text-xs font-bold text-amber-400">{group.event_count || 0}</div>
                  <div className="text-[10px] text-slate-400">Events</div>
                </div>
                <div>
                  <div className="text-xs font-bold text-teal-400">{group.task_count || 0}</div>
                  <div className="text-[10px] text-slate-400">Tasks</div>
                </div>
              </div>

              {/* Summary snippet */}
              <div className="mt-3 rounded-lg bg-emerald-950/20 border border-emerald-500/20 p-2.5 text-[11px] text-slate-300">
                <div className="flex items-center gap-1.5 font-semibold text-emerald-300 mb-1">
                  <Brain className="h-3.5 w-3.5" />
                  <span>AI Insight Preview</span>
                </div>
                <p className="line-clamp-2 text-slate-400">
                  {group.summary_preview || 'No summary generated yet. Click Analyze to summarize.'}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-5 pt-3 border-t border-slate-800 flex items-center gap-2">
              <button
                onClick={() => onSelectGroup(group.id)}
                className="flex-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 py-2 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors flex items-center justify-center gap-1"
              >
                <Brain className="h-3.5 w-3.5" />
                <span>View AI Summary</span>
              </button>

              <button
                onClick={() => onChatWithGroup(group.id)}
                className="rounded-xl border border-slate-700 bg-slate-800/80 px-3 py-2 text-xs font-semibold text-slate-200 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-1"
                title="Chat with AI about this group"
              >
                <Bot className="h-3.5 w-3.5 text-teal-400" />
                <span>Chat</span>
              </button>

              <button
                onClick={() => onAnalyzeGroup(group.id)}
                className="rounded-xl border border-slate-700 bg-slate-800/80 p-2 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/50 transition-colors"
                title="Run Fresh AI Analysis"
              >
                <Sparkles className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Custom Group Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-base font-bold text-white mb-1">Add New Monitored Group</h2>
            <p className="text-xs text-slate-400 mb-4">
              Create a group container to import WhatsApp text chats or JSON datasets.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Group Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Cloud Computing Lab Batch A"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  <option value="Academic / Lab">Academic / Lab</option>
                  <option value="Major Project">Major Project</option>
                  <option value="Official Notice">Official Notice</option>
                  <option value="Study Group">Study Group</option>
                  <option value="Social">Social</option>
                  <option value="Custom">Custom</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief summary of group purpose..."
                  rows={3}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="rounded-xl px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
