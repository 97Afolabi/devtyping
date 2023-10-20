import { generateExerciseSlug } from "../../../constants/strings";
import { SampleSelectedProp } from "../../../interfaces/Editor";
import {
  Exercise,
  ExerciseDetails,
  ExerciseSummary,
} from "../../../interfaces/Exercise";
import { firestore } from "./firestore";

export const firestoreExercise = {
  async save(data: Exercise) {
    try {
      const {
        title,
        topicSlug,
        author,
        downVotes,
        upVotes,
        isActive,
        createdAt,
        updatedAt,
        prerequisite,
        contributors,
        text,
      } = data;
      const slug = generateExerciseSlug(data.title);

      const summary: ExerciseSummary = {
        slug,
        title,
        topicSlug,
        author,
        downVotes,
        upVotes,
        isActive,
        createdAt,
        updatedAt,
      };
      const details: ExerciseDetails = {
        slug,
        prerequisite,
        contributors,
        text,
      };
      // Filter out fields with undefined values
      const filteredDetails = Object.fromEntries(
        Object.entries(details).filter(([_, value]) => value !== undefined)
      );

      await firestore.save("exercises", summary);
      await firestore.save("exercise_details", filteredDetails);
    } catch (e) {
      console.error("Error adding document: ", e);
      throw new Error("Error adding document");
    }
  },

  async findAll(topicSlug: string): Promise<ExerciseSummary[]> {
    try {
      const data = (await firestore.findWhere(
        "exercises",
        "topicSlug",
        "==",
        topicSlug
      )) as ExerciseSummary[];
      return data;
    } catch (e) {
      console.error("Error fetching documents: ", e);
      throw new Error("Error fetching documents");
    }
  },

  async findById(
    id: string
  ): Promise<{ summary: ExerciseSummary; detail: SampleSelectedProp }> {
    try {
      const summary = (await firestore.findById(
        "exercises",
        id
      )) as ExerciseSummary;
      const detail = (await firestore.findById(
        "exercise_details",
        id
      )) as SampleSelectedProp;
      return { summary, detail };
    } catch (e) {
      console.error("Error fetching document: ", e);
      throw new Error("Error fetching document");
    }
  },
};
