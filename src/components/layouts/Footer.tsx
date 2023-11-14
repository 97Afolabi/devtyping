import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full text-center bg-slate-900 text-white">
      <Link
        href="/"
        className="font-mono text-xl font-weight-700 tracking-tight hover:underline"
      >
        DevTyp.i.ng
      </Link>
    </footer>
  );
}
