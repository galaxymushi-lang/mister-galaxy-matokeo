import React, { useState, useEffect, useMemo } from 'react';
import { SchoolSettings, Subject, Student, TabType } from './types';
import { defaultSettings, defaultSubjects, defaultStudents } from './data/seedData';
import { calculateRankedStudents, calculateSubjectStats, generateExcelWorkbook, downloadFile, parseImportedExcel } from './utils/calculations';

import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DashboardTab } from './components/DashboardTab';
import { EntryTab } from './components/EntryTab';
import { SubjectAnalysisTab } from './components/SubjectAnalysisTab';
import { GeneralAnalysisTab } from './components/GeneralAnalysisTab';
import { SettingsTab } from './components/SettingsTab';
import { ReportModal } from './components/ReportModal';
import { LoginModal } from './components/LoginModal';

const STORE_KEY = 'mister-galaxy-results-v6';
const REMEMBER_KEY = 'mister-galaxy-remember-login';

export default function App() {
  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(REMEMBER_KEY) === '1';
  });

  // Main Data States
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem(STORE_KEY);
    if (!saved) return defaultSettings;
    try {
      const parsed = JSON.parse(saved);
      const loaded = { ...defaultSettings, ...parsed.settings };
      if (loaded.schoolName === 'Mister GALAXY') {
        loaded.schoolName = 'Results Portal';
      }
      return loaded;
    } catch {
      return defaultSettings;
    }
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORE_KEY);
    if (!saved) return defaultSubjects;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed.subjects) && parsed.subjects.length > 0
        ? parsed.subjects
        : defaultSubjects;
    } catch {
      return defaultSubjects;
    }
  });

  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORE_KEY);
    if (!saved) return defaultStudents;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed.students) && parsed.students.length > 0
        ? parsed.students
        : defaultStudents;
    } catch {
      return defaultStudents;
    }
  });

  // UI Navigation States
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [toastMsg, setToastMsg] = useState<string>('');
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    try { return localStorage.getItem('galaxy-dark') === 'true'; } catch { return false; }
  });

  // Report Modal States
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [reportType, setReportType] = useState<'general' | 'subject'>('general');
  const [selectedSubjectIds, setSelectedSubjectIds] = useState<string[]>([]);

  // Persistence side-effect
  useEffect(() => {
    const dataToSave = { settings, subjects, students };
    localStorage.setItem(STORE_KEY, JSON.stringify(dataToSave));
  }, [settings, subjects, students]);

  // Dark mode effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('galaxy-dark', String(darkMode));
  }, [darkMode]);

  // Toast Helper
  const showToast = (message: string) => {
    setToastMsg(message);
    setTimeout(() => {
      setToastMsg('');
    }, 2000);
  };

  // Calculated Stats
  const rankedStudents = useMemo(() => {
    return calculateRankedStudents(students, subjects, settings.gradeBoundaries);
  }, [students, subjects, settings.gradeBoundaries]);

  const subjectStatsList = useMemo(() => {
    return subjects.map((sub) => calculateSubjectStats(sub.id, students, subjects, settings.gradeBoundaries));
  }, [students, subjects, settings.gradeBoundaries]);

  const overallAvg = useMemo(() => {
    if (rankedStudents.length === 0) return 0;
    const total = rankedStudents.reduce((sum, st) => sum + st.average, 0);
    return total / rankedStudents.length;
  }, [rankedStudents]);

  const overallPassRate = useMemo(() => {
    if (rankedStudents.length === 0 || subjects.length === 0) return 0;
    const totalPassedSubjects = rankedStudents.reduce((sum, st) => sum + st.passedCount, 0);
    const totalPossible = rankedStudents.length * subjects.length;
    return (totalPassedSubjects / totalPossible) * 100;
  }, [rankedStudents, subjects]);

  // Handler Functions
  const handleLoginSuccess = (remember: boolean) => {
    if (remember) {
      localStorage.setItem(REMEMBER_KEY, '1');
    }
    setIsLoggedIn(true);
    showToast('Karibu kwenye mfumo!');
  };

  const handleLogout = () => {
    localStorage.removeItem(REMEMBER_KEY);
    setIsLoggedIn(false);
  };

  // Undo state
  const [undoStack, setUndoStack] = useState<{ studentId: string; subjectId: string; oldVal: number | '' }[]>([]);

  const handleUpdateMark = (studentId: string, subjectId: string, val: number | '') => {
    setStudents((prev) => {
      const oldStudent = prev.find((st) => st.id === studentId);
      const oldVal = oldStudent?.marks[subjectId] ?? '';
      if (oldVal !== val) {
        setUndoStack((stack) => [...stack.slice(-19), { studentId, subjectId, oldVal }]);
      }
      return prev.map((st) => {
        if (st.id === studentId) {
          return {
            ...st,
            marks: {
              ...st.marks,
              [subjectId]: val,
            },
          };
        }
        return st;
      });
    });
  };

  const handleUndo = () => {
    if (undoStack.length === 0) return;
    const last = undoStack[undoStack.length - 1];
    setUndoStack((s) => s.slice(0, -1));
    setStudents((prev) =>
      prev.map((st) => {
        if (st.id === last.studentId) {
          return { ...st, marks: { ...st.marks, [last.subjectId]: last.oldVal } };
        }
        return st;
      })
    );
    showToast('Umefuta hatua ya mwisho');
  };

  const handleUpdateStudentName = (studentId: string, newName: string) => {
    setStudents((prev) =>
      prev.map((st) => (st.id === studentId ? { ...st, name: newName } : st))
    );
    showToast('Jina la mwanafunzi limehifadhiwa');
  };

  const handleUpdateStudentGender = (studentId: string, gender: 'ME' | 'KE' | '') => {
    setStudents((prev) =>
      prev.map((st) => (st.id === studentId ? { ...st, gender } : st))
    );
  };

  const handleAddStudent = (name: string, gender?: 'ME' | 'KE' | '') => {
    const newStudent: Student = {
      id: `st-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      name,
      gender: gender || '',
      marks: {},
    };
    setStudents((prev) => [newStudent, ...prev]);
    showToast('Mwanafunzi mpya ameongezwa!');
  };

  const handleRemoveStudent = (studentId: string) => {
    setStudents((prev) => prev.filter((st) => st.id !== studentId));
    showToast('Mwanafunzi amefutwa');
  };

  const handleSaveSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
    showToast('Settings zimehifadhiwa!');
  };

  const handleAddSubject = (name: string, passMark: number) => {
    const newSub: Subject = {
      id: `sub-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      name,
      passMark,
    };
    setSubjects((prev) => [...prev, newSub]);
    showToast('Somo jipya limeongezwa!');
  };

  const handleRemoveSubject = (subjectId: string) => {
    setSubjects((prev) => prev.filter((s) => s.id !== subjectId));
    setStudents((prev) =>
      prev.map((st) => {
        const nextMarks = { ...st.marks };
        delete nextMarks[subjectId];
        return { ...st, marks: nextMarks };
      })
    );
    showToast('Somo limefutwa!');
  };

  const handleExportExcel = () => {
    const xmlContent = generateExcelWorkbook(settings, subjects, students);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadFile(`matokeo-${settings.schoolName.toLowerCase().replace(/\s+/g, '-')}-${dateStr}.xls`, xmlContent, 'application/vnd.ms-excel;charset=utf-8');
    showToast('Excel report imepakuliwa!');
  };

  const handleBackupSave = () => {
    const backupData = {
      app: 'Mister GALAXY Matokeo',
      savedAt: new Date().toISOString(),
      data: { settings, subjects, students },
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);
    downloadFile(`backup-matokeo-${dateStr}.json`, jsonStr, 'application/json');
    showToast('Backup ya data imehifadhiwa!');
  };

  const handleRestoreBackup = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string);
        const data = parsed.data || parsed;
        if (data.settings && Array.isArray(data.subjects) && Array.isArray(data.students)) {
          setSettings({ ...defaultSettings, ...data.settings });
          setSubjects(data.subjects);
          setStudents(data.students);
          showToast('Backup imerudishwa kikamilifu!');
        } else {
          showToast('Faili si la backup sahihi.');
        }
      } catch {
        showToast('Hitilafu katika kusoma faili la backup.');
      }
    };
    reader.readAsText(file);
  };

  const handleResetData = () => {
    setSettings(defaultSettings);
    setSubjects(defaultSubjects);
    setStudents(defaultStudents);
    showToast('Data za seed zimerudishwa!');
  };

  const handleClearAllMarks = () => {
    setStudents((prev) =>
      prev.map((st) => ({ ...st, marks: {} }))
    );
    showToast('Marks zote zimefutwa! Wanafunzi wamebaki.');
  };

  const handleImportExcel = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const html = e.target?.result as string;
        const { students: imported } = parseImportedExcel(html, subjects);
        if (imported.length === 0) {
          showToast('Hakuna data iliyopatikana kwenye faili.');
          return;
        }
        const newStudents: Student[] = imported.map((imp, i) => ({
          id: `imp-${Date.now()}-${i}`,
          name: imp.name,
          gender: imp.gender,
          marks: imp.marks,
        }));
        setStudents((prev) => [...prev, ...newStudents]);
        showToast(`Imeongeza wanafunzi ${newStudents.length} kutoka Excel!`);
      } catch {
        showToast('Hitilafu katika kusoma faili la Excel.');
      }
    };
    reader.readAsText(file);
  };

  const handleOpenReport = (type: 'general' | 'subject', subjectIds?: string[]) => {
    setReportType(type);
    setSelectedSubjectIds(subjectIds || []);
    setIsReportOpen(true);
  };

  // Render Login if not authenticated
  if (!isLoggedIn) {
    return (
      <LoginModal
        settings={settings}
        onLoginSuccess={handleLoginSuccess}
      />
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row text-slate-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onLogout={handleLogout}
        studentCount={students.length}
        darkMode={darkMode}
        onToggleDark={() => setDarkMode(!darkMode)}
      />

      {/* Main Content Workspace */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          settings={settings}
          studentCount={students.length}
          subjectCount={subjects.length}
          overallAvg={overallAvg}
          overallPassRate={overallPassRate}
          activeTab={activeTab}
          subjects={subjects}
          onOpenReport={handleOpenReport}
          onExportExcel={handleExportExcel}
          onUndo={handleUndo}
          canUndo={undoStack.length > 0}
        />

        <main className="p-4 sm:p-6 flex-1 max-w-7xl w-full mx-auto">
          {activeTab === 'dashboard' && (
            <DashboardTab
              students={rankedStudents}
              subjects={subjects}
              subjectStatsList={subjectStatsList}
              overallAvg={overallAvg}
              overallPassRate={overallPassRate}
            />
          )}

          {activeTab === 'entry' && (
            <EntryTab
              students={students}
              subjects={subjects}
              settings={settings}
              onUpdateMark={handleUpdateMark}
              onUpdateStudentName={handleUpdateStudentName}
              onUpdateStudentGender={handleUpdateStudentGender}
              onAddStudent={handleAddStudent}
              onRemoveStudent={handleRemoveStudent}
              onImportExcel={handleImportExcel}
            />
          )}

          {activeTab === 'subject' && (
            <SubjectAnalysisTab
              subjects={subjects}
              students={students}
              settings={settings}
            />
          )}

          {activeTab === 'general' && (
            <GeneralAnalysisTab
              students={students}
              subjects={subjects}
              settings={settings}
            />
          )}

          {activeTab === 'settings' && (
            <SettingsTab
              settings={settings}
              subjects={subjects}
              students={students}
              onSaveSettings={handleSaveSettings}
              onAddSubject={handleAddSubject}
              onRemoveSubject={handleRemoveSubject}
              onBackupSave={handleBackupSave}
              onExportExcel={handleExportExcel}
              onRestoreBackup={handleRestoreBackup}
              onResetData={handleResetData}
              onClearAllMarks={handleClearAllMarks}
            />
          )}
        </main>
      </div>

      {/* Report PDF Print Preview Modal */}
      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        type={reportType}
        settings={settings}
        subjects={subjects}
        students={students}
        selectedSubjectIds={selectedSubjectIds}
      />

      {/* Floating Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-xl border border-slate-700 animate-bounce">
          {toastMsg}
        </div>
      )}
    </div>
  );
}
