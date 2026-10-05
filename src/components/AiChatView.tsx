import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  Send,
  Mic,
  MicOff,
  Volume2,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  User as UserIcon,
  Pause,
  Play,
  Square,
  AlertCircle
} from 'lucide-react';
import { Conversation, Group } from '../types';
import { voiceManager } from '../utils/voice';

interface AiChatViewProps {
  groups: Group[];
  selectedGroupId: string;
  onSelectGroup: (groupId: string) => void;
  onAskQuestion: (question: string, groupId?: string) => Promise<{ answer: string; source: 'gemini' | 'demo' }>;
}

export const AiChatView: React.FC<AiChatViewProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onAskQuestion
}) => {
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; text: string; source?: string }>>([
    {
      role: 'assistant',
      text: "Hello Alex! I am your WhatsApp AI Agent. I can summarize conversations, answer questions, identify deadlines, and track meetings from your authorized group chats.\n\nTry asking: 'What happened in my project group today?' or 'When is the project presentation?'",
      source: 'gemini'
    }
  ]);
  const [input, setInput] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speakingIndex, setSpeakingIndex] = useState<number | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [voiceError, setVoiceError] = useState('');

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing]);

  const quickSuggestions = [
    'What happened in my project group today?',
    'When is my project presentation?',
    'What assignments were given?',
    'What did the mentor say about the project?',
    'Who mentioned the project deadline?',
    'What meetings are scheduled?'
  ];

  const handleSend = async (textToSend?: string) => {
    const q = textToSend || input;
    if (!q.trim() || isProcessing) return;

    const userMsg = q.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setIsProcessing(true);
    setVoiceError('');

    try {
      const res = await onAskQuestion(userMsg, selectedGroupId || undefined);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: res.answer, source: res.source }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: "I couldn't find that information in the available messages.",
          source: 'demo'
        }
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleVoiceInput = () => {
    if (isListening) {
      voiceManager.stopListening();
      setIsListening(false);
      return;
    }

    setVoiceError('');
    voiceManager.startListening(
      (transcript) => {
        setIsListening(false);
        if (transcript.trim()) {
          setInput(transcript);
          handleSend(transcript);
        }
      },
      () => {
        setIsListening(true);
      },
      () => {
        setIsListening(false);
      },
      (err) => {
        setIsListening(false);
        setVoiceError('Voice recognition unavailable or permission denied.');
      }
    );
  };

  const handleSpeak = (text: string, index: number) => {
    if (speakingIndex === index) {
      voiceManager.stopSpeaking();
      setSpeakingIndex(null);
      return;
    }

    voiceManager.speak(
      text,
      () => setSpeakingIndex(index),
      () => setSpeakingIndex(null),
      () => setSpeakingIndex(null)
    );
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8.5rem)] rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-950/70 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-md shadow-emerald-500/20">
            <Bot className="h-5 w-5 stroke-[2.2]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <span>🤖 AI Communication Assistant</span>
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            </h2>
            <p className="text-[11px] text-slate-400">
              Grounded strictly in group chat messages • Voice Enabled
            </p>
          </div>
        </div>

        {/* Group Scope Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 hidden sm:inline">Context Scope:</span>
          <select
            value={selectedGroupId}
            onChange={(e) => onSelectGroup(e.target.value)}
            className="rounded-xl border border-slate-800 bg-slate-900 py-1.5 px-2.5 text-xs text-white focus:border-emerald-500 focus:outline-none"
          >
            <option value="">All Monitored Groups</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.group_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex items-start gap-3 ${
              m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {/* Avatar */}
            <div
              className={`h-8 w-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                m.role === 'user'
                  ? 'bg-blue-600 text-white'
                  : 'bg-emerald-500 text-slate-950 shadow-sm shadow-emerald-500/20'
              }`}
            >
              {m.role === 'user' ? <UserIcon className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed shadow-sm ${
                m.role === 'user'
                  ? 'bg-emerald-500 text-slate-950 font-medium rounded-tr-none'
                  : 'bg-slate-950/80 border border-slate-800 text-slate-200 rounded-tl-none'
              }`}
            >
              <div className="whitespace-pre-line">{m.text}</div>

              {/* Assistant Actions */}
              {m.role === 'assistant' && (
                <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                  <span className="font-mono text-[10px]">
                    {m.source === 'gemini' ? 'Gemini 3.8 Flash' : 'NLP Heuristic Engine'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleSpeak(m.text, idx)}
                      className="hover:text-emerald-400 flex items-center gap-1 transition-colors"
                      title="Read aloud with Text-to-Speech"
                    >
                      {speakingIndex === idx ? (
                        <Square className="h-3 w-3 text-rose-400" />
                      ) : (
                        <Volume2 className="h-3.5 w-3.5 text-emerald-400" />
                      )}
                      <span>{speakingIndex === idx ? 'Stop' : 'Listen'}</span>
                    </button>

                    <button
                      onClick={() => handleCopy(m.text, idx)}
                      className="hover:text-white transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedIndex === idx ? (
                        <Check className="h-3.5 w-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-start gap-3">
            <div className="h-8 w-8 rounded-xl bg-emerald-500 text-slate-950 flex items-center justify-center shrink-0">
              <Bot className="h-4 w-4 animate-spin" />
            </div>
            <div className="rounded-2xl rounded-tl-none bg-slate-950/80 border border-slate-800 p-4 text-xs text-slate-400 flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Analyzing group message context & synthesizing answer...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Suggested chips */}
      <div className="px-4 py-2 bg-slate-950/60 border-t border-slate-800 flex items-center gap-2 overflow-x-auto">
        <span className="text-[10px] text-slate-400 uppercase font-semibold shrink-0">Prompts:</span>
        {quickSuggestions.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            className="rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[11px] text-slate-300 hover:border-emerald-500/40 hover:text-white whitespace-nowrap transition-colors"
          >
            "{prompt}"
          </button>
        ))}
      </div>

      {/* Voice feedback banner if active */}
      {isListening && (
        <div className="bg-emerald-950/80 border-t border-emerald-500/40 px-4 py-2 flex items-center justify-between text-xs text-emerald-300 animate-pulse">
          <div className="flex items-center gap-2">
            <Mic className="h-4 w-4 text-emerald-400 animate-bounce" />
            <span>Listening to your voice... Speak your question naturally.</span>
          </div>
          <button
            onClick={() => {
              voiceManager.stopListening();
              setIsListening(false);
            }}
            className="text-xs font-bold text-rose-300 hover:underline"
          >
            Cancel
          </button>
        </div>
      )}

      {voiceError && (
        <div className="bg-rose-950/80 border-t border-rose-500/30 px-4 py-1.5 text-[11px] text-rose-300 flex items-center gap-2">
          <AlertCircle className="h-3.5 w-3.5" />
          <span>{voiceError}</span>
        </div>
      )}

      {/* Input Form */}
      <form onSubmit={(e) => { e.preventDefault(); handleSend(); }} className="p-3 bg-slate-950 border-t border-slate-800">
        <div className="relative flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question about your messages (or tap the microphone)..."
            disabled={isProcessing}
            className="w-full rounded-xl border border-slate-800 bg-slate-900 py-3 pl-4 pr-24 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
          />

          <div className="absolute right-2 flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleVoiceInput}
              className={`rounded-lg p-2 transition-all ${
                isListening
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'
              }`}
              title="Voice Input (Speech-to-Text)"
            >
              {isListening ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </button>

            <button
              type="submit"
              disabled={!input.trim() || isProcessing}
              className="rounded-lg bg-emerald-500 px-3 py-1.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors flex items-center gap-1"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};
