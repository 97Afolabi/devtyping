"use client";
import Link from "next/link";
import AuthUser from "./AuthUser";

export default function Header() {
  return (
    <header className="w-full flex flex-col md:flex-row md:justify-between px-12 py-2 h-min bg-slate-900 text-white">
      <div className="text-center">
        <Link
          href="/"
          className="font-mono text-xl antialiased tracking-tight hover:underline"
        >
          DevTyp.i.ng
        </Link>
      </div>

      <AuthUser />
    </header>
  );
}
