import { SampleUnselectedProp } from "../interfaces/Editor";
import { Exercise } from "../interfaces/Exercise";
import { firestoreExercise } from "./firebase/firestore/exercises";
import { firestoreTopic } from "./firebase/firestore/topics";
import {
  IDBExercise,
  IDBExerciseDetails,
  IDBTopic,
} from "./indexeddb/indexeddb";

export const topic = {
  async getActiveExercises(slug: string): Promise<SampleUnselectedProp> {
    try {
      // check if it exists in IndexedDB
      let topic: SampleUnselectedProp;
      topic = await IDBTopic.get(slug);
      if (topic) {
        // add exercises summary
        topic.samples = await IDBTopic.getExerciseSummary(slug);
      }
      if (topic && topic.samples.length) {
        return topic;
      }
      // else
      // pull from Firestore
      topic = (await firestoreTopic.findById(
        slug
      )) as unknown as SampleUnselectedProp;

      // add to IndexedDB
      if (topic) {
        await IDBTopic.set(topic);
      }
      const exerciseArr = await firestoreExercise.findAllActive(slug);
      topic.samples = exerciseArr;
      await IDBExercise.saveMany(exerciseArr);
      return topic;
    } catch (error) {
      throw new Error("Unable to get topic");
    }
  },
};

export const exercise = {
  async get(slug: string): Promise<Exercise> {
    try {
      let exercise: Exercise;
      // check if summary and text exists in indexed db
      exercise = await IDBExercise.get(slug);
      if (exercise && exercise.text) {
        return exercise;
      }
      if (exercise && !exercise.text) {
        const details = await IDBExerciseDetails.get(slug);
        if (details) {
          // append text and contributors
          exercise.text = details.text;
          exercise.contributors = details.contributors;
          return exercise;
        }
      }
      // else
      // fetch from Firestore
      const data = await firestoreExercise.findById(slug);
      const { summary, detail } = data;
      // update indexed db
      await IDBExercise.set(summary);
      await IDBExerciseDetails.set(detail);
      return { ...summary, ...detail };
    } catch (error) {
      throw new Error("Unable to get exercise");
    }
  },
};
