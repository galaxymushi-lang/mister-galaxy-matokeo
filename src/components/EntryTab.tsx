import React, { useState, useMemo } from 'react';
import { Student, Subject, SchoolSettings } from '../types';
import { calculateSubjectRanks, getGrade, getGradeColor } from '../utils/calculations';
import { Plus, Trash2, Edit2, Save, X, User } from 'lucide-react';

interface EntryTabProps {
  students: Student[];
  subjects: Subject[];
  settings: SchoolSettings;
  onUpdateMark: (studentId: string, subjectId: string, val: number | '') => void;
  onUpdateStudentName: (studentId: string, newName: string) => void;
  onUpdateStudentGender: (studentId: string, gender: 'ME' | 'KE' | '') => void;
  onAddStudent: (name: string, gender?: 'ME' | 'KE' | '') => void;
  onRemoveStudent: (studentId: string) => void;
}

export function EntryTab({
  students,
  subjects,
  settings,
  onUpdateMark,
  onUpdateStudentName,
  onUpdateStudentGender,
  onAddStudent,
  onRemoveStudent,
}: EntryTabProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newGender, setNewGender] = useState<'ME' | 'KE' | ''>('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  // Calculate per-subject ranks
  const subjectRanks = useMemo(() => {
    const map = new Map<string, Map<string, number>>();
    for (const sub of subjects) {
      map.set(sub.id, calculateSubjectRanks(students, sub.id));
    }
    return map;
  }, [students, subjects]);

  const handleMarkChange = (studentId: string, subjectId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '') {
      onUpdateMark(studentId, subjectId, '');
      return;
    }
    const num = parseInt(val, 10);
    if (isNaN(num) || num < 0 || num > 100) return;
    onUpdateMark(studentId, subjectId, num);
  };

  const startEdit = (st: Student) => {
    setEditingId(st.id);
    setEditName(st.name);
  };

  const saveEdit = () => {
    if (editingId && editName.trim()) {
      onUpdateStudentName(editingId, editName.trim());
    }
    setEditingId(null);
    setEditName('');
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditName('');
  };

  return (
    <div className="space-y-6">
      {/* Add Student Form */}
      <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-5 transition-all duration-300 ${showAddForm ? '' : 'hidden'}`}>
        <div className="flex items-center gap-3 mb-4">
          <Plus className="w-5 h-5 text-emerald-500" />
          <h3 className="font-bold text-slate-900">Ongeza Mwanafunzi Mpya</h3>
        </div>
        <div className="flex flex-wrap gap-3 items-end">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jina Kamili</label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
              placeholder="Mfano: JOHN DOE"
            />
          </div>
          <div className="min-w-[150px]">
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Jinsia</label>
            <select
              value={newGender}
              onChange={(e) => setNewGender(e.target.value as 'ME' | 'KE' | '')}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
            >
              <option value="">Chagua</option>
              <option value="ME">Mwanaume (ME)</option>
              <option value="KE">Mwanamke (KE)</option>
            </select>
          </div>
          <button
            onClick={() => {
              if (newName.trim()) {
                onAddStudent(newName.trim(), newGender);
                setNewName('');
                setNewGender('');
              }
            }}
            className="px-4 py-2 rounded-lg bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors text-sm flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Ongeza
          </button>
          <button
            onClick={() => setShowAddForm(false)}
            className="px-4 py-2 rounded-lg bg-slate-200 text-slate-700 hover:bg-slate-300 transition-colors text-sm"
          >
            Futa
          </button>
        </div>
      </div>

      {students.length === 0 && !showAddForm && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <User className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 mb-1">Hakuna Wanafunzi</h3>
          <p className="text-slate-400 mb-4 text-sm">Bofya chini kuongeza mwanafunzi wa kwanza</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition-colors text-sm inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            Ongeza Mwanafunzi
          </button>
        </div>
      )}

      {/* Students Table */}
      {students.length > 0 && (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2">
              <User className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-slate-900">Orodha ya Wanafunzi na Matokeo</h3>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors flex items-center gap-1.5"
            >
              <Plus className="w-3.5 h-3.5" />
              Ongeza
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                  <th className="text-left px-4 py-3 font-semibold w-10 sticky left-0 bg-slate-50 z-10">No.</th>
                  <th className="text-left px-4 py-3 font-semibold min-w-[200px] sticky left-10 bg-slate-50 z-10">Jina la Mwanafunzi</th>
                  <th className="text-center px-3 py-3 font-semibold w-20">Jinsia</th>
                  {subjects.map((sub) => (
                    <React.Fragment key={sub.id}>
                      <th className="text-center px-2 py-1 font-semibold w-16 bg-indigo-50 text-indigo-700 border-b-2 border-indigo-200" colSpan={3}>
                        {sub.name}
                      </th>
                    </React.Fragment>
                  ))}
                  <th className="text-center px-3 py-3 font-semibold w-20">Jumla</th>
                  <th className="text-center px-3 py-3 font-semibold w-20">Wastani</th>
                  <th className="text-center px-3 py-3 font-semibold w-20">Veke</th>
                </tr>
                <tr className="bg-slate-50 text-slate-500 text-[10px] uppercase tracking-wide">
                  <th className="px-4 py-1 sticky left-0 bg-slate-50 z-10"></th>
                  <th className="px-4 py-1 sticky left-10 bg-slate-50 z-10"></th>
                  <th className="px-3 py-1"></th>
                  {subjects.map((sub) => (
                    <React.Fragment key={sub.id}>
                      <th className="text-center px-1 py-1 font-semibold text-indigo-600 bg-indigo-50/50">Alama</th>
                      <th className="text-center px-1 py-1 font-semibold text-indigo-600 bg-indigo-50/50">D</th>
                      <th className="text-center px-1 py-1 font-semibold text-indigo-600 bg-indigo-50/50">N</th>
                    </React.Fragment>
                  ))}
                  <th className="px-3 py-1"></th>
                  <th className="px-3 py-1"></th>
                  <th className="px-3 py-1"></th>
                </tr>
              </thead>
              <tbody>
                {students.map((st, i) => {
                  const sum = subjects.reduce((acc, sub) => {
                    const v = st.marks[sub.id];
                    return acc + (typeof v === 'number' && !isNaN(v) ? v : 0);
                  }, 0);
                  const count = subjects.filter((sub) => typeof st.marks[sub.id] === 'number' && !isNaN(st.marks[sub.id] as number)).length;
                  const avg = count > 0 ? sum / count : 0;

                  return (
                    <tr key={st.id} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-2 text-slate-500 text-sm sticky left-0 bg-white hover:bg-slate-50 z-10">{i + 1}</td>
                      <td className="px-4 py-2 sticky left-10 bg-white hover:bg-slate-50 z-10">
                        {editingId === st.id ? (
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="flex-1 px-2 py-1.5 rounded border border-indigo-500 bg-white text-sm focus:outline-none"
                              autoFocus
                            />
                            <button onClick={saveEdit} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded transition-colors" title="Hifadhi">
                              <Save className="w-4 h-4" />
                            </button>
                            <button onClick={cancelEdit} className="p-1 text-red-500 hover:bg-red-100 rounded transition-colors" title="Futa">
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-slate-900 truncate">{st.name}</span>
                            <button
                              onClick={() => startEdit(st)}
                              className="p-1 text-slate-400 hover:text-indigo-500 hover:bg-slate-100 rounded transition-colors shrink-0"
                              title="Badilisha jina"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        )}
                      </td>
                      <td className="px-3 py-2 text-center">
                        {editingId === st.id ? (
                          <select
                            value={st.gender}
                            onChange={(e) => onUpdateStudentGender(st.id, e.target.value as 'ME' | 'KE' | '')}
                            className="px-2 py-1 text-sm border border-indigo-500 rounded bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                          >
                            <option value="">-</option>
                            <option value="ME">ME</option>
                            <option value="KE">KE</option>
                          </select>
                        ) : (
                          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                            st.gender === 'ME' ? 'bg-blue-100 text-blue-700' : st.gender === 'KE' ? 'bg-pink-100 text-pink-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {st.gender || '-'}
                          </span>
                        )}
                      </td>
                      {subjects.map((sub) => {
                        const mark = typeof st.marks[sub.id] === 'number' ? (st.marks[sub.id] as number) : null;
                        const grade = mark !== null ? getGrade(mark, settings.gradeBoundaries) : null;
                        const rank = subjectRanks.get(sub.id)?.get(st.id) ?? null;
                        return (
                          <React.Fragment key={sub.id}>
                            {/* Mark Input */}
                            <td className="px-1 py-2 text-center">
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={mark !== null ? mark : ''}
                                onChange={(e) => handleMarkChange(st.id, sub.id, e)}
                                className="w-16 mx-auto px-2 py-1.5 text-center text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              />
                            </td>
                            {/* Grade */}
                            <td className="px-1 py-2 text-center">
                              {grade && (
                                <span className={`inline-block w-7 h-7 leading-7 text-xs font-bold rounded-md ${getGradeColor(grade)}`}>
                                  {grade}
                                </span>
                              )}
                            </td>
                            {/* Rank */}
                            <td className="px-1 py-2 text-center">
                              {rank !== null && (
                                <span className="text-xs font-bold text-indigo-700">
                                  {rank % 1 !== 0 ? rank.toFixed(1) : rank}
                                </span>
                              )}
                            </td>
                          </React.Fragment>
                        );
                      })}
                      <td className="px-3 py-2 text-center font-bold text-slate-900 text-sm">
                        {sum > 0 ? sum : '-'}
                      </td>
                      <td className="px-3 py-2 text-center font-semibold text-slate-700 text-sm">
                        {count > 0 ? avg.toFixed(1) : '-'}
                      </td>
                      <td className="px-3 py-2 text-center">
                        <button
                          onClick={() => onRemoveStudent(st.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-lg transition-colors"
                          title="Futa mwanafunzi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}