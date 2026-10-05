import React, { useState } from 'react';
import {
  Bot,
  LayoutDashboard,
  Users,
  Brain,
  AlertTriangle,
  Calendar,
  CheckSquare,
  Search,
  Mic,
  BarChart3,
  Settings,
  ShieldCheck,
  GraduationCap,
  Bell,
  Sun,
  Moon,
  Sparkles,
  Menu,
  X,
  Volume2
} from 'lucide-react';
import { HealthStatus, User } from '../types';

interface NavbarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  health: HealthStatus | null;
  user: User | null;
  unreadCount: number;
  onOpenBriefing: () => void;
  onOpenVoice: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  onLogout: () => void;
  toggleMobileMenu: () => void;
  isMobileMenuOpen: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  health,
  user,
  unreadCount,
  onOpenBriefing,
  onOpenVoice,
  darkMode,
  setDarkMode,
  onLogout,
  toggleMobileMenu,
  isMobileMenuOpen
}) => {
  const [showNotifMenu, setShowNotifMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        {/* Left: Mobile Toggle & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMobileMenu}
            className="md:hidden rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white"
            aria-label="Toggle Navigation"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <button
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2.5 text-left group"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-600 via-emerald-500 to-teal-400 text-slate-950 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
              <Bot className="h-6 w-6 stroke-[2.2]" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                  WhatsApp AI Agent
                </span>
                <span className="hidden sm:inline-flex items-center rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-medium text-emerald-400 border border-emerald-500/20">
                  CSE Capstone
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-400">
                Personal AI Communication Assistant
              </p>
            </div>
          </button>
        </div>

        {/* Center: AI Engine Status Badge */}
        <div className="hidden lg:flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900/60 px-3 py-1 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-slate-400">Engine:</span>
          {health?.hasGeminiKey ? (
            <span className="font-medium text-emerald-400 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Gemini 3.8 Flash (Active)
            </span>
          ) : (
            <span className="font-medium text-amber-300 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              Demo AI Mode (Offline Heuristics)
            </span>
          )}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Voice Assistant button */}
          <button
            onClick={onOpenVoice}
            className="flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-500/20 transition-all shadow-sm shadow-emerald-500/10"
            title="Open Voice AI Assistant"
          >
            <Mic className="h-4 w-4 animate-pulse" />
            <span className="hidden sm:inline">Voice AI</span>
          </button>

          {/* Daily Briefing trigger */}
          <button
            onClick={onOpenBriefing}
            className="hidden sm:flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900/80 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            title="View Morning AI Briefing"
          >
            <Volume2 className="h-3.5 w-3.5 text-amber-400" />
            <span>AI Briefing</span>
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative rounded-lg p-2 text-slate-400 hover:bg-slate-900 hover:text-white transition-colors"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-800 bg-slate-900/95 p-3 shadow-2xl backdrop-blur-xl z-50">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-semibold text-white">Detected Alerts</span>
                  <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-medium text-rose-300">
                    {unreadCount} Pending
                  </span>
                </div>
                <div className="mt-2 space-y-2 max-h-60 overflow-y-auto">
                  <div
                    onClick={() => {
                      setCurrentTab('deadlines');
                      setShowNotifMenu(false);
                    }}
                    className="cursor-pointer rounded-lg border border-rose-500/20 bg-rose-950/20 p-2 text-xs hover:border-rose-500/40 transition-colors"
                  >
                    <p className="font-semibold text-rose-300">🚨 Deadline Alert</p>
                    <p className="text-slate-300 mt-0.5">AI Project details submission portal closes Friday 5:00 PM</p>
                  </div>
                  <div
                    onClick={() => {
                      setCurrentTab('events');
                      setShowNotifMenu(false);
                    }}
                    className="cursor-pointer rounded-lg border border-amber-500/20 bg-amber-950/20 p-2 text-xs hover:border-amber-500/40 transition-colors"
                  >
                    <p className="font-semibold text-amber-300">📅 Presentation Scheduled</p>
                    <p className="text-slate-300 mt-0.5">Saturday 10:00 AM in Seminar Hall 2</p>
                  </div>
                  <div
                    onClick={() => {
                      setCurrentTab('events');
                      setShowNotifMenu(false);
                    }}
                    className="cursor-pointer rounded-lg border border-emerald-500/20 bg-emerald-950/20 p-2 text-xs hover:border-emerald-500/40 transition-colors"
                  >
                    <p className="font-semibold text-emerald-300">👥 Rehearsal Meeting</p>
                    <p className="text-slate-300 mt-0.5">Tomorrow at 2:00 PM in AI Lab</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setCurrentTab('important');
                    setShowNotifMenu(false);
                  }}
                  className="mt-2 w-full rounded-lg bg-slate-800/80 py-1.5 text-center text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white"
                >
                  View All Important Messages
                </button>
              </div>
            )}
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
            <div
              onClick={() => setCurrentTab('settings')}
              className="cursor-pointer flex items-center gap-2"
              title="Profile & Settings"
            >
              <img
                src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                alt={user?.name || 'User'}
                className="h-8 w-8 rounded-full object-cover ring-2 ring-emerald-500/40"
              />
              <div className="hidden xl:block text-left text-xs">
                <p className="font-medium text-white leading-none">{user?.name || 'Alex Kumar'}</p>
                <p className="text-[10px] text-slate-400 mt-0.5">Diploma CSE</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  isMobileMenuOpen: boolean;
  closeMobileMenu: () => void;
  unreadImportant: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  setCurrentTab,
  isMobileMenuOpen,
  closeMobileMenu,
  unreadImportant
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'groups', label: 'My Groups', icon: Users },
    { id: 'summary', label: 'AI Summary', icon: Brain },
    { id: 'important', label: 'Important', icon: AlertTriangle, badge: unreadImportant },
    { id: 'deadlines', label: 'Deadlines', icon: AlertTriangle, isSecondary: true },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'tasks', label: 'Tasks', icon: CheckSquare },
    { id: 'chat', label: 'AI Assistant', icon: Bot, isHighlight: true },
    { id: 'voice', label: 'Voice AI Mode', icon: Mic, isVoice: true },
    { id: 'search', label: 'Search & QA', icon: Search },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'tech_viva', label: 'Viva & Tech Guide', icon: GraduationCap },
    { id: 'privacy', label: 'Privacy & Scope', icon: ShieldCheck },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const handleSelect = (id: string) => {
    setCurrentTab(id);
    closeMobileMenu();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          onClick={closeMobileMenu}
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm md:hidden"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed md:sticky top-0 md:top-16 z-40 flex h-full md:h-[calc(100vh-4rem)] w-64 flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur-md p-4 transition-transform duration-200 ease-in-out md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
          <div className="px-3 pb-2 pt-1 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
            Assistant Navigation
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleSelect(item.id)}
                className={`group flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                    : item.isHighlight
                    ? 'text-teal-300 hover:bg-slate-900 border border-teal-500/20'
                    : item.isVoice
                    ? 'text-emerald-400 hover:bg-emerald-950/30'
                    : 'text-slate-300 hover:bg-slate-900/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive
                        ? 'text-emerald-400'
                        : item.isVoice
                        ? 'text-emerald-400 animate-pulse'
                        : 'text-slate-400 group-hover:text-slate-200'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>

                {item.badge && item.badge > 0 ? (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500/20 text-[10px] font-bold text-rose-300 border border-rose-500/30">
                    {item.badge}
                  </span>
                ) : null}

                {item.isVoice && (
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold text-emerald-300 uppercase tracking-wider">
                    Live
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Card for Viva Student Project */}
        <div className="mt-auto pt-3 border-t border-slate-800/80">
          <div
            onClick={() => handleSelect('tech_viva')}
            className="cursor-pointer rounded-xl border border-slate-800 bg-slate-900/60 p-3 hover:border-emerald-500/40 transition-colors"
          >
            <div className="flex items-center gap-2">
              <GraduationCap className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold text-white">Diploma CSE Viva Mode</span>
            </div>
            <p className="mt-1 text-[11px] text-slate-400 leading-relaxed">
              3NF SQLite schema, Python Flask API & Viva questions ready.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
