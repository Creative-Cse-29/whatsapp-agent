/**
 * Database store implementing SQLite schema tables:
 * - users (id, name, email, password)
 * - groups (id, group_name, created_at, category, description)
 * - messages (id, group_id, sender, message_text, message_date, message_time)
 * - summaries (id, group_id, summary, main_topics, created_at)
 * - important_messages (id, message_id, group_id, category, priority, explanation)
 * - events (id, group_id, event_name, event_date, event_time, description)
 * - tasks (id, group_id, task_name, deadline, status)
 * - conversations (id, user_id, group_id, question, answer, created_at)
 */

import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  role?: string;
}

export interface Group {
  id: string;
  group_name: string;
  category: string;
  description: string;
  avatar_color: string;
  created_at: string;
}

export interface Message {
  id: string;
  group_id: string;
  sender: string;
  message_text: string;
  message_date: string; // YYYY-MM-DD
  message_time: string; // HH:MM AM/PM
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
}

export interface DatabaseState {
  users: User[];
  groups: Group[];
  messages: Message[];
  summaries: Summary[];
  important_messages: ImportantMessage[];
  events: EventItem[];
  tasks: TaskItem[];
  conversations: Conversation[];
}

const DB_FILE = path.resolve(process.cwd(), 'database_storage.json');

