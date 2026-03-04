"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithGithub,
  signOut,
} from "../../lib/data/firebase/auth/auth";
import { firestoreUser } from "../../lib/data/firebase/firestore/users";

function useUserSession(initialUser: any) {
  const [user, setUser] = useState(initialUser);
  const [isReady, setIsReady] = useState(false);
  const shouldRefresh = useRef(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser((previousUser: any) => {
        if (
          previousUser !== undefined &&
          previousUser?.email !== authUser?.email
        ) {
          shouldRefresh.current = true;
        }

        return authUser;
      });
      setIsReady(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (shouldRefresh.current) {
      shouldRefresh.current = false;
      router.refresh();
    }
  }, [user, router]);

  return { user, isReady };
}

export default function AuthUser() {
  const { user, isReady } = useUserSession(undefined);
  const router = useRouter();
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (!isReady) {
      return;
    }

    if (!user) {
      setUsername("");
      return;
    }

    try {
      const cachedUser = localStorage.getItem("dtUser");
      if (cachedUser) {
        const parsedUser = JSON.parse(cachedUser) as { username?: string };
        if (parsedUser.username) {
          setUsername(parsedUser.username);
          return;
        }
      }
    } catch {
      setUsername("");
    }

    const fallbackUsername =
      user.username ||
      user.displayName ||
      (typeof user.email === "string" ? user.email.split("@")[0] : "");

    setUsername(fallbackUsername ?? "");
  }, [isReady, user]);

  const handleSignOut = () => {
    signOut();

    localStorage.removeItem("dtUser");
    setUsername("");
    router.refresh();
  };

  const handleSignIn = async () => {
    const data = await signInWithGithub();
    if (data && data.slug) {
      const firestoreData = await firestoreUser.findById(data.slug);
      localStorage.setItem("dtUser", JSON.stringify(firestoreData));
      if (firestoreData?.username) {
        setUsername(firestoreData.username);
      }
    }
    router.refresh();
  };

  if (!isReady) {
    return (
      <div className="flex justify-center items-center text-sm font-mono tracking-tight" />
    );
  }

  return (
    <>
      {user ? (
        <div className="flex justify-center items-center text-sm font-mono tracking-tight">
          <Link className="mx-1 hover:underline" href="/review">
            Review
          </Link>
          {" • "}
          <Link className="mx-1 hover:underline" href="/contribute">
            Contribute
          </Link>
          {" • "}
          <button
            type="button"
            className="mx-1 text-xs hover:underline"
            onClick={handleSignOut}
          >
            Sign out ({username || "Account"})
          </button>
        </div>
      ) : (
        <div className="flex justify-center items-center text-sm font-mono tracking-tight">
          <button
            type="button"
            onClick={handleSignIn}
            className="hover:underline"
          >
            Sign in with GitHub
          </button>
        </div>
      )}
    </>
  );
}
