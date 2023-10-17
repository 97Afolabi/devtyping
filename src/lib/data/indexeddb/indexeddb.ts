"use client";
import { IDBPDatabase, openDB } from "idb";
import { Topics } from "../../interfaces/IndexedDB";
import { ExerciseDetails, ExerciseSummary } from "../firebase/exercises";

const indexedDbSupported =
  typeof window !== "undefined" && "indexedDB" in window;

let dbPromise: Promise<IDBPDatabase<unknown>>;
if (indexedDbSupported) {
  dbPromise = openDB("devtyping", 1, {
    upgrade(db) {
      db.createObjectStore("topics", {
        keyPath: "slug",
      });
      const exercisesStore = db.createObjectStore("exercises", {
        keyPath: "slug",
      });
      exercisesStore.createIndex("topicSlug", "topicSlug");
      db.createObjectStore("exercise_details", {
        keyPath: "slug",
      });
    },
  });
  // } else {
  //   // TODO: handle browsers without IndexedDB support
  //   console.error("IndexedDB not supported");
  //   throw new Error("IndexedDB not supported");
}

const indexedDB = {
  async set(collection: string, value: unknown) {
    return (await dbPromise).put(collection, value);
  },

  async get(collection: string, key: string) {
    return (await dbPromise).get(collection, key);
  },

  async getFromIndex(collection: string, index: string) {
    return (await dbPromise).getAllFromIndex(collection, index);
  },

  async del(collection: string, key: string) {
    return (await dbPromise).delete(collection, key);
  },

  async clear(collection: string) {
    return (await dbPromise).clear(collection);
  },

  async keys(collection: string) {
    return (await dbPromise).getAllKeys(collection);
  },
};

export const IDBExercise = {
  async set(value: unknown) {
    return await indexedDB.set("exercises", value);
  },

  async saveMany(exercises: ExerciseSummary[]) {
    {
      exercises.forEach(async (exercise) => {
        await indexedDB.set("exercises", exercise);
      });
    }
  },

  async get(key: string) {
    return await indexedDB.get("exercises", key);
  },

  async getAllKeys() {
    return await indexedDB.keys("exercises");
  },
};

export const IDBExerciseDetails = {
  async set(value: unknown) {
    return await indexedDB.set("exercise_details", value);
  },

  async get(key: string): Promise<ExerciseDetails> {
    return (await indexedDB.get("exercise_details", key)) as ExerciseDetails;
  },
};

export const IDBTopic = {
  async set(value: Topics) {
    return await indexedDB.set("topics", value);
  },

  async get(key: string): Promise<Topics> {
    return await indexedDB.get("topics", key);
  },

  async getExerciseSummary(key: string): Promise<ExerciseSummary[]> {
    const exercises = await indexedDB.getFromIndex("exercises", "topicSlug");
    return exercises.filter((exercise) => exercise.topicSlug == key);
  },

  async getAllKeys() {
    return await indexedDB.keys("topics");
  },
};
