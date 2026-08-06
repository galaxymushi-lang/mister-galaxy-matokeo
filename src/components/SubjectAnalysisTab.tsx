import React, { useMemo } from 'react';
import { Student, Subject, SubjectStats, SchoolSettings } from '../types';
import { calculateSubjectStats, getGradeColor } from '../utils/calculations';
import { BookOpen, Users, TrendingUp, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface SubjectAnalysisTabProps {
  subjects: Subject[];
  students: Student[];
  settings: SchoolSettings;
}

export function SubjectAnalysisTab({ subjects, students, settings }: SubjectAnalysisTabProps) {
  const statsList = useMemo(() => {
    return subjects.map((sub) => calculateSubjectStats(sub.id, students, subjects, settings.gradeBoundaries));
  }, [subjects, students, settings.gradeBoundaries]);

  return (
    <div className="space-y-6">
      {subjects.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="font-bold text-slate-700 mb-1">Hakuna Masomo</h3>
          <p className="text-slate-400 mb-4 text-sm">Ongeza masomo kwenye mipangilio ili kuona uchambuzi.</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-4">
          {subjects.map((sub) => {
            const stat = statsList.find((s) => s.subjectId === sub.id)!;
            const passRate = stat.passRate;
            const isLow = passRate < 40;
            const isMed = passRate >= 40 && passRate < 70;

            // Grade distribution for this subject
            const values = students
              .map((st) => st.marks[sub.id])
              .filter((v): v is number => typeof v === 'number' && !isNaN(v));

            const gradeDist = values.reduce((acc, v) => {
              const g = v >= settings.gradeBoundaries.minA ? 'A' :
                        v >= settings.gradeBoundaries.minB ? 'B' :
                        v >= settings.gradeBoundaries.minC ? 'C' :
                        v >= settings.gradeBoundaries.minD ? 'D' : 'E';
              acc[g] = (acc[g] || 0) + 1;
              return acc;
            }, {} as Record<string, number>);

            return (
              <div key={sub.id} className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <div>
                      <h3 className="font-bold text-slate-900">{sub.name}</h3>
                      <p className="text-xs text-slate-500">Alama ya kufaulu: {sub.passMark}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-[11px] font-bold
                    ${passRate >= 70 ? 'bg-emerald-100 text-emerald-700' : passRate >= 40 ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}`}>
                    {passRate >= 70 ? <CheckCircle2 className="w-3 h-3" /> : passRate >= 40 ? <AlertTriangle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {passRate.toFixed(0)}% Kufaulu
                  </span>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="p-3 rounded-xl bg-slate-50">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">Wastani</p>
                    <p className="text-xl font-extrabold text-slate-900">{stat.average.toFixed(1)}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-emerald-50">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">Juu</p>
                    <p className="text-xl font-extrabold text-emerald-700">{stat.highest}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-red-50">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">Chini</p>
                    <p className="text-xl font-extrabold text-red-700">{stat.lowest}</p>
                  </div>
                  <div className="p-3 rounded-xl bg-cyan-50">
                    <p className="text-[11px] text-slate-500 uppercase tracking-wide">Wanafunzi</p>
                    <p className="text-xl font-extrabold text-cyan-700">{stat.totalStudents}</p>
                  </div>
                </div>

                {/* Pass/Fail */}
                <div className="flex items-center gap-3 mb-4 p-3 rounded-xl bg-slate-50">
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-emerald-700 font-semibold">Kufaulu: {stat.passCount}</span>
                      <span className="text-red-600 font-semibold">Kushindwa: {stat.failCount}</span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-200 overflow-hidden">
                      <div className={`h-full rounded-full ${passRate >= 70 ? 'bg-emerald-500' : passRate >= 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                        style={{ width: `${passRate}%` }} />
                    </div>
                  </div>
                </div>

                {/* Grade Distribution */}
                <div>
                  <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">Usambazaji wa Daraja</p>
                  <div className="space-y-2">
                    {(['A', 'B', 'C', 'D', 'E'] as const).map((grade) => {
                      const count = gradeDist[grade] || 0;
                      const pct = values.length > 0 ? (count / values.length) * 100 : 0;
                      return (
                        <div key={grade} className="flex items-center gap-2">
                          <span className={`w-8 text-xs font-bold ${getGradeColor(grade).replace('bg-', 'bg-').replace('text-', 'text-')} px-2 py-0.5 rounded text-center`}>
                            {grade}
                          </span>
                          <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-14 text-right text-xs text-slate-500">{count} ({pct.toFixed(0)}%)</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}