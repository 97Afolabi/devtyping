import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExerciseSummary } from "../../lib/interfaces/Exercise";
import {
  IDBExercise,
  IDBInactiveExercise,
} from "../../lib/data/indexeddb/indexeddb";
import { getAuthUser } from "../../lib/data/auth";
import { postWithAuth } from "../../lib/data/firebase/auth/request";

export default function ShowSummary({ data }: { data: ExerciseSummary }) {
  const [isActive, setIsActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusUpdateError, setStatusUpdateError] = useState("");
  const router = useRouter();

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
    isActive: boolean,
  ) => {
    if (isUpdatingStatus) {
      return;
    }

    setIsUpdatingStatus(true);
    setStatusUpdateError("");

    try {
      const response = await postWithAuth(
        `/api/exercises/${data.slug}/status`,
        {
          isActive,
          topicSlug: data.topicSlug,
        },
      );

      if (!response.ok) {
        const result = (await response.json()) as { error?: string };
        setStatusUpdateError(
          result.error ?? "Unable to update exercise status",
        );
        return;
      }

      if (isActive) {
        // currently active, so deactivate
        await Promise.all([
          IDBInactiveExercise.set({
            ...data,
            isActive: false,
            updatedAt: new Date().toISOString(),
          }),
          IDBExercise.del(data.slug!),
        ]);
        router.push(`/review/${data.topicSlug}/${data.slug}`);
      } else {
        // currently inactive, so activate
        await Promise.all([
          IDBExercise.set({
            ...data,
            isActive: true,
            updatedAt: new Date().toISOString(),
          }),
          IDBInactiveExercise.del(data.slug!),
        ]);
        router.push(`/${data.topicSlug}/${data.slug}`);
      }
    } catch {
      setStatusUpdateError("Unable to update exercise status");
    } finally {
      setIsUpdatingStatus(false);
    }
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
            className="bg-slate-600 hover:bg-slate-900 disabled:bg-slate-400 disabled:cursor-not-allowed text-white font-bold py-1 px-2 rounded-sm focus:outline-hidden focus:shadow-outline"
            onClick={() => handleStatusUpdate(data, isActive)}
            disabled={isUpdatingStatus}
            aria-disabled={isUpdatingStatus}
            aria-busy={isUpdatingStatus}
          >
            {isUpdatingStatus
              ? "Updating..."
              : isActive
                ? "Deactivate"
                : "Activate"}
          </button>
        </p>
      )}
      {statusUpdateError && (
        <p className="text-sm text-red-600">{statusUpdateError}</p>
      )}
      <p>
        Date: {data.createdAt?.toLocaleDateString()}{" "}
        {data.createdAt?.toLocaleTimeString()}
      </p>
    </div>
  );
}
