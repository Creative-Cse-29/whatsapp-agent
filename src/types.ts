export interface Group {
  id: string;
  group_name: string;
  category: string;
  description: string;
  avatar_color: string;
  created_at: string;
  message_count?: number;
  important_count?: number;
  event_count?: number;
  task_count?: number;
  has_summary?: boolean;
  summary_preview?: string;
}

export interface Message {
  id: string;
  group_id: string;
  sender: string;
  message_text: string;
  message_date: string;
  message_time: string;
  raw_timestamp?: number;
}

export interface Summary {
  id: string;
  group_id: string;
  summary: string;
  main_topics: string[];
  created_at: string;
  source: 'gemini' | 'demo';
}

export interface ImportantMessage {
  id: string;
  message_id: string;
  group_id: string;
  sender: string;
  message_text: string;
  category: 'Deadlines' | 'Exams' | 'Assignments' | 'Meetings' | 'Project' | 'Announcements' | 'Instructions';
  priority: 'Urgent' | 'Important' | 'Normal';
  explanation: string;
}

export interface EventItem {
  id: string;
  group_id: string;
  event_name: string;
  event_date: string;
  event_time: string;
  description: string;
  location?: string;
}

export interface TaskItem {
  id: string;
  group_id: string;
  task_name: string;
  deadline: string;
  status: 'pending' | 'completed';
  assigned_to?: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  group_id?: string;
  question: string;
  answer: string;
  created_at: string;
  source?: 'gemini' | 'demo';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  avatar?: string;
}

export interface AnalyticsData {
  total_messages: number;
  total_groups: number;
  total_important: number;
  total_events: number;
  total_tasks: number;
  tasks_pending: number;
  tasks_completed: number;
  groups_breakdown: Array<{ name: string; count: number; category: string }>;
  priority_breakdown: {
    Urgent: number;
    Important: number;
    Normal: number;
  };
  top_senders: Array<{ sender: string; count: number }>;
}

export interface HealthStatus {
  status: string;
  aiProvider: string;
  hasGeminiKey: boolean;
  model: string;
  timestamp: string;
}
