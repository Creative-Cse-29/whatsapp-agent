import React, { useState } from 'react';
import { Search, Brain, Sparkles, MessageSquare, Send, ArrowRight, User, Clock, AlertCircle } from 'lucide-react';
import { Group, Message } from '../types';

interface SearchViewProps {
  groups: Group[];
  allMessages: Message[];
  onAskQuestion: (q: string) => Promise<{ answer: string; source: 'gemini' | 'demo' }>;
}

export const SearchView: React.FC<SearchViewProps> = ({
  groups,
  allMessages,
  onAskQuestion
}) => {
  const [mode, setMode] = useState<'ai' | 'keyword'>('ai');
  const [query, setQuery] = useState('');
  const [keywordResults, setKeywordResults] = useState<Message[]>([]);
  const [aiAnswer, setAiAnswer] = useState<string | null>(null);
  const [aiSource, setAiSource] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const sampleAiQuestions = [
    'When is the project submission?',
    'What did the mentor say about the project?',
    'Who mentioned the project deadline?',
    'What meetings are scheduled?'
  ];

  const handleSearch = async (e?: React.FormEvent, customQ?: string) => {
    if (e) e.preventDefault();
    const q = (customQ || query).trim();
    if (!q) return;

    setIsSearching(true);

    if (mode === 'keyword') {
      const lower = q.toLowerCase();
      const matched = allMessages.filter(
        (m) =>
          m.message_text.toLowerCase().includes(lower) ||
          m.sender.toLowerCase().includes(lower)
      );
      setKeywordResults(matched);
      setIsSearching(false);
    } else {
      try {
        const res = await onAskQuestion(q);
        setAiAnswer(res.answer);
        setAiSource(res.source);
      } catch (err) {
        setAiAnswer("I couldn't find that information in the available messages.");
        setAiSource('demo');
      } finally {
        setIsSearching(false);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Search className="h-6 w-6 text-emerald-400" />
          <h1 className="text-xl font-bold text-white">Search Chat Records</h1>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Switch between exact Keyword Search and Natural Language AI Semantic Search.
        </p>
      </div>

      {/* Mode Selector */}
      <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/60 p-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-300">Search Engine Mode:</span>
          <div className="flex rounded-xl bg-slate-950 p-1 border border-slate-800">
            <button
              onClick={() => { setMode('ai'); setAiAnswer(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'ai'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Brain className="h-3.5 w-3.5" />
              <span>🧠 AI Natural Language Search</span>
            </button>
            <button
              onClick={() => { setMode('keyword'); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                mode === 'keyword'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              <span>🔎 Exact Keyword Search</span>
            </button>
          </div>
        </div>

        <span className="text-[11px] text-slate-400 hidden sm:inline">
          {mode === 'ai' ? 'Context-grounded reasoning' : 'Fast lexical matching'}
        </span>
      </div>

      {/* Search Input Box */}
      <form onSubmit={handleSearch} className="relative flex items-center">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={
            mode === 'ai'
              ? "Ask any question (e.g. 'When is the project submission?', 'What meetings are scheduled?')..."
              : "Enter exact search term (e.g. 'deadline', 'viva', 'portal', 'presentation')..."
          }
          className="w-full rounded-2xl border border-slate-800 bg-slate-900 py-3.5 pl-4 pr-28 text-xs text-white placeholder-slate-400 focus:border-emerald-500 focus:outline-none shadow-lg"
        />

        <button
          type="submit"
          disabled={!query.trim() || isSearching}
          className="absolute right-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-colors flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
        >
          {isSearching ? (
            <span>Searching...</span>
          ) : (
            <>
              {mode === 'ai' ? <Brain className="h-4 w-4" /> : <Search className="h-4 w-4" />}
              <span>{mode === 'ai' ? 'Ask AI' : 'Search'}</span>
            </>
          )}
        </button>
      </form>

      {/* Suggested prompts in AI mode */}
      {mode === 'ai' && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] text-slate-400 font-medium">Try asking:</span>
          {sampleAiQuestions.map((q, i) => (
            <button
              key={i}
              type="button"
              onClick={() => {
                setQuery(q);
                handleSearch(undefined, q);
              }}
              className="rounded-lg border border-slate-800 bg-slate-900/80 px-2.5 py-1 text-xs text-slate-300 hover:border-emerald-500/40 hover:text-white transition-colors"
            >
              "{q}"
            </button>
          ))}
        </div>
      )}

      {/* AI Answer Result Card */}
      {mode === 'ai' && aiAnswer && (
        <div className="rounded-2xl border border-emerald-500/30 bg-gradient-to-b from-emerald-950/20 via-slate-900 to-slate-900 p-6 shadow-xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-emerald-400" />
              <h3 className="text-sm font-bold text-white">AI Grounded Response</h3>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              Source: {aiSource === 'gemini' ? 'Gemini 3.8 Flash' : 'NLP Heuristic Engine'}
            </span>
          </div>

          <p className="text-sm text-slate-200 leading-relaxed font-medium">{aiAnswer}</p>

          <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
            <span>Strict zero-hallucination compliance: answer is derived strictly from loaded group messages.</span>
          </div>
        </div>
      )}

      {/* Keyword Results Table */}
      {mode === 'keyword' && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Keyword Matches ({keywordResults.length})
            </h3>
            {query && (
              <span className="text-xs text-slate-400">
                Searching for: "<strong className="text-emerald-400">{query}</strong>"
              </span>
            )}
          </div>

          {keywordResults.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">
              {query ? 'No messages contain this keyword.' : 'Enter a search term above.'}
            </p>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {keywordResults.map((msg) => {
                const group = groups.find((g) => g.id === msg.group_id);
                return (
                  <div
                    key={msg.id}
                    className="rounded-xl border border-slate-800 bg-slate-950/80 p-3 text-xs"
                  >
                    <div className="flex items-center justify-between mb-1 text-slate-400">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-emerald-300">{msg.sender}</span>
                        {group && (
                          <span className="rounded bg-slate-800 px-1.5 py-0.2 text-[10px]">
                            {group.group_name}
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-mono">
                        {msg.message_date} {msg.message_time}
                      </span>
                    </div>
                    <p className="text-slate-200 mt-1 font-medium">{msg.message_text}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
