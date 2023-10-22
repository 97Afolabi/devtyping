import { ExerciseSummary } from "./Exercise";

export interface Topics {
  title: string;
  slug: string;
  description: string;
  samples: ExerciseSummary[];
}
