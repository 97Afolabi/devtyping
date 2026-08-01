export interface ExerciseSource {
  kind: "original" | "derived" | "verbatim";
  origin: string;
  url?: string;
  license: "MIT" | "CC-BY-SA-4.0" | "Apache-2.0" | "original";
  attribution?: string;
}

export interface ExercisePracticeLink {
  label: string;
  url: string;
  provider: "leetcode" | "hackerrank" | "codewars" | "other";
  free: boolean;
}

export interface ExerciseSummary {
  id?: string;
  slug?: string;
  title: string;
  topicSlug: string;
  author: string;
  downVotes: number;
  upVotes: number;
  isActive: boolean;
  source?: ExerciseSource;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExerciseDetails {
  slug?: string;
  prerequisite?: string;
  contributors?: string[];
  text: string;
  practiceLinks?: ExercisePracticeLink[];
  category?: string;
  lineCount?: number;
  difficulty?: 1 | 2 | 3;
}

// The full merged shape returned by exercise.getActive()/getInactive() —
// exercises are stored split across the `exercises` (summary) and
// `exercise_details` (detail) collections, then combined on read.
export type Exercise = ExerciseSummary & ExerciseDetails;
