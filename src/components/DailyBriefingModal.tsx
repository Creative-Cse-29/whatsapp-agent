import React, { useState } from 'react';
import { X, Volume2, Sparkles, Sun, CheckCircle2, Clock, Calendar, CheckSquare, Square } from 'lucide-react';
import { voiceManager } from '../utils/voice';

interface DailyBriefingModalProps {
  isOpen: boolean;
  onClose: () => void;
  briefingText: string;
  totalMessages: number;
  totalGroups: number;
  urgentCount: number;
  eventCount: number;
  taskCount: number;
}

export const DailyBriefingModal: React.FC<DailyBriefingModalProps> = ({
  isOpen,
  onClose,
  briefingText,
  totalMessages,
  totalGroups,
  urgentCount,
  eventCount,
  taskCount
}) => {
  const [isSpeaking, setIsSpeaking] = useState(false);

  if (!isOpen) return null;

  const handleSpeak = () => {
    if (isSpeaking) {
      voiceManager.stopSpeaking();
      setIsSpeaking(false);
      return;
    }

    voiceManager.speak(
      briefingText,
      () => setIsSpeaking(true),
      () => setIsSpeaking(false),
      () => setIsSpeaking(false)
    );
  };

  const handleClose = () => {
    voiceManager.stopSpeaking();
    setIsSpeaking(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg rounded-3xl border border-emerald-500/30 bg-slate-900/95 p-6 sm:p-8 shadow-2xl">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 rounded-lg p-1 text-slate-400 hover:bg-slate-800 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/20">
            <Sun className="h-6 w-6 stroke-[2.2]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-400">
              <Sparkles className="h-3 w-3" />
              <span>Executive Synthesis</span>
            </div>
            <h2 className="text-lg font-bold text-white">☀️ Today's AI Morning Briefing</h2>
          </div>
        </div>

        {/* Highlight Stats Row */}
        <div className="grid grid-cols-4 gap-2 text-center p-3 rounded-2xl bg-slate-950 border border-slate-800 mb-5">
          <div>
            <span className="text-xs font-bold text-white block">{totalMessages}</span>
            <span className="text-[10px] text-slate-400">Messages</span>
          </div>
          <div>
            <span className="text-xs font-bold text-emerald-400 block">{totalGroups}</span>
            <span className="text-[10px] text-slate-400">Groups</span>
          </div>
          <div>
            <span className="text-xs font-bold text-rose-400 block">{urgentCount}</span>
            <span className="text-[10px] text-slate-400">Urgent</span>
          </div>
          <div>
            <span className="text-xs font-bold text-amber-400 block">{eventCount}</span>
            <span className="text-[10px] text-slate-400">Events</span>
          </div>
        </div>

        {/* Briefing Text Card */}
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-950/20 p-5 mb-6 text-xs sm:text-sm text-slate-200 leading-relaxed font-normal whitespace-pre-line">
          {briefingText}
        </div>

        {/* Audio Listen action */}
        <div className="flex items-center justify-between gap-3 pt-2 border-t border-slate-800">
          <button
            onClick={handleSpeak}
            className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-all flex items-center gap-2 ${
              isSpeaking
                ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 shadow-md shadow-emerald-500/20'
            }`}
          >
            {isSpeaking ? <Square className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            <span>{isSpeaking ? 'Stop Audio' : '🔊 Listen to Briefing'}</span>
          </button>

          <button
            onClick={handleClose}
            className="rounded-xl border border-slate-700 bg-slate-800 px-4 py-2.5 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
