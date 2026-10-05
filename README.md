# 🤖 WhatsApp AI Agent

**Final-Year Diploma in Computer Science & Engineering (CSE) Capstone Project**  
*An AI-powered communication assistant that converts flooded messaging groups into short, clear, actionable intelligence.*

> «"Instead of reading hundreds of messages, just ask your AI what happened, and it will understand, summarize, and tell you."»

---

## 1. Abstract & Problem Statement

College and project groups (AI/ML study groups, final-year capstone groups, departmental circulars) receive hundreds of messages every day. Vital updates—such as assignment submission portals, faculty reviews, exam cut-offs, presentation schedules, and tasks—are easily lost amid conversational noise.

**WhatsApp AI Agent** solves this challenge by providing:
1. **Context-Aware Summarization:** Converts 100+ raw messages into 5 high-impact bullet points and an executive summary.
2. **Urgency Classification:** Classifies notices into 🔴 Urgent, 🟠 Important, and 🟢 Normal.
3. **Deadline & Event Extraction:** Automatically tracks deadlines with remaining countdowns, plus scheduled presentations and meetings.
4. **Interactive Action Tasks:** Extracts todo items with status toggles.
5. **Strict Grounded Q&A:** Answers natural language questions based solely on authorized message data (zero hallucinations).
6. **Voice-to-Voice AI:** Speech-to-Text input with spoken audio playback via Web Speech & Gemini TTS.
7. **Privacy Compliance:** Operates only on user-authorized exports (TXT, CSV, JSON) without scraping or bypassing WhatsApp security.

---

## 2. Technology Stack

- **Frontend:** React 19, TypeScript, Tailwind CSS v4, Lucide Icons
- **Full-Stack Runtime:** Node.js, Express, `tsx` runner, Vite 8
- **AI Intelligence:** `@google/genai` TypeScript SDK with model `gemini-3.8-flash`
- **Offline Fallback Engine:** Heuristic NLP tokenizer and regular-expression pattern matcher (Demo Mode)
- **Voice Pipeline:** Web Speech API (`SpeechRecognition` & `SpeechSynthesisUtterance`)
- **Database:** SQLite 3NF Relational Schema (`database/schema.sql`)
- **Academic Reference API:** Python 3.10+ & Flask (`backend/app.py`)

---

## 3. SQLite Database Schema (3NF Normalization)

The database schema is defined in `database/schema.sql` and satisfies Third Normal Form (3NF):

| Table | Primary Key | Key Attributes |
|---|---|---|
| `users` | `id` | `name`, `email`, `password`, `role`, `avatar` |
| `groups` | `id` | `group_name`, `category`, `description`, `created_at` |
| `messages` | `id` | `group_id` (FK), `sender`, `message_text`, `message_date`, `message_time` |
| `summaries` | `id` | `group_id` (FK), `summary`, `main_topics`, `source` |
| `important_messages`| `id` | `message_id` (FK), `group_id` (FK), `category`, `priority`, `explanation` |
| `events` | `id` | `group_id` (FK), `event_name`, `event_date`, `event_time`, `location` |
| `tasks` | `id` | `group_id` (FK), `task_name`, `deadline`, `status`, `assigned_to` |
| `conversations` | `id` | `user_id` (FK), `group_id` (FK), `question`, `answer` |

---

## 4. API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service status & AI model indicator (`gemini-3.8-flash` / Demo) |
| `GET` | `/api/groups` | List monitored groups with aggregated counts |
| `POST` | `/api/groups` | Register a new custom group |
| `GET` | `/api/messages` | Retrieve messages filtered by group or keyword query |
| `POST` | `/api/messages/import` | Parse and store WhatsApp TXT, CSV, or JSON exports |
| `POST` | `/api/messages/analyze` | Run Gemini AI analysis to extract summaries, events, and tasks |
| `GET` | `/api/summary/:groupId`| Get latest generated summary for a group |
| `POST` | `/api/ai/ask` | Context-grounded Q&A strictly based on chat text |
| `GET` | `/api/important` | List urgent/important classified messages |
| `GET` | `/api/events` | List upcoming scheduled events and calendar items |
| `GET` | `/api/tasks` | Action tasks checklist |
| `PATCH`| `/api/tasks/:id/toggle`| Toggle task completion status (`pending` <-> `completed`) |
| `GET` | `/api/analytics` | Statistical distribution of messages, senders, and urgency |
| `GET` | `/api/briefing` | Cross-group executive morning briefing |
| `POST` | `/api/data/reset` | Restore pre-configured Diploma CSE demo scenario |
| `POST` | `/api/data/clear` | Permanently wipe imported message data |

---

## 5. Sample Demonstration Scenario

Preloaded in the **AI & ML Group**:
1. *Prof. Sharma (HOD CSE):* "Tomorrow we need to discuss the AI project evaluation criteria."
2. *Prof. Sharma (HOD CSE):* "Sir asked everyone to submit project details and architecture diagram."
3. *Rohan Verma:* "When is the project submission deadline, Sir?"
4. *Prof. Sharma (HOD CSE):* "Deadline is Friday before 5:00 PM on the portal. No late submissions will be accepted."
5. *Neha Patel:* "Is there a presentation also scheduled for this week?"
6. *Prof. Sharma (HOD CSE):* "Presentation will be Saturday at 10 AM in Seminar Hall 2. Bring your PPT on a pendrive."
7. *Vikram Singh:* "Should we meet before the presentation to dry run our slides?"
8. *Pooja Iyer:* "Yes! We should meet tomorrow at 2 PM in the AI lab to rehearse."
9. *Alex Kumar:* "Sounds great. Everyone upload your PPT before Friday so we can combine them."

### Automatically Extracted Results:
- **AI Summary:** "Today's discussion focused on the AI project. Students need to submit their project details by Friday. A project meeting is planned for tomorrow at 2 PM, and the presentation is scheduled for Saturday at 10 AM."
- **🚨 Urgent Highlight:** Project details submission portal hard deadline (Friday, 5:00 PM)
- **⏰ Deadline:** Friday, 5:00 PM (Portal)
- **📅 Events:**
  - Team Dry Run Rehearsal: Tomorrow (2:00 PM, AI Lab Room 204)
  - Project Presentation: Saturday (10:00 AM, Seminar Hall 2)
- **✅ Tasks:**
  - Upload & combine PPT slides before Friday (Alex Kumar)
  - Submit AI Project details on portal (All Students)

---

## 6. How to Run Locally

### Node.js / Express Environment (Port 3000):
```bash
# 1. Install dependencies
npm install

# 2. Configure environment variable (Optional for Gemini 3.8 Flash)
cp .env.example .env
# Set GEMINI_API_KEY="your-api-key" (Runs with fallback demo mode if omitted)

# 3. Start development server
npm run dev

# 4. Open in browser
http://localhost:3000
```

### Python Flask Alternative (for Viva Demonstration):
```bash
cd backend
pip install -r requirements.txt
python app.py
# Runs on http://127.0.0.1:5000
```

---

## 7. Viva Voce Cheat-Sheet for Examiners

- **Q: Does this project scrape private accounts?**  
  *A:* No. It adheres to ethical AI and privacy guidelines by only processing user-uploaded or authorized chat export files. It does not bypass WhatsApp's encryption.
- **Q: How are hallucinations prevented?**  
  *A:* Through strict prompt grounding. The model is constrained to the injected message context and instructed: *"If the information is not in the messages, explicitly reply: I couldn't find that information in the available messages."*
- **Q: What happens if there is no internet?**  
  *A:* The app includes an offline Fallback NLP Engine that parses messages using regular expressions and heuristics without relying on external API calls.
