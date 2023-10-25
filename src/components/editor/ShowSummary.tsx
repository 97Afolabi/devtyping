import { useState, useEffect } from "react";
import { ExerciseSummary } from "../../lib/interfaces/Exercise";
import { firestoreExercise } from "../../lib/data/firebase/firestore/exercises";
import {
  IDBExercise,
  IDBInactiveExercise,
} from "../../lib/data/indexeddb/indexeddb";
import { firestoreTopic } from "../../lib/data/firebase/firestore/topics";
import { getAuthUser } from "../../lib/data/auth";

export default function ShowSummary({ data }: { data: ExerciseSummary }) {
  const [isActive, setIsActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const setStatus = (isActive: boolean) => {
      setIsActive(isActive);

      const authUser = getAuthUser();
      setIsAdmin(authUser!.isAdmin);
    };

    setStatus(data.isActive);
  }, [data.isActive]);

  const handleStatusUpdate = async (
    data: ExerciseSummary,
    isActive: boolean
  ) => {
    await firestoreExercise.setStatus(data.slug!, isActive);
    if (isActive) {
      await IDBExercise.set({
        ...data,
        isActive: isActive,
        updatedAt: new Date().toISOString(),
      });
      await IDBInactiveExercise.del(data.slug!);
      await firestoreTopic.updateActiveCount(data.topicSlug, "up");
      await firestoreTopic.updateInactiveCount(data.topicSlug, "down");
    } else {
      await IDBInactiveExercise.set({
        ...data,
        isActive: isActive,
        updatedAt: new Date().toISOString(),
      });
      await IDBExercise.del(data.slug!);
      await firestoreTopic.updateActiveCount(data.topicSlug, "down");
      await firestoreTopic.updateInactiveCount(data.topicSlug, "up");
    }

    setIsActive(!isActive);
  };

  return (
    <div className="mx-2">
      <p>
        <span className="mr-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline text-green-600"
          >
            <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3"></path>
          </svg>{" "}
          ({data.upVotes})
        </span>
        <span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="inline text-red-600"
          >
            <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3zm7-13h2.67A2.31 2.31 0 0 1 22 4v7a2.31 2.31 0 0 1-2.33 2H17"></path>
          </svg>{" "}
          ({data.downVotes})
        </span>
      </p>

      {isAdmin && (
        <p>
          <button
            type="button"
            className="bg-slate-600 hover:bg-slate-900 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline"
            onClick={() => handleStatusUpdate(data, isActive)}
          >
            {isActive ? "Deactivate" : "Activate"}
          </button>
        </p>
      )}
      <p>
        Date: {data.createdAt?.toLocaleDateString()}{" "}
        {data.createdAt?.toLocaleTimeString()}
      </p>
    </div>
  );
}
