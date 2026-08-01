import { ExercisePracticeLink, ExerciseSummary } from "./Exercise";

export interface SampleUnselectedProp {
  title: string;
  slug: string;
  description: string;
  samples: ExerciseSummary[];
}

export interface SampleSelectedProp {
  text: string;
  contributors: string[];
  slug: string;
  practiceLinks?: ExercisePracticeLink[];
  category?: string;
  lineCount?: number;
  difficulty?: 1 | 2 | 3;
}
