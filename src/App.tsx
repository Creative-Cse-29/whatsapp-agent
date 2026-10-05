/**
 * WHATSAPP AI AGENT - React Full-Stack Application
 * Final Year Diploma Computer Science Engineering Project
 */

import React, { useState, useEffect } from 'react';
import {
  Group,
  Message,
  Summary,
  ImportantMessage,
  EventItem,
  TaskItem,
  User,
  AnalyticsData,
  HealthStatus
} from './types';
import * as api from './api';
import { Navbar, Sidebar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { DashboardOverview } from './components/DashboardOverview';
import { GroupsView } from './components/GroupsView';
import { ImportMessagesView } from './components/ImportMessagesView';
import { SummaryView } from './components/SummaryView';
import { ImportantView } from './components/ImportantView';
import { DeadlinesView } from './components/DeadlinesView';
import { EventsView } from './components/EventsView';
import { TasksView } from './components/TasksView';
import { AiChatView } from './components/AiChatView';
import { VoiceAssistantView } from './components/VoiceAssistantView';
import { AnalyticsView } from './components/AnalyticsView';
import { SearchView } from './components/SearchView';
import { SettingsView } from './components/SettingsView';
import { TechVivaView } from './components/TechVivaView';
import { PrivacyView } from './components/PrivacyView';
import { DailyBriefingModal } from './components/DailyBriefingModal';

export default function App() {
  // Navigation & View state
  const [currentTab, setCurrentTab] = useState<string>('landing');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);

  // Authenticated user state (Default demo user available)
  const [user, setUser] = useState<User | null>({
    id: 'usr_1',
    name: 'Alex Kumar',
    email: 'alex.kumar@diploma-cse.edu',
    role: 'Diploma CSE Final Year Student',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
  });

  // Application Data state
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<string>('grp_ai_ml');
  const [messages, setMessages] = useState<Message[]>([]);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [importantMessages, setImportantMessages] = useState<ImportantMessage[]>([]);
  const [events, setEvents] = useState<EventItem[]>([]);
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [dailyBriefingText, setDailyBriefingText] = useState<string>('');

  const [isLoadingSummary, setIsLoadingSummary] = useState(false);
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  // Load initial dataset
  const refreshAllData = async (groupIdToSelect?: string) => {
    try {
      const [h, grps, msgs, imps, evts, tsks, anlt, brf] = await Promise.all([
        api.fetchHealth().catch(() => null),
        api.fetchGroups().catch(() => []),
        api.fetchMessages().catch(() => []),
        api.fetchImportantMessages().catch(() => []),
        api.fetchEvents().catch(() => []),
        api.fetchTasks().catch(() => []),
        api.fetchAnalytics().catch(() => null),
        api.fetchDailyBriefing().catch(() => ({ briefing: '', generated_at: '' }))
      ]);

      if (h) setHealth(h);
      if (grps) setGroups(grps);
      if (msgs) setMessages(msgs);
      if (imps) setImportantMessages(imps);
      if (evts) setEvents(evts);
      if (tsks) setTasks(tsks);
      if (anlt) setAnalytics(anlt);
      if (brf) setDailyBriefingText(brf.briefing);

      const targetGId = groupIdToSelect || selectedGroupId || (grps[0]?.id ?? 'grp_ai_ml');
      setSelectedGroupId(targetGId);

      // Fetch summary for target group
      if (targetGId) {
        const sumData = await api.fetchSummary(targetGId).catch(() => null);
        if (sumData) setSummary(sumData.summary);
      }
    } catch (e) {
      console.error('Error refreshing data:', e);
    }
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  // Update summary when selected group changes
  useEffect(() => {
    if (selectedGroupId) {
      api.fetchSummary(selectedGroupId)
        .then((data) => {
          setSummary(data.summary);
        })
        .catch(() => {});
    }
  }, [selectedGroupId]);

  const handleSelectGroup = (groupId: string) => {
    setSelectedGroupId(groupId);
    setCurrentTab('summary');
  };

  const handleAnalyzeGroup = async (groupId: string) => {
    setIsLoadingSummary(true);
    setStatusNotification('AI is analyzing conversation context...');
    try {
      const res = await api.analyzeGroup(groupId);
      setSummary(res.summary);
      await refreshAllData(groupId);
      setStatusNotification('Analysis completed successfully!');
      setTimeout(() => setStatusNotification(null), 3000);
      setCurrentTab('summary');
    } catch (err: any) {
      setStatusNotification(err.message || 'Analysis failed');
      setTimeout(() => setStatusNotification(null), 4000);
    } finally {
      setIsLoadingSummary(false);
    }
  };

  const handleAskQuestion = async (q: string, groupId?: string) => {
    const targetGroup = groupId || (selectedGroupId !== 'all' ? selectedGroupId : undefined);
    return await api.askAiQuestion(q, targetGroup, user?.id || 'usr_1');
  };

  const handleToggleTask = async (taskId: string) => {
    try {
      await api.toggleTask(taskId);
      const updatedTasks = await api.fetchTasks();
      setTasks(updatedTasks);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCreateGroup = async (name: string, category: string, description: string) => {
    await api.createGroup(name, category, description);
    await refreshAllData();
  };

  const handleCreateEvent = async (event: Omit<EventItem, 'id'>) => {
    await api.createEvent(event);
    const updated = await api.fetchEvents();
    setEvents(updated);
  };

  const handleCreateTask = async (task: Omit<TaskItem, 'id' | 'status'>) => {
    await api.createTask(task);
    const updated = await api.fetchTasks();
    setTasks(updated);
  };

  const handleResetData = async () => {
    await api.resetDatabase();
    await refreshAllData();
  };

  const handleClearData = async () => {
    await api.clearImportedData();
    await refreshAllData();
  };

  // If viewing landing page
  if (currentTab === 'landing') {
    return (
      <>
        <LandingPage
          onGetStarted={() => {
            if (user) {
              setCurrentTab('dashboard');
            } else {
              setIsAuthModalOpen(true);
            }
          }}
          onTryDemo={() => {
            setCurrentTab('dashboard');
          }}
        />
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
          onLoginSuccess={(u) => {
            setUser(u);
            setCurrentTab('dashboard');
          }}
        />
      </>
    );
  }

  const unreadImportant = importantMessages.filter((m) => m.priority === 'Urgent').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Navbar */}
      <Navbar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        health={health}
        user={user}
        unreadCount={unreadImportant}
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenVoice={() => setCurrentTab('voice')}
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        onLogout={() => {
          setUser(null);
          setCurrentTab('landing');
        }}
        toggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobileMenuOpen={isMobileMenuOpen}
      />

      {/* Main Body with Sidebar + Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          isMobileMenuOpen={isMobileMenuOpen}
          closeMobileMenu={() => setIsMobileMenuOpen(false)}
          unreadImportant={unreadImportant}
        />

        {/* Dynamic Content Views */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
          {statusNotification && (
            <div className="mb-4 rounded-xl bg-emerald-500/20 border border-emerald-500/30 p-3 text-xs font-semibold text-emerald-300 flex items-center justify-between animate-fade-in shadow-lg">
              <span>{statusNotification}</span>
              <button
                onClick={() => setStatusNotification(null)}
                className="text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
          )}

          {currentTab === 'dashboard' && (
            <DashboardOverview
              groups={groups}
              totalMessages={messages.length}
              importantMessages={importantMessages}
              events={events}
              tasks={tasks}
              onSelectGroup={handleSelectGroup}
              onNavigate={(tab) => setCurrentTab(tab)}
              onOpenVoice={() => setCurrentTab('voice')}
              onOpenBriefing={() => setIsBriefingOpen(true)}
              onQuickAsk={(q) => {
                setCurrentTab('chat');
              }}
            />
          )}

          {currentTab === 'groups' && (
            <GroupsView
              groups={groups}
              onSelectGroup={handleSelectGroup}
              onAnalyzeGroup={handleAnalyzeGroup}
              onChatWithGroup={(gId) => {
                setSelectedGroupId(gId);
                setCurrentTab('chat');
              }}
              onCreateGroup={handleCreateGroup}
            />
          )}

          {currentTab === 'import' && (
            <ImportMessagesView
              groups={groups}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
              onImportSuccess={async () => {
                await refreshAllData(selectedGroupId);
              }}
              onAnalyzeTrigger={handleAnalyzeGroup}
            />
          )}

          {currentTab === 'summary' && (
            <SummaryView
              groups={groups}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
              summary={summary}
              importantMessages={importantMessages.filter((m) => !selectedGroupId || m.group_id === selectedGroupId)}
              events={events.filter((e) => !selectedGroupId || e.group_id === selectedGroupId)}
              tasks={tasks.filter((t) => !selectedGroupId || t.group_id === selectedGroupId)}
              isLoading={isLoadingSummary}
              onAnalyze={handleAnalyzeGroup}
              onToggleTask={handleToggleTask}
            />
          )}

          {currentTab === 'important' && (
            <ImportantView
              groups={groups}
              importantMessages={importantMessages}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
              onNavigateToDeadlines={() => setCurrentTab('deadlines')}
            />
          )}

          {currentTab === 'deadlines' && (
            <DeadlinesView
              groups={groups}
              importantMessages={importantMessages}
              onNavigateToGroup={handleSelectGroup}
            />
          )}

          {currentTab === 'events' && (
            <EventsView
              groups={groups}
              events={events}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
              onCreateEvent={handleCreateEvent}
            />
          )}

          {currentTab === 'tasks' && (
            <TasksView
              groups={groups}
              tasks={tasks}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
              onToggleTask={handleToggleTask}
              onCreateTask={handleCreateTask}
            />
          )}

          {currentTab === 'chat' && (
            <AiChatView
              groups={groups}
              selectedGroupId={selectedGroupId}
              onSelectGroup={setSelectedGroupId}
              onAskQuestion={handleAskQuestion}
            />
          )}

          {currentTab === 'voice' && (
            <VoiceAssistantView
              onAskQuestion={handleAskQuestion}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView data={analytics} />
          )}

          {currentTab === 'search' && (
            <SearchView
              groups={groups}
              allMessages={messages}
              onAskQuestion={handleAskQuestion}
            />
          )}

          {currentTab === 'tech_viva' && (
            <TechVivaView />
          )}

          {currentTab === 'privacy' && (
            <PrivacyView />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              user={user}
              onUpdateUser={setUser}
              onResetData={handleResetData}
              onClearData={handleClearData}
              darkMode={darkMode}
              setDarkMode={setDarkMode}
            />
          )}
        </main>
      </div>

      {/* Daily Briefing Popup Modal */}
      <DailyBriefingModal
        isOpen={isBriefingOpen}
        onClose={() => setIsBriefingOpen(false)}
        briefingText={dailyBriefingText || "Today's briefing ready."}
        totalMessages={messages.length}
        totalGroups={groups.length}
        urgentCount={unreadImportant}
        eventCount={events.length}
        taskCount={tasks.length}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(u) => {
          setUser(u);
          setIsAuthModalOpen(false);
          setCurrentTab('dashboard');
        }}
      />
    </div>
  );
}
