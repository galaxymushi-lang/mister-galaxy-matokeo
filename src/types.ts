export interface GradeBoundaries {
  minA: number;
  minB: number;
  minC: number;
  minD: number;
  minE: number;
}

export interface SchoolSettings {
  schoolName: string;
  examName: string;
  className: string;
  streamName: string;
  termName: string;
  examYear: number;
  username: string;
  password: string;
  gradeBoundaries: GradeBoundaries;
}

export interface Subject {
  id: string;
  name: string;
  passMark: number;
}

export interface Student {
  id: string;
  name: string;
  gender: 'ME' | 'KE' | '';
  marks: Record<string, number | ''>;
}

export interface RankedStudent extends Student {
  average: number;
  grade: string;
  passedCount: number;
  rank: number;
}

export interface SubjectStats {
  subjectId: string;
  subjectName: string;
  passMark: number;
  average: number;
  highest: number;
  lowest: number;
  passCount: number;
  failCount: number;
  totalStudents: number;
  passRate: number;
}

export type TabType = 'dashboard' | 'entry' | 'subject' | 'general' | 'settings';

export interface ExportData {
  settings: SchoolSettings;
  subjects: Subject[];
  students: Student[];
}
