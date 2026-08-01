export interface ExerciseSource {
  kind: "original" | "derived" | "verbatim";
  origin: string;
  url?: string;
  license: "MIT" | "CC-BY-SA-4.0" | "Apache-2.0" | "original";
  attribution?: string;
}

export interface Exercise {
  id?: string;
  title: string;
  slug?: string;
  prerequisite?: string;
  topicSlug: string;
  text: string;
  author: string;
  contributors?: string[];
  downVotes: number;
  upVotes: number;
  isActive: boolean;
  source?: ExerciseSource;
  createdAt?: Date;
  updatedAt?: Date;
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
}
