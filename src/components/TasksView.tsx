import React, { useState } from 'react';
import { CheckSquare, Plus, CheckCircle2, Clock, User, Filter, X } from 'lucide-react';
import { Group, TaskItem } from '../types';

interface TasksViewProps {
  groups: Group[];
  tasks: TaskItem[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
  onToggleTask: (taskId: string) => void;
  onCreateTask: (task: Omit<TaskItem, 'id' | 'status'>) => Promise<void>;
}

export const TasksView: React.FC<TasksViewProps> = ({
  groups,
  tasks,
  selectedGroupId,
  onSelectGroup,
  onToggleTask,
  onCreateTask
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [taskName, setTaskName] = useState('');
  const [deadline, setDeadline] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [targetGroup, setTargetGroup] = useState(selectedGroupId || groups[0]?.id || 'grp_ai_ml');

  const filteredTasks = tasks.filter((t) => {
    if (selectedGroupId && t.group_id !== selectedGroupId) return false;
    if (filter === 'pending' && t.status !== 'pending') return false;
    if (filter === 'completed' && t.status !== 'completed') return false;
    return true;
  });

  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completedCount = tasks.filter((t) => t.status === 'completed').length;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) return;

    await onCreateTask({
      group_id: targetGroup,
      task_name: taskName.trim(),
      deadline: deadline.trim() || 'Soon',
      assigned_to: assignedTo.trim() || 'Member'
    });

    setTaskName('');
    setDeadline('');
    setAssignedTo('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <CheckSquare className="h-6 w-6 text-teal-400" />
            <h1 className="text-xl font-bold text-white">Extracted Action Tasks</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Action items and todo checklists automatically extracted by AI from group instructions and chat discussions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={selectedGroupId}
            onChange={(e) => onSelectGroup(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Groups</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.group_name}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20 shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex rounded-xl bg-slate-900 p-1 border border-slate-800 text-xs">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors ${
              filter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors ${
              filter === 'pending' ? 'bg-teal-500 text-slate-950' : 'text-slate-400 hover:text-white'
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 font-semibold rounded-lg transition-colors ${
              filter === 'completed' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
            }`}
          >
            Completed ({completedCount})
          </button>
        </div>

        <span className="text-xs text-slate-400">
          Click checkbox to toggle task status
        </span>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {filteredTasks.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-white">No tasks found</p>
            <p className="text-xs text-slate-400 mt-1">
              {filter === 'completed' ? 'No completed tasks yet.' : 'All pending tasks have been marked as done!'}
            </p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const group = groups.find((g) => g.id === task.group_id);
            const isDone = task.status === 'completed';

            return (
              <div
                key={task.id}
                onClick={() => onToggleTask(task.id)}
                className={`cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all flex items-start gap-4 ${
                  isDone
                    ? 'border-slate-800/80 bg-slate-950/40 opacity-60'
                    : 'border-teal-500/30 bg-slate-900/60 hover:border-teal-500/60'
                }`}
              >
                <div
                  className={`mt-1 h-5 w-5 rounded-lg flex items-center justify-center border transition-all ${
                    isDone
                      ? 'border-teal-500 bg-teal-500 text-slate-950'
                      : 'border-slate-700 bg-slate-950 hover:border-teal-400'
                  }`}
                >
                  {isDone && <CheckCircle2 className="h-4 w-4 stroke-[3]" />}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3
                      className={`text-sm sm:text-base font-semibold ${
                        isDone ? 'line-through text-slate-400' : 'text-white'
                      }`}
                    >
                      {task.task_name}
                    </h3>

                    {group && (
                      <span className="rounded-full bg-slate-800 px-2 py-0.5 text-[10px] font-medium text-slate-300">
                        {group.group_name}
                      </span>
                    )}
                  </div>

                  <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-slate-400">
                    <span className="flex items-center gap-1.5 font-semibold text-teal-300">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Due: {task.deadline}</span>
                    </span>

                    {task.assigned_to && (
                      <span className="flex items-center gap-1.5">
                        <User className="h-3.5 w-3.5 text-slate-400" />
                        <span>Assigned to: <strong className="text-slate-200">{task.assigned_to}</strong></span>
                      </span>
                    )}

                    <span
                      className={`rounded px-2 py-0.5 text-[10px] font-bold ${
                        isDone ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
                      }`}
                    >
                      {isDone ? 'Completed' : 'Pending Action'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-base font-bold text-white mb-1">Add Action Task</h2>
            <p className="text-xs text-slate-400 mb-4">
              Add a todo item for your project or study group.
            </p>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Group</label>
                <select
                  value={targetGroup}
                  onChange={(e) => setTargetGroup(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                >
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.group_name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Task Description</label>
                <input
                  type="text"
                  value={taskName}
                  onChange={(e) => setTaskName(e.target.value)}
                  placeholder="e.g. Upload final PPT and code zip to portal"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Deadline</label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="e.g. Friday 5:00 PM"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Assigned To</label>
                  <input
                    type="text"
                    value={assignedTo}
                    onChange={(e) => setAssignedTo(e.target.value)}
                    placeholder="e.g. Alex Kumar"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
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
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
