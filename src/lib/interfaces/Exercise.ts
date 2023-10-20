export interface Exercise {
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExerciseSummary {
  slug?: string;
  title: string;
  topicSlug: string;
  author: string;
  downVotes: number;
  upVotes: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ExerciseDetails {
  slug?: string;
  prerequisite?: string;
  contributors?: string[];
  text: string;
}
