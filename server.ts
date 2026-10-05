import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { db } from './server/db.ts';
import { analyzeGroupMessages, answerQuestion, generateDailyBriefing } from './server/aiService.ts';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Helper to check Gemini key
function hasValidGeminiKey(): boolean {
  const k = process.env.GEMINI_API_KEY;
  return Boolean(k && k !== 'MY_GEMINI_API_KEY' && k.length > 5);
}

// ================= API ROUTES =================

// Health and AI status
app.get('/api/health', (req, res) => {
  const hasKey = hasValidGeminiKey();
  res.json({
    status: 'ok',
    aiProvider: hasKey ? 'Google Gemini 3.8 Flash' : 'Local NLP Heuristic (Demo Mode)',
    hasGeminiKey: hasKey,
    model: hasKey ? 'gemini-3.8-flash' : 'rule-based-nlp-demo',
    timestamp: new Date().toISOString()
  });
});

// Groups with computed counts
app.get('/api/groups', (req, res) => {
  const groups = db.getGroups();
  const allMessages = db.getMessages();
  const allImportant = db.getImportantMessages();
  const allEvents = db.getEvents();
  const allTasks = db.getTasks();

  const enriched = groups.map((g) => {
    const groupMsgs = allMessages.filter((m) => m.group_id === g.id);
    const groupImp = allImportant.filter((i) => i.group_id === g.id);
    const groupEvts = allEvents.filter((e) => e.group_id === g.id);
    const groupTsks = allTasks.filter((t) => t.group_id === g.id);
    const summary = db.getSummary(g.id);

    return {
      ...g,
      message_count: groupMsgs.length,
      important_count: groupImp.length,
      event_count: groupEvts.length,
      task_count: groupTsks.length,
      has_summary: Boolean(summary),
      summary_preview: summary?.summary?.substring(0, 120) || 'No summary yet. Click Analyze to generate.'
    };
  });

  res.json({ groups: enriched });
});

// Add custom group
app.post('/api/groups', (req, res) => {
  const { group_name, category, description } = req.body;
  if (!group_name) {
    return res.status(400).json({ error: 'Group name is required' });
  }
  const created = db.addGroup(group_name, category || 'Custom', description || '');
  res.json({ success: true, group: created });
});

// Get messages (optional filter by group or keyword)
app.get('/api/messages', (req, res) => {
  const { group_id, q } = req.query;
  let messages = db.getMessages(group_id as string | undefined);

  if (q && typeof q === 'string') {
    const term = q.toLowerCase();
    messages = messages.filter(
      (m) =>
        m.message_text.toLowerCase().includes(term) ||
        m.sender.toLowerCase().includes(term)
    );
  }

  res.json({ messages, total: messages.length });
});

// Parser for uploaded chat files (TXT, CSV, JSON)
function parseRawChat(rawContent: string, format: string, defaultGroupId: string) {
  const parsedMessages: Array<{
    group_id: string;
    sender: string;
    message_text: string;
    message_date: string;
    message_time: string;
  }> = [];

  const todayStr = new Date().toISOString().split('T')[0];

  if (format === 'json') {
    try {
      const data = JSON.parse(rawContent);
      const list = Array.isArray(data) ? data : data.messages || [];
      for (const item of list) {
        if (item.message_text || item.text || item.message) {
          parsedMessages.push({
            group_id: item.group_id || defaultGroupId,
            sender: item.sender || item.from || item.author || 'User',
            message_text: item.message_text || item.text || item.message || '',
            message_date: item.message_date || item.date || todayStr,
            message_time: item.message_time || item.time || '10:00 AM'
          });
        }
      }
      return parsedMessages;
    } catch (e) {
      console.warn('Failed to parse as JSON:', e);
    }
  }

  if (format === 'csv') {
    const lines = rawContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
    // Skip header if present
    const startIndex = lines[0].toLowerCase().includes('sender') || lines[0].toLowerCase().includes('message') ? 1 : 0;
    for (let i = startIndex; i < lines.length; i++) {
      const parts = lines[i].split(',').map((p) => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length >= 2) {
        parsedMessages.push({
          group_id: defaultGroupId,
          sender: parts[0] || 'Member',
          message_text: parts[1] || '',
          message_date: parts[2] || todayStr,
          message_time: parts[3] || '12:00 PM'
        });
      }
    }
    if (parsedMessages.length > 0) return parsedMessages;
  }

  // Text Parsing: WhatsApp export formats
  // Format A: [12/10/24, 10:15:32 AM] Alex: Hey guys
  // Format B: 12/10/24, 10:15 - Alex: Hey guys
  // Format C: Alex: Hey guys
  const lines = rawContent.split(/\r?\n/).filter((l) => l.trim().length > 0);
  const regexA = /^\[(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?)\]\s+([^:]+):\s+(.*)$/;
  const regexB = /^(\d{1,2}\/\d{1,2}\/\d{2,4}),?\s+(\d{1,2}:\d{2}\s*(?:AM|PM|am|pm)?)\s+-\s+([^:]+):\s+(.*)$/;
  const regexC = /^([^:]+):\s+(.*)$/;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const matchA = trimmed.match(regexA);
    if (matchA) {
      parsedMessages.push({
        group_id: defaultGroupId,
        message_date: matchA[1],
        message_time: matchA[2],
        sender: matchA[3].trim(),
        message_text: matchA[4].trim()
      });
      continue;
    }

    const matchB = trimmed.match(regexB);
    if (matchB) {
      parsedMessages.push({
        group_id: defaultGroupId,
        message_date: matchB[1],
        message_time: matchB[2],
        sender: matchB[3].trim(),
        message_text: matchB[4].trim()
      });
      continue;
    }

    const matchC = trimmed.match(regexC);
    if (matchC) {
      parsedMessages.push({
        group_id: defaultGroupId,
        message_date: todayStr,
        message_time: '12:00 PM',
        sender: matchC[1].trim(),
        message_text: matchC[2].trim()
      });
      continue;
    }

    // If continuation or plain line
    if (parsedMessages.length > 0) {
      parsedMessages[parsedMessages.length - 1].message_text += ' ' + trimmed;
    } else {
      parsedMessages.push({
        group_id: defaultGroupId,
        sender: 'Participant',
        message_text: trimmed,
        message_date: todayStr,
        message_time: '12:00 PM'
      });
    }
  }

  return parsedMessages;
}

