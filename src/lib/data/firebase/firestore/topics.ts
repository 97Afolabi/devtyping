import { updateDoc, increment } from "firebase/firestore";
import { generateSlug } from "../../../constants/strings";
import { Topic } from "../../../interfaces/Topic";
import { TopicSummary } from "../../../interfaces/TopicSummary";
import { firestore } from "./firestore";

export const firestoreTopic = {
  async save(data: Topic) {
    try {
      const slug = generateSlug(data.title);
      const topic = { slug, ...data };
      await firestore.save("topics", topic);
    } catch (error) {
      console.error("Error adding document: ", error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Error adding document");
    }
  },

  async findAll(): Promise<TopicSummary[]> {
    try {
      return await firestore.find<TopicSummary>("topics");
    } catch (e) {
      console.error("Error fetching documents: ", e);
      throw new Error("Error fetching documents");
    }
  },

  async findAllInActive(): Promise<TopicSummary[]> {
    try {
      const data = await firestore.findWhere<TopicSummary>("topics", {
        field: "isActive",
        operator: "==",
        value: false,
      });
      return data;
    } catch (e) {
      console.error("Error fetching documents: ", e);
      throw new Error("Error fetching documents");
    }
  },

  async findById(id: string): Promise<TopicSummary> {
    try {
      return await firestore.findById<TopicSummary>("topics", id);
    } catch (e) {
      console.error("Error fetching document: ", e);
      throw new Error("Error fetching document");
    }
  },

  async updateCount(
    id: string,
    action: "activate" | "deactivate",
  ): Promise<void> {
    try {
      const docRef = firestore.getDocRef("topics", id);
      switch (action) {
        case "activate":
          await updateDoc(docRef, {
            countActive: increment(1),
            countInactive: increment(-1),
            updatedAt: new Date(),
          });
          break;
        case "deactivate":
          await updateDoc(docRef, {
            countActive: increment(-1),
            countInactive: increment(1),
            updatedAt: new Date(),
          });
          break;
        default:
          throw new Error("Invalid operation");
      }
    } catch (e) {
      console.error("Error updating status: ", e);
      throw new Error("Error updating status");
    }
  },

  async updateInactiveCount(id: string, type: "up" | "down"): Promise<void> {
    try {
      const docRef = firestore.getDocRef("topics", id);
      switch (type) {
        case "up":
          await updateDoc(docRef, {
            countInactive: increment(1),
            updatedAt: new Date(),
          });
          break;
        case "down":
          await updateDoc(docRef, {
            countInactive: increment(-1),
            updatedAt: new Date(),
          });
          break;
        default:
          throw new Error("Invalid operation");
      }
    } catch (e) {
      console.error("Error updating status: ", e);
      throw new Error("Error updating status");
    }
  },
};
