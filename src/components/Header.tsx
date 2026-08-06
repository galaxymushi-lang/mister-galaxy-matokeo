import React, { useState } from 'react';
import { SchoolSettings, TabType, Subject } from '../types';
import { FileSpreadsheet, FileText, Users, BookOpen, TrendingUp, CheckCircle2, ChevronDown } from 'lucide-react';

interface HeaderProps {
  settings: SchoolSettings;
  studentCount: number;
  subjectCount: number;
  overallAvg: number;
  overallPassRate: number;
  activeTab: TabType;
  subjects: Subject[];
  onOpenReport: (type: 'general' | 'subject', subjectIds?: string[]) => void;
  onExportExcel: () => void;
}

const tabTitles: Record<TabType, string> = {
  dashboard: 'Dashibodi',
  entry: 'Kuingiza Matokeo',
  subject: 'Uchambuzi wa Somo',
  general: 'Uchambuzi wa Jumla',
  settings: 'Mipangilio',
};

export function Header({
  settings,
  studentCount,
  subjectCount,
  overallAvg,
  overallPassRate,
  activeTab,
  subjects,
  onOpenReport,
  onExportExcel,
}: HeaderProps) {
  const [showSubjectPicker, setShowSubjectPicker] = useState(false);
  const [pickedSubjects, setPickedSubjects] = useState<string[]>([]);

  const toggleSubject = (id: string) => {
    setPickedSubjects((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const handlePrintSubject = () => {
    if (pickedSubjects.length > 0) {
      onOpenReport('subject', pickedSubjects);
      setShowSubjectPicker(false);
      setPickedSubjects([]);
    }
  };

  return (
    <header className="bg-white border-b border-slate-200 px-4 sm:px-6 py-3 no-print relative">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-slate-900">{tabTitles[activeTab]}</h2>
          <p className="text-xs text-slate-500">
            {settings.schoolName} &middot; {settings.className} {settings.streamName} &middot; {settings.termName} {settings.examYear}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Quick stat chips — hidden on small screens */}
          <div className="hidden lg:flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
              <Users className="w-4 h-4 text-indigo-500" />
              <span className="text-xs font-semibold">{studentCount}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
              <BookOpen className="w-4 h-4 text-cyan-500" />
              <span className="text-xs font-semibold">{subjectCount}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-semibold">{overallAvg.toFixed(1)}</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold">{overallPassRate.toFixed(0)}%</span>
            </div>
          </div>

          {/* General Report */}
          <button
            onClick={() => onOpenReport('general')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-indigo-50 text-indigo-700 hover:bg-indigo-100 text-xs font-semibold transition-colors"
          >
            <FileText className="w-4 h-4" />
            Ripoti
          </button>

          {/* Subject Report — with picker */}
          <div className="relative">
            <button
              onClick={() => setShowSubjectPicker(!showSubjectPicker)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-50 text-cyan-700 hover:bg-cyan-100 text-xs font-semibold transition-colors"
            >
              <FileText className="w-4 h-4" />
              Ripoti Somo
              <ChevronDown className="w-3 h-3" />
            </button>

            {/* Subject Picker Dropdown */}
            {showSubjectPicker && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowSubjectPicker(false)} />
                <div className="absolute right-0 top-full mt-1 z-50 w-72 bg-white rounded-xl shadow-xl border border-slate-200 p-3">
                  <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Chagua somo la kuchapisha:</p>
                  <div className="space-y-1 mb-3">
                    {subjects.map((sub) => (
                      <label
                        key={sub.id}
                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-slate-50 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={pickedSubjects.includes(sub.id)}
                          onChange={() => toggleSubject(sub.id)}
                          className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                        />
                        <span className="text-sm font-medium text-slate-700">{sub.name}</span>
                      </label>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handlePrintSubject}
                      disabled={pickedSubjects.length === 0}
                      className="flex-1 px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                      Chapa ({pickedSubjects.length})
                    </button>
                    <button
                      onClick={() => { setPickedSubjects(subjects.map((s) => s.id)); }}
                      className="px-3 py-2 rounded-lg bg-slate-100 text-slate-600 text-xs font-semibold hover:bg-slate-200 transition-colors"
                    >
                      Zote
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Excel Export */}
          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-semibold transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
        </div>
      </div>
    </header>
  );
}