// Import messages endpoint
app.post('/api/messages/import', (req, res) => {
  const { group_id, content, format = 'txt', custom_messages } = req.body;
  const targetGroupId = group_id || 'grp_ai_ml';

  let messagesToInsert: Array<{
    group_id: string;
    sender: string;
    message_text: string;
    message_date: string;
    message_time: string;
  }> = [];

  if (custom_messages && Array.isArray(custom_messages)) {
    messagesToInsert = custom_messages.map((m: any) => ({
      group_id: targetGroupId,
      sender: m.sender || 'Participant',
      message_text: m.message_text || '',
      message_date: m.message_date || new Date().toISOString().split('T')[0],
      message_time: m.message_time || '10:00 AM'
    }));
  } else if (content) {
    messagesToInsert = parseRawChat(content, format, targetGroupId);
  }

  if (messagesToInsert.length === 0) {
    return res.status(400).json({ error: 'No valid messages could be parsed from input' });
  }

  const added = db.addMessages(messagesToInsert);
  res.json({
    success: true,
    count: added.length,
    messages: added
  });
});

// Analyze messages with AI
app.post('/api/messages/analyze', async (req, res) => {
  const { group_id } = req.body;
  const targetGroupId = group_id || 'grp_ai_ml';
  const group = db.getGroupById(targetGroupId);
  const messages = db.getMessages(targetGroupId);

  if (messages.length === 0) {
    return res.status(400).json({ error: 'No messages found in this group to analyze.' });
  }

  const groupName = group ? group.group_name : 'Group Chat';

  try {
    const result = await analyzeGroupMessages(messages, groupName);

    // Save summary
    const summary = db.upsertSummary({
      group_id: targetGroupId,
      summary: result.summary,
      main_topics: result.main_topics,
      created_at: new Date().toISOString(),
      source: result.source
    });

    // Save important messages
    const important = db.setImportantMessages(targetGroupId, result.important_messages);

    // Save events
    const events = db.setEvents(targetGroupId, result.events);

    // Save tasks
    const tasks = db.setTasks(targetGroupId, result.tasks);

    res.json({
      success: true,
      summary,
      important_messages: important,
      events,
      tasks,
      source: result.source
    });
  } catch (error) {
    console.error('Error during AI analysis:', error);
    res.status(500).json({ error: 'Failed to analyze messages', details: String(error) });
  }
});

// Get Summary for group
app.get('/api/summary/:groupId', (req, res) => {
  const { groupId } = req.params;
  const summary = db.getSummary(groupId);
  const important = db.getImportantMessages(groupId);
  const events = db.getEvents(groupId);
  const tasks = db.getTasks(groupId);

  res.json({
    summary: summary || null,
    important_messages: important,
    events,
    tasks
  });
});

