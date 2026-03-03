"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthUser } from "../lib/data/auth";

function isAuth(Component: any) {
  return function IsAuth(props: any) {
    const router = useRouter();

    useEffect(() => {
      const auth = getAuthUser();
      if (!auth || !auth.username) {
        router.replace("/");
      }
    }, [router]);

    return <Component {...props} />;
  };
}

function isAdmin(Component: any) {
  return function IsAuth(props: any) {
    const router = useRouter();

    useEffect(() => {
      const auth = getAuthUser();
      if (!auth || !auth.isAdmin) {
        router.replace("/");
      }
    }, [router]);

    return <Component {...props} />;
  };
}

export { isAuth, isAdmin };
