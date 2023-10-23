"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { getAuthUser } from "../lib/data/auth";

export default function isAuth(Component: any) {
  return function IsAuth(props: any) {
    useEffect(() => {
      const auth = getAuthUser();
      if (!auth || !auth.username) {
        return redirect("/");
      }
    }, []);

    return <Component {...props} />;
  };
}
