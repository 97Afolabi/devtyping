import { SampleUnselectedProp } from "../interfaces/Editor";
import { Exercise, exercises } from "./firebase/exercises";
import { topics } from "./firebase/topics";
import {
  IDBExercise,
  IDBExerciseDetails,
  IDBTopic,
} from "./indexeddb/indexeddb";

export const topic = {
  async save() {},

  async get(slug: string): Promise<SampleUnselectedProp> {
    // try {
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
    topic = (await topics.findById(slug)) as SampleUnselectedProp;

    // add to IndexedDB
    if (topic) {
      await IDBTopic.set(topic);
    }
    const exerciseArr = await exercises.findAll(slug);
    topic.samples = exerciseArr;
    await IDBExercise.saveMany(exerciseArr);
    return topic;
    // } catch (error) {
    //   throw new Error("");
    // }
  },
};

export const exercise = {
  async get(slug: string): Promise<Exercise> {
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
    const data = await exercises.findById(slug);
    const { summary, detail } = data;
    // update indexed db
    await IDBExercise.set(summary);
    await IDBExerciseDetails.set(detail);
    return { ...summary, ...detail };
  },
};
