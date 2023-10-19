"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithGithub,
  signOut,
} from "../../lib/data/firebase/auth";

export function getAuthUser() {
  const localStorageSupported =
    typeof window !== "undefined" && "localStorage" in window;

  if (localStorageSupported) {
    const dtUser = localStorage.getItem("dtUser");
    if (!dtUser) {
      return;
    }
    return JSON.parse(dtUser);
  }
}

function useUserSession(initialUser: any) {
  const [user, setUser] = useState(initialUser);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged((authUser) => {
      setUser(authUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    onAuthStateChanged((authUser) => {
      if (user === undefined) return;

      // refresh when user changed to ease testing
      if (user?.email !== authUser?.email) {
        router.refresh();
      }
    });
  }, [user]);

  return user;
}

export default function AuthUser() {
  useUserSession(undefined);

  const handleSignOut = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    signOut();

    localStorage.removeItem("dtUser");
  };

  const handleSignIn = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const data = await signInWithGithub();
    if (data && data.userId) {
      localStorage.setItem(
        "dtUser",
        JSON.stringify({
          id: data.userId,
          username: data.userName,
        })
      );
    }
  };

  const authUser: { id: string; username: string } = getAuthUser();

  return (
    <>
      {authUser ? (
        <>
          {authUser.username}
          {" • "}
          <small>
            <a className="text-orange" href="#" onClick={handleSignOut}>
              Sign Out
            </a>
          </small>
        </>
      ) : (
        <a href="#" onClick={handleSignIn}>
          Sign in with GitHub
        </a>
      )}
    </>
  );
}
