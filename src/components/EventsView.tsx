import React, { useState } from 'react';
import { Calendar, Plus, Clock, MapPin, Users, CheckCircle2, X } from 'lucide-react';
import { EventItem, Group } from '../types';

interface EventsViewProps {
  groups: Group[];
  events: EventItem[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
  onCreateEvent: (event: Omit<EventItem, 'id'>) => Promise<void>;
}

export const EventsView: React.FC<EventsViewProps> = ({
  groups,
  events,
  selectedGroupId,
  onSelectGroup,
  onCreateEvent
}) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [targetGroup, setTargetGroup] = useState(selectedGroupId || groups[0]?.id || 'grp_ai_ml');

  const filteredEvents = selectedGroupId
    ? events.filter((e) => e.group_id === selectedGroupId)
    : events;

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    await onCreateEvent({
      group_id: targetGroup,
      event_name: eventName.trim(),
      event_date: eventDate.trim() || 'Upcoming',
      event_time: eventTime.trim() || 'TBD',
      description: description.trim(),
      location: location.trim()
    });

    setEventName('');
    setEventDate('');
    setEventTime('');
    setDescription('');
    setLocation('');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Calendar className="h-6 w-6 text-amber-400" />
            <h1 className="text-xl font-bold text-white">Detected Events & Presentations</h1>
          </div>
          <p className="mt-1 text-xs text-slate-400">
            Presentations, viva evaluations, rehearsals, and group meetings captured automatically from chat messages.
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
            <span>Add Event</span>
          </button>
        </div>
      </div>

      {/* Events Grid / Schedule Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.length === 0 ? (
          <div className="col-span-full rounded-2xl border border-slate-800 bg-slate-900/40 p-12 text-center">
            <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto mb-2 opacity-60" />
            <p className="text-sm font-semibold text-white">No upcoming events detected</p>
            <p className="text-xs text-slate-400 mt-1">Select another group or add an event manually.</p>
          </div>
        ) : (
          filteredEvents.map((evt) => {
            const group = groups.find((g) => g.id === evt.group_id);

            return (
              <div
                key={evt.id}
                className="flex flex-col justify-between rounded-2xl border border-amber-500/30 bg-gradient-to-b from-amber-950/20 via-slate-900 to-slate-900 p-5 shadow-lg"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30 flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>{evt.event_date} • {evt.event_time}</span>
                    </span>

                    {group && (
                      <span className="text-[11px] text-slate-400 font-medium">
                        {group.group_name.substring(0, 15)}...
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-bold text-white">{evt.event_name}</h3>
                  <p className="mt-2 text-xs text-slate-300 leading-relaxed">
                    {evt.description}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{evt.location || 'College Campus'}</span>
                  </div>

                  <span className="text-[11px] font-mono text-emerald-400">Scheduled</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-2xl border border-slate-800 bg-slate-900 p-6 shadow-2xl">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-base font-bold text-white mb-1">Add Calendar Event</h2>
            <p className="text-xs text-slate-400 mb-4">
              Schedule an event or milestone for your group.
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
                <label className="block text-xs font-medium text-slate-300 mb-1">Event Name</label>
                <input
                  type="text"
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. AI Project Final Presentation"
                  required
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Date</label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g. Saturday"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Time</label>
                  <input
                    type="text"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Location</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="e.g. Seminar Hall 2"
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Details, pendrive requirement, slide deck etc."
                  rows={2}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
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
                  className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
                >
                  Save Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
