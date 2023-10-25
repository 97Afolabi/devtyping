import { firestore } from "./firestore";

export interface User {
  id: string;
  username: string;
  isActive: boolean;
  isAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export const firestoreUser = {
  async save(data: { slug: string; username: string }) {
    try {
      const user = { ...data, isActive: true, isAdmin: false };
      await firestore.save("users", user);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  },

  async findActive(): Promise<User[]> {
    try {
      return (await firestore.findWhere("users", {
        field: "isActive",
        operator: "==",
        value: true,
      })) as User[];
    } catch (e) {
      console.error("Error fetching documents: ", e);
      throw new Error("Error fetching documents");
    }
  },

  async findInActive(): Promise<User[]> {
    try {
      const data = (await firestore.findWhere("users", {
        field: "isActive",
        operator: "==",
        value: false,
      })) as User[];
      return data;
    } catch (e) {
      console.error("Error fetching documents: ", e);
      throw new Error("Error fetching documents");
    }
  },

  async findById(id: string): Promise<User> {
    try {
      return (await firestore.findById("users", id)) as User;
    } catch (e) {
      console.error("Error fetching document: ", e);
      throw new Error("Error fetching document");
    }
  },
};
