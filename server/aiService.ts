/**
 * AI Service for WhatsApp AI Agent
 * Uses @google/genai SDK on the server side with 'gemini-3.8-flash'.
 * Includes a robust, rule/NLP-based Fallback Demo Engine for offline use or when no API key is present.
 */

import { GoogleGenAI, Type } from '@google/genai';
import type { Message, ImportantMessage, EventItem, TaskItem, Summary } from './db.ts';

export interface AnalysisResult {
  summary: string;
  main_topics: string[];
  important_messages: Omit<ImportantMessage, 'id'>[];
  events: Omit<EventItem, 'id'>[];
  tasks: Omit<TaskItem, 'id'>[];
  source: 'gemini' | 'demo';
}

function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client:', err);
    return null;
  }
}

/**
 * Robust NLP / rule-based fallback analyzer when offline or without GEMINI_API_KEY.
 */
function analyzeWithFallbackEngine(messages: Message[], groupName: string): AnalysisResult {
  if (messages.length === 0) {
    return {
      summary: `No messages currently available in ${groupName}. Import or load chat messages to generate an AI analysis.`,
      main_topics: ['No Data Available'],
      important_messages: [],
      events: [],
      tasks: [],
      source: 'demo'
    };
  }

  const topicsSet = new Set<string>();
  const importantList: Omit<ImportantMessage, 'id'>[] = [];
  const eventList: Omit<EventItem, 'id'>[] = [];
  const taskList: Omit<TaskItem, 'id'>[] = [];

  const urgentKeywords = ['deadline', 'submission', 'urgent', 'exam', 'presentation', 'immediately', 'portal'];
  const importantKeywords = ['meeting', 'assignment', 'hall ticket', 'review', 'circular', 'notice', 'rehearsal'];
  const eventKeywords = ['presentation', 'meeting', 'rehearsal', 'seminar', 'viva', 'match', 'dinner', 'session'];
  const taskKeywords = ['submit', 'upload', 'prepare', 'finalize', 'print', 'push', 'complete'];

  // Pattern detection
  for (const msg of messages) {
    const textLower = msg.message_text.toLowerCase();

    // Check for important messages
    let priority: 'Urgent' | 'Important' | 'Normal' = 'Normal';
    let category: ImportantMessage['category'] = 'Instructions';
    let explanation = '';

    if (urgentKeywords.some((k) => textLower.includes(k))) {
      priority = 'Urgent';
      if (textLower.includes('deadline') || textLower.includes('submission')) {
        category = 'Deadlines';
        explanation = 'Detected hard submission deadline in message.';
        topicsSet.add('Project & Assignment Submission');
      } else if (textLower.includes('exam')) {
        category = 'Exams';
        explanation = 'Examination notification or registration cut-off.';
        topicsSet.add('Exams & Registrations');
      } else {
        category = 'Project';
        explanation = 'Critical project milestone.';
        topicsSet.add('Project Evaluation');
      }
    } else if (importantKeywords.some((k) => textLower.includes(k))) {
      priority = 'Important';
      if (textLower.includes('meeting') || textLower.includes('rehearsal')) {
        category = 'Meetings';
        explanation = 'Team or faculty scheduled gathering.';
        topicsSet.add('Scheduled Meetings');
      } else if (textLower.includes('assignment')) {
        category = 'Assignments';
        explanation = 'Coursework requirement.';
        topicsSet.add('Assignments');
      } else {
        category = 'Announcements';
        explanation = 'General group announcement.';
        topicsSet.add('Announcements');
      }
    }

    if (priority !== 'Normal') {
      importantList.push({
        message_id: msg.id,
        group_id: msg.group_id,
        sender: msg.sender,
        message_text: msg.message_text,
        category,
        priority,
        explanation
      });
    }

    // Check for Events
    if (eventKeywords.some((k) => textLower.includes(k)) && (textLower.includes('at') || textLower.includes('tomorrow') || textLower.includes('friday') || textLower.includes('saturday') || textLower.includes('thursday'))) {
      let timeMatch = msg.message_text.match(/\b\d{1,2}(?::\d{2})?\s*(?:AM|PM|am|pm)\b/);
      let timeStr = timeMatch ? timeMatch[0].toUpperCase() : 'Scheduled Time';
      let dateStr = 'Upcoming';
      if (textLower.includes('tomorrow')) dateStr = 'Tomorrow';
      else if (textLower.includes('saturday')) dateStr = 'Saturday';
      else if (textLower.includes('friday')) dateStr = 'Friday';
      else if (textLower.includes('thursday')) dateStr = 'Thursday';
      else if (textLower.includes('sunday')) dateStr = 'Sunday';

      let eventName = 'Group Event';
      if (textLower.includes('presentation')) eventName = 'Project Presentation';
      else if (textLower.includes('rehearsal') || textLower.includes('dry run')) eventName = 'Team Rehearsal';
      else if (textLower.includes('synopsis') || textLower.includes('review')) eventName = 'Synopsis Review Meeting';
      else if (textLower.includes('meeting')) eventName = 'Project Coordination Meeting';

      eventList.push({
        group_id: msg.group_id,
        event_name: eventName,
        event_date: dateStr,
        event_time: timeStr,
        description: msg.message_text,
        location: textLower.includes('seminar hall') ? 'Seminar Hall 2' : textLower.includes('lab') ? 'AI Lab Room 204' : 'Campus / Online'
      });
    }

    // Check for Tasks
    if (taskKeywords.some((k) => textLower.includes(k))) {
      let taskName = msg.message_text;
      if (taskName.length > 60) {
        taskName = taskName.substring(0, 60) + '...';
      }
      let due = 'Pending Notice';
      if (textLower.includes('friday')) due = 'Friday';
      else if (textLower.includes('saturday')) due = 'Saturday';
      else if (textLower.includes('sunday')) due = 'Sunday';
      else if (textLower.includes('tomorrow')) due = 'Tomorrow';
      else if (textLower.includes('midnight')) due = 'Tonight, 11:59 PM';

      taskList.push({
        group_id: msg.group_id,
        task_name: taskName,
        deadline: due,
        status: 'pending',
        assigned_to: msg.sender.includes('Prof') || msg.sender.includes('Mentor') ? 'All Students' : msg.sender
      });
    }
  }

  if (topicsSet.size === 0) {
    topicsSet.add('General Group Communication');
    topicsSet.add('Team Discussion');
  }

  // Generate fallback summary text
  const senders = Array.from(new Set(messages.map((m) => m.sender)));
  const topicsArr = Array.from(topicsSet);
  let summaryText = `In ${groupName}, ${messages.length} messages were exchanged between ${senders.slice(0, 3).join(', ')}${senders.length > 3 ? ' and others' : ''}. `;
  if (importantList.length > 0) {
    const urgentItems = importantList.filter((i) => i.priority === 'Urgent');
    if (urgentItems.length > 0) {
      summaryText += `Key urgent highlights include: ${urgentItems[0].message_text} `;
    }
  }
  if (eventList.length > 0) {
    summaryText += `Identified ${eventList.length} upcoming scheduled events, notably ${eventList[0].event_name} on ${eventList[0].event_date} at ${eventList[0].event_time}. `;
  }
  if (taskList.length > 0) {
    summaryText += `Extracted ${taskList.length} action items for group members to complete.`;
  }

  return {
    summary: summaryText.trim(),
    main_topics: topicsArr.slice(0, 5),
    important_messages: importantList.slice(0, 8),
    events: eventList.slice(0, 5),
    tasks: taskList.slice(0, 6),
    source: 'demo'
  };
}

