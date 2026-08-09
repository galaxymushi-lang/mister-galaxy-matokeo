import React from 'react';
import { TabType } from '../types';
import {
  School,
  LayoutDashboard,
  ClipboardEdit,
  BookOpen,
  BarChart3,
  Settings,
  LogOut,
  Users,
  Moon,
  Sun,
} from 'lucide-react';

interface SidebarProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  onLogout: () => void;
  studentCount: number;
  darkMode: boolean;
  onToggleDark: () => void;
}

const tabs: { key: TabType; label: string; icon: React.ReactNode }[] = [
  { key: 'dashboard', label: 'Dashibodi', icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: 'entry', label: 'Kuingiza Matokeo', icon: <ClipboardEdit className="w-5 h-5" /> },
  { key: 'subject', label: 'Uchambuzi wa Somo', icon: <BookOpen className="w-5 h-5" /> },
  { key: 'general', label: 'Uchambuzi wa Jumla', icon: <BarChart3 className="w-5 h-5" /> },
  { key: 'settings', label: 'Mipangilio', icon: <Settings className="w-5 h-5" /> },
];

export function Sidebar({ activeTab, onTabChange, onLogout, studentCount, darkMode, onToggleDark }: SidebarProps) {
  return (
    <aside className="w-full md:w-64 bg-slate-900 text-white flex md:flex-col shrink-0 md:min-h-screen">
      {/* Brand */}
      <div className="flex items-center gap-3 px-5 py-4 md:py-6 border-b border-slate-800">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-400 flex items-center justify-center shrink-0">
          <School className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold leading-tight text-sm">Mister GALAXY</h1>
          <p className="text-[11px] text-slate-400">Matokeo Portal</p>
        </div>
        {/* Mobile: dark mode + logout in brand bar */}
        <div className="md:hidden flex items-center gap-2 ml-auto">
          <button
            onClick={onToggleDark}
            className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
            title={darkMode ? 'Mwanga' : 'Giza'}
          >
            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-400" />}
          </button>
          <button
            onClick={onLogout}
            className="p-2 rounded-lg hover:bg-slate-800 text-red-400 transition-colors"
            title="Toka"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex md:flex-col flex-1 gap-1 px-2 md:px-3 md:py-4 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`flex items-center gap-2 px-3 py-3 rounded-xl text-sm font-medium transition-all whitespace-nowrap shrink-0 min-h-[44px]
              ${activeTab === tab.key
                ? 'bg-gradient-to-r from-indigo-600 to-cyan-500 text-white shadow-lg'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'}`}
          >
            {tab.icon}
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden text-xs">{tab.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>

      {/* Footer - desktop only */}
      <div className="px-3 py-4 border-t border-slate-800 hidden md:block">
        <button
          onClick={onToggleDark}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors mb-2"
        >
          {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
          {darkMode ? 'Mwanga' : 'Giza'}
        </button>

        <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-800/60 mb-3">
          <Users className="w-4 h-4 text-cyan-400" />
          <div>
            <p className="text-xs text-slate-400">Wanafunzi</p>
            <p className="font-bold text-sm">{studentCount}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 text-red-400 hover:bg-red-600 hover:text-white transition-colors text-sm font-medium"
        >
          <LogOut className="w-4 h-4" />
          Toka
        </button>
      </div>
    </aside>
  );
}
