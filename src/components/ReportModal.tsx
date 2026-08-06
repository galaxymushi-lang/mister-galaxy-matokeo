import React, { useMemo } from 'react';
import { SchoolSettings, Subject, Student } from '../types';
import { calculateRankedStudents, calculateSubjectStats, getGradeColor } from '../utils/calculations';
import { X, Printer } from 'lucide-react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'general' | 'subject';
  settings: SchoolSettings;
  subjects: Subject[];
  students: Student[];
  selectedSubjectIds?: string[];
}

export function ReportModal({ isOpen, onClose, type, settings, subjects, students, selectedSubjectIds }: ReportModalProps) {
  const ranked = useMemo(() => calculateRankedStudents(students, subjects, settings.gradeBoundaries), [students, subjects, settings.gradeBoundaries]);

  if (!isOpen) return null;

  const filteredSubjects = type === 'subject'
    ? subjects.filter((s) => (selectedSubjectIds && selectedSubjectIds.length > 0 ? selectedSubjectIds.includes(s.id) : true))
    : subjects;

  const title = type === 'general' ? 'Ripoti ya Matokeo ya Jumla' : `Ripoti — ${filteredSubjects.map((s) => s.name).join(', ') || 'Hakuna somo'}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div
        className="report-modal relative w-full max-w-5xl bg-white shadow-2xl flex flex-col overflow-hidden"
        style={{ height: '92vh' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Toolbar — hidden in print */}
        <div className="no-print flex items-center justify-between px-5 py-2.5 border-b border-slate-200 bg-white">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 rounded-full bg-gradient-to-b from-indigo-500 to-cyan-500" />
            <div>
              <h3 className="font-bold text-slate-900 text-sm">{title}</h3>
              <p className="text-[11px] text-slate-400">{filteredSubjects.length} somo{filteredSubjects.length !== 1 ? 'i' : ''} · {ranked.length} mwanafunzi</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              Pakua PDF
            </button>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-slate-100 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Print Area — this is what gets printed */}
        <div className="flex-1 overflow-y-auto p-8 print-area" id="report-print-area">

          {/* ─── REPORT HEADER ─── */}
          <header className="text-center mb-6">
            <div className="inline-block w-10 h-1 rounded-full bg-slate-900 mb-4" />
            <h1 className="text-xl font-bold text-slate-900 tracking-tight uppercase">{settings.schoolName}</h1>
            <p className="text-sm text-slate-500 mt-0.5 font-medium">{settings.examName}</p>
            <p className="text-xs text-slate-400 mt-1">
              {settings.className} {settings.streamName} — {settings.termName} {settings.examYear}
            </p>
            <div className="mt-3 inline-block border-t border-b border-slate-200 py-1 px-6">
              <p className="text-[11px] text-slate-400 font-medium">
                Ripoti imekuwa tarehe {new Date().toLocaleDateString('sw-TZ', { year: 'numeric', month: 'long', day: 'numeric' })}
              </p>
            </div>
          </header>

          {type === 'general' ? (
            <GeneralReportContent ranked={ranked} subjects={subjects} students={students} settings={settings} />
          ) : (
            <SubjectReportContent filteredSubjects={filteredSubjects} ranked={ranked} students={students} settings={settings} />
          )}

          {/* ─── FOOTER ─── */}
          <footer className="mt-8 pt-3 border-t border-slate-200 flex items-center justify-between">
            <p className="text-[10px] text-slate-400 italic">Mfumo wa Mister GALAXY Matokeo</p>
            <p className="text-[10px] text-slate-400">Tarehe: {new Date().toLocaleDateString('sw-TZ')}</p>
          </footer>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   GENERAL REPORT
   ───────────────────────────────────────────── */
function GeneralReportContent({ ranked, subjects, students, settings }: {
  ranked: ReturnType<typeof calculateRankedStudents>;
  subjects: Subject[];
  students: Student[];
  settings: SchoolSettings;
}) {
  const overallAvg = ranked.length > 0 ? ranked.reduce((s, st) => s + st.average, 0) / ranked.length : 0;
  const overallPassRate = ranked.length > 0 && subjects.length > 0
    ? (ranked.reduce((s, st) => s + st.passedCount, 0) / (ranked.length * subjects.length)) * 100
    : 0;

  return (
    <>
      {/* Summary Stats */}
      <div className="grid grid-cols-4 gap-2 mb-5">
        {[
          { label: 'Wanafunzi', value: String(ranked.length), color: 'text-slate-900' },
          { label: 'Masomo', value: String(subjects.length), color: 'text-slate-900' },
          { label: 'Wastani', value: overallAvg.toFixed(1), color: 'text-slate-900' },
          { label: 'Kufaulu', value: overallPassRate.toFixed(0) + '%', color: 'text-slate-900' },
        ].map((item) => (
          <div key={item.label} className="text-center py-2 px-3 border border-slate-200 rounded-lg">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{item.label}</p>
            <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
          </div>
        ))}
      </div>

      {/* Results Table */}
      <div className="mb-6">
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="text-center px-1.5 py-2 font-semibold">No.</th>
              <th className="text-left px-2 py-2 font-semibold">Jina la Mwanafunzi</th>
              <th className="text-center px-1.5 py-2 font-semibold">Jinsia</th>
              {subjects.map((sub) => (
                <th key={sub.id} className="text-center px-1.5 py-2 font-semibold">{sub.name}</th>
              ))}
              <th className="text-center px-1.5 py-2 font-semibold">Jumla</th>
              <th className="text-center px-1.5 py-2 font-semibold">Wastani</th>
              <th className="text-center px-1.5 py-2 font-semibold">Daraja</th>
              <th className="text-center px-1.5 py-2 font-semibold">Nafasi</th>
            </tr>
          </thead>
          <tbody>
            {ranked.map((st, i) => {
              const sum = subjects.reduce((acc, sub) => {
                const v = st.marks[sub.id];
                return acc + (typeof v === 'number' && !isNaN(v) ? v : 0);
              }, 0);
              return (
                <tr key={st.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="text-center px-1.5 py-1 text-slate-400">{i + 1}</td>
                  <td className="px-2 py-1 font-medium text-slate-800">{st.name}</td>
                  <td className="text-center px-1.5 py-1">
                    <span className={`font-semibold ${st.gender === 'ME' ? 'text-blue-600' : st.gender === 'KE' ? 'text-pink-600' : 'text-slate-400'}`}>
                      {st.gender || '-'}
                    </span>
                  </td>
                  {subjects.map((sub) => {
                    const val = st.marks[sub.id];
                    return (
                      <td key={sub.id} className="text-center px-1.5 py-1 font-medium">
                        {typeof val === 'number' ? (
                          <span className={val >= sub.passMark ? 'text-emerald-700' : 'text-red-600'}>{val}</span>
                        ) : '-'}
                      </td>
                    );
                  })}
                  <td className="text-center px-1.5 py-1 font-bold">{sum > 0 ? sum : '-'}</td>
                  <td className="text-center px-1.5 py-1 font-bold">{st.average.toFixed(1)}</td>
                  <td className="text-center px-1.5 py-1">
                    <span className={`font-bold ${getGradeTextClass(st.grade)}`}>{st.grade}</span>
                  </td>
                  <td className="text-center px-1.5 py-1 font-bold text-indigo-700">{st.rank}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Subject Comparison */}
      <div>
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2 pb-1 border-b border-slate-900">
          Ulinganisho wa Utendaji wa Masomo
        </h3>
        <table className="w-full text-[11px]">
          <thead>
            <tr className="bg-slate-900 text-white">
              <th className="text-center px-1.5 py-2 font-semibold">No.</th>
              <th className="text-left px-2 py-2 font-semibold">Somo</th>
              <th className="text-center px-1.5 py-2 font-semibold">Kufaulu</th>
              <th className="text-center px-1.5 py-2 font-semibold">Wastani</th>
              <th className="text-center px-1.5 py-2 font-semibold">Juu</th>
              <th className="text-center px-1.5 py-2 font-semibold">Chini</th>
              <th className="text-center px-1.5 py-2 font-semibold">Wanaofaulu</th>
              <th className="text-center px-1.5 py-2 font-semibold">Wanaoshindwa</th>
              <th className="text-center px-1.5 py-2 font-semibold">Kiwango</th>
            </tr>
          </thead>
          <tbody>
            {subjects.map((sub, idx) => {
        const stat = calculateSubjectStats(sub.id, students, subjects, settings.gradeBoundaries);
              return (
                <tr key={sub.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="text-center px-1.5 py-1 text-slate-400">{idx + 1}</td>
                  <td className="px-2 py-1 font-medium text-slate-800">{sub.name}</td>
                  <td className="text-center px-1.5 py-1">{sub.passMark}</td>
                  <td className="text-center px-1.5 py-1 font-bold">{stat.average.toFixed(1)}</td>
                  <td className="text-center px-1.5 py-1 font-semibold text-emerald-700">{stat.highest}</td>
                  <td className="text-center px-1.5 py-1 font-semibold text-red-600">{stat.lowest}</td>
                  <td className="text-center px-1.5 py-1">{stat.passCount}</td>
                  <td className="text-center px-1.5 py-1">{stat.failCount}</td>
                  <td className="text-center px-1.5 py-1 font-bold">{stat.passRate.toFixed(0)}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────
   SUBJECT REPORT
   ───────────────────────────────────────────── */
function SubjectReportContent({ filteredSubjects, ranked, students, settings }: {
  filteredSubjects: Subject[];
  ranked: ReturnType<typeof calculateRankedStudents>;
  students: Student[];
  settings: SchoolSettings;
}) {
  if (filteredSubjects.length === 0) {
    return (
      <div className="text-center py-16 text-slate-400">
        <p className="text-sm">Hakuna somo lililochaguliwa.</p>
        <p className="text-xs mt-1">Chagua somo kutoka kwenye orodha ya masomo.</p>
      </div>
    );
  }

  return (
    <>
      {filteredSubjects.map((sub, subIdx) => {
        const stat = calculateSubjectStats(sub.id, students, filteredSubjects, settings.gradeBoundaries);
        const subjectStudents = ranked
          .map((st) => ({
            ...st,
            rank: 0,
            mark: typeof st.marks[sub.id] === 'number' ? (st.marks[sub.id] as number) : null,
          }))
          .filter((st) => st.mark !== null)
          .sort((a, b) => (b.mark ?? 0) - (a.mark ?? 0));

        // Average ranking for ties
        let ri = 0;
        while (ri < subjectStudents.length) {
          let rj = ri;
          while (rj < subjectStudents.length && subjectStudents[rj].mark === subjectStudents[ri].mark) rj++;
          const avgRank = (ri + 1 + rj) / 2;
          for (let rk = ri; rk < rj; rk++) subjectStudents[rk].rank = avgRank;
          ri = rj;
        }

        return (
          <div key={sub.id} className={`subject-section ${subIdx > 0 ? 'mt-6' : ''}`}>
            {/* Subject Title Bar */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-slate-900">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide">{sub.name}</h3>
              <div className="flex items-center gap-4 text-[10px] text-slate-500">
                <span>Wastani: <strong className="text-slate-800">{stat.average.toFixed(1)}</strong></span>
                <span>Juu: <strong className="text-emerald-700">{stat.highest}</strong></span>
                <span>Chini: <strong className="text-red-600">{stat.lowest}</strong></span>
                <span>Kufaulu: <strong className="text-indigo-700">{stat.passRate.toFixed(0)}%</strong></span>
              </div>
            </div>

            {/* Results Table */}
            <table className="w-full text-[11px]">
              <thead>
                <tr className="bg-slate-900 text-white">
                  <th className="text-left px-2 py-2 font-semibold">Jina</th>
                  <th className="text-center px-1.5 py-2 font-semibold">Jinsia</th>
                  <th className="text-center px-1.5 py-2 font-semibold">Alama</th>
                  <th className="text-center px-1.5 py-2 font-semibold">Daraja</th>
                  <th className="text-center px-1.5 py-2 font-semibold">Nafasi</th>
                  <th className="text-center px-1.5 py-2 font-semibold">Matokeo</th>
                </tr>
              </thead>
              <tbody>
                {subjectStudents.map((st, i) => (
                  <tr key={st.id} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="px-2 py-1 font-medium text-slate-800">{st.name}</td>
                    <td className="text-center px-1.5 py-1">
                      <span className={`font-semibold ${st.gender === 'ME' ? 'text-blue-600' : st.gender === 'KE' ? 'text-pink-600' : 'text-slate-400'}`}>
                        {st.gender || '-'}
                      </span>
                    </td>
                    <td className="text-center px-1.5 py-1 font-bold">{st.mark}</td>
                    <td className="text-center px-1.5 py-1">
                      <span className={`font-bold ${getGradeTextClass(getMarkGrade(st.mark, settings.gradeBoundaries))}`}>
                        {getMarkGrade(st.mark, settings.gradeBoundaries)}
                      </span>
                    </td>
                    <td className="text-center px-1.5 py-1 font-bold text-indigo-700">{st.rank}</td>
                    <td className="text-center px-1.5 py-1">
                      {st.mark !== null && st.mark >= sub.passMark ? (
                        <span className="font-bold text-emerald-700">PASS</span>
                      ) : (
                        <span className="font-bold text-red-600">FAIL</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
    </>
  );
}

/* ─────────────────────────────────────────────
   HELPERS
   ───────────────────────────────────────────── */
function getGradeTextClass(grade: string): string {
  switch (grade) {
    case 'A': return 'text-emerald-700';
    case 'B': return 'text-green-700';
    case 'C': return 'text-amber-700';
    case 'D': return 'text-orange-700';
    default: return 'text-red-700';
  }
}

function getMarkGrade(mark: number | null, boundaries: { minA: number; minB: number; minC: number; minD: number }): string {
  if (mark === null) return 'E';
  if (mark >= boundaries.minA) return 'A';
  if (mark >= boundaries.minB) return 'B';
  if (mark >= boundaries.minC) return 'C';
  if (mark >= boundaries.minD) return 'D';
  return 'E';
}