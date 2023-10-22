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
  QueryConstraint,
} from "firebase/firestore";
import { firebaseApp } from "../firebase";

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

export const firestore = {
  async save(collName: string, data: any) {
    try {
      data.createdAt = data.updatedAt = new Date();

      const collectionRef = collection(db, collName);
      await setDoc(doc(collectionRef, data.slug), data, { merge: true });
    } catch (e) {
      console.error("Error adding document: ", e);
      throw new Error("Error adding document");
    }
  },

  async find(collName: string): Promise<unknown[]> {
    try {
      const querySnapshot = await getDocs(collection(db, collName));
      const documents: unknown[] = [];
      querySnapshot.forEach((doc) =>
        documents.push({
          ...doc.data(),
          // Only plain objects can be passed to Client Components from Server Components
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
        })
      );
      return documents;
    } catch (e) {
      console.error("Error fetching documents: ", e);
      throw new Error("Error fetching documents");
    }
  },

  async findById(collection: string, id: string): Promise<unknown> {
    try {
      const docRef = doc(db, collection, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          // Only plain objects can be passed to Client Components from Server Components
          createdAt: docSnap.data().createdAt.toDate(),
          updatedAt: docSnap.data().updatedAt.toDate(),
        };
      } else {
        console.error("Document not found");
      }
    } catch (e) {
      console.error("Error fetching document: ", e);
      throw new Error("Error fetching document");
    }
  },

  async findWhere(
    collName: string,
    ...constraints: Array<{
      field: string;
      operator: WhereFilterOp;
      value: unknown;
    }>
  ): Promise<unknown[]> {
    try {
      const queryConstraints: QueryConstraint[] = constraints.map(
        (constraint) =>
          where(constraint.field, constraint.operator, constraint.value)
      );

      const q = query(collection(db, collName), ...queryConstraints);
      const querySnapshot = await getDocs(q);

      const documents: unknown[] = [];
      querySnapshot.forEach((doc) =>
        documents.push({
          ...doc.data(),
          // Only plain objects can be passed to Client Components from Server Components
          createdAt: doc.data().createdAt.toDate(),
          updatedAt: doc.data().updatedAt.toDate(),
        })
      );
      return documents;
    } catch (e) {
      console.error("Error fetching documents: ", e);
      throw new Error("Error fetching documents");
    }
  },

  getDocRef(collection: string, id: string): DocumentReference {
    try {
      return doc(db, collection, id);
    } catch (e) {
      console.error("Error getting reference: ", e);
      throw new Error("Error getting reference");
    }
  },
};
