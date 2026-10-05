import React, { useState } from 'react';
import {
  Settings,
  User as UserIcon,
  Volume2,
  Bell,
  Trash2,
  RotateCcw,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Moon,
  Sun
} from 'lucide-react';
import { User } from '../types';
import { voiceManager, SpeechSettings } from '../utils/voice';

interface SettingsViewProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
  onResetData: () => Promise<void>;
  onClearData: () => Promise<void>;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  user,
  onUpdateUser,
  onResetData,
  onClearData,
  darkMode,
  setDarkMode
}) => {
  const [name, setName] = useState(user?.name || 'Alex Kumar');
  const [email, setEmail] = useState(user?.email || 'alex.kumar@diploma-cse.edu');
  const [role, setRole] = useState(user?.role || 'Diploma CSE Final Year Student');
  const [voiceRate, setVoiceRate] = useState(1.0);
  const [voicePitch, setVoicePitch] = useState(1.0);
  const [notifUrgent, setNotifUrgent] = useState(true);
  const [notifDeadlines, setNotifDeadlines] = useState(true);
  const [notifEvents, setNotifEvents] = useState(true);
  const [actionStatus, setActionStatus] = useState<string | null>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      onUpdateUser({
        ...user,
        name,
        email,
        role
      });
      setActionStatus('Profile updated successfully.');
      setTimeout(() => setActionStatus(null), 3000);
    }
  };

  const handleTestVoice = () => {
    voiceManager.speak(
      "Hello Alex! This is your voice synthesis test for WhatsApp AI Agent.",
      undefined,
      undefined,
      undefined,
      { rate: voiceRate, pitch: voicePitch }
    );
  };

  const handleResetDataClick = async () => {
    if (window.confirm('Reset all messages, groups, events, and tasks to the initial Diploma CSE demo dataset?')) {
      await onResetData();
      setActionStatus('Database successfully reset to demo scenario.');
      setTimeout(() => setActionStatus(null), 3000);
    }
  };

  const handleClearDataClick = async () => {
    if (window.confirm('Are you sure you want to delete all imported messages, summaries, and detected items?')) {
      await onClearData();
      setActionStatus('All imported messages have been permanently deleted.');
      setTimeout(() => setActionStatus(null), 3000);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Settings className="h-6 w-6 text-emerald-400" />
          <h1 className="text-xl font-bold text-white">System & Profile Settings</h1>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Configure profile details, voice synthesis preferences, notifications, and data management.
        </p>
      </div>

      {actionStatus && (
        <div className="rounded-xl bg-emerald-500/10 border border-emerald-500/30 p-3 text-xs text-emerald-300 flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{actionStatus}</span>
        </div>
      )}

      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <UserIcon className="h-4 w-4 text-emerald-400" />
          <span>User Profile</span>
        </h2>

        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="flex items-center gap-4 pb-4 border-b border-slate-800">
            <img
              src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
              alt={user?.name || 'User'}
              className="h-16 w-16 rounded-full object-cover ring-2 ring-emerald-500"
            />
            <div>
              <h3 className="text-sm font-bold text-white">{name}</h3>
              <p className="text-xs text-slate-400">{role}</p>
              <span className="inline-block mt-1 rounded bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
                Academic Role: Verified Student
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">College Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-300 mb-1">Project Role / Department</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full rounded-xl border border-slate-800 bg-slate-950 py-2 px-3 text-xs text-white focus:border-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-emerald-400 transition-colors"
            >
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>

      {/* Voice Preferences Card */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
          <h2 className="text-sm font-bold text-white flex items-center gap-2">
            <Volume2 className="h-4 w-4 text-emerald-400" />
            <span>Voice Assistant Settings (TTS)</span>
          </h2>
          <button
            type="button"
            onClick={handleTestVoice}
            className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/25 transition-colors"
          >
            🔊 Test Voice
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Speech Rate: {voiceRate}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={voiceRate}
              onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-slate-300 mb-1">
              <span>Speech Pitch: {voicePitch}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="1.8"
              step="0.1"
              value={voicePitch}
              onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
              className="w-full accent-emerald-500"
            />
          </div>
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-6 shadow-lg">
        <h2 className="text-sm font-bold text-white mb-4 flex items-center gap-2">
          <Bell className="h-4 w-4 text-amber-400" />
          <span>Automated Alert Subscriptions</span>
        </h2>

        <div className="space-y-3 text-xs">
          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
            <div>
              <p className="font-semibold text-white">🚨 Urgent Deadlines & Cutoffs</p>
              <p className="text-[11px] text-slate-400">Receive alerts when messages contain hard deadlines</p>
            </div>
            <input
              type="checkbox"
              checked={notifUrgent}
              onChange={(e) => setNotifUrgent(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
            />
          </label>

          <label className="flex items-center justify-between p-3 rounded-xl bg-slate-950/70 border border-slate-800 cursor-pointer">
            <div>
              <p className="font-semibold text-white">📅 Presentation & Meeting Notifications</p>
              <p className="text-[11px] text-slate-400">Alert on scheduled faculty meetings and seminar hall bookings</p>
            </div>
            <input
              type="checkbox"
              checked={notifEvents}
              onChange={(e) => setNotifEvents(e.target.checked)}
              className="rounded border-slate-700 bg-slate-900 text-emerald-500 focus:ring-0"
            />
          </label>
        </div>
      </div>

      {/* Data Management & Privacy Wipe */}
      <div className="rounded-2xl border border-rose-500/20 bg-rose-950/10 p-6 shadow-lg">
        <h2 className="text-sm font-bold text-white mb-1 flex items-center gap-2">
          <Trash2 className="h-4 w-4 text-rose-400" />
          <span>Data Management & Academic Reset</span>
        </h2>
        <p className="text-xs text-slate-400 mb-4">
          Control stored chat files, cached AI summaries, and demonstration scenario state.
        </p>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={handleResetDataClick}
            className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-colors flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Reset to Demo Scenario</span>
          </button>

          <button
            type="button"
            onClick={handleClearDataClick}
            className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-4 py-2.5 text-xs font-semibold text-rose-300 hover:bg-rose-500/20 transition-colors flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Delete My Imported Data</span>
          </button>
        </div>
      </div>
    </div>
  );
};
