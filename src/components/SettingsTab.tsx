import React, { useState, useRef } from 'react';
import { SchoolSettings, Subject, Student } from '../types';
import {
  Plus,
  Trash2,
  Download,
  Upload,
  RotateCcw,
  AlertTriangle,
  School,
  Users,
  BookOpen,
  Lock,
  Eye,
  EyeOff,
  FileJson,
  Target,
  Eraser,
} from 'lucide-react';

interface SettingsTabProps {
  settings: SchoolSettings;
  subjects: Subject[];
  students: Student[];
  onSaveSettings: (newSettings: Partial<SchoolSettings>) => void;
  onAddSubject: (name: string, passMark: number) => void;
  onRemoveSubject: (subjectId: string) => void;
  onBackupSave: () => void;
  onExportExcel: () => void;
  onRestoreBackup: (file: File) => void;
  onResetData: () => void;
  onClearAllMarks: () => void;
}

export function SettingsTab({
  settings,
  subjects,
  students,
  onSaveSettings,
  onAddSubject,
  onRemoveSubject,
  onBackupSave,
  onExportExcel,
  onRestoreBackup,
  onResetData,
  onClearAllMarks,
}: SettingsTabProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [newSubName, setNewSubName] = useState('');
  const [newSubPassMark, setNewSubPassMark] = useState(25);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="space-y-6 max-w-3xl">
      {/* School Info */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-3 mb-5">
          <School className="w-6 h-6 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-900">Taarifa za Shule</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Jina la Shule</label>
            <input
              type="text"
              value={settings.schoolName}
              onChange={(e) => onSaveSettings({ schoolName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Jina la Mtihani</label>
            <input
              type="text"
              value={settings.examName}
              onChange={(e) => onSaveSettings({ examName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Darasa</label>
            <input
              type="text"
              value={settings.className}
              onChange={(e) => onSaveSettings({ className: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Stream/Darasa</label>
            <input
              type="text"
              value={settings.streamName}
              onChange={(e) => onSaveSettings({ streamName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Muhula</label>
            <input
              type="text"
              value={settings.termName}
              onChange={(e) => onSaveSettings({ termName: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Mwaka wa Mtihani</label>
            <input
              type="number"
              value={settings.examYear}
              onChange={(e) => onSaveSettings({ examYear: parseInt(e.target.value) || new Date().getFullYear() })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
        </div>
      </div>

      {/* Authentication */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-3 mb-5">
          <Lock className="w-6 h-6 text-cyan-500" />
          <h2 className="text-lg font-bold text-slate-900">Uthibitishaji</h2>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Jina la Mtumiaji</label>
            <input
              type="text"
              value={settings.username}
              onChange={(e) => onSaveSettings({ username: e.target.value })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            />
          </div>
          <div className="relative">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">Neno la Siri</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={settings.password}
                onChange={(e) => onSaveSettings({ password: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Grade Boundaries */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-3 mb-5">
          <Target className="w-6 h-6 text-emerald-500" />
          <h2 className="text-lg font-bold text-slate-900">Mipaka ya Daraja (Grade Boundaries)</h2>
        </div>
        <div className="grid sm:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">A (juu ya)</label>
            <input type="number" min="0" max="100" value={settings.gradeBoundaries.minA}
              onChange={(e) => onSaveSettings({ gradeBoundaries: { ...settings.gradeBoundaries, minA: parseInt(e.target.value) || 0 } })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center font-bold" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">B (juu ya)</label>
            <input type="number" min="0" max="100" value={settings.gradeBoundaries.minB}
              onChange={(e) => onSaveSettings({ gradeBoundaries: { ...settings.gradeBoundaries, minB: parseInt(e.target.value) || 0 } })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center font-bold" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">C (juu ya)</label>
            <input type="number" min="0" max="100" value={settings.gradeBoundaries.minC}
              onChange={(e) => onSaveSettings({ gradeBoundaries: { ...settings.gradeBoundaries, minC: parseInt(e.target.value) || 0 } })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center font-bold" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">D (juu ya)</label>
            <input type="number" min="0" max="100" value={settings.gradeBoundaries.minD}
              onChange={(e) => onSaveSettings({ gradeBoundaries: { ...settings.gradeBoundaries, minD: parseInt(e.target.value) || 0 } })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center font-bold" />
          </div>
          <div>
            <label className="block text-[11px] font-semibold text-slate-600 mb-1.5 uppercase tracking-wide">E (chini ya)</label>
            <input type="number" min="0" max="100" value={settings.gradeBoundaries.minE}
              onChange={(e) => onSaveSettings({ gradeBoundaries: { ...settings.gradeBoundaries, minE: parseInt(e.target.value) || 0 } })}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm text-center font-bold" />
          </div>
        </div>
      </div>

      {/* Subjects Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <BookOpen className="w-6 h-6 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900">Usimamizi wa Masomo</h2>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              placeholder="Jina la somo"
              className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-40"
            />
            <input
              type="number"
              min="0"
              max="100"
              value={newSubPassMark}
              onChange={(e) => setNewSubPassMark(parseInt(e.target.value) || 25)}
              className="px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm w-24 text-center"
            />
            <button
              onClick={() => { if (newSubName.trim()) { onAddSubject(newSubName.trim(), newSubPassMark); setNewSubName(''); }}}
              className="px-3 py-2 rounded-lg bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              Ongeza
            </button>
          </div>
        </div>
        <div className="space-y-2">
          {subjects.map((sub) => (
            <div key={sub.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-amber-500" />
                <div>
                  <p className="font-semibold text-slate-900">{sub.name}</p>
                  <p className="text-xs text-slate-500">Alama ya kufaulu: {sub.passMark} / 100</p>
                </div>
              </div>
              <button
                onClick={() => onRemoveSubject(sub.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                title="Futa somo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
          {subjects.length === 0 && (
            <p className="text-center text-slate-400 text-sm py-4">Hakuna masomo yaliyoongezwa.</p>
          )}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-3 mb-5">
          <FileJson className="w-6 h-6 text-cyan-500" />
          <h2 className="text-lg font-bold text-slate-900">Usimamizi wa Data</h2>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={onBackupSave}
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-left transition-colors flex flex-col items-start gap-2"
          >
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white shadow-sm">
              <Download className="w-5 h-5 text-emerald-500" />
            </div>
            <p className="font-semibold text-slate-900">Pakua Backup</p>
            <p className="text-xs text-slate-500">Hifadhi data yote (JSON)</p>
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 rounded-xl bg-slate-50 hover:bg-slate-100 text-left transition-colors flex flex-col items-start gap-2"
          >
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white shadow-sm">
              <Upload className="w-5 h-5 text-indigo-500" />
            </div>
            <p className="font-semibold text-slate-900">Weka Backup</p>
            <p className="text-xs text-slate-500">Rudisha data kutoka faili</p>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) onRestoreBackup(f); e.target.value = ''; }}
            className="hidden"
          />

          <button
            onClick={onExportExcel}
            className="p-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-left transition-colors flex flex-col items-start gap-2"
          >
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white shadow-sm">
              <Download className="w-5 h-5 text-emerald-600" />
            </div>
            <p className="font-semibold text-slate-900">Pakua Excel</p>
            <p className="text-xs text-slate-500">Ripoti ya matokeo (.xls)</p>
          </button>

          <button
            onClick={onClearAllMarks}
            className="p-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-left transition-colors flex flex-col items-start gap-2 border border-amber-100"
          >
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white shadow-sm">
              <Eraser className="w-5 h-5 text-amber-600" />
            </div>
            <p className="font-semibold text-amber-700">Futa Marks Zote</p>
            <p className="text-xs text-amber-600">Wanafunzi wabaki, marks zote zifutwe</p>
          </button>

          <button
            onClick={onResetData}
            className="p-4 rounded-xl bg-red-50 hover:bg-red-100 text-left transition-colors flex flex-col items-start gap-2 border border-red-100"
          >
            <div className="flex items-center gap-2 p-2 rounded-lg bg-white shadow-sm">
              <RotateCcw className="w-5 h-5 text-red-500" />
            </div>
            <p className="font-semibold text-red-700">Futa na Rudisha</p>
            <p className="text-xs text-red-500">Data za mwanzo (seed)</p>
          </button>
        </div>

        {/* Danger zone */}
        <div className="mt-5 p-4 rounded-xl bg-red-50 border border-red-100">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-red-700">Eneo hatari</h3>
          </div>
          <p className="text-sm text-red-600">
            Kufuta data kutarudisha hali ya mwanzo na kufuta matokeo yote yaliyokuwa yametengenezwa.
            <br />
            <span className="font-semibold">Hii hawezi kurudishiwa.</span>
          </p>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-3 mb-5">
          <Users className="w-6 h-6 text-indigo-500" />
          <h2 className="text-lg font-bold text-slate-900">Muhtasari wa Data</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 rounded-xl bg-slate-50">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Wanafunzi</p>
            <p className="text-2xl font-extrabold text-slate-900">{students.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-emerald-50">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Masomo</p>
            <p className="text-2xl font-extrabold text-emerald-700">{subjects.length}</p>
          </div>
          <div className="p-3 rounded-xl bg-cyan-50">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Vipengele vya Data</p>
            <p className="text-2xl font-extrabold text-cyan-700">{students.reduce((sum, s) => sum + Object.keys(s.marks).length, 0)}</p>
          </div>
          <div className="p-3 rounded-xl bg-amber-50">
            <p className="text-xs text-slate-500 uppercase tracking-wide">Mwaka</p>
            <p className="text-2xl font-extrabold text-amber-700">{settings.examYear}</p>
          </div>
        </div>
      </div>
    </div>
  );
}