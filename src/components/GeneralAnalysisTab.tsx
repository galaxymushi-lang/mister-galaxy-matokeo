import React, { useMemo } from 'react';
import { Student, Subject, SchoolSettings, RankedStudent } from '../types';
import { calculateRankedStudents, getGradeColor } from '../utils/calculations';
import { BarChart3, Users, Trophy, AlertTriangle, Target, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface GeneralAnalysisTabProps {
  students: Student[];
  subjects: Subject[];
  settings: SchoolSettings;
}

export function GeneralAnalysisTab({ students, subjects, settings }: GeneralAnalysisTabProps) {
  const ranked = useMemo(() => calculateRankedStudents(students, subjects, settings.gradeBoundaries), [students, subjects, settings.gradeBoundaries]);

  // Overall stats
  const totalStudents = ranked.length;
  const overallAvg = ranked.length > 0 ? ranked.reduce((sum, s) => sum + s.average, 0) / ranked.length : 0;
  const overallPassRate = ranked.length > 0 && subjects.length > 0
    ? (ranked.reduce((sum, s) => sum + s.passedCount, 0) / (ranked.length * subjects.length)) * 100
    : 0;

  // Gender stats
  const maleStudents = ranked.filter(s => s.gender === 'ME');
  const femaleStudents = ranked.filter(s => s.gender === 'KE');
  const maleAvg = maleStudents.length > 0 ? maleStudents.reduce((sum, s) => sum + s.average, 0) / maleStudents.length : 0;
  const femaleAvg = femaleStudents.length > 0 ? femaleStudents.reduce((sum, s) => sum + s.average, 0) / femaleStudents.length : 0;

  // Top/Bottom
  const top10 = ranked.slice(0, 10);
  const bottom10 = ranked.slice(-10).reverse();

  // Grade distribution
  const gradeDist = { A: 0, B: 0, C: 0, D: 0, E: 0 };
  ranked.forEach(s => { if (gradeDist[s.grade as keyof typeof gradeDist] !== undefined) gradeDist[s.grade as keyof typeof gradeDist]++; });

  // Subject comparison
  const subjectAvgs = subjects.map(sub => {
    const vals = students.map(st => st.marks[sub.id]).filter((v): v is number => typeof v === 'number' && !isNaN(v));
    return { name: sub.name, avg: vals.length > 0 ? vals.reduce((a,b)=>a+b,0)/vals.length : 0 };
  }).sort((a,b) => b.avg - a.avg);

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Wanafunzi</p>
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{totalStudents}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Wastani</p>
            <BarChart3 className="w-5 h-5 text-cyan-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{overallAvg.toFixed(1)}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Kufaulu</p>
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{overallPassRate.toFixed(0)}%</p>
        </div>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Bora</p>
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-2xl font-extrabold text-slate-900">{gradeDist.A}</p>
        </div>
      </div>

      {/* Gender Comparison */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5 text-indigo-500" />
            <h3 className="font-bold text-slate-900">Ulinganisho wa Jinsia</h3>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-blue-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">ME</span>
                <span className="text-xs text-slate-500">{maleStudents.length} wanafunzi</span>
              </div>
              <p className="text-3xl font-extrabold text-blue-700">{maleAvg.toFixed(1)}</p>
              <p className="text-xs text-slate-500">Wastani</p>
            </div>
            <div className="p-4 rounded-xl bg-pink-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-0.5 rounded-full bg-pink-100 text-pink-700 text-xs font-bold">KE</span>
                <span className="text-xs text-slate-500">{femaleStudents.length} wanafunzi</span>
              </div>
              <p className="text-3xl font-extrabold text-pink-700">{femaleAvg.toFixed(1)}</p>
              <p className="text-xs text-slate-500">Wastani</p>
            </div>
          </div>
          <div className="mt-4 p-3 rounded-xl bg-slate-50">
            <p className="text-sm text-slate-600">
              Tofauti: <span className="font-bold text-slate-900">{Math.abs(maleAvg - femaleAvg).toFixed(1)} alama</span>
              {maleAvg > femaleAvg ? ' (Wanaume wanaongoza)' : femaleAvg > maleAvg ? ' (Wanawake wanaongoza)' : ' (Sawa)'}
            </p>
          </div>
        </div>

        {/* Grade Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-slate-900">Usambazaji wa Daraja (Jumla)</h3>
          </div>
          <div className="space-y-2">
            {(['A', 'B', 'C', 'D', 'E'] as const).map((grade) => {
              const count = gradeDist[grade];
              const pct = totalStudents > 0 ? (count / totalStudents) * 100 : 0;
              const colors: Record<string, string> = { A: 'bg-emerald-500', B: 'bg-green-400', C: 'bg-amber-400', D: 'bg-orange-400', E: 'bg-red-400' };
              return (
                <div key={grade} className="flex items-center gap-3">
                  <span className={`w-10 text-center px-2 py-1 rounded text-xs font-bold text-white ${colors[grade]}`}>{grade}</span>
                  <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${colors[grade]}`} style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-20 text-right text-sm font-semibold text-slate-700">{count} ({pct.toFixed(1)}%)</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Top/Bottom 10 */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowUpRight className="w-5 h-5 text-emerald-500" />
            <h3 className="font-bold text-slate-900">Top 10 Wanafunzi</h3>
          </div>
          <div className="space-y-2">
            {top10.map((st, i) => (
              <div key={st.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-white
                    ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : i === 2 ? 'bg-orange-400' : 'bg-slate-200 text-slate-600'}`}>
                    {i + 1}
                  </span>
                  <span className="text-sm font-medium text-slate-900">{st.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getGradeColor(st.grade)}`}>{st.grade}</span>
                  <span className="text-sm font-bold text-slate-700">{st.average.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
          <div className="flex items-center gap-2 mb-4">
            <ArrowDownRight className="w-5 h-5 text-red-500" />
            <h3 className="font-bold text-slate-900">Chini 10 Wanafunzi</h3>
          </div>
          <div className="space-y-2">
            {bottom10.map((st, i) => (
              <div key={st.id} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold text-slate-500 bg-slate-200">
                    {ranked.length - i}
                  </span>
                  <span className="text-sm font-medium text-slate-900">{st.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${getGradeColor(st.grade)}`}>{st.grade}</span>
                  <span className="text-sm font-bold text-red-600">{st.average.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Subject Performance Ranking */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
        <div className="flex items-center gap-2 mb-4">
          <BarChart3 className="w-5 h-5 text-cyan-500" />
          <h3 className="font-bold text-slate-900">Ulinganisho wa Utendaji wa Masomo</h3>
        </div>
        <div className="space-y-2">
          {subjectAvgs.map((sub, i) => (
            <div key={sub.name} className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors">
              <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white
                ${i === 0 ? 'bg-emerald-500' : i === 1 ? 'bg-cyan-500' : i === 2 ? 'bg-indigo-500' : 'bg-slate-300'}`}>
                {i + 1}
              </span>
              <div className="flex-1">
                <p className="font-semibold text-slate-900">{sub.name}</p>
                <div className="h-1.5 bg-slate-200 rounded-full overflow-hidden mt-1">
                  <div className="h-full rounded-full bg-cyan-500" style={{ width: `${Math.min(sub.avg, 100)}%` }} />
                </div>
              </div>
              <span className="text-sm font-bold text-slate-700 w-16 text-right">{sub.avg.toFixed(1)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}