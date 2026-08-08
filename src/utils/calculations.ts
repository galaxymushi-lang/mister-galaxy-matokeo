import { Student, RankedStudent, Subject, SubjectStats, SchoolSettings, GradeBoundaries } from '../types';

// ========================================
// Grade calculation helpers
// ========================================

export function getGrade(avg: number, boundaries: GradeBoundaries): string {
  if (avg >= boundaries.minA) return 'A';
  if (avg >= boundaries.minB) return 'B';
  if (avg >= boundaries.minC) return 'C';
  if (avg >= boundaries.minD) return 'D';
  return 'E';
}

export function getGradeColor(grade: string): string {
  switch (grade) {
    case 'A':
      return 'bg-emerald-100 text-emerald-700';
    case 'B':
      return 'bg-green-100 text-green-700';
    case 'C':
      return 'bg-amber-100 text-amber-700';
    case 'D':
      return 'bg-orange-100 text-orange-700';
    default:
      return 'bg-red-100 text-red-700';
  }
}

export function calculateAverage(marks: Record<string, number | ''>, subjects: Subject[]): number {
  const values = subjects
    .map((s) => marks[s.id])
    .filter((v): v is number => typeof v === 'number' && !isNaN(v));
  if (values.length === 0) return 0;
  return values.reduce((sum, v) => sum + v, 0) / values.length;
}

export function countPassed(marks: Record<string, number | ''>, subjects: Subject[]): number {
  let count = 0;
  for (const sub of subjects) {
    const val = marks[sub.id];
    if (typeof val === 'number' && val >= sub.passMark) count++;
  }
  return count;
}

export function calculateRankedStudents(
  students: Student[],
  subjects: Subject[],
  boundaries: GradeBoundaries
): RankedStudent[] {
  const ranked = students
    .map((st) => {
      const average = calculateAverage(st.marks, subjects);
      const passedCount = countPassed(st.marks, subjects);
      const grade = getGrade(average, boundaries);
      return { ...st, average, grade, passedCount, rank: 0 };
    })
    .sort((a, b) => {
      if (b.average !== a.average) return b.average - a.average;
      return b.passedCount - a.passedCount;
    });

  // Assign ranks (average ranking for ties: 1,1.5,3)
  let i = 0;
  while (i < ranked.length) {
    let j = i;
    while (j < ranked.length && ranked[j].average === ranked[i].average) j++;
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) ranked[k].rank = avgRank;
    i = j;
  }

  return ranked;
}

export function calculateSubjectStats(
  subjectId: string,
  students: Student[],
  subjects: Subject[],
  boundaries: GradeBoundaries
): SubjectStats {
  const subject = subjects.find((s) => s.id === subjectId);
  const name = subject?.name || subjectId;
  const passMark = subject?.passMark || 0;

  const values = students
    .map((st) => st.marks[subjectId])
    .filter((v): v is number => typeof v === 'number' && !isNaN(v));

  const totalStudents = values.length;
  if (totalStudents === 0) {
    return {
      subjectId,
      subjectName: name,
      passMark,
      average: 0,
      highest: 0,
      lowest: 0,
      passCount: 0,
      failCount: 0,
      totalStudents: 0,
      passRate: 0,
    };
  }

  const sum = values.reduce((a, b) => a + b, 0);
  const average = sum / totalStudents;
  const highest = Math.max(...values);
  const lowest = Math.min(...values);
  const passCount = values.filter((v) => v >= passMark).length;
  const failCount = totalStudents - passCount;
  const passRate = (passCount / totalStudents) * 100;

  return {
    subjectId,
    subjectName: name,
    passMark,
    average,
    highest,
    lowest,
    passCount,
    failCount,
    totalStudents,
    passRate,
  };
}

// ========================================
// Per-subject ranking (for EntryTab live display)
// ========================================

export function calculateSubjectRanks(
  students: Student[],
  subjectId: string
): Map<string, number> {
  const ranks = new Map<string, number>();
  const withMark = students
    .map((st) => ({ id: st.id, mark: typeof st.marks[subjectId] === 'number' ? (st.marks[subjectId] as number) : null }))
    .filter((s) => s.mark !== null)
    .sort((a, b) => (b.mark ?? 0) - (a.mark ?? 0));

  let i = 0;
  while (i < withMark.length) {
    let j = i;
    while (j < withMark.length && withMark[j].mark === withMark[i].mark) j++;
    const avgRank = (i + 1 + j) / 2;
    for (let k = i; k < j; k++) ranks.set(withMark[k].id, avgRank);
    i = j;
  }
  return ranks;
}

// ========================================
// Excel export (SpreadsheetML / HTML table .xls)
// ========================================

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function htmlCell(value: string | number, opts: { bold?: boolean; align?: 'center' | 'left' } = {}): string {
  const style = [
    opts.bold ? 'font-weight:bold;' : '',
    opts.align === 'center' ? 'text-align:center;' : 'text-align:left;',
    'border:1px solid #000000;padding:4px 8px;',
  ].join('');
  return `<td style="${style}">${escapeXml(String(value))}</td>`;
}

export function generateExcelWorkbook(
  settings: SchoolSettings,
  subjects: Subject[],
  students: Student[]
): string {
  const ranked = calculateRankedStudents(students, subjects, settings.gradeBoundaries);
  const title = `${settings.schoolName} - ${settings.examName}`;
  const subtitle = `${settings.className} ${settings.streamName} - ${settings.termName} ${settings.examYear}`;

  let rows = '';

  // Header row
  rows += '<tr>';
  rows += htmlCell('No.', { bold: true, align: 'center' });
  rows += htmlCell('Jina la Mwanafunzi', { bold: true });
  rows += htmlCell('Jinsia', { bold: true, align: 'center' });
  for (const sub of subjects) {
    rows += htmlCell(sub.name, { bold: true, align: 'center' });
  }
  rows += htmlCell('Jumla', { bold: true, align: 'center' });
  rows += htmlCell('Wastani', { bold: true, align: 'center' });
  rows += htmlCell('Daraja', { bold: true, align: 'center' });
  rows += htmlCell('Nafasi', { bold: true, align: 'center' });
  rows += '</tr>';

  // Data rows
  ranked.forEach((st, i) => {
    const sum = subjects.reduce((acc, sub) => {
      const v = st.marks[sub.id];
      return acc + (typeof v === 'number' && !isNaN(v) ? v : 0);
    }, 0);

    rows += '<tr>';
    rows += htmlCell(i + 1, { align: 'center' });
    rows += htmlCell(st.name);
    rows += htmlCell(st.gender || '-', { align: 'center' });
    for (const sub of subjects) {
      const v = st.marks[sub.id];
      rows += htmlCell(typeof v === 'number' && !isNaN(v) ? v : '-', { align: 'center' });
    }
    rows += htmlCell(Math.round(sum), { align: 'center' });
    rows += htmlCell(st.average.toFixed(1), { align: 'center' });
    rows += htmlCell(st.grade, { align: 'center' });
    rows += htmlCell(st.rank, { align: 'center' });
    rows += '</tr>';
  });

  return `<!DOCTYPE html>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="UTF-8" /><title>${escapeXml(title)}</title></head>
<body>
  <h3>${escapeXml(title)}</h3>
  <p>${escapeXml(subtitle)}</p>
  <p>Tarehe: ${new Date().toLocaleDateString()}</p>
  <table style="border-collapse:collapse;border:1px solid #000000;">${rows}</table>
</body>
</html>`;
}

// ========================================
// File download helper
// ========================================

export function downloadFile(filename: string, content: string, mimeType: string): void {
  const blob = new Blob(['\ufeff', content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
