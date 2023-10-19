import { initializeApp } from "firebase/app";
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
} from "firebase/firestore";
import { envVars } from "../../constants/utils";

// Initialize Firebase
export const firebaseApp = initializeApp( envVars.firebase );

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(firebaseApp);

export const firestore = {
  dbHandle: db,

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
    field: string,
    operator: WhereFilterOp,
    value: unknown
  ): Promise<unknown[]> {
    try {
      const q = query(collection(db, collName), where(field, operator, value));
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
};
