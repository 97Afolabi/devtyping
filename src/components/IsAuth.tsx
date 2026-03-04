"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "../lib/data/auth";

function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const router = useRouter();
    const auth = getAuthUser();
    const unauthorized = !auth || !auth.username;

    useEffect(() => {
      if (unauthorized) {
        router.replace("/");
      }
    }, [router, unauthorized]);

    if (unauthorized) {
      return null;
    }

    return <Component {...props} />;
  };
}

function isAdmin(Component: any) {
  return function IsAuth(props: any) {
    const router = useRouter();
    const auth = getAuthUser();
    const unauthorized = !auth || !auth.isAdmin;

    useEffect(() => {
      if (unauthorized) {
        router.replace("/");
      }
    }, [router, unauthorized]);

    if (unauthorized) {
      return null;
    }

    return <Component {...props} />;
  };
}

export { isAuth, isAdmin };
