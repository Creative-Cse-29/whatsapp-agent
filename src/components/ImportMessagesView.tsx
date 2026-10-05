import React, { useState } from 'react';
import {
  Upload,
  FileText,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCode,
  Table,
  ArrowRight,
  Database,
  Brain,
  Info
} from 'lucide-react';
import { Group, Message } from '../types';

interface ImportMessagesViewProps {
  groups: Group[];
  selectedGroupId: string;
  onSelectGroup: (id: string) => void;
  onImportSuccess: (count: number, messages: Message[]) => void;
  onAnalyzeTrigger: (groupId: string) => void;
}

export const ImportMessagesView: React.FC<ImportMessagesViewProps> = ({
  groups,
  selectedGroupId,
  onSelectGroup,
  onImportSuccess,
  onAnalyzeTrigger
}) => {
  const [format, setFormat] = useState<'txt' | 'csv' | 'json'>('txt');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [previewMessages, setPreviewMessages] = useState<Message[]>([]);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const sampleDemoScenario = `[29/09/2026, 09:15 AM] Prof. Sharma (HOD CSE): Tomorrow we need to discuss the AI project evaluation criteria.
[29/09/2026, 09:16 AM] Prof. Sharma (HOD CSE): Sir asked everyone to submit project details and architecture diagram.
[29/09/2026, 09:20 AM] Rohan Verma: When is the project submission deadline, Sir?
[29/09/2026, 09:25 AM] Prof. Sharma (HOD CSE): Deadline is Friday before 5:00 PM on the portal. No late submissions will be accepted.
[29/09/2026, 09:30 AM] Neha Patel: Is there a presentation also scheduled for this week?
[29/09/2026, 09:35 AM] Prof. Sharma (HOD CSE): Presentation will be Saturday at 10 AM in Seminar Hall 2. Bring your PPT on a pendrive.
[29/09/2026, 10:00 AM] Vikram Singh: Should we meet before the presentation to dry run our slides?
[29/09/2026, 10:05 AM] Pooja Iyer: Yes! We should meet tomorrow at 2 PM in the AI lab to rehearse.
[29/09/2026, 10:15 AM] Alex Kumar: Sounds great. Everyone upload your PPT before Friday so we can combine them.
[29/09/2026, 10:20 AM] Rohan Verma: Got it. I will finalize the model accuracy graph today.`;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    if (file.name.endsWith('.json')) setFormat('json');
    else if (file.name.endsWith('.csv')) setFormat('csv');
    else setFormat('txt');

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setFileContent(content);
    };
    reader.readAsText(file);
  };

  const handleLoadDemoData = () => {
    setFormat('txt');
    setFileContent(sampleDemoScenario);
    setFileName('ai_ml_sample_chat_export.txt');
    setStatusMessage({
      type: 'success',
      text: 'Loaded realistic final-year AI project scenario (Submission Friday 5 PM, Presentation Saturday 10 AM, Rehearsal tomorrow 2 PM).'
    });
  };

  const handleImportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileContent.trim()) {
      setStatusMessage({ type: 'error', text: 'Please paste chat text or select a file to import.' });
      return;
    }

    setIsImporting(true);
    setStatusMessage(null);

    try {
      const res = await fetch('/api/messages/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          group_id: selectedGroupId,
          content: fileContent,
          format
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to import messages');

      setPreviewMessages(data.messages || []);
      onImportSuccess(data.count, data.messages);
      setStatusMessage({
        type: 'success',
        text: `Successfully imported and parsed ${data.count} messages into database.`
      });
    } catch (err: any) {
      setStatusMessage({ type: 'error', text: err.message || 'Import failed.' });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <Upload className="h-6 w-6 text-emerald-400" />
          <h1 className="text-xl font-bold text-white">Import Authorized Chat Data</h1>
        </div>
        <p className="mt-1 text-xs text-slate-400">
          Upload exported WhatsApp chats (.txt, .csv, .json) or load academic demo scenarios. Zero private account scraping.
        </p>
      </div>

      {/* Target Group Selector & Demo Data trigger */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex-1">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Select Target Group for Import
            </label>
            <select
              value={selectedGroupId}
              onChange={(e) => onSelectGroup(e.target.value)}
              className="w-full sm:w-80 rounded-xl border border-slate-800 bg-slate-950 py-2.5 px-3 text-xs font-medium text-white focus:border-emerald-500 focus:outline-none"
            >
              {groups.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.group_name} ({g.message_count || 0} existing msgs)
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleLoadDemoData}
              className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-2.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/10"
            >
              <Sparkles className="h-4 w-4" />
              <span>Use Demo Data</span>
            </button>
          </div>
        </div>
      </div>

      {/* File Format Tabs & Input */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-300">Format:</span>
            <div className="flex rounded-lg bg-slate-950 p-1 border border-slate-800">
              {(['txt', 'csv', 'json'] as const).map((fmt) => (
                <button
                  key={fmt}
                  type="button"
                  onClick={() => setFormat(fmt)}
                  className={`px-3 py-1 text-xs font-mono font-medium rounded-md uppercase transition-all ${
                    format === fmt ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                  }`}
                >
                  .{fmt}
                </button>
              ))}
            </div>
          </div>

          {fileName && (
            <span className="text-xs font-mono text-emerald-400 truncate max-w-xs">
              File: {fileName}
            </span>
          )}
        </div>

        {/* Drag and Drop Box */}
        <div className="relative border-2 border-dashed border-slate-800 hover:border-emerald-500/40 rounded-xl p-6 text-center transition-colors bg-slate-950/40">
          <input
            type="file"
            accept=".txt,.csv,.json"
            onChange={handleFileUpload}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />
          <Upload className="h-8 w-8 text-slate-400 mx-auto mb-2" />
          <p className="text-xs font-medium text-white">
            Drag & drop your chat export file here, or <span className="text-emerald-400 underline">browse</span>
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            Supports WhatsApp exported .txt (e.g. "[12/10/24, 10:15 AM] Alex: ..."), CSV, or JSON
          </p>
        </div>

        {/* Text Area Manual Content */}
        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Or Paste Chat Content Directly
          </label>
          <textarea
            value={fileContent}
            onChange={(e) => setFileContent(e.target.value)}
            rows={8}
            placeholder={`Paste exported messages here...\nExample:\nProf. Sharma: Tomorrow we need to discuss AI project.\nProf. Sharma: Deadline is Friday before 5:00 PM.\nRohan: Presentation will be Saturday at 10 AM.`}
            className="w-full rounded-xl border border-slate-800 bg-slate-950 p-3 font-mono text-xs text-slate-200 placeholder-slate-400 focus:border-emerald-500 focus:outline-none"
          />
        </div>

        {statusMessage && (
          <div
            className={`rounded-xl p-3 text-xs flex items-center gap-2 ${
              statusMessage.type === 'success'
                ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-300'
                : 'bg-rose-500/10 border border-rose-500/30 text-rose-300'
            }`}
          >
            {statusMessage.type === 'success' ? (
              <CheckCircle2 className="h-4 w-4 shrink-0" />
            ) : (
              <AlertCircle className="h-4 w-4 shrink-0" />
            )}
            <span>{statusMessage.text}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <Info className="h-3.5 w-3.5 text-emerald-400" />
            <span>Messages are parsed and stored in local normalized database.</span>
          </div>

          <button
            type="button"
            onClick={handleImportSubmit}
            disabled={isImporting || !fileContent.trim()}
            className="rounded-xl bg-emerald-500 px-5 py-2.5 text-xs font-semibold text-slate-950 hover:bg-emerald-400 disabled:opacity-50 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
          >
            {isImporting ? (
              <span>Parsing Messages...</span>
            ) : (
              <>
                <Database className="h-4 w-4" />
                <span>Parse & Store Messages</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Preview Section if messages exist */}
      {previewMessages.length > 0 && (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/60 p-5 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Table className="h-4 w-4 text-emerald-400" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                Parsed Messages Preview ({previewMessages.length})
              </h3>
            </div>

            <button
              onClick={() => onAnalyzeTrigger(selectedGroupId)}
              className="rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 px-4 py-2 text-xs font-bold text-slate-950 hover:opacity-95 transition-all flex items-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <Brain className="h-4 w-4" />
              <span>Analyze with AI Now</span>
            </button>
          </div>

          <div className="overflow-x-auto max-h-72 overflow-y-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950 text-slate-400 text-[11px] font-semibold sticky top-0">
                <tr>
                  <th className="py-2.5 px-3">Date & Time</th>
                  <th className="py-2.5 px-3">Sender</th>
                  <th className="py-2.5 px-3">Message Content</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {previewMessages.map((msg, i) => (
                  <tr key={i} className="hover:bg-slate-950/40">
                    <td className="py-2 px-3 text-[11px] font-mono text-slate-400 whitespace-nowrap">
                      {msg.message_date} {msg.message_time}
                    </td>
                    <td className="py-2 px-3 font-semibold text-emerald-300 whitespace-nowrap">
                      {msg.sender}
                    </td>
                    <td className="py-2 px-3 text-slate-200">
                      {msg.message_text}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
