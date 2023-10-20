import { ExerciseSummary } from "../data/firebase/firestore/exercises";

export interface Topics {
  title: string;
  slug: string;
  description: string;
  samples: ExerciseSummary[];
}
