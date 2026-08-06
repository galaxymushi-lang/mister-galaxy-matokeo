import React from 'react';
import { RankedStudent, Subject, SubjectStats } from '../types';
import { getGradeColor } from '../utils/calculations';
import {
  Trophy,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Award,
  Medal,
} from 'lucide-react';

interface DashboardTabProps {
  students: RankedStudent[];
  subjects: Subject[];
  subjectStatsList: SubjectStats[];
  overallAvg: number;
  overallPassRate: number;
}

export function DashboardTab({ students, subjects, subjectStatsList, overallAvg, overallPassRate }: DashboardTabProps) {
  const topStudents = students.slice(0, 5);
  const gradeDistribution = (() => {
    const dist: Record<string, number> = { A: 0, B: 0, C: 0, D: 0, E: 0 };
    students.forEach((st) => {
      if (dist[st.grade] !== undefined) dist[st.grade]++;
    });
    return dist;
  })();

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Wanafunzi</p>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{students.length}</p>
          <p className="text-[11px] text-slate-400 mt-1">Jumla ya wanafunzi</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Wastani</p>
            <TrendingUp className="w-5 h-5 text-cyan-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{overallAvg.toFixed(1)}</p>
          <p className="text-[11px] text-slate-400 mt-1">Wastani wa jumla</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Kiwango Kufaulu</p>
            <CheckCircle2 className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{overallPassRate.toFixed(0)}%</p>
          <p className="text-[11px] text-slate-400 mt-1">Kufaulu kwa jumla</p>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Mafanikio</p>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{gradeDistribution.A}</p>
          <p className="text-[11px] text-slate-400 mt-1">Wanafunzi waliofanya vizuri</p>
        </div>
      </div>

      {/* Top Students + Grade Distribution */}
      <div className="grid lg:grid-cols-3 gap-4">
        {/* Top 5 */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Medal className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900">Wanafunzi Bora (Top 5)</h3>
          </div>
          <div className="space-y-2">
            {topStudents.map((st, i) => (
              <div key={st.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                    ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-400' : 'bg-slate-200 text-slate-600'}`}>
                    {i + 1}
                  </span>
                  <div>
                    <p className="font-semibold text-sm text-slate-900">{st.name}</p>
                    <p className="text-[11px] text-slate-400">{st.gender || '-'}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-sm text-slate-900">{st.average.toFixed(1)}</p>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-bold ${getGradeColor(st.grade)}`}>
                    {st.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-900">Usambazaji wa Daraja</h3>
          </div>
          <div className="space-y-3">
            {(['A', 'B', 'C', 'D', 'E'] as const).map((grade) => {
              const count = gradeDistribution[grade] || 0;
              const pct = students.length > 0 ? (count / students.length) * 100 : 0;
              const colors: Record<string, string> = {
                A: 'bg-emerald-500',
                B: 'bg-green-400',
                C: 'bg-amber-400',
                D: 'bg-orange-400',
                E: 'bg-red-400',
              };
              return (
                <div key={grade}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="font-bold text-slate-700">Daraja {grade}</span>
                    <span className="text-slate-500">{count} wanafunzi ({pct.toFixed(0)}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className={`h-full rounded-full ${colors[grade]} transition-all duration-500`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Subject Stats Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-cyan-500" />
            <h3 className="font-bold text-slate-900">Uchambuzi wa Masomo</h3>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wide">
                <th className="text-left px-5 py-3 font-semibold">Somo</th>
                <th className="text-center px-4 py-3 font-semibold">Wastani</th>
                <th className="text-center px-4 py-3 font-semibold">Alama ya Juu</th>
                <th className="text-center px-4 py-3 font-semibold">Alama ya Chini</th>
                <th className="text-center px-4 py-3 font-semibold">Kufaulu</th>
                <th className="text-center px-4 py-3 font-semibold">Kiwango</th>
              </tr>
            </thead>
            <tbody>
              {subjectStatsList.map((stat) => (
                <tr key={stat.subjectId} className="border-t border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-3 font-semibold text-slate-900">{stat.subjectName}</td>
                  <td className="text-center px-4 py-3 text-slate-700">{stat.average.toFixed(1)}</td>
                  <td className="text-center px-4 py-3 text-emerald-600 font-semibold">{stat.highest}</td>
                  <td className="text-center px-4 py-3 text-red-500 font-semibold">{stat.lowest}</td>
                  <td className="text-center px-4 py-3 text-slate-700">{stat.passCount}/{stat.totalStudents}</td>
                  <td className="text-center px-4 py-3">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-20 h-2 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${stat.passRate >= 70 ? 'bg-emerald-500' : stat.passRate >= 40 ? 'bg-amber-400' : 'bg-red-400'}`}
                          style={{ width: `${stat.passRate}%` }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{stat.passRate.toFixed(0)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
              {subjectStatsList.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center px-5 py-8 text-slate-400 text-sm">
                    Hakuna masomo. Ongeza masomo kwenye mipangilio.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Low performers warning */}
      {students.some((st) => st.grade === 'E') && (
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-red-50 border border-red-200">
          <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            Kuna wanafunzi {students.filter((st) => st.grade === 'E').length} walio na daraja E. Wanahitaji msaada wa ziada.
          </p>
        </div>
      )}
    </div>
  );
}
