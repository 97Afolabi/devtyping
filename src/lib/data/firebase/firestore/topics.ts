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
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  },

  async findAll(): Promise<TopicSummary[]> {
    try {
      return (await firestore.find("topics")) as TopicSummary[];
    } catch (e) {
      console.error("Error fetching documents: ", e);
      throw new Error("Error fetching documents");
    }
  },

  async findAllInActive(): Promise<TopicSummary[]> {
    try {
      const data = (await firestore.findWhere("topics", {
        field: "isActive",
        operator: "==",
        value: false,
      })) as TopicSummary[];
      return data;
    } catch (e) {
      console.error("Error fetching documents: ", e);
      throw new Error("Error fetching documents");
    }
  },

  async findById(id: string): Promise<TopicSummary> {
    try {
      return (await firestore.findById("topics", id)) as TopicSummary;
    } catch (e) {
      console.error("Error fetching document: ", e);
      throw new Error("Error fetching document");
    }
  },

  async incrementCount(id: string, type: "active" | "inactive"): Promise<void> {
    try {
      const docRef = firestore.getDocRef("topics", id);
      switch (type) {
        case "active":
          await updateDoc(docRef, {
            countActive: increment(1),
            countInactive: increment(-1),
            updatedAt: new Date(),
          });
          break;
        case "inactive":
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
};