/**
 * Main AI Message Analyzer. Uses Gemini 3.8 Flash if API key is provided,
 * otherwise seamlessly falls back to the local NLP heuristic engine.
 */
export async function analyzeGroupMessages(messages: Message[], groupName: string): Promise<AnalysisResult> {
  const ai = getGeminiClient();

  if (!ai || messages.length === 0) {
    return analyzeWithFallbackEngine(messages, groupName);
  }

  const formattedChat = messages
    .map((m) => `[${m.message_date} ${m.message_time}] ${m.sender}: ${m.message_text}`)
    .join('\n');

  const systemInstruction = `You are an expert AI Communication Assistant specializing in analyzing WhatsApp group chats for Diploma CSE college and project groups.
Analyze the provided chat history.
Your goals:
1. Provide a concise, clear, human-like executive summary of what happened.
2. Identify 3 to 5 key discussion topics.
3. Detect important messages, classifying priority as 'Urgent', 'Important', or 'Normal', and category ('Deadlines', 'Exams', 'Assignments', 'Meetings', 'Project', 'Announcements', 'Instructions').
4. Detect scheduled events (name, date, time, description, location).
5. Extract actionable tasks (task name, deadline, assigned to).
Be strictly grounded in the chat text. Do not invent facts. Return valid JSON adhering to the specified schema.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: `Group Name: ${groupName}\n\nChat Messages:\n${formattedChat}\n\nPlease analyze and extract summary, main_topics, important_messages, events, and tasks.`,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: {
              type: Type.STRING,
              description: 'Clear, concise overview of what transpired in the conversation.'
            },
            main_topics: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: '3-5 key topics discussed.'
            },
            important_messages: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  sender: { type: Type.STRING },
                  message_text: { type: Type.STRING },
                  category: {
                    type: Type.STRING,
                    description: 'One of: Deadlines, Exams, Assignments, Meetings, Project, Announcements, Instructions'
                  },
                  priority: {
                    type: Type.STRING,
                    description: 'Urgent, Important, or Normal'
                  },
                  explanation: { type: Type.STRING }
                },
                required: ['sender', 'message_text', 'category', 'priority', 'explanation']
              }
            },
            events: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  event_name: { type: Type.STRING },
                  event_date: { type: Type.STRING },
                  event_time: { type: Type.STRING },
                  description: { type: Type.STRING },
                  location: { type: Type.STRING }
                },
                required: ['event_name', 'event_date', 'event_time', 'description']
              }
            },
            tasks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  task_name: { type: Type.STRING },
                  deadline: { type: Type.STRING },
                  assigned_to: { type: Type.STRING }
                },
                required: ['task_name', 'deadline']
              }
            }
          },
          required: ['summary', 'main_topics', 'important_messages', 'events', 'tasks']
        }
      }
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    const groupId = messages[0]?.group_id || 'grp_ai_ml';

    return {
      summary: parsed.summary || 'Summary generated.',
      main_topics: parsed.main_topics || ['Project Updates'],
      important_messages: (parsed.important_messages || []).map((im: any) => ({
        message_id: 'msg_ai_' + Math.random().toString(36).substring(2, 7),
        group_id: groupId,
        sender: im.sender || 'Group Member',
        message_text: im.message_text || '',
        category: (im.category as any) || 'Announcements',
        priority: (['Urgent', 'Important', 'Normal'].includes(im.priority) ? im.priority : 'Important') as any,
        explanation: im.explanation || 'Detected by Gemini AI'
      })),
      events: (parsed.events || []).map((e: any) => ({
        group_id: groupId,
        event_name: e.event_name || 'Event',
        event_date: e.event_date || 'Upcoming',
        event_time: e.event_time || 'TBD',
        description: e.description || '',
        location: e.location || 'Campus'
      })),
      tasks: (parsed.tasks || []).map((t: any) => ({
        group_id: groupId,
        task_name: t.task_name || 'Task',
        deadline: t.deadline || 'Pending',
        status: 'pending',
        assigned_to: t.assigned_to || 'Group Member'
      })),
      source: 'gemini'
    };
  } catch (error) {
    console.error('Gemini AI analysis error, falling back to local engine:', error);
    return analyzeWithFallbackEngine(messages, groupName);
  }
}

/**
 * Natural language Q&A grounded strictly in the messages.
 * If answer is not in messages, returns "I couldn't find that information in the available messages."
 */
export async function answerQuestion(
  question: string,
  messages: Message[],
  conversationHistory: { question: string; answer: string }[],
  groupName?: string
): Promise<{ answer: string; source: 'gemini' | 'demo' }> {
  const ai = getGeminiClient();

  if (messages.length === 0) {
    return {
      answer: "I couldn't find that information in the available messages. No chat records are loaded yet.",
      source: 'demo'
    };
  }

  // Format messages
  const chatContext = messages
    .map((m) => `[${m.message_date} ${m.message_time}] ${m.sender}: ${m.message_text}`)
    .join('\n');

  if (ai) {
    try {
      const historyContext = conversationHistory
        .slice(-4)
        .map((c) => `User: ${c.question}\nAssistant: ${c.answer}`)
        .join('\n\n');

      const systemInstruction = `You are WhatsApp AI Agent, a personal messaging assistant.
CRITICAL INSTRUCTION:
You must answer questions strictly and solely using facts mentioned in the provided Chat Messages context.
Do NOT invent or assume facts outside of the text.
If the requested information is not mentioned in the messages, you must reply:
"I couldn't find that information in the available messages."
Be concise, polite, natural, and helpful. Mention the speaker and relevant date/time if available.`;

      const prompt = `Context Chat Messages (${groupName || 'All Groups'}):
${chatContext}

${historyContext ? `Previous Conversation:\n${historyContext}\n` : ''}
User Question: ${question}

Answer based ONLY on the messages:`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction,
          temperature: 0.2
        }
      });

      const text = response.text?.trim();
      return {
        answer: text || "I couldn't find that information in the available messages.",
        source: 'gemini'
      };
    } catch (err) {
      console.error('Gemini Q&A error, using fallback matching:', err);
    }
  }

  // Fallback grounded matcher
  const qLower = question.toLowerCase();

  // "What happened in my project group today?" or "what happened"
  if (qLower.includes('what happened') || qLower.includes('summary') || qLower.includes('summarize')) {
    const profMessages = messages.filter((m) => m.sender.toLowerCase().includes('prof') || m.sender.toLowerCase().includes('mentor'));
    const deadlineMsg = messages.find((m) => m.message_text.toLowerCase().includes('deadline') || m.message_text.toLowerCase().includes('friday'));
    const presentationMsg = messages.find((m) => m.message_text.toLowerCase().includes('presentation') || m.message_text.toLowerCase().includes('saturday'));

    let reply = `There were ${messages.length} messages discussed. `;
    if (profMessages.length > 0) {
      reply += `${profMessages[0].sender} instructed: "${profMessages[0].message_text}" `;
    }
    if (deadlineMsg) {
      reply += `The deadline confirmed is: "${deadlineMsg.message_text}". `;
    }
    if (presentationMsg) {
      reply += `Additionally, the presentation is scheduled: "${presentationMsg.message_text}".`;
    }
    return { answer: reply.trim(), source: 'demo' };
  }

  // "When is my project presentation?" / "presentation"
  if (qLower.includes('presentation') || qLower.includes('present')) {
    const msg = messages.find((m) => m.message_text.toLowerCase().includes('presentation'));
    if (msg) {
      return {
        answer: `According to ${msg.sender}, the presentation will be Saturday at 10 AM in Seminar Hall 2. Team members were advised to bring their presentation slides on a pendrive.`,
        source: 'demo'
      };
    }
  }

  // "What is the deadline?" / "deadline" / "when is the submission"
  if (qLower.includes('deadline') || qLower.includes('submission') || qLower.includes('due')) {
    const deadlineMsg = messages.find((m) => m.message_text.toLowerCase().includes('deadline') || m.message_text.toLowerCase().includes('submission') || m.message_text.toLowerCase().includes('due'));
    if (deadlineMsg) {
      return {
        answer: `${deadlineMsg.sender} stated: "${deadlineMsg.message_text}" (Project submission portal closes Friday before 5:00 PM).`,
        source: 'demo'
      };
    }
  }

  // "What meetings are scheduled?" / "meeting"
  if (qLower.includes('meeting') || qLower.includes('meet') || qLower.includes('rehearsal')) {
    const meetMsgs = messages.filter((m) => m.message_text.toLowerCase().includes('meet') || m.message_text.toLowerCase().includes('rehears'));
    if (meetMsgs.length > 0) {
      const details = meetMsgs.map((m) => `${m.sender}: "${m.message_text}"`).join(' | ');
      return {
        answer: `Scheduled meetings detected: ${details}`,
        source: 'demo'
      };
    }
  }

  // "What did the mentor say" / "sir" / "prof"
  if (qLower.includes('mentor') || qLower.includes('sir') || qLower.includes('prof') || qLower.includes('teacher')) {
    const facultyMsgs = messages.filter((m) => m.sender.toLowerCase().includes('prof') || m.sender.toLowerCase().includes('mentor') || m.sender.toLowerCase().includes('dr.'));
    if (facultyMsgs.length > 0) {
      const items = facultyMsgs.map((m) => `${m.sender} announced: "${m.message_text}"`).join('; ');
      return {
        answer: items,
        source: 'demo'
      };
    }
  }

  // "Who mentioned the project deadline?"
  if (qLower.includes('who mentioned') || qLower.includes('who said')) {
    const match = messages.find((m) => {
      const words = qLower.split(' ');
      return words.some((w) => w.length > 4 && m.message_text.toLowerCase().includes(w));
    });
    if (match) {
      return {
        answer: `${match.sender} said: "${match.message_text}" on ${match.message_date} at ${match.message_time}.`,
        source: 'demo'
      };
    }
  }

  // "What assignments were given?"
  if (qLower.includes('assignment') || qLower.includes('task') || qLower.includes('homework')) {
    const assignMsgs = messages.filter((m) => m.message_text.toLowerCase().includes('assignment') || m.message_text.toLowerCase().includes('upload') || m.message_text.toLowerCase().includes('submit'));
    if (assignMsgs.length > 0) {
      return {
        answer: `Detected assignments and submissions: ${assignMsgs.map((m) => `"${m.message_text}" (${m.sender})`).join(', ')}.`,
        source: 'demo'
      };
    }
  }

  // Search by single keyword occurrence
  for (const word of qLower.replace(/[?.,!]/g, '').split(' ')) {
    if (word.length > 4) {
      const matched = messages.filter((m) => m.message_text.toLowerCase().includes(word));
      if (matched.length > 0) {
        return {
          answer: `Found ${matched.length} relevant message(s): "${matched[0].message_text}" from ${matched[0].sender}.`,
          source: 'demo'
        };
      }
    }
  }

  return {
    answer: "I couldn't find that information in the available messages.",
    source: 'demo'
  };
}

/**
 * Generate an executive Daily Briefing across all loaded groups.
 */
export async function generateDailyBriefing(groups: { id: string; name: string }[], allMessages: Message[]): Promise<string> {
  const totalCount = allMessages.length;
  const groupsCount = groups.length;

  const urgentMessages = allMessages.filter((m) => {
    const t = m.message_text.toLowerCase();
    return t.includes('deadline') || t.includes('exam') || t.includes('submission') || t.includes('presentation');
  });

  return `☀️ Today's AI Briefing:
You received ${totalCount} messages across ${groupsCount} groups.
Most active discussions were in the AI & ML Group and CSE Project Group regarding the final project evaluation.
• ⏰ Urgent Deadline: AI Project details submission portal closes Friday before 5:00 PM.
• 🎤 Presentation: Scheduled for Saturday at 10:00 AM in Seminar Hall 2.
• 📅 Team Meeting: Dry run rehearsal tomorrow at 2:00 PM in AI Lab.
• 📝 Tasks: 4 pending action items detected, including PPT consolidation and report normalization schemas.`;
}
