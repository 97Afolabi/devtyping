"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  onAuthStateChanged,
  signInWithGithub,
  signOut,
} from "../../lib/data/firebase/auth/auth";
import { getAuthUser } from "../../lib/data/auth";

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
  const router = useRouter();

  const handleSignOut = (event: { preventDefault: () => void }) => {
    event.preventDefault();
    signOut();

    localStorage.removeItem("dtUser");
    router.refresh();
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

  const authUser = getAuthUser();

  return (
    <>
      {authUser ? (
        <div className="flex justify-center items-center text-sm font-mono tracking-tight">
          <Link className="mx-1 hover:underline" href="/review">
            Review
          </Link>
          {" • "}
          <Link className="mx-1 hover:underline" href="/contribute">
            Contribute
          </Link>
          {" • "}
          <a className="mx-1 hover:underline" href="#" onClick={handleSignOut}>
            Sign out ({authUser.username})
          </a>
        </div>
      ) : (
        <a href="#" onClick={handleSignIn} className="hover:underline">
          Sign in with GitHub
        </a>
      )}
    </>
  );
}
