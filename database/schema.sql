-- ==========================================================
-- DIPLOMA COMPUTER SCIENCE ENGINEERING (FINAL YEAR PROJECT)
-- Project: WHATSAPP AI AGENT
-- Database: SQLite Schema Specification
-- Normalization: 3NF Compliant
-- ==========================================================

PRAGMA foreign_keys = ON;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    avatar TEXT,
    role TEXT DEFAULT 'Student',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Groups Table
CREATE TABLE IF NOT EXISTS groups (
    id TEXT PRIMARY KEY,
    group_name TEXT NOT NULL,
    category TEXT DEFAULT 'Academic',
    description TEXT,
    avatar_color TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 3. Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    sender TEXT NOT NULL,
    message_text TEXT NOT NULL,
    message_date TEXT NOT NULL,
    message_time TEXT NOT NULL,
    raw_timestamp INTEGER,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- Index for fast lookup by group and date
CREATE INDEX IF NOT EXISTS idx_messages_group_date ON messages(group_id, message_date);

-- 4. Summaries Table
CREATE TABLE IF NOT EXISTS summaries (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    summary TEXT NOT NULL,
    main_topics TEXT, -- Stored as JSON string or comma-separated list
    source TEXT DEFAULT 'gemini',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- 5. Important Messages Table
CREATE TABLE IF NOT EXISTS important_messages (
    id TEXT PRIMARY KEY,
    message_id TEXT NOT NULL,
    group_id TEXT NOT NULL,
    sender TEXT,
    message_text TEXT NOT NULL,
    category TEXT CHECK(category IN ('Deadlines', 'Exams', 'Assignments', 'Meetings', 'Project', 'Announcements', 'Instructions')),
    priority TEXT CHECK(priority IN ('Urgent', 'Important', 'Normal')),
    explanation TEXT,
    FOREIGN KEY (message_id) REFERENCES messages(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- 6. Events Table
CREATE TABLE IF NOT EXISTS events (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    event_name TEXT NOT NULL,
    event_date TEXT NOT NULL,
    event_time TEXT NOT NULL,
    description TEXT,
    location TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- 7. Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    group_id TEXT NOT NULL,
    task_name TEXT NOT NULL,
    deadline TEXT NOT NULL,
    status TEXT CHECK(status IN ('pending', 'completed')) DEFAULT 'pending',
    assigned_to TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE CASCADE
);

-- 8. Conversations Table (Q&A history with WhatsApp AI Agent)
CREATE TABLE IF NOT EXISTS conversations (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    group_id TEXT,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (group_id) REFERENCES groups(id) ON DELETE SET NULL
);
