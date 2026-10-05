import {
  Group,
  Message,
  Summary,
  ImportantMessage,
  EventItem,
  TaskItem,
  Conversation,
  AnalyticsData,
  HealthStatus
} from './types';

const BASE_URL = '';

export async function fetchHealth(): Promise<HealthStatus> {
  const res = await fetch(`${BASE_URL}/api/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}

export async function fetchGroups(): Promise<Group[]> {
  const res = await fetch(`${BASE_URL}/api/groups`);
  if (!res.ok) throw new Error('Failed to fetch groups');
  const data = await res.json();
  return data.groups || [];
}

export async function createGroup(group_name: string, category = 'Custom', description = ''): Promise<Group> {
  const res = await fetch(`${BASE_URL}/api/groups`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ group_name, category, description })
  });
  if (!res.ok) throw new Error('Failed to create group');
  const data = await res.json();
  return data.group;
}

export async function fetchMessages(groupId?: string, query?: string): Promise<Message[]> {
  const params = new URLSearchParams();
  if (groupId) params.append('group_id', groupId);
  if (query) params.append('q', query);

  const res = await fetch(`${BASE_URL}/api/messages?${params.toString()}`);
  if (!res.ok) throw new Error('Failed to fetch messages');
  const data = await res.json();
  return data.messages || [];
}

export async function importMessages(
  groupId: string,
  content?: string,
  format: 'txt' | 'csv' | 'json' = 'txt',
  customMessages?: Array<{ sender: string; message_text: string }>
): Promise<{ success: boolean; count: number; messages: Message[] }> {
  const res = await fetch(`${BASE_URL}/api/messages/import`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ group_id: groupId, content, format, custom_messages: customMessages })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to import messages');
  }
  return res.json();
}

export async function analyzeGroup(groupId: string): Promise<{
  summary: Summary;
  important_messages: ImportantMessage[];
  events: EventItem[];
  tasks: TaskItem[];
  source: 'gemini' | 'demo';
}> {
  const res = await fetch(`${BASE_URL}/api/messages/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ group_id: groupId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to analyze messages with AI');
  }
  return res.json();
}

export async function fetchSummary(groupId: string): Promise<{
  summary: Summary | null;
  important_messages: ImportantMessage[];
  events: EventItem[];
  tasks: TaskItem[];
}> {
  const res = await fetch(`${BASE_URL}/api/summary/${groupId}`);
  if (!res.ok) throw new Error('Failed to fetch summary');
  return res.json();
}

export async function askAiQuestion(
  question: string,
  groupId?: string,
  userId = 'usr_1'
): Promise<{ answer: string; source: 'gemini' | 'demo'; conversation?: Conversation }> {
  const res = await fetch(`${BASE_URL}/api/ai/ask`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question, group_id: groupId, user_id: userId })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to query AI');
  }
  return res.json();
}

export async function fetchImportantMessages(groupId?: string): Promise<ImportantMessage[]> {
  const url = groupId ? `${BASE_URL}/api/important?group_id=${groupId}` : `${BASE_URL}/api/important`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch important messages');
  const data = await res.json();
  return data.important_messages || [];
}

export async function fetchEvents(groupId?: string): Promise<EventItem[]> {
  const url = groupId ? `${BASE_URL}/api/events?group_id=${groupId}` : `${BASE_URL}/api/events`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch events');
  const data = await res.json();
  return data.events || [];
}

export async function createEvent(event: Omit<EventItem, 'id'>): Promise<EventItem> {
  const res = await fetch(`${BASE_URL}/api/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(event)
  });
  if (!res.ok) throw new Error('Failed to create event');
  const data = await res.json();
  return data.event;
}

export async function fetchTasks(groupId?: string): Promise<TaskItem[]> {
  const url = groupId ? `${BASE_URL}/api/tasks?group_id=${groupId}` : `${BASE_URL}/api/tasks`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch tasks');
  const data = await res.json();
  return data.tasks || [];
}

export async function createTask(task: Omit<TaskItem, 'id' | 'status'>): Promise<TaskItem> {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!res.ok) throw new Error('Failed to create task');
  const data = await res.json();
  return data.task;
}

export async function toggleTask(taskId: string): Promise<TaskItem> {
  const res = await fetch(`${BASE_URL}/api/tasks/${taskId}/toggle`, {
    method: 'PATCH'
  });
  if (!res.ok) throw new Error('Failed to toggle task status');
  const data = await res.json();
  return data.task;
}

export async function fetchAnalytics(): Promise<AnalyticsData> {
  const res = await fetch(`${BASE_URL}/api/analytics`);
  if (!res.ok) throw new Error('Failed to fetch analytics');
  return res.json();
}

export async function fetchDailyBriefing(): Promise<{ briefing: string; generated_at: string }> {
  const res = await fetch(`${BASE_URL}/api/briefing`);
  if (!res.ok) throw new Error('Failed to fetch daily briefing');
  return res.json();
}

export async function resetDatabase(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/data/reset`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to reset database');
}

export async function clearImportedData(): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/data/clear`, { method: 'POST' });
  if (!res.ok) throw new Error('Failed to clear imported data');
}