export const INITIAL_DEMO_DATA: DatabaseState = {
  users: [
    {
      id: 'usr_1',
      name: 'Alex Kumar',
      email: 'alex.kumar@diploma-cse.edu',
      password: 'hashed_password_123',
      role: 'Diploma CSE Final Year Student',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  ],
  groups: [
    {
      id: 'grp_ai_ml',
      group_name: 'AI & ML Group',
      category: 'Academic / Lab',
      description: 'Discussions on AI models, neural networks, machine learning assignments, and faculty instructions.',
      avatar_color: 'from-emerald-500 to-teal-600',
      created_at: '2026-09-01T08:00:00Z'
    },
    {
      id: 'grp_cse_project',
      group_name: 'CSE Final Year Project Group',
      category: 'Major Project',
      description: 'Final Year Diploma Capstone Project coordination, synopsis submission, reviews, and viva preparation.',
      avatar_color: 'from-blue-500 to-indigo-600',
      created_at: '2026-09-05T09:30:00Z'
    },
    {
      id: 'grp_college_circ',
      group_name: 'College Official Circulars',
      category: 'Official Notice',
      description: 'Departmental notifications, fee deadlines, semester exam forms, hall tickets, and sports day circulars.',
      avatar_color: 'from-amber-500 to-orange-600',
      created_at: '2026-08-20T10:00:00Z'
    },
    {
      id: 'grp_web_cloud',
      group_name: 'Web Dev & Cloud Computing',
      category: 'Study Group',
      description: 'Full stack development, React, Docker, Cloud Run, API deployment, and assignment doubt solving.',
      avatar_color: 'from-purple-500 to-pink-600',
      created_at: '2026-09-10T11:15:00Z'
    },
    {
      id: 'grp_friends',
      group_name: 'Friends & Hostel Group',
      category: 'Social',
      description: 'Hostel dinner plans, weekend cricket match, study sessions, and casual chat.',
      avatar_color: 'from-rose-500 to-red-600',
      created_at: '2026-09-12T14:00:00Z'
    }
  ],
  messages: [
    // AI & ML Group messages (Scenario from prompt: project submission, presentation, Friday deadline, Saturday 10 AM)
    {
      id: 'msg_1',
      group_id: 'grp_ai_ml',
      sender: 'Prof. Sharma (HOD CSE)',
      message_text: 'Good morning students. Tomorrow we need to discuss the AI project evaluation criteria.',
      message_date: '2026-09-29',
      message_time: '09:15 AM'
    },
    {
      id: 'msg_2',
      group_id: 'grp_ai_ml',
      sender: 'Prof. Sharma (HOD CSE)',
      message_text: 'Sir asked everyone to submit project details and architecture diagram.',
      message_date: '2026-09-29',
      message_time: '09:16 AM'
    },
    {
      id: 'msg_3',
      group_id: 'grp_ai_ml',
      sender: 'Rohan Verma',
      message_text: 'When is the project submission deadline, Sir?',
      message_date: '2026-09-29',
      message_time: '09:20 AM'
    },
    {
      id: 'msg_4',
      group_id: 'grp_ai_ml',
      sender: 'Prof. Sharma (HOD CSE)',
      message_text: 'Deadline is Friday before 5:00 PM on the portal. No late submissions will be accepted.',
      message_date: '2026-09-29',
      message_time: '09:25 AM'
    },
    {
      id: 'msg_5',
      group_id: 'grp_ai_ml',
      sender: 'Neha Patel',
      message_text: 'Is there a presentation also scheduled for this week?',
      message_date: '2026-09-29',
      message_time: '09:30 AM'
    },
    {
      id: 'msg_6',
      group_id: 'grp_ai_ml',
      sender: 'Prof. Sharma (HOD CSE)',
      message_text: 'Presentation will be Saturday at 10 AM in Seminar Hall 2. Bring your PPT on a pendrive.',
      message_date: '2026-09-29',
      message_time: '09:35 AM'
    },
    {
      id: 'msg_7',
      group_id: 'grp_ai_ml',
      sender: 'Vikram Singh',
      message_text: 'Should we meet before the presentation to dry run our slides?',
      message_date: '2026-09-29',
      message_time: '10:00 AM'
    },
    {
      id: 'msg_8',
      group_id: 'grp_ai_ml',
      sender: 'Pooja Iyer',
      message_text: 'Yes! We should meet tomorrow at 2 PM in the AI lab to rehearse.',
      message_date: '2026-09-29',
      message_time: '10:05 AM'
    },
    {
      id: 'msg_9',
      group_id: 'grp_ai_ml',
      sender: 'Alex Kumar',
      message_text: 'Sounds great. Everyone upload your PPT before Friday so we can combine them.',
      message_date: '2026-09-29',
      message_time: '10:15 AM'
    },
    {
      id: 'msg_10',
      group_id: 'grp_ai_ml',
      sender: 'Rohan Verma',
      message_text: 'Got it. I will finalize the model accuracy graph today.',
      message_date: '2026-09-29',
      message_time: '10:20 AM'
    },

    // CSE Project Group messages
    {
      id: 'msg_11',
      group_id: 'grp_cse_project',
      sender: 'Mentor Dr. Kulkarni',
      message_text: 'Team, please ensure your database normalization schemas are updated in the report.',
      message_date: '2026-09-29',
      message_time: '11:00 AM'
    },
    {
      id: 'msg_12',
      group_id: 'grp_cse_project',
      sender: 'Alex Kumar',
      message_text: 'Yes Ma\'am, we have added 3NF schemas and ER diagrams for WhatsApp AI Agent.',
      message_date: '2026-09-29',
      message_time: '11:10 AM'
    },
    {
      id: 'msg_13',
      group_id: 'grp_cse_project',
      sender: 'Mentor Dr. Kulkarni',
      message_text: 'Project synopsis review meeting scheduled for Thursday at 3:30 PM in Faculty Room 14.',
      message_date: '2026-09-29',
      message_time: '11:15 AM'
    },
    {
      id: 'msg_14',
      group_id: 'grp_cse_project',
      sender: 'Pooja Iyer',
      message_text: 'Noted! I will print the hardcopy draft of chapter 1 and 2.',
      message_date: '2026-09-29',
      message_time: '11:20 AM'
    },
    {
      id: 'msg_15',
      group_id: 'grp_cse_project',
      sender: 'Vikram Singh',
      message_text: 'Don\'t forget to push your code branches to main repository before midnight.',
      message_date: '2026-09-29',
      message_time: '11:45 AM'
    },

    // College Official Circulars
    {
      id: 'msg_16',
      group_id: 'grp_college_circ',
      sender: 'Exam Cell',
      message_text: 'CIRCULAR #402: Diploma final semester examination registration closes on Monday, Oct 5.',
      message_date: '2026-09-28',
      message_time: '02:00 PM'
    },
    {
      id: 'msg_17',
      group_id: 'grp_college_circ',
      sender: 'Placement Cell',
      message_text: 'Campus Drive: Infosys & TCS campus drive registration open for Diploma CSE batches.',
      message_date: '2026-09-28',
      message_time: '04:30 PM'
    },
    {
      id: 'msg_18',
      group_id: 'grp_college_circ',
      sender: 'Academic Office',
      message_text: 'Holiday announcement: College will remain closed next Wednesday on account of Gandhi Jayanti.',
      message_date: '2026-09-29',
      message_time: '01:00 PM'
    },

    // Web Dev & Cloud Computing
    {
      id: 'msg_19',
      group_id: 'grp_web_cloud',
      sender: 'Arun Mentor',
      message_text: 'Reminder: Docker containerization lab assignment submission due this Sunday at 11:59 PM.',
      message_date: '2026-09-29',
      message_time: '03:10 PM'
    },
    {
      id: 'msg_20',
      group_id: 'grp_web_cloud',
      sender: 'Alex Kumar',
      message_text: 'Is everyone able to push Docker images to the registry successfully?',
      message_date: '2026-09-29',
      message_time: '03:15 PM'
    },
    {
      id: 'msg_21',
      group_id: 'grp_web_cloud',
      sender: 'Sneha R',
      message_text: 'Yes, tag it with your roll number and push to student harbor hub.',
      message_date: '2026-09-29',
      message_time: '03:22 PM'
    },

    // Friends & Hostel
    {
      id: 'msg_22',
      group_id: 'grp_friends',
      sender: 'Rohan Verma',
      message_text: 'Who is up for cricket practice at college ground on Sunday morning at 7 AM?',
      message_date: '2026-09-29',
      message_time: '08:00 PM'
    },
    {
      id: 'msg_23',
      group_id: 'grp_friends',
      sender: 'Vikram Singh',
      message_text: 'Count me in! Also hostel mess committee meeting is tomorrow at 8:30 PM.',
      message_date: '2026-09-29',
      message_time: '08:10 PM'
    }
  ],
  summaries: [
    {
      id: 'sum_ai_ml',
      group_id: 'grp_ai_ml',
      summary: 'Today\'s discussion in the AI & ML Group focused on the final AI project submission and presentation. Prof. Sharma instructed all students to submit their project details and architecture diagram by Friday before 5:00 PM. A rehearsal meeting is scheduled for tomorrow at 2:00 PM in the AI lab, followed by the official project presentation on Saturday at 10:00 AM in Seminar Hall 2.',
      main_topics: ['AI Project Submission', 'Presentation Schedule', 'Lab Rehearsal Meeting', 'Slide Deck Preparation'],
      created_at: '2026-09-29T10:30:00Z',
      source: 'gemini'
    },
    {
      id: 'sum_cse_project',
      group_id: 'grp_cse_project',
      summary: 'The CSE Final Year Project Group reviewed progress on the WhatsApp AI Agent capstone. Dr. Kulkarni requested updated 3NF database normalization schemas. The team scheduled a synopsis review meeting with faculty on Thursday at 3:30 PM in Faculty Room 14, and agreed to push git branches before midnight.',
      main_topics: ['Database Schema Review', 'Project Synopsis Meeting', 'Git Branch Merge', 'Documentation Chapters 1 & 2'],
      created_at: '2026-09-29T12:00:00Z',
      source: 'gemini'
    }
  ],
  important_messages: [
    {
      id: 'imp_1',
      message_id: 'msg_4',
      group_id: 'grp_ai_ml',
      sender: 'Prof. Sharma (HOD CSE)',
      message_text: 'Deadline is Friday before 5:00 PM on the portal. No late submissions will be accepted.',
      category: 'Deadlines',
      priority: 'Urgent',
      explanation: 'Final AI Project details submission portal hard deadline.'
    },
    {
      id: 'imp_2',
      message_id: 'msg_6',
      group_id: 'grp_ai_ml',
      sender: 'Prof. Sharma (HOD CSE)',
      message_text: 'Presentation will be Saturday at 10 AM in Seminar Hall 2. Bring your PPT on a pendrive.',
      category: 'Meetings',
      priority: 'Urgent',
      explanation: 'Official graded presentation with external panel.'
    },
    {
      id: 'imp_3',
      message_id: 'msg_13',
      group_id: 'grp_cse_project',
      sender: 'Mentor Dr. Kulkarni',
      message_text: 'Project synopsis review meeting scheduled for Thursday at 3:30 PM in Faculty Room 14.',
      category: 'Meetings',
      priority: 'Important',
      explanation: 'Faculty guide milestone check.'
    },
    {
      id: 'imp_4',
      message_id: 'msg_16',
      group_id: 'grp_college_circ',
      sender: 'Exam Cell',
      message_text: 'CIRCULAR #402: Diploma final semester examination registration closes on Monday, Oct 5.',
      category: 'Exams',
      priority: 'Urgent',
      explanation: 'Diploma final exam registration cut-off.'
    },
    {
      id: 'imp_5',
      message_id: 'msg_19',
      group_id: 'grp_web_cloud',
      sender: 'Arun Mentor',
      message_text: 'Reminder: Docker containerization lab assignment submission due this Sunday at 11:59 PM.',
      category: 'Assignments',
      priority: 'Important',
      explanation: 'Weekly lab assignment grade evaluation.'
    },
    {
      id: 'imp_6',
      message_id: 'msg_9',
      group_id: 'grp_ai_ml',
      sender: 'Alex Kumar',
      message_text: 'Everyone upload your PPT before Friday so we can combine them.',
      category: 'Instructions',
      priority: 'Normal',
      explanation: 'Team coordination task.'
    }
  ],
  events: [
    {
      id: 'evt_1',
      group_id: 'grp_ai_ml',
      event_name: 'AI Project Presentation',
      event_date: 'Saturday (Oct 3, 2026)',
      event_time: '10:00 AM',
      description: 'Formal viva and slide deck evaluation in Seminar Hall 2.',
      location: 'Seminar Hall 2'
    },
    {
      id: 'evt_2',
      group_id: 'grp_ai_ml',
      event_name: 'Project Team Rehearsal & Dry Run',
      event_date: 'Tomorrow (Sept 30, 2026)',
      event_time: '02:00 PM',
      description: 'Group rehearsal in AI Lab before final presentation.',
      location: 'AI Laboratory, Room 204'
    },
    {
      id: 'evt_3',
      group_id: 'grp_cse_project',
      event_name: 'Project Synopsis Faculty Review',
      event_date: 'Thursday (Oct 1, 2026)',
      event_time: '03:30 PM',
      description: 'Progress evaluation with Dr. Kulkarni.',
      location: 'Faculty Room 14'
    }
  ],
  tasks: [
    {
      id: 'tsk_1',
      group_id: 'grp_ai_ml',
      task_name: 'Submit AI Project details on portal',
      deadline: 'Friday, 5:00 PM',
      status: 'pending',
      assigned_to: 'All Team Members'
    },
    {
      id: 'tsk_2',
      group_id: 'grp_ai_ml',
      task_name: 'Upload and combine PPT slides on pendrive',
      deadline: 'Friday, 8:00 PM',
      status: 'pending',
      assigned_to: 'Alex Kumar'
    },
    {
      id: 'tsk_3',
      group_id: 'grp_cse_project',
      task_name: 'Print hardcopy draft of documentation chapter 1 & 2',
      deadline: 'Thursday, 12:00 PM',
      status: 'completed',
      assigned_to: 'Pooja Iyer'
    },
    {
      id: 'tsk_4',
      group_id: 'grp_web_cloud',
      task_name: 'Complete Docker containerization lab assignment',
      deadline: 'Sunday, 11:59 PM',
      status: 'pending',
      assigned_to: 'Alex Kumar'
    }
  ],
  conversations: [
    {
      id: 'conv_1',
      user_id: 'usr_1',
      group_id: 'grp_ai_ml',
      question: 'What happened in my project group today?',
      answer: 'Today there were 10 messages in the AI & ML Group. Prof. Sharma discussed project evaluation guidelines. The key takeaway is that project details must be submitted on the portal by Friday before 5:00 PM. Additionally, your team scheduled a dry run rehearsal for tomorrow at 2:00 PM in the AI Lab, and the final presentation is on Saturday at 10:00 AM.',
      created_at: '2026-09-29T10:45:00Z'
    },
    {
      id: 'conv_2',
      user_id: 'usr_1',
      group_id: 'grp_ai_ml',
      question: 'What is the deadline?',
      answer: 'The official AI project submission deadline is Friday before 5:00 PM on the portal. Late submissions will not be accepted. Also, team members must upload individual PPT slides before Friday evening so they can be merged.',
      created_at: '2026-09-29T10:46:30Z'
    }
  ]
};

class DatabaseManager {
  private state: DatabaseState;

  constructor() {
    this.state = this.load();
  }

  private load(): DatabaseState {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (e) {
      console.error('Failed to load database file, using initial data:', e);
    }
    this.save(INITIAL_DEMO_DATA);
    return JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
  }

  private save(data: DatabaseState) {
    try {
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write database file:', e);
    }
  }

  public getState(): DatabaseState {
    return this.state;
  }

  public resetToDemo(): DatabaseState {
    this.state = JSON.parse(JSON.stringify(INITIAL_DEMO_DATA));
    this.save(this.state);
    return this.state;
  }

  public clearImportedData(): DatabaseState {
    // Keep standard user and groups, reset messages and generated items
    this.state.messages = [];
    this.state.summaries = [];
    this.state.important_messages = [];
    this.state.events = [];
    this.state.tasks = [];
    this.state.conversations = [];
    this.save(this.state);
    return this.state;
  }

  // Groups
  public getGroups(): Group[] {
    return this.state.groups;
  }

  public getGroupById(groupId: string): Group | undefined {
    return this.state.groups.find((g) => g.id === groupId);
  }

  public addGroup(name: string, category = 'Custom', description = ''): Group {
    const id = 'grp_' + Date.now().toString(36);
    const colors = [
      'from-emerald-500 to-teal-600',
      'from-blue-500 to-indigo-600',
      'from-purple-500 to-pink-600',
      'from-amber-500 to-orange-600',
      'from-cyan-500 to-blue-600'
    ];
    const newGroup: Group = {
      id,
      group_name: name,
      category,
      description,
      avatar_color: colors[Math.floor(Math.random() * colors.length)],
      created_at: new Date().toISOString()
    };
    this.state.groups.push(newGroup);
    this.save(this.state);
    return newGroup;
  }

  // Messages
  public getMessages(groupId?: string): Message[] {
    if (groupId) {
      return this.state.messages.filter((m) => m.group_id === groupId);
    }
    return this.state.messages;
  }

  public addMessages(newMessages: Omit<Message, 'id'>[]): Message[] {
    const created: Message[] = newMessages.map((m, idx) => ({
      ...m,
      id: 'msg_' + Date.now() + '_' + idx
    }));
    this.state.messages.push(...created);
    this.save(this.state);
    return created;
  }

  // Summaries
  public getSummary(groupId: string): Summary | undefined {
    return this.state.summaries.find((s) => s.group_id === groupId);
  }

  public upsertSummary(summary: Omit<Summary, 'id'>): Summary {
    const existingIdx = this.state.summaries.findIndex((s) => s.group_id === summary.group_id);
    const item: Summary = {
      ...summary,
      id: existingIdx >= 0 ? this.state.summaries[existingIdx].id : 'sum_' + Date.now().toString(36)
    };
    if (existingIdx >= 0) {
      this.state.summaries[existingIdx] = item;
    } else {
      this.state.summaries.push(item);
    }
    this.save(this.state);
    return item;
  }

  // Important Messages
  public getImportantMessages(groupId?: string): ImportantMessage[] {
    if (groupId) {
      return this.state.important_messages.filter((im) => im.group_id === groupId);
    }
    return this.state.important_messages;
  }

  public setImportantMessages(groupId: string, items: Omit<ImportantMessage, 'id'>[]) {
    // Filter out existing for this group and append new
    this.state.important_messages = this.state.important_messages.filter((im) => im.group_id !== groupId);
    const added: ImportantMessage[] = items.map((im, i) => ({
      ...im,
      id: 'imp_' + Date.now() + '_' + i
    }));
    this.state.important_messages.push(...added);
    this.save(this.state);
    return added;
  }

  // Events
  public getEvents(groupId?: string): EventItem[] {
    if (groupId) {
      return this.state.events.filter((e) => e.group_id === groupId);
    }
    return this.state.events;
  }

  public setEvents(groupId: string, items: Omit<EventItem, 'id'>[]) {
    this.state.events = this.state.events.filter((e) => e.group_id !== groupId);
    const added: EventItem[] = items.map((e, i) => ({
      ...e,
      id: 'evt_' + Date.now() + '_' + i
    }));
    this.state.events.push(...added);
    this.save(this.state);
    return added;
  }

  public addEvent(item: Omit<EventItem, 'id'>): EventItem {
    const evt: EventItem = {
      ...item,
      id: 'evt_' + Date.now().toString(36)
    };
    this.state.events.push(evt);
    this.save(this.state);
    return evt;
  }

  // Tasks
  public getTasks(groupId?: string): TaskItem[] {
    if (groupId) {
      return this.state.tasks.filter((t) => t.group_id === groupId);
    }
    return this.state.tasks;
  }

  public setTasks(groupId: string, items: Omit<TaskItem, 'id'>[]) {
    this.state.tasks = this.state.tasks.filter((t) => t.group_id !== groupId);
    const added: TaskItem[] = items.map((t, i) => ({
      ...t,
      id: 'tsk_' + Date.now() + '_' + i
    }));
    this.state.tasks.push(...added);
    this.save(this.state);
    return added;
  }

  public toggleTaskStatus(taskId: string): TaskItem | null {
    const task = this.state.tasks.find((t) => t.id === taskId);
    if (!task) return null;
    task.status = task.status === 'completed' ? 'pending' : 'completed';
    this.save(this.state);
    return task;
  }

  public addTask(item: Omit<TaskItem, 'id'>): TaskItem {
    const task: TaskItem = {
      ...item,
      id: 'tsk_' + Date.now().toString(36)
    };
    this.state.tasks.push(task);
    this.save(this.state);
    return task;
  }

  // Conversations
  public getConversations(userId = 'usr_1', groupId?: string): Conversation[] {
    return this.state.conversations.filter((c) => {
      if (c.user_id !== userId) return false;
      if (groupId && c.group_id && c.group_id !== groupId) return false;
      return true;
    });
  }

  public addConversation(conv: Omit<Conversation, 'id' | 'created_at'>): Conversation {
    const item: Conversation = {
      ...conv,
      id: 'conv_' + Date.now().toString(36),
      created_at: new Date().toISOString()
    };
    this.state.conversations.push(item);
    this.save(this.state);
    return item;
  }
}

export const db = new DatabaseManager();
