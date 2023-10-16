import { ExerciseSummary } from "../data/firebase/exercises";

export interface Topics {
  title: string;
  slug: string;
  description: string;
  samples: ExerciseSummary[];
}
