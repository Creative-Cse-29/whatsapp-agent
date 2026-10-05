import React, { useState, useEffect } from 'react';
import {
  Mic,
  MicOff,
  Volume2,
  Sparkles,
  Bot,
  Square,
  RotateCcw,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { voiceManager } from '../utils/voice';

interface VoiceAssistantViewProps {
  onAskQuestion: (question: string) => Promise<{ answer: string; source: 'gemini' | 'demo' }>;
}

export const VoiceAssistantView: React.FC<VoiceAssistantViewProps> = ({ onAskQuestion }) => {
  const [status, setStatus] = useState<'idle' | 'listening' | 'thinking' | 'speaking'>('idle');
  const [transcript, setTranscript] = useState('');
  const [lastQuestion, setLastQuestion] = useState('');
  const [lastAnswer, setLastAnswer] = useState(
    "Tap the glowing AI orb or press the microphone to ask anything about your WhatsApp messages. I will listen, extract the answer from your chat history, and speak it back to you."
  );
  const [continuousMode, setContinuousMode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const sampleVoicePrompts = [
    'What happened in my project group today?',
    'When is my project presentation?',
    'What is the submission deadline?',
    'What did Prof. Sharma say?'
  ];

  const handleStartVoice = () => {
    setErrorMsg('');
    voiceManager.stopSpeaking();

    voiceManager.startListening(
      async (userSpokenText) => {
        if (!userSpokenText.trim()) {
          setStatus('idle');
          return;
        }

        setTranscript(userSpokenText);
        setLastQuestion(userSpokenText);
        setStatus('thinking');

        try {
          const res = await onAskQuestion(userSpokenText);
          setLastAnswer(res.answer);
          setStatus('speaking');

          voiceManager.speak(
            res.answer,
            () => setStatus('speaking'),
            () => {
              setStatus('idle');
              if (continuousMode) {
                setTimeout(() => handleStartVoice(), 800);
              }
            },
            () => setStatus('idle')
          );
        } catch (err: any) {
          const fallback = "I couldn't find that information in the available messages.";
          setLastAnswer(fallback);
          setStatus('speaking');
          voiceManager.speak(fallback, () => setStatus('speaking'), () => setStatus('idle'));
        }
      },
      () => {
        setStatus('listening');
        setTranscript('');
      },
      () => {
        if (status === 'listening') setStatus('idle');
      },
      (err) => {
        setStatus('idle');
        setErrorMsg('Microphone access denied or browser speech recognition unavailable.');
      }
    );
  };

  const handleStopAll = () => {
    voiceManager.stopListening();
    voiceManager.stopSpeaking();
    setStatus('idle');
  };

  const handlePromptClick = async (prompt: string) => {
    setLastQuestion(prompt);
    setStatus('thinking');
    handleStopAll();

    try {
      const res = await onAskQuestion(prompt);
      setLastAnswer(res.answer);
      setStatus('speaking');
      voiceManager.speak(
        res.answer,
        () => setStatus('speaking'),
        () => setStatus('idle'),
        () => setStatus('idle')
      );
    } catch (e) {
      setLastAnswer("I couldn't find that information in the available messages.");
      setStatus('idle');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[calc(100vh-9rem)] py-6 max-w-4xl mx-auto px-4 text-center">
      {/* Top Banner */}
      <div>
        <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300 mb-3">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>Real-Time Voice AI Agent</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          Speak to Your WhatsApp AI Assistant
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Natural speech recognition with Gemini context-grounded voice response.
        </p>
      </div>

      {/* Center Animated AI Orb */}
      <div className="my-8 flex flex-col items-center">
        <div
          onClick={status === 'idle' ? handleStartVoice : handleStopAll}
          className="relative cursor-pointer group"
          title={status === 'idle' ? 'Click to Speak' : 'Click to Cancel'}
        >
          {/* Outer glow rings */}
          <div
            className={`absolute inset-0 rounded-full blur-2xl transition-all duration-700 ${
              status === 'listening'
                ? 'bg-rose-500/40 scale-125'
                : status === 'thinking'
                ? 'bg-amber-500/40 scale-110 animate-pulse'
                : status === 'speaking'
                ? 'bg-teal-500/40 scale-130 animate-pulse'
                : 'bg-emerald-500/20 group-hover:scale-110'
            }`}
          />

          {/* Main 3D Orb */}
          <div
            className={`relative flex h-48 w-48 sm:h-56 sm:w-56 items-center justify-center rounded-full shadow-2xl transition-all duration-500 ${
              status === 'listening'
                ? 'bg-gradient-to-tr from-rose-600 via-pink-500 to-amber-400 animate-pulse ring-4 ring-rose-400/50'
                : status === 'thinking'
                ? 'bg-gradient-to-tr from-amber-500 via-orange-400 to-emerald-400 animate-spin ring-4 ring-amber-400/50'
                : status === 'speaking'
                ? 'bg-gradient-to-tr from-emerald-500 via-teal-400 to-cyan-300 animate-pulse-glow ring-4 ring-teal-400/50'
                : 'bg-gradient-to-tr from-emerald-600 via-teal-500 to-slate-900 group-hover:shadow-emerald-500/40 ring-2 ring-emerald-500/30'
            }`}
          >
            {status === 'listening' && (
              <Mic className="h-16 w-16 text-white animate-bounce stroke-[2.2]" />
            )}
            {status === 'thinking' && (
              <Sparkles className="h-16 w-16 text-slate-950 animate-pulse" />
            )}
            {status === 'speaking' && (
              <Volume2 className="h-16 w-16 text-slate-950 animate-bounce stroke-[2.2]" />
            )}
            {status === 'idle' && (
              <Mic className="h-16 w-16 text-emerald-300 group-hover:scale-110 transition-transform" />
            )}
          </div>
        </div>

        {/* State Label */}
        <div className="mt-6">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1.5 border border-slate-800 text-xs font-bold uppercase tracking-wider">
            {status === 'listening' && (
              <span className="text-rose-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-400 animate-ping" />
                Listening... (Speak your question)
              </span>
            )}
            {status === 'thinking' && (
              <span className="text-amber-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-spin" />
                Thinking & Searching Messages...
              </span>
            )}
            {status === 'speaking' && (
              <span className="text-emerald-400 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                Speaking AI Answer...
              </span>
            )}
            {status === 'idle' && (
              <span className="text-slate-300">Tap Orb to Start Speaking</span>
            )}
          </div>

          {errorMsg && (
            <div className="mt-2 text-xs text-rose-400 flex items-center justify-center gap-1">
              <AlertCircle className="h-3.5 w-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Transcript & Response Area */}
      <div className="w-full max-w-2xl space-y-4">
        {lastQuestion && (
          <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-4 text-left">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
              🗣️ You Asked:
            </span>
            <p className="text-sm font-semibold text-white">"{lastQuestion}"</p>
          </div>
        )}

        <div className="rounded-2xl border border-emerald-500/30 bg-slate-950/80 p-5 text-left shadow-lg">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
            <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <Bot className="h-4 w-4" />
              <span>AI Spoken Answer</span>
            </span>

            {status === 'speaking' && (
              <button
                onClick={handleStopAll}
                className="text-[11px] font-semibold text-rose-400 hover:underline flex items-center gap-1"
              >
                <Square className="h-3 w-3" />
                <span>Stop Audio</span>
              </button>
            )}
          </div>
          <p className="text-sm text-slate-200 leading-relaxed font-medium">{lastAnswer}</p>
        </div>

        {/* Quick Voice Chips */}
        <div className="pt-2">
          <p className="text-[11px] text-slate-400 mb-2">Or tap a sample question to test:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {sampleVoicePrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(p)}
                className="rounded-xl border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs text-slate-300 hover:border-emerald-500/40 hover:text-white transition-colors"
              >
                "{p}"
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
