import {
  doc,
  getDoc,
  getDocs,
  getFirestore,
  collection,
  setDoc,
  where,
  query,
  WhereFilterOp,
  DocumentReference,
  DocumentData,
  QueryConstraint,
} from "firebase/firestore";
import { firebaseApp } from "../firebase";

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

function normalizeTimestampFields<T>(data: DocumentData): T {
  const normalizedData = { ...data } as Record<string, unknown>;

  const createdAt = normalizedData.createdAt as { toDate?: () => Date };
  const updatedAt = normalizedData.updatedAt as { toDate?: () => Date };

  if (createdAt && typeof createdAt.toDate === "function") {
    normalizedData.createdAt = createdAt.toDate();
  }

  if (updatedAt && typeof updatedAt.toDate === "function") {
    normalizedData.updatedAt = updatedAt.toDate();
  }

  return normalizedData as T;
}

export const firestore = {
  async save<T extends { slug?: string; createdAt?: Date; updatedAt?: Date }>(
    collName: string,
    data: T,
  ): Promise<void> {
    try {
      if (!data.slug) {
        throw new Error("Missing slug field");
      }

      const now = new Date();
      const payload = {
        ...data,
        createdAt: data.createdAt ?? now,
        updatedAt: now,
      };

      const collectionRef = collection(db, collName);
      await setDoc(doc(collectionRef, data.slug), payload, { merge: true });
    } catch (e) {
      console.error("Error adding document: ", e);
      throw new Error("Error adding document");
    }
  },

  async find<T>(collName: string): Promise<T[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collName));
      const documents: T[] = [];
      querySnapshot.forEach((docSnap) => {
        documents.push(normalizeTimestampFields<T>(docSnap.data()));
      });

      return documents;
    } catch (e) {
      console.error("Error fetching documents: ", e);
      throw new Error("Error fetching documents");
    }
  },

  async findById<T>(collection: string, id: string): Promise<T> {
    try {
      const docRef = doc(db, collection, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return normalizeTimestampFields<T>(docSnap.data());
      } else {
        throw new Error("Document not found");
      }
    } catch (e) {
      console.error("Error fetching document: ", e);
      throw new Error("Error fetching document");
    }
  },

  async findWhere<T>(
    collName: string,
    ...constraints: Array<{
      field: string;
      operator: WhereFilterOp;
      value: unknown;
    }>
  ): Promise<T[]> {
    try {
      const queryConstraints: QueryConstraint[] = constraints.map(
        (constraint) =>
          where(constraint.field, constraint.operator, constraint.value),
      );

      const q = query(collection(db, collName), ...queryConstraints);
      const querySnapshot = await getDocs(q);

      const documents: T[] = [];
      querySnapshot.forEach((docSnap) => {
        documents.push(normalizeTimestampFields<T>(docSnap.data()));
      });

      return documents;
    } catch (e) {
      console.error("Error fetching documents: ", e);
      throw new Error("Error fetching documents");
    }
  },

  getDocRef(collection: string, id: string): DocumentReference<DocumentData> {
    try {
      return doc(db, collection, id);
    } catch (e) {
      console.error("Error getting reference: ", e);
      throw new Error("Error getting reference");
    }
  },
};
