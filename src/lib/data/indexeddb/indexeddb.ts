"use client";
import { IDBPDatabase, deleteDB, openDB } from "idb";
import { Topics } from "../../interfaces/IndexedDB";
import { ExerciseSummary, ExerciseDetails } from "../../interfaces/Exercise";

const indexedDbSupported =
  typeof window !== "undefined" && "indexedDB" in window;

let dbPromise: Promise<IDBPDatabase<unknown>>;
if (indexedDbSupported) {
  const dbName = "devtyping";
  const dbVersion = 2;

  dbPromise = openDB(dbName, dbVersion, {
    upgrade(db, oldVersion) {
      if (oldVersion < 1) {
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
      }

      if (oldVersion < 2) {
        const inactiveExercisesStore = db.createObjectStore(
          "inactive_exercises",
          {
            keyPath: "slug",
          }
        );
        inactiveExercisesStore.createIndex("topicSlug", "topicSlug");
      }
    },
  });
  // } else {
  //   // TODO: handle browsers without IndexedDB support
  //   console.error("IndexedDB not supported");
  //   throw new Error("IndexedDB not supported");
}

export const deleteIDB = async () => {
  if (indexedDbSupported) {
    await deleteDB("devtyping");
  }
};

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

  async del(key: string) {
    return await indexedDB.del("exercises", key);
  },
};

export const IDBInactiveExercise = {
  async set(value: unknown) {
    return await indexedDB.set("inactive_exercises", value);
  },

  async saveMany(exercises: ExerciseSummary[]) {
    {
      exercises.forEach(async (exercise) => {
        await indexedDB.set("inactive_exercises", exercise);
      });
    }
  },

  async get(key: string) {
    return await indexedDB.get("inactive_exercises", key);
  },

  async getAllKeys() {
    return await indexedDB.keys("inactive_exercises");
  },

  async del(key: string) {
    return await indexedDB.del("inactive_exercises", key);
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

  async getInactiveExerciseSummary(key: string): Promise<ExerciseSummary[]> {
    const exercises = await indexedDB.getFromIndex(
      "inactive_exercises",
      "topicSlug"
    );
    return exercises.filter((exercise) => exercise.topicSlug == key);
  },

  async getAllKeys() {
    return await indexedDB.keys("topics");
  },
};