// Natural Language AI Q&A
app.post('/api/ai/ask', async (req, res) => {
  const { question, group_id, user_id = 'usr_1' } = req.body;

  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Question cannot be empty' });
  }

  const messages = db.getMessages(group_id);
  const group = group_id ? db.getGroupById(group_id) : undefined;
  const history = db.getConversations(user_id, group_id).map((c) => ({
    question: c.question,
    answer: c.answer
  }));

  try {
    const { answer, source } = await answerQuestion(
      question,
      messages,
      history,
      group?.group_name
    );

    const saved = db.addConversation({
      user_id,
      group_id,
      question,
      answer
    });

    res.json({
      conversation: saved,
      answer,
      source
    });
  } catch (error) {
    console.error('Error in AI ask endpoint:', error);
    res.status(500).json({
      answer: "I couldn't find that information in the available messages.",
      source: 'demo'
    });
  }
});

// Important messages list
app.get('/api/important', (req, res) => {
  const { group_id } = req.query;
  const items = db.getImportantMessages(group_id as string | undefined);
  res.json({ important_messages: items });
});

// Events
app.get('/api/events', (req, res) => {
  const { group_id } = req.query;
  const events = db.getEvents(group_id as string | undefined);
  res.json({ events });
});

app.post('/api/events', (req, res) => {
  const { group_id, event_name, event_date, event_time, description, location } = req.body;
  if (!event_name || !group_id) {
    return res.status(400).json({ error: 'event_name and group_id are required' });
  }
  const created = db.addEvent({
    group_id,
    event_name,
    event_date: event_date || 'Upcoming',
    event_time: event_time || 'TBD',
    description: description || '',
    location: location || ''
  });
  res.json({ success: true, event: created });
});

// Tasks
app.get('/api/tasks', (req, res) => {
  const { group_id } = req.query;
  const tasks = db.getTasks(group_id as string | undefined);
  res.json({ tasks });
});

app.post('/api/tasks', (req, res) => {
  const { group_id, task_name, deadline, assigned_to } = req.body;
  if (!task_name || !group_id) {
    return res.status(400).json({ error: 'task_name and group_id are required' });
  }
  const created = db.addTask({
    group_id,
    task_name,
    deadline: deadline || 'Soon',
    status: 'pending',
    assigned_to: assigned_to || 'Member'
  });
  res.json({ success: true, task: created });
});

app.patch('/api/tasks/:id/toggle', (req, res) => {
  const { id } = req.params;
  const updated = db.toggleTaskStatus(id);
  if (!updated) {
    return res.status(404).json({ error: 'Task not found' });
  }
  res.json({ success: true, task: updated });
});

// Analytics
app.get('/api/analytics', (req, res) => {
  const groups = db.getGroups();
  const messages = db.getMessages();
  const important = db.getImportantMessages();
  const events = db.getEvents();
  const tasks = db.getTasks();

  const groupCounts: Record<string, { name: string; count: number; category: string }> = {};
  for (const g of groups) {
    groupCounts[g.id] = { name: g.group_name, count: 0, category: g.category };
  }
  for (const m of messages) {
    if (groupCounts[m.group_id]) {
      groupCounts[m.group_id].count++;
    }
  }

  // Priority breakdown
  const priorityBreakdown = {
    Urgent: important.filter((i) => i.priority === 'Urgent').length,
    Important: important.filter((i) => i.priority === 'Important').length,
    Normal: important.filter((i) => i.priority === 'Normal').length
  };

  // Top senders
  const senderMap: Record<string, number> = {};
  for (const m of messages) {
    senderMap[m.sender] = (senderMap[m.sender] || 0) + 1;
  }
  const topSenders = Object.entries(senderMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([sender, count]) => ({ sender, count }));

  res.json({
    total_messages: messages.length,
    total_groups: groups.length,
    total_important: important.length,
    total_events: events.length,
    total_tasks: tasks.length,
    tasks_pending: tasks.filter((t) => t.status === 'pending').length,
    tasks_completed: tasks.filter((t) => t.status === 'completed').length,
    groups_breakdown: Object.values(groupCounts),
    priority_breakdown: priorityBreakdown,
    top_senders: topSenders
  });
});

// Daily Briefing
app.get('/api/briefing', async (req, res) => {
  const groups = db.getGroups().map((g) => ({ id: g.id, name: g.group_name }));
  const messages = db.getMessages();
  const text = await generateDailyBriefing(groups, messages);
  res.json({ briefing: text, generated_at: new Date().toISOString() });
});

// Data management: reset to initial scenario or clear
app.post('/api/data/reset', (req, res) => {
  db.resetToDemo();
  res.json({ success: true, message: 'Reset successfully to demo state' });
});

app.post('/api/data/clear', (req, res) => {
  db.clearImportedData();
  res.json({ success: true, message: 'All imported chat messages have been removed' });
});

// ================= FRONTEND SERVING =================
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`WhatsApp AI Agent server running at http://0.0.0.0:${PORT}`);
    console.log(`Gemini API configured: ${hasValidGeminiKey() ? 'YES (Active)' : 'NO (Fallback Demo Mode Ready)'}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
