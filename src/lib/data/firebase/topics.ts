import { generateSlug } from "../../constants/strings";
import { TopicSummary } from "../../interfaces/TopicSummary";
import { firestore } from "./firebase";

export interface Topic {
  title: string;
  slug?: string;
  summary: string;
  description: string;
  count: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const topics = {
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

  async findById(id: string): Promise<TopicSummary> {
    try {
      return (await firestore.findById("topics", id)) as TopicSummary;
    } catch (e) {
      console.error("Error fetching document: ", e);
      throw new Error("Error fetching document");
    }
  },
};
