"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "../lib/data/auth";

// getAuthUser() reads localStorage, which doesn't exist during SSR. Reading
// it directly during render caused a hydration mismatch for any logged-in
// user, since the server always renders as signed-out. `undefined` means
// "not checked yet" (matches the server, and the first client render,
// before the effect runs); the real value applies on the next render.
function useAuth() {
  const [auth, setAuth] = useState<ReturnType<typeof getAuthUser> | undefined>(
    undefined,
  );

  useEffect(() => {
    setAuth(getAuthUser());
  }, []);

  return auth;
}

function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const router = useRouter();
    const auth = useAuth();
    const checked = auth !== undefined;
    const unauthorized = checked && (!auth || !auth.username);

    useEffect(() => {
      if (unauthorized) {
        router.replace("/");
      }
    }, [router, unauthorized]);

    if (!checked || unauthorized) {
      return null;
    }

    return <Component {...props} />;
  };
}

function isAdmin(Component: any) {
  return function IsAuth(props: any) {
    const router = useRouter();
    const auth = useAuth();
    const checked = auth !== undefined;
    const unauthorized = checked && (!auth || !auth.isAdmin);

    useEffect(() => {
      if (unauthorized) {
        router.replace("/");
      }
    }, [router, unauthorized]);

    if (!checked || unauthorized) {
      return null;
    }

    return <Component {...props} />;
  };
}

export { isAuth, isAdmin };
