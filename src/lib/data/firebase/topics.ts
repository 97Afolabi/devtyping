import { generateSlug } from "../../constants/strings";
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

  async findAll() {
    try {
      return await firestore.find("topics");
    } catch (e) {
      console.error("Error fetching documents: ", e);
    }
  },

  async findById(id: string) {
    try {
      return await firestore.findById("topics", id);
    } catch (e) {
      console.error("Error fetching document: ", e);
    }
  },
};
